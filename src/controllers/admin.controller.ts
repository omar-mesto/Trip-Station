import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getDashboardStatsService, updateAdminProfileService } from '../services/admin.service';
import { listUsersService, toggleBlockUserService } from '../services/admin.service';
import { getLang } from '../utils/lang.util';

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

export const updateAdminProfile = asyncHandler(async (req: Request & { user?: any }, res: Response) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  const lang = getLang(req);

  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 'Unauthorized', 401);
  }
  try {
    const updatedAdmin = await updateAdminProfileService(req.user._id, req.body, lang, req.file);
    return successResponse(res, {
      admin: {
        id: updatedAdmin._id,
        fullName: updatedAdmin.fullName,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        profileImage: updatedAdmin.profileImage ? `${baseUrl}${updatedAdmin.profileImage}` : null,
      },
    });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
});