import { AppDataSource } from '../config/database.ts';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { Role, User } from '../entites/User.js';
import { RegisterInput, LoginInput } from '../schemas/auth.ts';
import { createError } from '../utils/error.ts';
import { sendOTPEmail } from '../utils/mailer.ts';

export const registerUser = async (input: RegisterInput) => {
    const userRepo = AppDataSource.getRepository(User);

    const existingEmail = await userRepo.findOneBy({ email: input.email });
    if (existingEmail) {
      throw createError('Email already registered', 404);
    }

    const existingPhone = await userRepo.findOneBy({ phone: input.phone });
    if (existingPhone) {
      throw createError('phone already registered', 404);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = userRepo.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      dob: input.dob,
      role: Role.USER,
      otp,
      otp_expiry: otpExpiry,
      is_verified: false,
    });

    const saved = await userRepo.save(user);
    await sendOTPEmail(saved.email, otp);
    const { password: _, ...userWithoutPassword } = saved;

    return userWithoutPassword;

};

export const verifyOTP = async (email: string, otp: string) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email, otp });

  if (!user || !user.otp_expiry || user.otp_expiry < new Date()) {
    throw createError('Invalid or expired OTP', 400);
  }

  user.is_verified = true;
  user.otp = null;
  user.otp_expiry = null;
  await userRepo.save(user);

  const token = generateToken({ user_id: user.user_id, email: user.email, role: user.role });
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const loginUser = async (input: LoginInput) => {

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: input.email });

    if (!user) {
      throw createError('User not found', 404);
    }

    // --- QUICK FIX: Auto-verify specific developer accounts ---
    const developerEmails = ['Utsavrail15@gmail.com', 'admin@gmail.com'];
    if (developerEmails.includes(user.email) && !user.is_verified) {
        user.is_verified = true;
        await userRepo.save(user);
    }
    // ---------------------------------------------------------

    if (!user.is_verified) {
      throw createError('Please verify your email first', 401);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw createError('Invalid creditiantial', 404);
    }

    const token = generateToken({ user_id: user.user_id, email: user.email, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword }; 

};