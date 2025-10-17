import mongoose, { Schema } from 'mongoose';
import { ICompany } from '../interfaces/models';

const companySchema = new Schema<ICompany>({
  name: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  rating: { type: Number, default: 0 },
  logo: { type: String },
  contact: {
    whatsapp: { type: String },
    facebook: { type: String },
    website: { type: String },  
    instagram: { type: String },
    mapLocation: { type: String }
  }
}, { timestamps: true });

export default mongoose.model<ICompany>('Company', companySchema);
