import express from 'express';
import { getDashboardStats, getUsers, toggleBlockUser } from '../controllers/admin.controller';
import { authorize, protect } from '../middlewares/auth';

const router = express.Router();
router.get('/dashboard', protect,authorize('admin'), getDashboardStats);
router.get('/users', protect,authorize('admin'), getUsers);
router.put('/users/block/:id', protect,authorize('admin'),toggleBlockUser);


export default router;
