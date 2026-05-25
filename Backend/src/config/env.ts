import dotenv from 'dotenv';
import { url } from 'inspector';
import { email } from 'zod';
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
    port: process.env['PORT'] || '3000',

    db: {
        url: process.env['DATABASE_URL'],
        host: process.env['DB_HOST'] || 'localhost',
        port: parseInt(process.env['DB_PORT'] || '3000', 10),
        username: process.env['DB_USERNAME'] || 'postgres',
        password: process.env['DB_PASSWORD'] || '',
        name: process.env['DB_NAME'] || 'estore',

    },
    jwt: {
        secret: getEnv('JWT_SECRET'),
        expiresIn: getEnv('JWT_EXPIRES_IN', '1d'),
    },
    email: {
      user: process.env['EMAIL_USER'] || '',
      pass: process.env['EMAIL_PASS'] || '',
    }
};


