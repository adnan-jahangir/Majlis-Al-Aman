import express from 'express';
import { query, get } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { format, subDays, eachDayOfInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const router = express.Router();
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();

    // 1. Overall Prayer Statistics
    const totalCompletedPrayersRow = await get(
      `SELECT count(*) as total FROM prayer_records WHERE user_id = ? AND status = 'completed'`,
      [userId]
    );
    const totalPrayersCompleted = (totalCompletedPrayersRow && totalCompletedPrayersRow.total) || 0;

    // Consistency per individual prayer
    const prayerConsistency = {};
    for (const name of PRAYER_NAMES) {
      const row = await get(
        `SELECT count(*) as completed FROM prayer_records WHERE user_id = ? AND prayer_name = ? AND status = 'completed'`,
        [userId, name]
      );
      const totalLoggedRow = await get(
        `SELECT count(DISTINCT date) as total_days FROM prayer_records WHERE user_id = ?`,
        [userId]
      );
      const totalDays = Math.max(1, (totalLoggedRow && totalLoggedRow.total_days) || 1);
      const completed = (row && row.completed) || 0;
      prayerConsistency[name] = {
        name,
        completed,
        percentage: Math.min(100, Math.round((completed / totalDays) * 100))
      };
    }

    // 2. Quran Statistics
    const quranStatsRow = await get(
      `SELECT 
        SUM(pages_read) as total_pages, 
        COUNT(DISTINCT date) as total_reading_days,
        SUM(reading_duration_mins) as total_duration_mins
       FROM quran_records WHERE user_id = ?`,
      [userId]
    );

    const totalQuranPages = (quranStatsRow && quranStatsRow.total_pages) || 0;
    const totalReadingDays = (quranStatsRow && quranStatsRow.total_reading_days) || 0;
    const avgPagesPerDay = totalReadingDays > 0 ? (totalQuranPages / totalReadingDays).toFixed(1) : '0';

    // 3. Weekly Chart (Last 7 days)
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const weeklyChart = [];

    for (const day of last7Days) {
      const dStr = format(day, 'yyyy-MM-dd');
      const prayers = await query(
        `SELECT prayer_name, status FROM prayer_records WHERE user_id = ? AND date = ? AND status = 'completed'`,
        [userId, dStr]
      );
      const quran = await get(
        `SELECT SUM(pages_read) as pages FROM quran_records WHERE user_id = ? AND date = ?`,
        [userId, dStr]
      );

      weeklyChart.push({
        date: dStr,
        day: format(day, 'EEE'), // Mon, Tue, etc.
        prayers: prayers.length,
        quranPages: (quran && quran.pages) || 0,
        score: Math.round((prayers.length / 5) * 100)
      });
    }

    // 4. Monthly Trend (Last 6 Months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const mDate = subMonths(today, i);
      const mStart = startOfMonth(mDate);
      const mEnd = endOfMonth(mDate);
      const mStr = format(mDate, 'yyyy-MM');

      const pCountRow = await get(
        `SELECT count(*) as total FROM prayer_records WHERE user_id = ? AND date LIKE ? AND status = 'completed'`,
        [userId, `${mStr}%`]
      );
      const qPagesRow = await get(
        `SELECT SUM(pages_read) as total FROM quran_records WHERE user_id = ? AND date LIKE ?`,
        [userId, `${mStr}%`]
      );

      const daysInM = eachDayOfInterval({ start: mStart, end: mEnd }).length;
      const maxPrayers = daysInM * 5;
      const completed = (pCountRow && pCountRow.total) || 0;

      monthlyTrend.push({
        month: format(mDate, 'MMM yyyy'),
        shortMonth: format(mDate, 'MMM'),
        completedPrayers: completed,
        completionRate: Math.min(100, Math.round((completed / maxPrayers) * 100)),
        quranPages: (qPagesRow && qPagesRow.total) || 0
      });
    }

    // 5. Daily Activity Trend for past 30 days (for smooth area chart)
    const last30Days = eachDayOfInterval({ start: subDays(today, 29), end: today });
    const dailyActivityTrend = [];
    for (const day of last30Days) {
      const dStr = format(day, 'yyyy-MM-dd');
      const pRow = await get(
        `SELECT count(*) as completed FROM prayer_records WHERE user_id = ? AND date = ? AND status = 'completed'`,
        [userId, dStr]
      );
      const qRow = await get(
        `SELECT SUM(pages_read) as pages FROM quran_records WHERE user_id = ? AND date = ?`,
        [userId, dStr]
      );
      dailyActivityTrend.push({
        date: dStr,
        displayDate: format(day, 'MMM d'),
        prayers: (pRow && pRow.completed) || 0,
        quranPages: (qRow && qRow.pages) || 0
      });
    }

    // 6. 365 Days Activity Heatmap (GitHub style)
    const lastYearDays = eachDayOfInterval({ start: subDays(today, 364), end: today });
    
    // Fetch all active records in the past year
    const pastYearStartDate = format(subDays(today, 364), 'yyyy-MM-dd');
    const allPrayersPastYear = await query(
      `SELECT date, count(CASE WHEN status = 'completed' THEN 1 END) as count 
       FROM prayer_records 
       WHERE user_id = ? AND date >= ? 
       GROUP BY date`,
      [userId, pastYearStartDate]
    );

    const allQuranPastYear = await query(
      `SELECT date, SUM(pages_read) as pages 
       FROM quran_records 
       WHERE user_id = ? AND date >= ? 
       GROUP BY date`,
      [userId, pastYearStartDate]
    );

    const prayerYearMap = {};
    allPrayersPastYear.forEach(r => { prayerYearMap[r.date] = r.count; });
    const quranYearMap = {};
    allQuranPastYear.forEach(r => { quranYearMap[r.date] = r.pages; });

    const heatmap = lastYearDays.map(day => {
      const dStr = format(day, 'yyyy-MM-dd');
      const pCount = prayerYearMap[dStr] || 0;
      const qPages = quranYearMap[dStr] || 0;

      let level = 0;
      if (pCount === 5) level = 4;
      else if (pCount >= 3 || qPages >= 10) level = 3;
      else if (pCount >= 2 || qPages >= 4) level = 2;
      else if (pCount >= 1 || qPages > 0) level = 1;

      return {
        date: dStr,
        level,
        prayers: pCount,
        quranPages: qPages
      };
    });

    const streakRow = await get('SELECT * FROM streaks WHERE user_id = ?', [userId]);

    res.json({
      prayers: {
        totalCompleted: totalPrayersCompleted,
        consistency: prayerConsistency
      },
      quran: {
        totalPages: totalQuranPages,
        totalReadingDays,
        avgPagesPerDay,
        totalDurationMins: (quranStatsRow && quranStatsRow.total_duration_mins) || 0
      },
      streak: streakRow || { current_streak: 0, longest_streak: 0, total_active_days: 0 },
      weeklyChart,
      monthlyTrend,
      dailyActivityTrend,
      heatmap
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error calculating statistics' });
  }
});

export default router;
