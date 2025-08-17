import mongoose, { Schema } from "mongoose";
import { IAdmin } from "../interfaces/models";
import bcrypt from 'bcryptjs';

const adminSchema = new Schema<IAdmin>({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true,lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdmin>('Admin', adminSchema);