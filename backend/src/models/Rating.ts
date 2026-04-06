import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  stayRequestId: mongoose.Types.ObjectId;
  stars: number;
  comment: string;
}

const RatingSchema = new Schema<IRating>({
  fromUserId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stayRequestId:  { type: Schema.Types.ObjectId, ref: 'StayRequest' },
  stars:          { type: Number, required: true, min: 1, max: 5 },
  comment:        { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model<IRating>('Rating', RatingSchema);
