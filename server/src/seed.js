import bcrypt from 'bcryptjs';
import { initDb, run, get } from './db.js';

export const cleanAndResetDatabase = async () => {
  await initDb();

  console.log('Cleaning all dummy data and resetting database to fresh state...');

  // Remove all dummy records
  await run('DELETE FROM prayer_records');
  await run('DELETE FROM quran_records');
  await run('DELETE FROM streaks');
  await run('DELETE FROM user_achievements');
  await run('DELETE FROM post_reactions');
  await run('DELETE FROM post_comments');
  await run('DELETE FROM community_posts');
  await run('DELETE FROM announcements');
  await run('DELETE FROM user_settings');
  await run('DELETE FROM users');

  const salt = await bcrypt.genSalt(10);
  const userPasswordHash = await bcrypt.hash('password123', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);

  // 1. Clean primary user (Adnan Tariq - 0 records, fresh start)
  const userRes = await run(
    `INSERT INTO users (name, username, email, password_hash, role, avatar, bio)
     VALUES (?, ?, ?, ?, 'user', ?, ?)`,
    [
      'Adnan Tariq',
      'adnan',
      'adnan@majlis.app',
      userPasswordHash,
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'Seeking consistency and peace in daily worship.'
    ]
  );

  const adnanId = userRes.id;
  await run(
    `INSERT INTO user_settings (
      user_id, theme, location_city, location_country, latitude, longitude,
      calc_method, madhab, daily_quran_goal, is_public_profile, show_prayer_stats,
      show_quran_stats, appear_on_leaderboard, show_community_activity
    ) VALUES (?, 'dark', 'Dhaka', 'Bangladesh', 23.8103, 90.4125, 'Karachi', 'Standard', 10, 1, 1, 1, 1, 1)`,
    [adnanId]
  );
  await run(
    `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
     VALUES (?, 0, 0, NULL, 0)`,
    [adnanId]
  );

  // 2. Clean admin account (Bilal Admin - 0 records, fresh start)
  const adminRes = await run(
    `INSERT INTO users (name, username, email, password_hash, role, avatar, bio)
     VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
    [
      'Bilal Admin',
      'admin',
      'admin@majlis.app',
      adminPasswordHash,
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      'Administrator at Majlis Al-Aman.'
    ]
  );

  const adminId = adminRes.id;
  await run(
    `INSERT INTO user_settings (
      user_id, theme, location_city, location_country, latitude, longitude,
      calc_method, madhab, daily_quran_goal, is_public_profile, show_prayer_stats,
      show_quran_stats, appear_on_leaderboard, show_community_activity
    ) VALUES (?, 'dark', 'Dhaka', 'Bangladesh', 23.8103, 90.4125, 'Karachi', 'Standard', 10, 1, 1, 1, 1, 1)`,
    [adminId]
  );
  await run(
    `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
     VALUES (?, 0, 0, NULL, 0)`,
    [adminId]
  );

  // 3. Clean initial announcement
  await run(
    `INSERT INTO announcements (title, content, is_active) VALUES
     ('Welcome to Majlis Al-Aman', 'Start logging your 5 daily prayers and Quran recitation today to build lifelong spiritual consistency.', 1)`
  );

  console.log('Database successfully reset to a clean, fresh state without dummy records!');
};

export const seedDatabase = async () => {
  await initDb();
  try {
    const userCount = await get('SELECT count(*) as count FROM users');
    if (!userCount || userCount.count === 0) {
      console.log('Seeding initial demo and admin users...');
      const salt = await bcrypt.genSalt(10);
      const userPasswordHash = await bcrypt.hash('password123', salt);
      const adminPasswordHash = await bcrypt.hash('admin123', salt);

      const userRes = await run(
        `INSERT INTO users (name, username, email, password_hash, role, avatar, bio)
         VALUES (?, ?, ?, ?, 'user', ?, ?)`,
        [
          'Adnan Tariq',
          'adnan',
          'adnan@majlis.app',
          userPasswordHash,
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          'Seeking consistency and peace in daily worship.'
        ]
      );

      const adnanId = userRes.id;
      await run(
        `INSERT INTO user_settings (
          user_id, theme, location_city, location_country, latitude, longitude,
          calc_method, madhab, daily_quran_goal, is_public_profile, show_prayer_stats,
          show_quran_stats, appear_on_leaderboard, show_community_activity
        ) VALUES (?, 'dark', 'Dhaka', 'Bangladesh', 23.8103, 90.4125, 'Karachi', 'Standard', 10, 1, 1, 1, 1, 1)`,
        [adnanId]
      );
      await run(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
         VALUES (?, 0, 0, NULL, 0)`,
        [adnanId]
      );

      const adminRes = await run(
        `INSERT INTO users (name, username, email, password_hash, role, avatar, bio)
         VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
        [
          'Bilal Admin',
          'admin',
          'admin@majlis.app',
          adminPasswordHash,
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          'Administrator at Majlis Al-Aman.'
        ]
      );

      const adminId = adminRes.id;
      await run(
        `INSERT INTO user_settings (
          user_id, theme, location_city, location_country, latitude, longitude,
          calc_method, madhab, daily_quran_goal, is_public_profile, show_prayer_stats,
          show_quran_stats, appear_on_leaderboard, show_community_activity
        ) VALUES (?, 'dark', 'Dhaka', 'Bangladesh', 23.8103, 90.4125, 'Karachi', 'Standard', 10, 1, 1, 1, 1, 1)`,
        [adminId]
      );
      await run(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
         VALUES (?, 0, 0, NULL, 0)`,
        [adminId]
      );

      await run(
        `INSERT INTO announcements (title, content, is_active) VALUES
         ('Welcome to Majlis Al-Aman', 'Start logging your 5 daily prayers and Quran recitation today to build lifelong spiritual consistency.', 1)`
      );
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err.message);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  cleanAndResetDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Reset error:', err);
    process.exit(1);
  });
}
