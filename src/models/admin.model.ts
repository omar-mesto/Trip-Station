import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

adminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdmin>('Admin', adminSchema);
