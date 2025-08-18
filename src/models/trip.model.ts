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
    startDate: {
      type: Date,
      required: true,
      set: (val: string) => {
        const d = new Date(val);
        d.setUTCHours(0, 0, 0, 0);
        return d;
      }
    },
    endDate: {
      type: Date,
      required: true,
      set: (val: string) => {
        const d = new Date(val);
        d.setUTCHours(0, 0, 0, 0);
        return d;
      }
    },
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
tripSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.startDate) {
      ret.startDate = ret.startDate.toISOString().split("T")[0];
    }
    if (ret.endDate) {
      ret.endDate = ret.endDate.toISOString().split("T")[0];
    }
    return ret;
  }
});

const Trip = mongoose.model<ITrip>('Trip', tripSchema);
export default Trip;
