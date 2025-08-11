import express from 'express';
import { getUsers, toggleBlockUser,registerUser, updateProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth';
import { uploadProfileImage } from '../middlewares/uploadImage';
import { userLogin } from '../controllers/auth.controller';

const router = express.Router();

router.get('/', protect, getUsers);
router.put('/block/:id', protect, toggleBlockUser);
router.post('/register', uploadProfileImage.single('profileImage'), registerUser);
router.post('/login', userLogin);
router.put('/update-profile', protect, uploadProfileImage.single('profileImage'), updateProfile);

export default router;
