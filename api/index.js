import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve .env from server/ directory (not api/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

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
import { initDb } from '../server/src/db.js';
import { seedDatabase } from '../server/src/seed.js';

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
    mongo_uri_set: !!process.env.MONGODB_URI,
    jwt_secret_set: !!process.env.JWT_SECRET,
    google_client_set: !!process.env.GOOGLE_CLIENT_ID,
    timestamp: new Date().toISOString()
  });
});

// Global error handler — prevents unhandled crashes from returning raw 500
app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      await initDb();
      await seedDatabase();
      await connectMongo();
      isInitialized = true;
      console.log('✅ Serverless initialization complete');
    } catch (err) {
      console.error('Serverless initialization error:', err.message);
      // Still mark as initialized so we don't retry every cold start
      isInitialized = true;
    }
  }
  return app(req, res);
}
