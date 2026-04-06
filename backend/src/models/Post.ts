import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  image: string; // base64
  caption: string;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
}

const CommentSchema = new Schema<IComment>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  text:     { type: String, required: true },
}, { timestamps: true });

const PostSchema = new Schema<IPost>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  image:    { type: String, required: true },
  caption:  { type: String, default: '' },
  likes:    [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);
