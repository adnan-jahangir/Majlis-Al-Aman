import express from 'express';
import { query, get } from '../db.js';
import { optionalAuth } from '../middleware/auth.js';
import { format, startOfWeek, startOfMonth } from 'date-fns';

const router = express.Router();
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

router.get('/', optionalAuth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'today'; // 'today', 'this_week', 'this_month', 'all_time'
    const currentUserId = req.user ? req.user.id : null;

    let startDateStr = null;
    let elapsedTargetDays = 1;
    let periodTargetPrayers = 5;

    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    if (timeframe === 'today') {
      startDateStr = todayStr;
      elapsedTargetDays = 1;
      periodTargetPrayers = 5;
    } else if (timeframe === 'this_week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      startDateStr = format(weekStart, 'yyyy-MM-dd');
      const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
      elapsedTargetDays = Math.max(1, dayOfWeek);
      periodTargetPrayers = 35; // 7 days * 5 prayers
    } else if (timeframe === 'this_month') {
      const monthStart = startOfMonth(now);
      startDateStr = format(monthStart, 'yyyy-MM-dd');
      elapsedTargetDays = Math.max(1, now.getDate());
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      periodTargetPrayers = daysInMonth * 5; // e.g. 31 * 5 = 155 prayers
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

      if (timeframe === 'today') {
        const pRow = await get(
          `SELECT count(*) as count FROM prayer_records 
           WHERE user_id = ? AND date = ? AND status = 'completed'`,
          [user.id, todayStr]
        );
        prayerCompletedCount = (pRow && pRow.count) || 0;

        const qRow = await get(
          `SELECT sum(pages_read) as pages FROM quran_records 
           WHERE user_id = ? AND date = ?`,
          [user.id, todayStr]
        );
        quranPagesCount = (qRow && qRow.pages) || 0;
        quranDaysCount = quranPagesCount > 0 ? 1 : 0;
      } else if (startDateStr) {
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

      // Calculate score based on timeframe
      let score = 0;
      let prayerConsistency = 0;
      let targetPrayersForPeriod = periodTargetPrayers;

      if (timeframe === 'today') {
        prayerConsistency = Math.round((prayerCompletedCount / 5) * 100);
        score = Math.round((prayerCompletedCount * 16) + (quranPagesCount * 3) + Math.min(20, (user.current_streak || 0) * 2));
      } else {
        let maxElapsedPrayers = elapsedTargetDays * 5;
        if (timeframe === 'all_time') {
          const activeDays = Math.max(1, user.total_active_days || 1);
          maxElapsedPrayers = activeDays * 5;
          targetPrayersForPeriod = maxElapsedPrayers;
        }

        prayerConsistency = Math.min(100, Math.round((prayerCompletedCount / maxElapsedPrayers) * 100));
        const streakBonus = Math.min(20, (user.current_streak || 0) * 2);
        const quranBonus = Math.min(30, quranDaysCount * 5);
        score = Math.round(prayerConsistency * 0.7 + quranBonus + streakBonus);
      }

      leaderboard.push({
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        prayerConsistency: user.show_prayer_stats ? `${prayerConsistency}%` : 'Private',
        prayerConsistencyVal: prayerConsistency,
        prayerCompleted: user.show_prayer_stats ? prayerCompletedCount : 0,
        totalTargetPrayers: user.show_prayer_stats ? targetPrayersForPeriod : 5,
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

// GET /api/leaderboard/user/:userId - Get spiritual details for a user modal
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const targetUser = await get(
      `SELECT u.id, u.name, u.username, u.avatar, u.bio, u.created_at,
              us.is_public_profile, us.show_prayer_stats, us.show_quran_stats,
              s.current_streak, s.longest_streak, s.total_active_days
       FROM users u
       LEFT JOIN user_settings us ON u.id = us.user_id
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE u.id = ? AND u.is_disabled = 0`,
      [targetUserId]
    );

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Today's prayers
    let todayPrayers = [];
    let todayCompletedCount = 0;

    if (targetUser.show_prayer_stats !== 0) {
      const records = await query(
        'SELECT prayer_name, status FROM prayer_records WHERE user_id = ? AND date = ?',
        [targetUserId, todayStr]
      );
      const recordMap = {};
      records.forEach(r => { recordMap[r.prayer_name] = r.status; });

      todayPrayers = PRAYER_NAMES.map(name => ({
        name,
        status: recordMap[name] || 'pending'
      }));

      todayCompletedCount = todayPrayers.filter(p => p.status === 'completed').length;
    }

    // Quran summary
    let quranStats = {
      todayPages: 0,
      todayDuration: 0,
      totalPages: 0
    };

    if (targetUser.show_quran_stats !== 0) {
      const qToday = await get(
        'SELECT sum(pages_read) as total_pages, sum(reading_duration_mins) as total_duration FROM quran_records WHERE user_id = ? AND date = ?',
        [targetUserId, todayStr]
      );
      const qTotal = await get(
        'SELECT sum(pages_read) as total_pages FROM quran_records WHERE user_id = ?',
        [targetUserId]
      );

      quranStats = {
        todayPages: (qToday && qToday.total_pages) || 0,
        todayDuration: (qToday && qToday.total_duration) || 0,
        totalPages: (qTotal && qTotal.total_pages) || 0
      };
    }

    // Achievements
    const achievements = await query(
      'SELECT badge_key, unlocked_at FROM user_achievements WHERE user_id = ?',
      [targetUserId]
    );

    res.json({
      user: {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        avatar: targetUser.avatar,
        bio: targetUser.bio || 'Seeking peace and barakah in daily worship 🌿',
        memberSince: targetUser.created_at,
        streak: {
          current_streak: targetUser.current_streak || 0,
          longest_streak: targetUser.longest_streak || 0,
          total_active_days: targetUser.total_active_days || 0
        }
      },
      privacy: {
        showPrayerStats: targetUser.show_prayer_stats !== 0,
        showQuranStats: targetUser.show_quran_stats !== 0
      },
      todayPrayers,
      todayCompletedCount,
      quranStats,
      achievements: achievements.map(a => a.badge_key)
    });
  } catch (error) {
    console.error('Get user leaderboard profile error:', error);
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

export default router;
