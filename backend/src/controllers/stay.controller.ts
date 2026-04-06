import { Response } from 'express';
import StayRequest from '../models/StayRequest';
import { AuthRequest } from '../middleware/auth.middleware';
import { createNotification } from './notification.controller';

export const sendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { localId, fromDate, toDate, message, guestCount, purpose } = req.body;
    const sr = await StayRequest.create({ travelerId: req.userId, localId, fromDate, toDate, message, guestCount, purpose });
    await createNotification(localId, 'stay_request', '🏠 New Stay Request', `Someone wants to stay with you from ${fromDate} to ${toDate}`, '/local-requests');
    res.json(sr);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const myRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await StayRequest.find({ travelerId: req.userId }).populate('localId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const localRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await StayRequest.find({ localId: req.userId }).populate('travelerId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const respondRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const sr = await StayRequest.findOneAndUpdate(
      { _id: req.params.id, localId: req.userId },
      { status },
      { new: true }
    ).populate('travelerId');
    if (!sr) return res.status(404).json({ message: 'Request not found' });

    const traveler = sr.travelerId as any;
    const msg = status === 'accepted' ? '✅ Stay request accepted!' : '❌ Stay request declined';
    await createNotification(String(traveler._id || traveler), 'stay_' + status, msg, `Your stay request has been ${status}`, '/my-requests');

    res.json(sr);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
