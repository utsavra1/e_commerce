import { Request, Response } from 'express';
import { AppDataSource } from '../app.js'
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { Role, User } from '../entites/User.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone, dob } = req.body;

    if (!username || !email || !password || !phone || !dob) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userRepo = AppDataSource.getRepository(User);

    const existingEmail = await userRepo.findOneBy({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const existingPhone = await userRepo.findOneBy({ phone });
    if (existingPhone) {
      return res.status(409).json({ message: 'Phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      username,
      email,
      password: hashedPassword,
      phone,
      dob,
      role: Role.USER,
    });

    const saved = await userRepo.save(user);
    const { password: _, ...userWithoutPassword } = saved;

    return res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ user_id: user.user_id, email: user.email, role: user.role });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};