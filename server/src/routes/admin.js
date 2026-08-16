import express from 'express';
import { query, get, run } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { format, subDays } from 'date-fns';

const router = express.Router();

// Apply auth + admin verification to all admin routes
router.use(authenticateToken, requireAdmin);

// Admin dashboard analytics overview
router.get('/metrics', async (req, res) => {
  try {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const past7DaysStr = format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const totalUsersRow = await get('SELECT count(*) as count FROM users');
    const disabledUsersRow = await get('SELECT count(*) as count FROM users WHERE is_disabled = 1');
    const totalPrayersRow = await get('SELECT count(*) as count FROM prayer_records WHERE status = "completed"');
    const totalQuranPagesRow = await get('SELECT sum(pages_read) as total FROM quran_records');
    const totalCommunityPostsRow = await get('SELECT count(*) as count FROM community_posts');

    // Daily active users today
    const dauRow = await get(
      `SELECT count(DISTINCT user_id) as count 
       FROM (
         SELECT user_id FROM prayer_records WHERE date = ?
         UNION
         SELECT user_id FROM quran_records WHERE date = ?
       )`,
      [todayStr, todayStr]
    );

    // Weekly active users
    const wauRow = await get(
      `SELECT count(DISTINCT user_id) as count 
       FROM (
         SELECT user_id FROM prayer_records WHERE date >= ?
         UNION
         SELECT user_id FROM quran_records WHERE date >= ?
       )`,
      [past7DaysStr, past7DaysStr]
    );

    // User growth trend for past 7 days
    const recentSignups = await query(
      `SELECT date(created_at) as date, count(*) as count 
       FROM users 
       GROUP BY date(created_at) 
       ORDER BY date(created_at) DESC LIMIT 7`
    );

    res.json({
      totalUsers: (totalUsersRow && totalUsersRow.count) || 0,
      disabledUsers: (disabledUsersRow && disabledUsersRow.count) || 0,
      dailyActiveUsers: (dauRow && dauRow.count) || 0,
      weeklyActiveUsers: (wauRow && wauRow.count) || 0,
      totalPrayerRecords: (totalPrayersRow && totalPrayersRow.count) || 0,
      totalQuranPages: (totalQuranPagesRow && totalQuranPagesRow.total) || 0,
      totalCommunityPosts: (totalCommunityPostsRow && totalCommunityPostsRow.count) || 0,
      recentSignups
    });
  } catch (error) {
    console.error('Admin metrics error:', error);
    res.status(500).json({ error: 'Server error loading admin metrics' });
  }
});

// List users with search and pagination
router.get('/users', async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search.trim().toLowerCase()}%` : '%';
    const users = await query(
      `SELECT u.id, u.name, u.username, u.email, u.role, u.is_disabled, u.created_at,
              s.current_streak, s.total_active_days,
              (SELECT count(*) FROM prayer_records pr WHERE pr.user_id = u.id AND pr.status = 'completed') as completed_prayers,
              (SELECT sum(pages_read) FROM quran_records qr WHERE qr.user_id = u.id) as quran_pages
       FROM users u
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE lower(u.name) LIKE ? OR lower(u.username) LIKE ? OR lower(u.email) LIKE ?
       ORDER BY u.created_at DESC`,
      [search, search, search]
    );

    res.json({ users });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Server error fetching user list' });
  }
});

// Toggle user disabled status
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (parseInt(targetUserId, 10) === req.user.id) {
      return res.status(400).json({ error: 'Cannot disable your own admin account' });
    }

    const user = await get('SELECT id, is_disabled FROM users WHERE id = ?', [targetUserId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newStatus = user.is_disabled ? 0 : 1;
    await run('UPDATE users SET is_disabled = ? WHERE id = ?', [newStatus, targetUserId]);

    res.json({
      message: `User account has been ${newStatus ? 'disabled' : 'enabled'}`,
      isDisabled: newStatus
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Server error toggling user status' });
  }
});

// Manage Announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Server error loading announcements' });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await run('INSERT INTO announcements (title, content) VALUES (?, ?)', [title.trim(), content.trim()]);
    const announcement = await get('SELECT * FROM announcements WHERE id = ?', [result.id]);

    res.status(201).json({ message: 'Announcement published', announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Server error creating announcement' });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await run('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Server error deleting announcement' });
  }
});

// Delete community post (moderation)
router.delete('/posts/:id', async (req, res) => {
  try {
    await run('DELETE FROM community_posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post removed by moderation' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error deleting post' });
  }
});

export default router;
