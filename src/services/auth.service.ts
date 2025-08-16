import User from '../models/user.model';
import Admin from '../models/admin.model';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../utils/token';
import { t } from '../config/i18n';
import { IAdminAccount, IUserAccount, LoginPayload, RegisterPayload } from '../interfaces/models';

export const logoutService = async () => {
  return true;
};

export const loginService = async (
  payload: LoginPayload,lang: 'en' | 'ar'): Promise<{ accessToken: string; account: (IUserAccount | IAdminAccount) & { _id: any } }> => {
  const { email, password, role } = payload;

  let account: (IUserAccount & any) | (IAdminAccount & any) | null = null;

  if (role === 'admin') {
    account = await Admin.findOne({ email });
    if (!account) throw new Error(t('invalid_credentials', lang));

    const isMatch = await account.comparePassword(password);
    if (!isMatch) throw new Error(t('invalid_credentials', lang));
  } else {
    account = await User.findOne({ email });
    if (!account) throw new Error(t('invalid_credentials', lang));
    if (account.isBlocked) throw new Error(t('user_blocked', lang));

    const isMatch = await account.comparePassword(password);
    if (!isMatch) throw new Error(t('invalid_credentials', lang));
  }

  const accessToken = generateAccessToken(account._id.toString());
  return { accessToken, account };
};

export const userRegisterService = async (
  payload: RegisterPayload,
  lang: 'en' | 'ar',
  file?: Express.Multer.File
) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new Error(t('email_already_exists', lang));

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    profileImage: file ? `/uploads/profileImages/${file.filename}` : undefined,
  });

  const accessToken = generateAccessToken(user._id.toString());
  return { accessToken, user };
};


export const updateUserProfileService = async (
  userId: string,
  payload: Partial<RegisterPayload>,
  lang: 'en' | 'ar',
  file?: Express.Multer.File
) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  if (payload.email) {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error(t('email_already_exists', lang));
    }
  }

  const updateData: any = { ...payload };
  if (file) {
    updateData.profileImage = `/uploads/profileImages/${file.filename}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) throw new Error(t('user_not_found', lang));
    return updatedUser;
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
      throw new Error(t('email_already_exists', lang));
    }
    throw error;
  }
};

