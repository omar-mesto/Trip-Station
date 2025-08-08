import express from 'express';
import { adminLogin } from '../controllers/admin.controller';
import { getDashboardStats } from '../controllers/admin.controller';
import { protectAdmin } from '../middlewares/auth';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/dashboard', protectAdmin, getDashboardStats);

export default router;
