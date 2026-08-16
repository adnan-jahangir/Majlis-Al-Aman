import express from 'express';
import { query, get } from '../db.js';
import { optionalAuth } from '../middleware/auth.js';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'this_week'; // 'this_week', 'this_month', 'all_time'
    const currentUserId = req.user ? req.user.id : null;

    let startDateStr = null;
    let totalTargetDays = 7;
    const now = new Date();

    if (timeframe === 'this_week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      startDateStr = format(weekStart, 'yyyy-MM-dd');
      totalTargetDays = Math.max(1, Math.round((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    } else if (timeframe === 'this_month') {
      const monthStart = startOfMonth(now);
      startDateStr = format(monthStart, 'yyyy-MM-dd');
      totalTargetDays = Math.max(1, now.getDate());
    }

    // Fetch all eligible users who have appear_on_leaderboard enabled
    const eligibleUsers = await query(
      `SELECT u.id, u.name, u.username, u.avatar, s.current_streak, s.longest_streak, s.total_active_days,
              us.appear_on_leaderboard, us.show_prayer_stats, us.show_quran_stats
       FROM users u
       JOIN user_settings us ON u.id = us.user_id
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE u.is_disabled = 0 AND (us.appear_on_leaderboard = 1 OR u.id = ?)`,
      [currentUserId || -1]
    );

    const leaderboard = [];

    for (const user of eligibleUsers) {
      let prayerCompletedCount = 0;
      let quranDaysCount = 0;
      let quranPagesCount = 0;

      if (startDateStr) {
        const pRow = await get(
          `SELECT count(*) as count FROM prayer_records 
           WHERE user_id = ? AND date >= ? AND status = 'completed'`,
          [user.id, startDateStr]
        );
        prayerCompletedCount = (pRow && pRow.count) || 0;

        const qRow = await get(
          `SELECT count(DISTINCT date) as days, sum(pages_read) as pages FROM quran_records 
           WHERE user_id = ? AND date >= ?`,
          [user.id, startDateStr]
        );
        quranDaysCount = (qRow && qRow.days) || 0;
        quranPagesCount = (qRow && qRow.pages) || 0;
      } else {
        // All time
        const pRow = await get(
          `SELECT count(*) as count FROM prayer_records WHERE user_id = ? AND status = 'completed'`,
          [user.id]
        );
        prayerCompletedCount = (pRow && pRow.count) || 0;

        const qRow = await get(
          `SELECT count(DISTINCT date) as days, sum(pages_read) as pages FROM quran_records WHERE user_id = ?`,
          [user.id]
        );
        quranDaysCount = (qRow && qRow.days) || 0;
        quranPagesCount = (qRow && qRow.pages) || 0;
      }

      // Calculate consistency metrics
      let maxPossiblePrayers = totalTargetDays * 5;
      if (timeframe === 'all_time') {
        const activeDays = Math.max(1, user.total_active_days || 1);
        maxPossiblePrayers = activeDays * 5;
      }

      const prayerConsistency = Math.min(100, Math.round((prayerCompletedCount / maxPossiblePrayers) * 100));
      const streakBonus = Math.min(20, (user.current_streak || 0) * 2);
      const quranBonus = Math.min(30, quranDaysCount * 5);
      
      // Consistency score formula focused on steady habits
      const score = Math.round(prayerConsistency * 0.7 + quranBonus + streakBonus);

      leaderboard.push({
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        prayerConsistency: user.show_prayer_stats ? `${prayerConsistency}%` : 'Private',
        prayerConsistencyVal: prayerConsistency,
        prayerCompleted: prayerCompletedCount,
        quranDays: user.show_quran_stats ? quranDaysCount : 0,
        quranPages: user.show_quran_stats ? quranPagesCount : 0,
        streak: user.current_streak || 0,
        score,
        isCurrentUser: currentUserId === user.id,
        isPrivate: !user.appear_on_leaderboard
      });
    }

    // Sort by Score descending, then streak, then prayers completed
    leaderboard.sort((a, b) => b.score - a.score || b.streak - a.streak || b.prayerCompleted - a.prayerCompleted);

    // Assign rank
    leaderboard.forEach((item, index) => {
      item.rank = index + 1;
    });

    const userRank = leaderboard.find(item => item.isCurrentUser);

    res.json({
      timeframe,
      leaderboard,
      userRank: userRank || null,
      totalParticipants: leaderboard.length
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error computing leaderboard' });
  }
});

export default router;
