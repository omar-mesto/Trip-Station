import mongoose, { Schema } from "mongoose";
import { IAdmin } from "../interfaces/models";
import bcrypt from 'bcryptjs';

const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

adminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdmin>('Admin', adminSchema);