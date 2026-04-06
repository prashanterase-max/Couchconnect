import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Profile from '../models/Profile';
import { AuthRequest } from '../middleware/auth.middleware';

const signToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'traveler' });
    await Profile.create({ userId: user._id, name: user.name, role: user.role });

    const token = signToken(String(user._id), user.role);
    res.cookie('cc_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    if (user.isBlacklisted) return res.status(403).json({ message: 'Account suspended' });

    const token = signToken(String(user._id), user.role);
    res.cookie('cc_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('cc_token');
  res.json({ message: 'Logged out' });
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
