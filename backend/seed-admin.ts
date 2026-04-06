import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB...');

  const users = mongoose.connection.collection('users');
  const profiles = mongoose.connection.collection('profiles');

  const email = 'admin@gmail.com';
  const existing = await users.findOne({ email });

  if (existing) {
    // update role to admin
    await users.updateOne({ email }, { $set: { role: 'admin' } });
    await profiles.updateOne({ userId: existing._id }, { $set: { role: 'admin' } });
    console.log('✅ Existing user updated to admin role');
  } else {
    const password = await bcrypt.hash('admin123', 12);
    const result = await users.insertOne({
      name: 'Admin',
      email,
      password,
      role: 'admin',
      isVerified: true,
      verificationStatus: 'approved',
      isBlacklisted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await profiles.insertOne({
      userId: result.insertedId,
      name: 'Admin',
      bio: 'CouchConnect Administrator',
      city: '',
      languages: [],
      photo: '',
      posts: [],
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin user created');
  }

  console.log('   Email:    admin@gmail.com');
  console.log('   Password: admin123');
  console.log('   Role:     admin');
  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
