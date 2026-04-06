import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId;
  submittedName: string;
  documentImage: string; // base64
  ocrText: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
}

const VerificationSchema = new Schema<IVerification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  submittedName: { type: String, required: true },
  documentImage: { type: String, required: true },
  ocrText: { type: String, default: '' },
  confidence: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IVerification>('Verification', VerificationSchema);
