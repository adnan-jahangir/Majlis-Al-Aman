import express from 'express';
import { query, get } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const router = express.Router();
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Get monthly calendar history
router.get('/month', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year || new Date().getFullYear(), 10);
    const month = parseInt(req.query.month || (new Date().getMonth() + 1), 10); // 1-12

    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const startDateStr = `${monthStr}-01`;
    
    // Construct interval days
    const monthDate = parseISO(startDateStr);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Fetch prayers in this month
    const prayerRows = await query(
      `SELECT date, prayer_name, status 
       FROM prayer_records 
       WHERE user_id = ? AND date LIKE ?`,
      [userId, `${monthStr}%`]
    );

    // Fetch quran in this month
    const quranRows = await query(
      `SELECT date, SUM(pages_read) as total_pages, SUM(reading_duration_mins) as total_duration 
       FROM quran_records 
       WHERE user_id = ? AND date LIKE ? 
       GROUP BY date`,
      [userId, `${monthStr}%`]
    );

    const prayerMap = {};
    prayerRows.forEach(r => {
      if (!prayerMap[r.date]) prayerMap[r.date] = {};
      prayerMap[r.date][r.prayer_name] = r.status;
    });

    const quranMap = {};
    quranRows.forEach(r => {
      quranMap[r.date] = {
        pages: r.total_pages || 0,
        duration: r.total_duration || 0
      };
    });

    const calendarDays = daysInMonth.map(day => {
      const dStr = format(day, 'yyyy-MM-dd');
      const prayersForDay = prayerMap[dStr] || {};
      const completedCount = Object.values(prayersForDay).filter(s => s === 'completed').length;
      const quranInfo = quranMap[dStr] || { pages: 0, duration: 0 };

      let level = 'empty'; // 'full' (5/5), 'high' (4/5), 'partial' (1-3/5), 'empty' (0)
      if (completedCount === 5) level = 'full';
      else if (completedCount >= 3) level = 'high';
      else if (completedCount > 0 || quranInfo.pages > 0) level = 'partial';

      return {
        date: dStr,
        dayNumber: day.getDate(),
        dayOfWeek: day.getDay(), // 0 = Sun
        completedPrayers: completedCount,
        totalPrayers: 5,
        quranPages: quranInfo.pages,
        quranDuration: quranInfo.duration,
        level,
        hasActivity: completedCount > 0 || quranInfo.pages > 0
      };
    });

    // Summary statistics for the month
    const totalDaysWithFullPrayers = calendarDays.filter(d => d.completedPrayers === 5).length;
    const totalMonthPrayers = calendarDays.reduce((acc, d) => acc + d.completedPrayers, 0);
    const totalMonthPages = calendarDays.reduce((acc, d) => acc + d.quranPages, 0);
    const maxPossiblePrayers = daysInMonth.length * 5;
    const monthCompletionRate = Math.round((totalMonthPrayers / maxPossiblePrayers) * 100);

    res.json({
      year,
      month,
      monthName: format(monthStart, 'MMMM yyyy'),
      calendarDays,
      summary: {
        totalDaysWithFullPrayers,
        totalMonthPrayers,
        totalMonthPages,
        monthCompletionRate
      }
    });
  } catch (error) {
    console.error('Get history month error:', error);
    res.status(500).json({ error: 'Server error fetching monthly history' });
  }
});

// Get day details
router.get('/day/:date', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.params.date;

    const prayerRows = await query(
      'SELECT prayer_name, status, notes, updated_at FROM prayer_records WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    const prayerMap = {};
    prayerRows.forEach(r => { prayerMap[r.prayer_name] = r; });

    const prayers = PRAYER_NAMES.map(name => ({
      name,
      status: prayerMap[name] ? prayerMap[name].status : 'pending',
      notes: prayerMap[name] ? prayerMap[name].notes : null,
      updated_at: prayerMap[name] ? prayerMap[name].updated_at : null
    }));

    const completedCount = prayers.filter(p => p.status === 'completed').length;

    const quranLogs = await query(
      'SELECT id, surah_number, surah_name, pages_read, reading_duration_mins, notes, created_at FROM quran_records WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    const totalPages = quranLogs.reduce((acc, l) => acc + l.pages_read, 0);
    const totalDuration = quranLogs.reduce((acc, l) => acc + (l.reading_duration_mins || 0), 0);

    res.json({
      date,
      prayers,
      completedCount,
      totalPrayers: 5,
      prayerScore: `${completedCount}/5`,
      completionPercentage: Math.round((completedCount / 5) * 100),
      quranLogs,
      totalQuranPages: totalPages,
      totalQuranDuration: totalDuration
    });
  } catch (error) {
    console.error('Get day history error:', error);
    res.status(500).json({ error: 'Server error fetching day details' });
  }
});

export default router;
