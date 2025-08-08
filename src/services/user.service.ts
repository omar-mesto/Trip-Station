import User from '../models/user.model';

export const getAllUsers = async () => {
  return await User.find();
};

export const createUser = async (data: { name: string; email: string }) => {
  const user = new User(data);
  return await user.save();
};