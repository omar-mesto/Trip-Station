import { Request, Response } from 'express';
import { adminLoginService, userLoginService, userRegisterService, updateUserProfileService, logoutService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { asyncHandler } from '../middlewares/asyncHandler';

const getLangFromRequest = (req: Request) => {
  return (req.query.lang as string) === 'ar' ? 'ar' : 'en';
};

export const adminLogin = async (req: Request, res: Response) => {
  const lang = getLangFromRequest(req);
  try {
    const { accessToken, admin } = await adminLoginService(req.body, lang);
    return successResponse(res, {
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || t('invalid_credentials', lang), 401);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const lang = getLangFromRequest(req);
  try {
    const { accessToken, user } = await userLoginService(req.body, lang);
    return successResponse(res, {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
      },
      accessToken,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || t('invalid_credentials', lang), 401);
  }
};

export const userRegister = async (req: Request, res: Response) => {
  const lang = getLangFromRequest(req);
  try {
    const { accessToken, user } = await userRegisterService(req.body, lang);
    return successResponse(res, {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
      },
      accessToken,
    }, undefined, 201);
  } catch (error: any) {
    return errorResponse(res, error.message || t('invalid_credentials', lang), 400);
  }
};

export const userUpdateProfile = async (req: Request & { user?: any }, res: Response) => {
  const lang = getLangFromRequest(req);
  if (!req.user) return errorResponse(res, t('unauthorized', lang), 401);
  try {
    const updatedUser = await updateUserProfileService(req.user._id, req.body, lang);
    return successResponse(res, {
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error: any) {
    return errorResponse(res, error.message || t('user_not_found', lang), 400);
  }
};

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutService();
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return successResponse(res, { message: 'Logged out successfully' });
});
