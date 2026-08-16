import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/src/routes/auth.js';
import prayerRoutes from '../server/src/routes/prayers.js';
import quranRoutes from '../server/src/routes/quran.js';
import historyRoutes from '../server/src/routes/history.js';
import statsRoutes from '../server/src/routes/stats.js';
import leaderboardRoutes from '../server/src/routes/leaderboard.js';
import communityRoutes from '../server/src/routes/community.js';
import settingsRoutes from '../server/src/routes/settings.js';
import adminRoutes from '../server/src/routes/admin.js';
import prayerTimesRoutes from '../server/src/routes/prayerTimes.js';
import { connectMongo } from '../server/src/mongo.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/quran', quranRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prayer-times', prayerTimesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    name: 'Majlis Al-Aman Serverless API',
    mongo_user_id: '6a81ca9256464fc5bf9cbd87',
    timestamp: new Date().toISOString()
  });
});

export default async function handler(req, res) {
  try {
    await connectMongo();
  } catch (err) {
    console.error('Mongo connection error in Vercel function:', err);
  }
  return app(req, res);
}
