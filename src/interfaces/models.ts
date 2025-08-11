import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  isBlocked: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITrip extends Document {
  name: {
    en: string;
    ar?: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  location: string;
  lat: number;
  lang: number;
  price: number;
  status: string;
  images: string[];
  country: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isAdvertisement: Boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
}

export interface UpdateProfileInput {
  userId: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICompany extends Document {
  name: {
    en: string;
    ar?: string;
  };
  rating: number;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICountry extends Document {
  name: {
    en: string;
    ar?: string;
  };
  flag?: string;
  createdAt: Date;
  updatedAt: Date;
}