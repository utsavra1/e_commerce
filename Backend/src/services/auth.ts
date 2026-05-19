import { AppDataSource } from '../config/database.ts';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { Role, User } from '../entites/User.js';
import { RegisterInput, LoginInput } from '../schemas/auth.ts';
import { createError } from '../utils/error.ts';

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

    const user = userRepo.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      dob: input.dob,
      role: Role.USER,
    });

    const saved = await userRepo.save(user);
    const { password: _, ...userWithoutPassword } = saved;

    return userWithoutPassword;

};

export const loginUser = async (input: LoginInput) => {

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: input.email });

    if (!user) {
      throw createError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw createError('Invalid creditiantial', 404);
    }

    const token = generateToken({ user_id: user.user_id, email: user.email, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword }; 

};