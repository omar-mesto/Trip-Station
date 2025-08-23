import User from '../models/user.model';
import Admin from '../models/admin.model';
import { t } from '../config/i18n';

export const getDashboardStatsService = async (lang: 'en' | 'ar') => {
  const User = (await import('../models/user.model')).default;
  const Company = (await import('../models/company.model')).default;
  const Trip = (await import('../models/trip.model')).default;
  const Country = (await import('../models/country.model')).default;
  const totalUsers = await User.countDocuments();
  const totalCompanies = await Company.countDocuments();
  const totalTrips = await Trip.countDocuments();
  const countries = await Country.find();
  return {
    totalUsers,
    totalCompanies,
    totalTrips,
    countriesCount: countries.length
  };
};

export const listUsersService = async (page: number, limit: number) => {
  const total = await User.countDocuments();
  const users = await User.find()
    .select(`_id fullName email profileImage isBlocked`)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const data = users.map((user: any) => ({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    isBlocked: user.isBlocked,
    profileImage: user.profileImage
      ? `${process.env.BASE_URL}/uploads/profileImages${user.profileImage}`
      : null,
  }));

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
};

export const toggleBlockUserService = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};

export const updateAdminProfileService = async (
  adminId: string,
  payload: { fullName?: string; oldPassword?: string; newPassword?: string },
  lang: 'en' | 'ar',
  file?: Express.Multer.File
) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error(t('user_not_found', lang));
  if (payload.fullName) {
    admin.fullName = payload.fullName;
  }
  if (payload.oldPassword && payload.newPassword) {
    const isMatch = await admin.comparePassword(payload.oldPassword);
    if (!isMatch) throw new Error(t('invalid_old_password', lang));

    if (payload.newPassword.length < 6) {
      throw new Error(t('password_min_length', lang));
    }
    admin.password = payload.newPassword;
  }
  if (file) {
    admin.set("profileImage", `/uploads/adminImages/${file.filename}`);
  }

  await admin.save();
  return admin;
};

