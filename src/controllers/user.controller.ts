import { Request, Response } from 'express';
import User from '../models/user.model';
import { successResponse, errorResponse } from '../utils/response';
import { t } from "../config/i18n";

export const getUsers = async (req: Request, res: Response) => {
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

    return successResponse(res, {
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch users', 500);
  }
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return errorResponse(res, 'User not found', 404);

    user.isBlocked = !user.isBlocked;
    await user.save();

    const message = user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully';
    return successResponse(res, user, message);
  } catch (error) {
    return errorResponse(res, 'Failed to update user status', 500);
  }
};
