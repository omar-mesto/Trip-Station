import mongoose, { Schema, Document } from 'mongoose';

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

const companySchema = new Schema<ICompany>({
   name: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  rating: { type: Number, default: 0 },
  logo: { type: String },
}, { timestamps: true });

export default mongoose.model<ICompany>('Company', companySchema);
