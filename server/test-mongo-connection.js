import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User, UserSettings, Streak, Announcement } from './src/models/index.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function testAtlas() {
  console.log('Testing connection to MongoDB Atlas...');
  console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');

    const TARGET_USER_ID = '6a81ca9256464fc5bf9cbd87';
    let user = await User.findById(TARGET_USER_ID);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      user = new User({
        _id: new mongoose.Types.ObjectId(TARGET_USER_ID),
        name: 'Adnan Tariq',
        username: 'adnan',
        email: 'adnan@majlis.app',
        password_hash: passwordHash,
        role: 'user',
        bio: 'Seeking consistency and peace in daily worship.'
      });
      await user.save();
      console.log(`✅ Seeded primary user into MongoDB Atlas with ID: ${TARGET_USER_ID}`);
    } else {
      console.log(`✅ User with ID ${TARGET_USER_ID} found in MongoDB Atlas!`);
    }

    await UserSettings.findOneAndUpdate(
      { user_id: TARGET_USER_ID },
      {
        user_id: TARGET_USER_ID,
        location_city: 'Dhaka',
        location_country: 'Bangladesh',
        latitude: 23.8103,
        longitude: 90.4125,
        calc_method: 'Karachi'
      },
      { upsert: true, new: true }
    );

    await Streak.findOneAndUpdate(
      { user_id: TARGET_USER_ID },
      { user_id: TARGET_USER_ID, current_streak: 0, longest_streak: 0, total_active_days: 0 },
      { upsert: true, new: true }
    );

    console.log('🌟 MongoDB Atlas Verification & Seeding 100% Successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Error:', err.message);
    process.exit(1);
  }
}

testAtlas();
