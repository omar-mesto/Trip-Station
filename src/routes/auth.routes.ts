import express from 'express';
import { login, userRegister, logout, userUpdateProfile, deleteUser } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { uploadProfileImage } from '../middlewares/uploadImage';

const router = express.Router();
router.post('/login', validate(loginSchema), login);
router.post('/user/register',uploadProfileImage.single('profileImage'), validate(registerSchema), userRegister);
router.post('/logout', protect, logout);
router.put('/user/update-profile', protect, uploadProfileImage.single('profileImage'), userUpdateProfile);
router.delete('/delete', protect, deleteUser);

export default router;
