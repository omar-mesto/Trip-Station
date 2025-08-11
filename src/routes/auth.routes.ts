import express from 'express';
import { userLogin, adminLogin, userRegister, logout } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { updateProfile } from '../controllers/user.controller';

const router = express.Router();

router.post('/user/register', validate(registerSchema), userRegister);
router.post('/user/login', validate(loginSchema), userLogin);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.post('/logout', protect, logout);
router.put('/user/update-profile', protect, updateProfile);

export default router;