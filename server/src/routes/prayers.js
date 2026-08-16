import express from 'express';
import { query, get, run } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { updateStreakAndAchievements } from '../services/streakService.js';
import { format } from 'date-fns';

const router = express.Router();
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Get prayers for a specific date (defaults to today)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date || format(new Date(), 'yyyy-MM-dd');

    const records = await query(
      'SELECT prayer_name, status, notes, updated_at FROM prayer_records WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    const recordMap = {};
    records.forEach(r => {
      recordMap[r.prayer_name] = r;
    });

    const prayers = PRAYER_NAMES.map(name => ({
      name,
      status: recordMap[name] ? recordMap[name].status : 'pending',
      notes: recordMap[name] ? recordMap[name].notes : null,
      updated_at: recordMap[name] ? recordMap[name].updated_at : null
    }));

    const completedCount = prayers.filter(p => p.status === 'completed').length;

    // Get Quran pages for this day too for quick daily sync
    const quranDay = await get(
      'SELECT sum(pages_read) as total_pages, sum(reading_duration_mins) as total_duration FROM quran_records WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    res.json({
      date,
      prayers,
      completedCount,
      totalPrayers: 5,
      completionPercentage: Math.round((completedCount / 5) * 100),
      quranSummary: {
        pagesRead: (quranDay && quranDay.total_pages) || 0,
        durationMins: (quranDay && quranDay.total_duration) || 0
      }
    });
  } catch (error) {
    console.error('Get prayers error:', error);
    res.status(500).json({ error: 'Server error fetching prayers' });
  }
});

// Update single prayer status
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { prayerName, status, date, notes } = req.body;
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    if (!PRAYER_NAMES.includes(prayerName)) {
      return res.status(400).json({ error: 'Invalid prayer name' });
    }

    const validStatuses = ['completed', 'missed', 'late', 'excused', 'pending'];
    const targetStatus = validStatuses.includes(status) ? status : 'completed';

    if (targetStatus === 'pending') {
      // Remove record or mark as pending
      await run(
        'DELETE FROM prayer_records WHERE user_id = ? AND date = ? AND prayer_name = ?',
        [userId, targetDate, prayerName]
      );
    } else {
      await run(
        `INSERT INTO prayer_records (user_id, date, prayer_name, status, notes, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, date, prayer_name) DO UPDATE SET
           status = excluded.status,
           notes = excluded.notes,
           updated_at = CURRENT_TIMESTAMP`,
        [userId, targetDate, prayerName, targetStatus, notes || null]
      );
    }

    // Refresh streak and check achievements
    const streakInfo = await updateStreakAndAchievements(userId);

    // Fetch updated day
    const records = await query(
      'SELECT prayer_name, status, notes, updated_at FROM prayer_records WHERE user_id = ? AND date = ?',
      [userId, targetDate]
    );

    const recordMap = {};
    records.forEach(r => { recordMap[r.prayer_name] = r; });

    const prayers = PRAYER_NAMES.map(name => ({
      name,
      status: recordMap[name] ? recordMap[name].status : 'pending',
      notes: recordMap[name] ? recordMap[name].notes : null,
      updated_at: recordMap[name] ? recordMap[name].updated_at : null
    }));

    const completedCount = prayers.filter(p => p.status === 'completed').length;

    // Check if user completed all 5 prayers today and should generate a celebratory community post option
    const completedAllToday = completedCount === 5;

    res.json({
      message: `${prayerName} marked as ${targetStatus}`,
      date: targetDate,
      prayerName,
      status: targetStatus,
      prayers,
      completedCount,
      completionPercentage: Math.round((completedCount / 5) * 100),
      streak: streakInfo,
      completedAllToday
    });
  } catch (error) {
    console.error('Toggle prayer error:', error);
    res.status(500).json({ error: 'Server error updating prayer record' });
  }
});

// Quick bulk mark all completed for a day
router.post('/mark-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, status = 'completed' } = req.body;
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    for (const name of PRAYER_NAMES) {
      await run(
        `INSERT INTO prayer_records (user_id, date, prayer_name, status, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, date, prayer_name) DO UPDATE SET
           status = excluded.status,
           updated_at = CURRENT_TIMESTAMP`,
        [userId, targetDate, name, status]
      );
    }

    const streakInfo = await updateStreakAndAchievements(userId);

    res.json({
      message: `All prayers marked as ${status}`,
      date: targetDate,
      streak: streakInfo
    });
  } catch (error) {
    console.error('Mark all error:', error);
    res.status(500).json({ error: 'Server error bulk updating prayers' });
  }
});

export default router;
