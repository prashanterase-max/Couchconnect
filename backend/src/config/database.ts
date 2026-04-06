import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // keep-alive ping every 5 minutes to prevent Atlas cold starts
    setInterval(async () => {
      try { await mongoose.connection.db?.admin().ping(); }
      catch { /* ignore */ }
    }, 5 * 60 * 1000);

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
