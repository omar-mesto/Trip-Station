import { Request, Response } from 'express';
import User from '../models/user.model';
import { successResponse, errorResponse } from '../utils/response';
import { t } from "../config/i18n";

export const getUsers = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('name _id createdAt email image isBlocked')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    const formattedUsers = users.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    }));

    return successResponse(res, {
      users: formattedUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers,
    });
  } catch (error) {
    return errorResponse(res, t("failed_fetch_users", lang as any), 500);
  }
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return errorResponse(res, t("user_not_found", lang as any), 404);

    user.isBlocked = !user.isBlocked;
    await user.save();

    const message = user.isBlocked
      ? t("user_blocked_successfully", lang as any)
      : t("user_unblocked_successfully", lang as any);

    return successResponse(res, user, message);
  } catch (error) {
    return errorResponse(res, t("failed_update_user_status", lang as any), 500);
  }
};
