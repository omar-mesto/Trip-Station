import { Request, Response } from 'express';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getDashboardStatsService } from '../services/admin.service';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const lang = req.lang!;
  const stats = await getDashboardStatsService(lang);
  return successResponse(res, stats);
});