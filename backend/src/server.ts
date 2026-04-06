import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import chatRoutes from './routes/chat.routes';
import stayRoutes from './routes/stay.routes';
import questionRoutes from './routes/question.routes';
import verificationRoutes from './routes/verification.routes';
import adminRoutes from './routes/admin.routes';
import ratingRoutes from './routes/rating.routes';
import notificationRoutes from './routes/notification.routes';
import reportRoutes from './routes/report.routes';
import postRoutes from './routes/post.routes';
import appRatingRoutes from './routes/apprating.routes';
import feedbackRoutes from './routes/feedback.routes';

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin.includes('localhost') || origin.includes('trycloudflare.com')) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stay', stayRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/app-rating', appRatingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Public stats endpoint (no auth required)
app.get('/api/stats', async (_req, res) => {
  try {
    const User = (await import('./models/User')).default;
    const StayRequest = (await import('./models/StayRequest')).default;
    const Rating = (await import('./models/Rating')).default;
    const Profile = (await import('./models/Profile')).default;
    const AppRating = (await import('./models/AppRating')).default;
    const [totalUsers, totalLocals, totalStays, allAppRatings, totalCities] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'local' }),
      StayRequest.countDocuments({ status: 'accepted' }),
      AppRating.find().select('stars').lean(),
      Profile.distinct('city', { city: { $ne: '' } }),
    ]);
    const avgRating = allAppRatings.length
      ? (allAppRatings.reduce((s: number, r: any) => s + r.stars, 0) / allAppRatings.length).toFixed(1)
      : '0.0';
    res.json({ totalUsers, totalLocals, totalStays, avgRating, totalCities: totalCities.length, totalRatings: allAppRatings.length });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
