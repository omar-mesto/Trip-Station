import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { addFavoriteService, removeFavoriteService, listFavoritesService } from '../services/favorite.service';
import { t } from '../config/i18n';
import { getLang } from '../utils/lang.util';

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const userId = req.user._id;
  const tripId = req.body.tripId;
  const favorite = await addFavoriteService(userId, tripId);
  return successResponse(res, t('Added to favorites', lang), favorite);
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const userId = req.user._id;
  const tripId = req.body.tripId;
  const removed = await removeFavoriteService(userId, tripId);
  if (!removed) return errorResponse(res, t('Favorite not found',lang), 404);
  return successResponse(res, t('Removed from favorites',lang), removed);
});

export const listFavorites = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const lang = getLang(req);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const favorites = await listFavoritesService(userId, lang, page, limit);
  return successResponse(res, 'Success', favorites);
});
