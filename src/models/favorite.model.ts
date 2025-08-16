import mongoose, { Schema } from 'mongoose';

const favoriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
}, { timestamps: true });

export default mongoose.model('Favorite', favoriteSchema);
