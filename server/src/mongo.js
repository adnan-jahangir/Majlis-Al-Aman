import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/majlis_al_aman';

export const connectMongo = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✨ Connected to MongoDB database successfully!');
  } catch (err) {
    console.log('MongoDB connection notice:', err.message);
  }
};
