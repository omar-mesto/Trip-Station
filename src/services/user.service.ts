import User from '../models/user.model';

export const listUsersService = async (page: number, limit: number) => {
  return await User.find().skip((page - 1) * limit).limit(limit);
};

export const toggleBlockUserService = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};

export const registerUserService = async (data: any) => {
  const user = await User.create(data);
  return user;
};

export const updateProfileService = async (userId: string, data: any) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    data,
    { new: true, select: '-password' }
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};