import { query, get, run } from '../db.js';
import { format, subDays, parseISO } from 'date-fns';

export const updateStreakAndAchievements = async (userId) => {
  // Fetch all unique prayer dates and quran dates for the user
  const prayerDates = await query(
    `SELECT date, count(CASE WHEN status = 'completed' THEN 1 END) as completed_count 
     FROM prayer_records 
     WHERE user_id = ? 
     GROUP BY date 
     ORDER BY date DESC`,
    [userId]
  );

  const quranDates = await query(
    `SELECT DISTINCT date FROM quran_records WHERE user_id = ? AND pages_read > 0`,
    [userId]
  );

  const quranDateSet = new Set(quranDates.map(r => r.date));
  
  // A day is active if user completed at least 1 prayer or read quran
  const activeDateSet = new Set();
  prayerDates.forEach(p => {
    if (p.completed_count > 0) activeDateSet.add(p.date);
  });
  quranDates.forEach(q => activeDateSet.add(q.date));

  const sortedDates = Array.from(activeDateSet).sort((a, b) => b.localeCompare(a));
  const totalActiveDays = sortedDates.length;

  if (totalActiveDays === 0) {
    await run(
      `INSERT OR REPLACE INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
       VALUES (?, 0, 0, NULL, 0)`,
      [userId]
    );
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();
  
  // If no activity today, check if active yesterday
  if (!activeDateSet.has(todayStr)) {
    if (activeDateSet.has(yesterdayStr)) {
      checkDate = subDays(new Date(), 1);
    } else {
      checkDate = null;
    }
  }

  if (checkDate) {
    let d = checkDate;
    while (true) {
      const dStr = format(d, 'yyyy-MM-dd');
      if (activeDateSet.has(dStr)) {
        currentStreak++;
        d = subDays(d, 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak historically
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  // Sort ascending for historical streak run
  const ascendingDates = Array.from(activeDateSet).sort();
  for (const dateStr of ascendingDates) {
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const prev = parseISO(prevDate);
      const curr = parseISO(dateStr);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = dateStr;
  }

  if (currentStreak > longestStreak) longestStreak = currentStreak;

  const lastActivity = sortedDates[0];

  await run(
    `INSERT OR REPLACE INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, currentStreak, longestStreak, lastActivity, totalActiveDays]
  );

  // Check and award achievements
  await checkAndAwardAchievements(userId, currentStreak, longestStreak, totalActiveDays);

  return { currentStreak, longestStreak, totalActiveDays };
};

export const checkAndAwardAchievements = async (userId, currentStreak, longestStreak, totalActiveDays) => {
  const totalCompletedPrayersRow = await get(
    `SELECT count(*) as total FROM prayer_records WHERE user_id = ? AND status = 'completed'`,
    [userId]
  );
  const totalPrayers = totalCompletedPrayersRow ? totalCompletedPrayersRow.total : 0;

  const totalQuranPagesRow = await get(
    `SELECT sum(pages_read) as total FROM quran_records WHERE user_id = ?`,
    [userId]
  );
  const totalPages = (totalQuranPagesRow && totalQuranPagesRow.total) || 0;

  const fajrCompletedRow = await get(
    `SELECT count(*) as total FROM prayer_records WHERE user_id = ? AND prayer_name = 'Fajr' AND status = 'completed'`,
    [userId]
  );
  const fajrCount = fajrCompletedRow ? fajrCompletedRow.total : 0;

  const badgesToGrant = [];

  // Streak badges
  if (currentStreak >= 3 || longestStreak >= 3) badgesToGrant.push('streak_3');
  if (currentStreak >= 7 || longestStreak >= 7) badgesToGrant.push('streak_7');
  if (currentStreak >= 14 || longestStreak >= 14) badgesToGrant.push('streak_14');
  if (currentStreak >= 30 || longestStreak >= 30) badgesToGrant.push('streak_30');
  if (currentStreak >= 100 || longestStreak >= 100) badgesToGrant.push('streak_100');

  // Prayer milestones
  if (totalPrayers >= 10) badgesToGrant.push('prayers_10');
  if (totalPrayers >= 50) badgesToGrant.push('prayers_50');
  if (totalPrayers >= 100) badgesToGrant.push('prayers_100');
  if (totalPrayers >= 500) badgesToGrant.push('prayers_500');

  // Fajr devotion
  if (fajrCount >= 7) badgesToGrant.push('fajr_champion');

  // Quran milestones
  if (totalPages >= 1) badgesToGrant.push('quran_starter');
  if (totalPages >= 50) badgesToGrant.push('quran_50');
  if (totalPages >= 100) badgesToGrant.push('quran_100');
  if (totalPages >= 604) badgesToGrant.push('khatam_club');

  for (const badge of badgesToGrant) {
    await run(
      `INSERT OR IGNORE INTO user_achievements (user_id, badge_key, unlocked_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [userId, badge]
    );
  }
};
