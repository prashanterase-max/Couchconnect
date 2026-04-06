import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  senderId: mongoose.Types.ObjectId;
  text: string;
  seenBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IChat extends Document {
  chatId: string; // sorted userId1_userId2
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const ChatSchema = new Schema<IChat>({
  chatId: { type: String, required: true, unique: true, index: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.model<IChat>('Chat', ChatSchema);
