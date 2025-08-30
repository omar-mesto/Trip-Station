import { Request, Response } from 'express';
import { userRegisterService, updateUserProfileService, logoutService, deleteUserService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getLang } from '../utils/lang.util';
import { generateAccessToken } from '../utils/token';
import Admin from '../models/admin.model';
import User from '../models/user.model';

export const login = async (req: Request, res: Response) => {
  const lang = getLang(req);
  const { email, password, role } = req.body;

  try {
    let account: any = null;

    if (role === 'admin') {
      account = await Admin.findOne({ email: email.toLowerCase().trim() });
    } else {
      account = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!account) {
      return errorResponse(res, t('invalid_credentials', lang), 401);
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, t('invalid_credentials', lang), 401);
    }

    if (role === 'user' && account.isBlocked) {
      return errorResponse(res, t('user_blocked', lang), 403);
    }

    const accessToken = generateAccessToken(account._id.toString());

    return successResponse(res, {
      [role]: {
        _id: account._id,
        fullName: account.fullName,
        email: account.email,
        ...(role === 'admin'
          ? { role: account.role }
          : { profileImage: account.profileImage }),
      },
      accessToken,
    });
  } catch (error: any) {
    return errorResponse(res, t('login_failed', lang), 500);
  }
};

export const userRegister = async (req: Request, res: Response) => {
  const lang = getLang(req);
  try {
    const { accessToken, user } = await userRegisterService(req.body, lang, req.file);
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

export const userUpdateProfile = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lang = getLang(req);
  if (!req.user) return errorResponse(res, t('unauthorized', lang), 401);

  try {
    if (req.body.email) delete req.body.email;

    const updatedUser = await updateUserProfileService(
      req.user._id,
      req.body,
      lang,
      req.file
    );

    return successResponse(res, {
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};


export const logout = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  return successResponse(res, t('Logged out successfully', lang));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);

  const userId = (req as any).user._id;
  const deletedUser = await deleteUserService(userId);

  if (!deletedUser) {
    return errorResponse(res, t('user_not_found', lang), 404);
  }

  return successResponse(res, t('account_deleted_successfully', lang));
});