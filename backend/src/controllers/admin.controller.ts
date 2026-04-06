import { Response } from 'express';
import User from '../models/User';
import Verification from '../models/Verification';
import Profile from '../models/Profile';
import Question from '../models/Question';
import StayRequest from '../models/StayRequest';
import { AuthRequest } from '../middleware/auth.middleware';

export const listVerifications = async (_req: AuthRequest, res: Response) => {
  try {
    const verifications = await Verification.find().sort({ createdAt: -1 }).lean();
    res.json(verifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [total, locals, travelers, verified, pendingVerifications, totalQuestions, totalStays] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'local' }),
      User.countDocuments({ role: 'traveler' }),
      User.countDocuments({ isVerified: true }),
      Verification.countDocuments({ status: 'pending' }),
      Question.countDocuments(),
      StayRequest.countDocuments(),
    ]);
    res.json({ total, locals, travelers, verified, pendingVerifications, totalQuestions, totalStays });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      const re = new RegExp(req.query.search as string, 'i');
      filter.$or = [{ name: re }, { email: re }];
    }
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const [verification, profile] = await Promise.all([
      Verification.findOne({ userId: req.params.id }).lean(),
      Profile.findOne({ userId: req.params.id }).lean(),
    ]);
    res.json({ user, verification, profile });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { action, role } = req.body;
    const userId = req.params.id;

    if (action === 'delete') {
      await User.findByIdAndDelete(userId);
      return res.json({ message: 'User deleted' });
    }

    if (action === 'setRole' && role) {
      const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
      await Profile.findOneAndUpdate({ userId }, { role });
      return res.json(user);
    }

    const updates: any = {};
    if (action === 'approve') {
      updates.isVerified = true; updates.verificationStatus = 'approved'; updates.isBlacklisted = false;
      await Verification.findOneAndUpdate({ userId }, { status: 'approved' });
    } else if (action === 'reject') {
      updates.isVerified = false; updates.verificationStatus = 'rejected';
      await Verification.findOneAndUpdate({ userId }, { status: 'rejected' });
    } else if (action === 'blacklist') {
      updates.isBlacklisted = true;
    } else if (action === 'unblacklist') {
      updates.isBlacklisted = false;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkAction = async (req: AuthRequest, res: Response) => {
  try {
    const { userIds, action } = req.body;
    if (!userIds?.length) return res.status(400).json({ message: 'No users selected' });

    if (action === 'delete') {
      await User.deleteMany({ _id: { $in: userIds } });
    } else if (action === 'blacklist') {
      await User.updateMany({ _id: { $in: userIds } }, { isBlacklisted: true });
    } else if (action === 'unblacklist') {
      await User.updateMany({ _id: { $in: userIds } }, { isBlacklisted: false });
    }
    res.json({ message: `Bulk ${action} done`, count: userIds.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getActivityFeed = async (_req: AuthRequest, res: Response) => {
  try {
    const [recentUsers, recentVerifications, recentStays] = await Promise.all([
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(10).lean(),
      Verification.find().select('submittedName status confidence createdAt userId').sort({ createdAt: -1 }).limit(10).lean(),
      StayRequest.find().populate('travelerId', 'name').populate('localId', 'name').sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    const feed = [
      ...recentUsers.map((u: any) => ({ type: 'signup', icon: '👤', text: `${u.name} signed up as ${u.role}`, time: u.createdAt, color: '#3b82f6' })),
      ...recentVerifications.map((v: any) => ({ type: 'verification', icon: '🛡️', text: `${v.submittedName} submitted verification — ${v.status}`, time: v.createdAt, color: v.status === 'approved' ? '#22c55e' : v.status === 'pending' ? '#b07800' : '#ef4444' })),
      ...recentStays.map((s: any) => ({ type: 'stay', icon: '🏠', text: `${(s.travelerId as any)?.name || 'Traveler'} requested stay with ${(s.localId as any)?.name || 'Local'}`, time: s.createdAt, color: '#a855f7' })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20);

    res.json(feed);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listQuestions = async (_req: AuthRequest, res: Response) => {
  try {
    const questions = await Question.find().populate('authorId', 'name email').sort({ createdAt: -1 }).lean();
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnswer = async (req: AuthRequest, res: Response) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, { $pull: { answers: { _id: req.params.answerId } } });
    res.json({ message: 'Answer deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
