import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  name: {
    en: string;
    ar?: string;
  };
  flag?: string;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new Schema<ICountry>({
  name: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  flag: { type: String },
}, { timestamps: true });

export default mongoose.model<ICountry>('Country', countrySchema);
