import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserSettings, Streak } from './models/index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/majlis_al_aman';

export const connectMongo = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✨ Connected to MongoDB database successfully!');
  } catch (err) {
    console.log('MongoDB local connection notice:', err.message);
  }
};

export const seedMongoUser = async () => {
  try {
    if (mongoose.connection.readyState < 1) return;

    const existingUser = await User.findOne({ email: 'adnan@majlis.app' });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      const newUser = new User({
        name: 'Adnan Tariq',
        username: 'adnan',
        email: 'adnan@majlis.app',
        password_hash: passwordHash,
        role: 'user',
        bio: 'Seeking consistency and peace in daily worship.'
      });
      await newUser.save();

      await UserSettings.findOneAndUpdate(
        { user_id: newUser._id },
        {
          user_id: newUser._id,
          location_city: 'Dhaka',
          location_country: 'Bangladesh',
          latitude: 23.8103,
          longitude: 90.4125,
          calc_method: 'Karachi'
        },
        { upsert: true, new: true }
      );

      await Streak.findOneAndUpdate(
        { user_id: newUser._id },
        { user_id: newUser._id, current_streak: 0, longest_streak: 0, total_active_days: 0 },
        { upsert: true, new: true }
      );

      console.log(`✓ Seeded primary MongoDB user: ${newUser.email} (${newUser._id})`);
    }
  } catch (err) {
    console.error('Mongo seed error:', err.message);
  }
};
