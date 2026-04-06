import { Response } from 'express';
import Rating from '../models/Rating';
import Profile from '../models/Profile';
import { AuthRequest } from '../middleware/auth.middleware';

export const submitRating = async (req: AuthRequest, res: Response) => {
  try {
    const { toUserId, stayRequestId, stars, comment } = req.body;
    const existing = await Rating.findOne({ fromUserId: req.userId, stayRequestId });
    if (existing) return res.status(409).json({ message: 'Already rated this stay' });

    const rating = await Rating.create({ fromUserId: req.userId, toUserId, stayRequestId, stars, comment });

    // update profile avg rating
    const all = await Rating.find({ toUserId });
    const avg = all.reduce((s, r) => s + r.stars, 0) / all.length;
    await Profile.findOneAndUpdate({ userId: toUserId }, { rating: Math.round(avg * 10) / 10, ratingCount: all.length });

    res.json(rating);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getRatings = async (req: AuthRequest, res: Response) => {
  try {
    const ratings = await Rating.find({ toUserId: req.params.userId })
      .populate('fromUserId', 'name').sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
