import jwt, { SignOptions } from "jsonwebtoken";
import {env } from '../config/env.ts'


const generateToken = (payload: object): string => {
    return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] });
}

const verifyToken = (token: string): any =>{
    return jwt.verify(token, env.jwt.secret );
}

export {generateToken, verifyToken};