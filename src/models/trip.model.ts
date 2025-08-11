import mongoose, { Schema } from 'mongoose';
import { ITrip } from '../interfaces/models';

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
  isAdvertisement: { type: Boolean },
  lat: { type: Number },
  lang: { type: Number },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  images: [{ type: String }],
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
}, { timestamps: true });

export default mongoose.model<ITrip>('Trip', tripSchema);
