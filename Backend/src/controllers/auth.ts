import { Request, Response, NextFunction } from 'express';
import { RegisterInput, LoginInput } from '../schemas/auth.ts';
import * as authService from '../services/auth.ts';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as RegisterInput;
    const user = await authService.registerUser(input);

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as LoginInput;
    const { token } = await authService.loginUser(input);

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};
