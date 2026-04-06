import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  email: string;
  category: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
}

const FeedbackSchema = new Schema<IFeedback>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, default: '' },
  email:    { type: String, default: '' },
  category: { type: String, default: 'General' },
  message:  { type: String, required: true },
  status:   { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
}, { timestamps: true });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
