import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);

export default router;
