import { initDb, run } from './db.js';

export const cleanAndResetDatabase = async () => {
  await initDb();

  console.log('Cleaning all dummy records and resetting database to clean state...');

  // Wipe all records
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

  // Add clean initial welcome announcement
  await run(
    `INSERT INTO announcements (title, content, is_active) VALUES
     ('Welcome to Majlis Al-Aman', 'Start logging your 5 daily prayers and Quran recitation today to build lifelong spiritual consistency.', 1)`
  );

  console.log('Database successfully cleared of all dummy users and reset to a clean state!');
};

export const seedDatabase = async () => {
  await initDb();
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  cleanAndResetDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Reset error:', err);
    process.exit(1);
  });
}
