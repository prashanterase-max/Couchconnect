import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  bio: string;
  city: string;
  languages: string[];
  photo: string;
  coverPhoto: string;
  posts: string[];
  role: string;
  socialLinks: { instagram?: string; twitter?: string; linkedin?: string; website?: string };
  emergencyContact: { name?: string; phone?: string; relation?: string };
  rating: number;
  ratingCount: number;
  reportCount: number;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  name: { type: String, default: '', index: true },
  bio: { type: String, default: '' },
  city: { type: String, default: '', index: true },
  languages: [{ type: String }],
  photo: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  posts: [{ type: String }],
  role: { type: String, default: 'traveler', index: true },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter:   { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    website:   { type: String, default: '' },
  },
  emergencyContact: {
    name:     { type: String, default: '' },
    phone:    { type: String, default: '' },
    relation: { type: String, default: '' },
  },
  rating:      { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
