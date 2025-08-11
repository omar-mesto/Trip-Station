import User from '../models/user.model';
import Admin from '../models/admin.model';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../utils/token';
import { t } from '../config/i18n';
import { LoginPayload, RegisterPayload } from '../interfaces/models';


export const logoutService = async () => {
  return true;
};

export const adminLoginService = async (payload: LoginPayload, lang: 'en' | 'ar') => {
  const { email, password } = payload;
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(t('invalid_credentials', lang));

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw new Error(t('invalid_credentials', lang));

  const accessToken = generateAccessToken(admin._id.toString());

  return { accessToken, admin };
};

export const userLoginService = async (payload: LoginPayload, lang: 'en' | 'ar') => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) throw new Error(t('invalid_credentials', lang));
  if (user.isBlocked) throw new Error(t('unauthorized', lang));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error(t('invalid_credentials', lang));

  const accessToken = generateAccessToken(user._id.toString());

  return { accessToken, user };
};

export const userRegisterService = async (payload: RegisterPayload, lang: 'en' | 'ar') => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new Error(t('invalid_credentials', lang)); // or custom msg "Email already exists"

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    profileImage: payload.profileImage,
  });

  const accessToken = generateAccessToken(user._id.toString());
  return { accessToken, user };
};

export const updateUserProfileService = async (userId: string, payload: Partial<RegisterPayload>, lang: 'en' | 'ar') => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true });
  if (!updatedUser) throw new Error(t('user_not_found', lang));
  return updatedUser;
};
