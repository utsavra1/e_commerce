import {email, z} from 'zod';


const registerSchema = z.object({
    username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must not exceed 100 characters'),
    
    email: z.string()
    .email('Please provide a valid email'),

    password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters'),

    phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone must be a valid 10-digit number'),
});

const loginSchema = z.object({
  email: z.string()
    .email('Please provide a valid email'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export {loginSchema, registerSchema};