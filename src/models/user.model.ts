import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/models";
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);