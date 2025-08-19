import User from '../models/user.model';

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
  return await User.find().select(`_id fullName email profileImage isBlocked`)
  .skip((page - 1) * limit).limit(limit);
};

export const toggleBlockUserService = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};
