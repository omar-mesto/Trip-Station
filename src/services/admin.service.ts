export const getDashboardStatsService = async (lang: any) => {
  const User = (await import('../models/user.model')).default;
  const Company = (await import('../models/company.model')).default;
  const Trip = (await import('../models/trip.model')).default;

  const totalUsers = await User.countDocuments();
  const totalCompanies = await Company.countDocuments();
  const totalTrips = await Trip.countDocuments();
  return { totalUsers, totalCompanies, totalTrips };
};
