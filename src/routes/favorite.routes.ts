import express from 'express';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favorite.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/', protect, addFavorite);
router.delete('/', protect, removeFavorite);
router.get('/', protect, listFavorites);

export default router;
