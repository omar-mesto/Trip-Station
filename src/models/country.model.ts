import mongoose, { Schema, Document } from 'mongoose';
import { ICountry } from '../interfaces/models';

const countrySchema = new Schema<ICountry>({
  name: {
    en: { type: String, required: true },
    ar: { type: String },
    },
  images: [{ type: String }],
  tripType: { type: String, enum: ['local', 'international'], default: 'international' },
}, { timestamps: true });

export default mongoose.model<ICountry>('Country', countrySchema);
