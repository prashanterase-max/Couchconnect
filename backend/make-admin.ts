import 'dotenv/config';
import mongoose from 'mongoose';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  const email = process.argv[2];
  if (!email) { console.log('Usage: ts-node make-admin.ts your@email.com'); process.exit(1); }
  const result = await mongoose.connection.collection('users').updateOne(
    { email },
    { $set: { role: 'admin' } }
  );
  console.log(result.matchedCount ? `✅ ${email} is now admin` : `❌ User not found`);
  process.exit(0);
};

run().catch(console.error);
