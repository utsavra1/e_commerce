import { AppDataSource } from '../app.js'
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { Role, User } from '../entites/User.js';
import { RegisterInput, LoginInput } from '../schemas/auth.ts';

export const registerUser = async (input: RegisterInput) => {
    const userRepo = AppDataSource.getRepository(User);

    const existingEmail = await userRepo.findOneBy({ email: input.email });
    if (existingEmail) {
      const error: any = new Error('Email already registered');
        error.status = 409;
        throw error;
    }

    const existingPhone = await userRepo.findOneBy({ phone: input.phone });
    if (existingPhone) {
      const error: any = new Error('Phone already registered');
        error.status = 409;
        throw error;
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
      const error: any = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      const error: any = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const token = generateToken({ user_id: user.user_id, email: user.email, role: user.role });

    return {token};
};