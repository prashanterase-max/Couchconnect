import { Router, Response } from 'express';
import Feedback from '../models/Feedback';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// User submits feedback
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { category, message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message required' });
    const user = await User.findById(req.userId).select('name email').lean();
    const fb = await Feedback.create({
      userId: req.userId,
      userName: (user as any)?.name || '',
      email: (user as any)?.email || '',
      category: category || 'General',
      message: message.trim(),
    });
    res.json(fb);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list all feedback
router.get('/', authMiddleware, requireRole('admin'), async (_req, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedbacks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update status
router.patch('/:id', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const fb = await Feedback.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(fb);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
