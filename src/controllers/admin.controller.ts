import { Request, Response } from 'express';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getDashboardStatsService } from '../services/admin.service';
import { listUsersService, toggleBlockUserService } from '../services/admin.service';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const lang = req.lang!;
  const stats = await getDashboardStatsService(lang);
  return successResponse(res, stats);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as any) || 1;
  const limit = parseInt(req.query.limit as any) || 10;
  const data = await listUsersService(page, limit);
  return successResponse(res, data);
});

export const toggleBlockUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await toggleBlockUserService(req.params.id);
  return successResponse(res, user);
});