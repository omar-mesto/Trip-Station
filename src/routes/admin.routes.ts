import express from 'express';
import { getDashboardStats, getUsers, toggleBlockUser, updateAdminProfile } from '../controllers/admin.controller';
import { authorize, protect } from '../middlewares/auth';
import { uploadAdminImage } from '../middlewares/uploadImage';

const router = express.Router();
router.get('/dashboard', protect,authorize('admin'), getDashboardStats);
router.get('/users', protect,authorize('admin'), getUsers);
router.put('/users/block/:id', protect,authorize('admin'),toggleBlockUser);
router.put("/profile", protect,authorize('admin'), uploadAdminImage.single("profileImage"),updateAdminProfile);


export default router;
