import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'message' | 'stay_request' | 'stay_accepted' | 'stay_rejected' | 'verification' | 'rating' | 'report';
  title: string;
  body: string;
  link: string;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type:   { type: String, required: true },
  title:  { type: String, required: true },
  body:   { type: String, default: '' },
  link:   { type: String, default: '' },
  read:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
