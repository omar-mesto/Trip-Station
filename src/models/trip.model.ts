import mongoose, { Schema  } from 'mongoose';
import { ITrip } from '../interfaces/models';

const tripSchema = new Schema<ITrip>(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String },
    },
    location: { type: String },
    geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tripType: { type: String, enum: ['local', 'international'], default: 'international' },
    isAdvertisement: { type: Boolean, default: false },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    images: [{ type: String }],

    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country' },
  },
  { timestamps: true }
);

tripSchema.index({ geoLocation: '2dsphere' });

const Trip = mongoose.model<ITrip>('Trip', tripSchema);
export default Trip;
