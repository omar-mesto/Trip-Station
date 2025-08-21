import mongoose, { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  isBlocked: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: any;
}

export interface ITrip extends Document {
  name: { en: string; ar?: string };
  description: { en: string; ar?: string };
  location?: string;
  geoLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  isAdvertisement: boolean;
  price: number;
  rating: number;
  status: string;
  images: string[];
  company: mongoose.Types.ObjectId;
  country?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  tripType: 'local' | 'international';
}

export interface INearbyTrip {
  id: string;
  price: number;
  location?: string;
  lat: number | null;
  lng: number | null;
  name: string | null;
  description: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
}

export interface IAccountBase {
 _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserAccount extends IAccountBase {
  profileImage?: string;
  isBlocked?: boolean;
}

export interface IAdminAccount extends IAccountBase {
  role: string;
}

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: string;
  profileImage?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICompany extends Document {
  name: {
    en: string;
    ar?: string;
  };
  contact:{
    whatsapp: string;
    facebook: string,
    website: string ,
    instagram: string,
    email: string,
    phone: string
  }
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
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  tripType: 'local' | 'international';
}