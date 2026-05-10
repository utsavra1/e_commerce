import {Router} from 'express';
import { getMyProfile, updateProfile, changePassword } from '../controllers/profile.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { updateProfileSchema, changePasswordSchema } from '../schemas/profile.ts';


const router = Router();

router.get('/me', authenticate, getMyProfile);
router.post('/me', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;


