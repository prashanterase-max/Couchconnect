import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  authorId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IQuestion extends Document {
  authorId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  city: string;
  answers: IAnswer[];
}

const AnswerSchema = new Schema<IAnswer>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const QuestionSchema = new Schema<IQuestion>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  city: { type: String, default: '' },
  answers: [AnswerSchema],
}, { timestamps: true });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
