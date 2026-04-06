import { Response } from 'express';
import Report from '../models/Report';
import Profile from '../models/Profile';
import { AuthRequest } from '../middleware/auth.middleware';

export const reportUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, reason } = req.body;
    if (!userId || !reason) return res.status(400).json({ message: 'userId and reason required' });

    // prevent duplicate reports from same user
    const existing = await Report.findOne({ reportedUserId: userId, reportedByUserId: req.userId });
    if (existing) return res.status(409).json({ message: 'You have already reported this user' });

    await Report.create({ reportedUserId: userId, reportedByUserId: req.userId, reason });
    await Profile.findOneAndUpdate({ userId }, { $inc: { reportCount: 1 } });

    res.json({ message: 'Report submitted. Our team will review it.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listReports = async (_req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find()
      .populate('reportedUserId', 'name email role')
      .populate('reportedByUserId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
