import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { listUsersService,toggleBlockUserService,registerUserService,updateProfileService} from '../services/user.service';

const getLang = (req: Request): 'en' | 'ar' => {
  const langRaw = req.query.lang as string | undefined;
  return langRaw === 'ar' ? 'ar' : 'en';
};

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

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const payload = req.body;
  if ((req as any).file && (req as any).file.path) payload.profileImage = (req as any).file.path;
  const user = await registerUserService(payload);
  return successResponse(res, { _id: user._id, fullName: user.fullName, email: user.email }, t('register_success', lang));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const userId = (req as any).user?._id?.toString();
  if (!userId) return errorResponse(res, t('not_authorized', lang), 401);

  const payload = req.body;
  if ((req as any).file && (req as any).file.path) payload.profileImage = (req as any).file.path;

  const user = await updateProfileService(userId, payload);
  if (!user) {
    return errorResponse(res, t('user_not_found', lang), 404);
  }

  return successResponse(
    res,
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
    },
    t('profile_updated_successfully', lang)
  );
});
