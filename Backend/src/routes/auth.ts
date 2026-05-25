import { Router } from 'express';
import { register, login, verify } from '../controllers/auth.js'
import { registerSchema, loginSchema } from '../schemas/auth.ts';
import validate from '../middleware/validate.ts';



const router = Router();
 
router.post('/register', validate(registerSchema), register);
router.post('/login',validate(loginSchema), login);
router.post('/verify', verify);

export default router;