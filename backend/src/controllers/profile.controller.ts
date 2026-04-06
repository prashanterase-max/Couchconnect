import { Response } from 'express';
import Profile from '../models/Profile';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    let profile = await Profile.findOne({ userId: req.userId }).lean();
    if (!profile) {
      const user = await User.findById(req.userId).lean();
      profile = await Profile.create({ userId: req.userId, name: user?.name || '', role: user?.role || 'traveler' });
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, city, languages, photo, posts } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { name, bio, city, languages, photo, posts },
      { new: true, upsert: true }
    );
    if (name) await User.findByIdAndUpdate(req.userId, { name });
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfileById = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).lean();
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listProfiles = async (_req: AuthRequest, res: Response) => {
  try {
    const profiles = await Profile.find({ role: { $ne: 'admin' } }).select('-posts').lean();
    res.json(profiles);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
