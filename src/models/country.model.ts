import mongoose, { Schema, Document } from 'mongoose';
import { ICountry } from '../interfaces/models';

const countrySchema = new Schema<ICountry>({
  name: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  flag: { type: String },
}, { timestamps: true });

export default mongoose.model<ICountry>('Country', countrySchema);
