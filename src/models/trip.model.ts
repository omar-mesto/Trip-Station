import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  name: {
    en: string;
    ar?: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  location: string;
  lat: number;
  lang: number;
  price: number;
  status: string;
  images: string[];
  country: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isAdvertisment: Boolean;
}

const tripSchema = new Schema<ITrip>({
  name: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  description: {
    en: { type: String },
    ar: { type: String }
  },
  location: { type: String },
  isAdvertisment: {type: Boolean},
  lat: { type: Number },
  lang: { type: Number },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  images: [{ type: String }],
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
}, { timestamps: true });

export default mongoose.model<ITrip>('Trip', tripSchema);
