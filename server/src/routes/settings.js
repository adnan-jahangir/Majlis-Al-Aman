import express from 'express';
import { get, run } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await get('SELECT * FROM user_settings WHERE user_id = ?', [userId]);

    if (!settings) {
      await run(
        `INSERT INTO user_settings (user_id) VALUES (?)`,
        [userId]
      );
      settings = await get('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    }

    res.json({ settings, ...settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// Update settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      theme,
      locationCity,
      locationCountry,
      latitude,
      longitude,
      calcMethod,
      madhab,
      fajrReminder,
      dhuhrReminder,
      asrReminder,
      maghribReminder,
      ishaReminder,
      quranReminder,
      streakReminder,
      emailReminder,
      reminderTime,
      dailyQuranGoal,
      isPublicProfile,
      showPrayerStats,
      showQuranStats,
      appearOnLeaderboard,
      showCommunityActivity
    } = req.body;

    await run(
      `INSERT INTO user_settings (
        user_id, theme, location_city, location_country, latitude, longitude,
        calc_method, madhab, fajr_reminder, dhuhr_reminder, asr_reminder,
        maghrib_reminder, isha_reminder, quran_reminder, streak_reminder,
        email_reminder, reminder_time,
        daily_quran_goal, is_public_profile, show_prayer_stats, show_quran_stats,
        appear_on_leaderboard, show_community_activity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        theme = COALESCE(?, theme),
        location_city = COALESCE(?, location_city),
        location_country = COALESCE(?, location_country),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        calc_method = COALESCE(?, calc_method),
        madhab = COALESCE(?, madhab),
        fajr_reminder = COALESCE(?, fajr_reminder),
        dhuhr_reminder = COALESCE(?, dhuhr_reminder),
        asr_reminder = COALESCE(?, asr_reminder),
        maghrib_reminder = COALESCE(?, maghrib_reminder),
        isha_reminder = COALESCE(?, isha_reminder),
        quran_reminder = COALESCE(?, quran_reminder),
        streak_reminder = COALESCE(?, streak_reminder),
        email_reminder = COALESCE(?, email_reminder),
        reminder_time = COALESCE(?, reminder_time),
        daily_quran_goal = COALESCE(?, daily_quran_goal),
        is_public_profile = COALESCE(?, is_public_profile),
        show_prayer_stats = COALESCE(?, show_prayer_stats),
        show_quran_stats = COALESCE(?, show_quran_stats),
        appear_on_leaderboard = COALESCE(?, appear_on_leaderboard),
        show_community_activity = COALESCE(?, show_community_activity)`,
      [
        userId,
        theme || 'dark',
        locationCity || 'New York',
        locationCountry || 'United States',
        latitude || 40.7128,
        longitude || -74.0060,
        calcMethod || 'ISNA',
        madhab || 'Standard',
        fajrReminder ?? 1,
        dhuhrReminder ?? 1,
        asrReminder ?? 1,
        maghribReminder ?? 1,
        ishaReminder ?? 1,
        quranReminder ?? 1,
        streakReminder ?? 1,
        emailReminder ?? 1,
        reminderTime || '22:00',
        dailyQuranGoal || 10,
        isPublicProfile ?? 1,
        showPrayerStats ?? 1,
        showQuranStats ?? 1,
        appearOnLeaderboard ?? 1,
        showCommunityActivity ?? 1,
        // On conflict update args:
        theme,
        locationCity,
        locationCountry,
        latitude,
        longitude,
        calcMethod,
        madhab,
        fajrReminder,
        dhuhrReminder,
        asrReminder,
        maghribReminder,
        ishaReminder,
        quranReminder,
        streakReminder,
        emailReminder,
        reminderTime,
        dailyQuranGoal,
        isPublicProfile,
        showPrayerStats,
        showQuranStats,
        appearOnLeaderboard,
        showCommunityActivity
      ]
    );

    const updatedSettings = await get('SELECT * FROM user_settings WHERE user_id = ?', [userId]);

    res.json({ message: 'Settings saved successfully', settings: updatedSettings, ...updatedSettings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error updating settings' });
  }
});

// Test reminder notification dispatch
router.post('/test-reminder', authenticateToken, async (req, res) => {
  try {
    const user = await get('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    const { sendReminderEmail } = await import('../services/emailService.js');

    const result = await sendReminderEmail({
      user,
      pendingPrayers: ['Maghrib', 'Isha'],
      quranPagesToday: 4,
      streak: 5
    });

    res.json({
      message: 'Test notification triggered successfully',
      result
    });
  } catch (error) {
    console.error('Test reminder error:', error);
    res.status(500).json({ error: 'Server error triggering test notification' });
  }
});

export default router;
