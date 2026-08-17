import { format } from 'date-fns';
import { query, get } from '../db.js';
import { sendReminderEmail } from './emailService.js';

// Cache to prevent duplicate daily reminder emails to the same user on the same date
const sentRemindersCache = new Set(); // format: `${userId}_${dateStr}`

export const checkAndSendDueReminders = async () => {
  try {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHour}:${currentMinute}`;

    // Get all active users with email reminder enabled
    const usersWithSettings = await query(
      `SELECT u.id, u.name, u.email, 
              COALESCE(us.email_reminder, 1) as email_reminder,
              COALESCE(us.reminder_time, '22:00') as reminder_time
       FROM users u
       LEFT JOIN user_settings us ON u.id = us.user_id
       WHERE u.is_disabled = 0`
    );

    for (const u of usersWithSettings) {
      if (u.email_reminder !== 1) continue;

      const cacheKey = `${u.id}_${todayStr}`;
      if (sentRemindersCache.has(cacheKey)) continue;

      // Check if current time matches the user's configured reminder time
      const userReminderTime = u.reminder_time || '22:00';
      if (userReminderTime === currentTimeStr) {
        // Check today's prayer records
        const prayers = await query(
          'SELECT prayer_name, status FROM prayer_records WHERE user_id = ? AND date = ?',
          [u.id, todayStr]
        );

        const allPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const completedMap = {};
        prayers.forEach(p => { completedMap[p.prayer_name] = p.status; });

        const pending = allPrayers.filter(pName => completedMap[pName] !== 'completed');

        // Only send if at least 1 prayer is not completed
        if (pending.length > 0) {
          const quranRow = await get(
            'SELECT sum(pages_read) as total FROM quran_records WHERE user_id = ? AND date = ?',
            [u.id, todayStr]
          );
          const streakRow = await get('SELECT current_streak FROM streaks WHERE user_id = ?', [u.id]);

          await sendReminderEmail({
            user: u,
            pendingPrayers: pending,
            quranPagesToday: (quranRow && quranRow.total) || 0,
            streak: (streakRow && streakRow.current_streak) || 0
          });

          sentRemindersCache.add(cacheKey);
        }
      }
    }
  } catch (err) {
    console.error('Reminder scheduler check error:', err.message);
  }
};

export const startReminderScheduler = () => {
  console.log('⏰ Reminder Scheduler initialized (checking every 60 seconds)');
  // Check every 60 seconds
  setInterval(() => {
    checkAndSendDueReminders();
  }, 60000);
};
