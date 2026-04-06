import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifs = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(30).lean();
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { read: true });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Helper to create notifications from other controllers
export const createNotification = async (
  userId: string, type: string, title: string, body: string, link: string
) => {
  try {
    await Notification.create({ userId, type, title, body, link });
  } catch { /* silent */ }
};
