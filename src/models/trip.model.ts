import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  name: string;
  description: string;
  location: string;
  lat: number;
  lang: number;
  price: number;
  status: string;
  images: string[];
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  lat: { type: Number },
  lang: { type: Number },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  images: [{ type: String }],
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });

export default mongoose.model<ITrip>('Trip', tripSchema);
