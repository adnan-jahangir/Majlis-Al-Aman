import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import prayerRoutes from './routes/prayers.js';
import quranRoutes from './routes/quran.js';
import historyRoutes from './routes/history.js';
import statsRoutes from './routes/stats.js';
import leaderboardRoutes from './routes/leaderboard.js';
import communityRoutes from './routes/community.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';
import prayerTimesRoutes from './routes/prayerTimes.js';
import { seedDatabase } from './seed.js';
import { connectMongo, seedMongoUser } from './mongo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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

// Health check & metadata
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    name: 'Majlis Al-Aman API', 
    mongo_user_id: '6a81ca9256464fc5bf9cbd87',
    timestamp: new Date().toISOString() 
  });
});

// Error handling fallback
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Initialize database and start server
Promise.all([seedDatabase(), connectMongo()])
  .then(async () => {
    await seedMongoUser();
    app.listen(PORT, () => {
      console.log(`✨ Majlis Al-Aman Server running on http://localhost:${PORT}`);
      console.log(`📌 Primary MongoDB ID Configured: 6a81ca9256464fc5bf9cbd87`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
  });
