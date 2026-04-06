import mongoose, { Document, Schema } from 'mongoose';

export interface IAppRating extends Document {
  userId: mongoose.Types.ObjectId;
  stars: number;
  comment: string;
}

const AppRatingSchema = new Schema<IAppRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stars:  { type: Number, required: true, min: 1, max: 5 },
  comment:{ type: String, default: '' },
}, { timestamps: true });

export default mongoose.model<IAppRating>('AppRating', AppRatingSchema);
