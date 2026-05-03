import { Router } from 'express';
import { register, login } from '../controllers/auth.js'
import { registerSchema, loginSchema } from '../schemas/auth.ts';
import validate from '../middleware/validate.ts';


const router = Router();
 
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;