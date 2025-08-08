import Admin from '../models/admin.model';
import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/response';
import { generateToken } from '../utils/generateToken';
import User from '../models/user.model';
import Company from '../models/company.model';
import Trip from '../models/trip.model';
import { t } from "../config/i18n";

export const adminLogin = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: t("email_password_required", lang as any) });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: t("invalid_credentials", lang as any) });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: t("invalid_credentials", lang as any) });
  }

  const token = generateToken(admin._id.toString());

  return successResponse(res, {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token,
  }, t("login_successful", lang as any));
};

export const getDashboardStats = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const totalUsers = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalTrips = await Trip.countDocuments();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tripsByMonth = await Trip.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } }
    ]);

    return successResponse(res, {
      totalUsers,
      totalCompanies,
      totalTrips,
      tripsByMonth,
    });
  } catch (err) {
    return errorResponse(res, t("failed_get_stats", lang as any), 500);
  }
};
