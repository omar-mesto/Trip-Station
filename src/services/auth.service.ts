import User from '../models/user.model';
import Admin from '../models/admin.model';
import { generateAccessToken } from '../utils/token';
import { t } from '../config/i18n';
import { IAdminAccount, IUserAccount, LoginPayload, RegisterPayload } from '../interfaces/models';

export const logoutService = async () => {
  return true;
};

export const loginService = async (
  payload: LoginPayload,
  lang: 'en' | 'ar'
): Promise<{ accessToken: string; account: (IUserAccount | IAdminAccount) & { _id: any } }> => {
  const { email, password, role } = payload;

  let account: (IUserAccount & any) | (IAdminAccount & any) | null = null;

  if (role === 'admin') {
    account = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!account) throw new Error(t('invalid_credentials', lang));

    const isMatch = await account.comparePassword(password);
    if (!isMatch) throw new Error(t('invalid_credentials', lang));
  } else {
    account = await User.findOne({ email: email.toLowerCase().trim() });
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
  const existingUser = await User.findOne({ email: payload.email.toLowerCase().trim() });
  if (existingUser) throw new Error(t('email_already_exists', lang));
  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email.toLowerCase().trim(),
    password: payload.password,
    profileImage: file ? `/uploads/profileImages/${file.filename}` : undefined,
  });

  const accessToken = generateAccessToken(user._id.toString());
  return { accessToken, user };
};


export const updateUserProfileService = async (
  userId: string,
  payload: Partial<RegisterPayload> & { oldPassword?: string; newPassword?: string },
  lang: 'en' | 'ar',
  file?: Express.Multer.File
) => {
  if (payload.email) {
    delete payload.email;
  }

  const user = await User.findById(userId);
  if (!user) throw new Error(t('user_not_found', lang));

  if (payload.oldPassword && payload.newPassword) {
    const isMatch = await user.comparePassword(payload.oldPassword);
    if (!isMatch) {
      throw new Error(t('invalid_old_password', lang));
    }

    if (payload.newPassword.length < 6) {
      throw new Error(t('password_min_length', lang));
    }

    user.password = payload.newPassword;
  }

  if (payload.fullName) user.fullName = payload.fullName;
  if (file) user.profileImage = `/uploads/profileImages/${file.filename}`;

  await user.save();
  return user;
};

export const deleteUserService = async (userId: string) => {
  return User.findByIdAndDelete(userId);
};
