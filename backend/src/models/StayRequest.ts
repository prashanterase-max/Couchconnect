import mongoose, { Document, Schema } from 'mongoose';

export interface IStayRequest extends Document {
  travelerId: mongoose.Types.ObjectId;
  localId: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  message: string;
  guestCount: number;
  purpose: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const StayRequestSchema = new Schema<IStayRequest>({
  travelerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  localId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  message: { type: String, default: '' },
  guestCount: { type: Number, default: 1 },
  purpose: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IStayRequest>('StayRequest', StayRequestSchema);
