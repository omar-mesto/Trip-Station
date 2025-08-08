import express from 'express';
import { getUsers, toggleBlockUser } from '../controllers/user.controller';
import { protectAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', protectAdmin, getUsers);
router.patch('/block/:id', protectAdmin, toggleBlockUser);

export default router;
