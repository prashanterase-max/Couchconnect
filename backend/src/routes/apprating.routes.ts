import { Router, Request, Response } from 'express';
import AppRating from '../models/AppRating';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Submit or update own rating
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { stars, comment } = req.body;
    const rating = await AppRating.findOneAndUpdate(
      { userId: req.userId },
      { stars, comment },
      { upsert: true, new: true }
    );
    res.json(rating);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get own rating
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rating = await AppRating.findOne({ userId: req.userId }).lean();
    res.json(rating);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Public: get aggregate stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const all = await AppRating.find().select('stars').lean();
    const count = all.length;
    const avg = count ? (all.reduce((s, r) => s + r.stars, 0) / count) : 0;
    const dist = [1,2,3,4,5].map(s => ({ stars: s, count: all.filter(r => r.stars === s).length }));
    res.json({ avg: Math.round(avg * 10) / 10, count, distribution: dist });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
