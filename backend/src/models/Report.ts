import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reportedUserId: mongoose.Types.ObjectId;
  reportedByUserId: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

const ReportSchema = new Schema<IReport>({
  reportedUserId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reportedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason:           { type: String, required: true },
  status:           { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IReport>('Report', ReportSchema);
