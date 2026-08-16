import express from 'express';
import { query, get, run } from '../db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get community feed
router.get('/feed', optionalAuth, async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    const posts = await query(
      `SELECT cp.id, cp.user_id, cp.content, cp.post_type, cp.badge_info, cp.created_at,
              u.name, u.username, u.avatar,
              s.current_streak
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       JOIN user_settings us ON u.id = us.user_id
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE u.is_disabled = 0 AND (us.show_community_activity = 1 OR u.id = ?)
       ORDER BY cp.created_at DESC
       LIMIT ? OFFSET ?`,
      [currentUserId || -1, limit, offset]
    );

    const postIds = posts.map(p => p.id);
    let reactionsByPost = {};
    let userReactionsByPost = {};
    let commentsByPost = {};

    if (postIds.length > 0) {
      const placeholders = postIds.map(() => '?').join(',');

      // Group reactions
      const reactionRows = await query(
        `SELECT post_id, reaction_type, count(*) as count 
         FROM post_reactions 
         WHERE post_id IN (${placeholders}) 
         GROUP BY post_id, reaction_type`,
        postIds
      );

      reactionRows.forEach(r => {
        if (!reactionsByPost[r.post_id]) reactionsByPost[r.post_id] = {};
        reactionsByPost[r.post_id][r.reaction_type] = r.count;
      });

      // Current user's reactions
      if (currentUserId) {
        const userReactions = await query(
          `SELECT post_id, reaction_type 
           FROM post_reactions 
           WHERE post_id IN (${placeholders}) AND user_id = ?`,
          [...postIds, currentUserId]
        );
        userReactions.forEach(r => {
          if (!userReactionsByPost[r.post_id]) userReactionsByPost[r.post_id] = [];
          userReactionsByPost[r.post_id].push(r.reaction_type);
        });
      }

      // Comments count and recent comments
      const commentRows = await query(
        `SELECT pc.id, pc.post_id, pc.comment, pc.created_at, u.name, u.username, u.avatar
         FROM post_comments pc
         JOIN users u ON pc.user_id = u.id
         WHERE pc.post_id IN (${placeholders})
         ORDER BY pc.created_at ASC`,
        postIds
      );

      commentRows.forEach(c => {
        if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
        commentsByPost[c.post_id].push(c);
      });
    }

    const feed = posts.map(p => ({
      ...p,
      reactions: reactionsByPost[p.id] || { barakallah: 0, mashallah: 0, mabrook: 0, heart: 0 },
      totalReactions: Object.values(reactionsByPost[p.id] || {}).reduce((a, b) => a + b, 0),
      userReactions: userReactionsByPost[p.id] || [],
      comments: commentsByPost[p.id] || [],
      commentsCount: (commentsByPost[p.id] || []).length
    }));

    res.json({ feed, page, hasMore: posts.length === limit });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Server error fetching community feed' });
  }
});

// Create post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, postType = 'general', badgeInfo } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }

    const result = await run(
      `INSERT INTO community_posts (user_id, content, post_type, badge_info)
       VALUES (?, ?, ?, ?)`,
      [userId, content.trim(), postType, badgeInfo ? JSON.stringify(badgeInfo) : null]
    );

    const newPost = await get(
      `SELECT cp.id, cp.user_id, cp.content, cp.post_type, cp.badge_info, cp.created_at,
              u.name, u.username, u.avatar,
              s.current_streak
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE cp.id = ?`,
      [result.id]
    );

    res.status(201).json({
      message: 'Post shared with community',
      post: {
        ...newPost,
        reactions: { barakallah: 0, mashallah: 0, mabrook: 0, heart: 0 },
        totalReactions: 0,
        userReactions: [],
        comments: [],
        commentsCount: 0
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error creating post' });
  }
});

// Toggle reaction on post
router.post('/posts/:id/react', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { reactionType = 'barakallah' } = req.body; // 'barakallah', 'mashallah', 'mabrook', 'heart'

    const validTypes = ['barakallah', 'mashallah', 'mabrook', 'heart'];
    if (!validTypes.includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    const existing = await get(
      'SELECT id FROM post_reactions WHERE post_id = ? AND user_id = ? AND reaction_type = ?',
      [postId, userId, reactionType]
    );

    if (existing) {
      // Toggle off
      await run('DELETE FROM post_reactions WHERE id = ?', [existing.id]);
    } else {
      // Add reaction
      await run(
        'INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES (?, ?, ?)',
        [postId, userId, reactionType]
      );
    }

    // Return updated reaction counts
    const reactionRows = await query(
      'SELECT reaction_type, count(*) as count FROM post_reactions WHERE post_id = ? GROUP BY reaction_type',
      [postId]
    );
    const reactions = { barakallah: 0, mashallah: 0, mabrook: 0, heart: 0 };
    reactionRows.forEach(r => { reactions[r.reaction_type] = r.count; });

    const userReactions = await query(
      'SELECT reaction_type FROM post_reactions WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    res.json({
      postId,
      reactions,
      userReactions: userReactions.map(r => r.reaction_type),
      totalReactions: Object.values(reactions).reduce((a, b) => a + b, 0)
    });
  } catch (error) {
    console.error('React error:', error);
    res.status(500).json({ error: 'Server error updating reaction' });
  }
});

// Add comment to post
router.post('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    const result = await run(
      'INSERT INTO post_comments (post_id, user_id, comment) VALUES (?, ?, ?)',
      [postId, userId, comment.trim()]
    );

    const newComment = await get(
      `SELECT pc.id, pc.post_id, pc.comment, pc.created_at, u.name, u.username, u.avatar
       FROM post_comments pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.id = ?`,
      [result.id]
    );

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
});

// Public profile viewer
router.get('/user/:username', optionalAuth, async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await get(
      'SELECT id, name, username, avatar, bio, created_at FROM users WHERE lower(username) = ? AND is_disabled = 0',
      [username]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const settings = await get('SELECT * FROM user_settings WHERE user_id = ?', [user.id]);
    const streak = await get('SELECT * FROM streaks WHERE user_id = ?', [user.id]);
    const achievements = await query('SELECT badge_key, unlocked_at FROM user_achievements WHERE user_id = ?', [user.id]);

    let prayerCount = 0;
    let quranPages = 0;

    if (settings && settings.show_prayer_stats) {
      const pRow = await get(`SELECT count(*) as count FROM prayer_records WHERE user_id = ? AND status = 'completed'`, [user.id]);
      prayerCount = (pRow && pRow.count) || 0;
    }

    if (settings && settings.show_quran_stats) {
      const qRow = await get(`SELECT sum(pages_read) as pages FROM quran_records WHERE user_id = ?`, [user.id]);
      quranPages = (qRow && qRow.pages) || 0;
    }

    res.json({
      user,
      streak: streak || { current_streak: 0, longest_streak: 0, total_active_days: 0 },
      achievements: achievements.map(a => a.badge_key),
      stats: {
        totalPrayers: settings && settings.show_prayer_stats ? prayerCount : 'Private',
        totalQuranPages: settings && settings.show_quran_stats ? quranPages : 'Private'
      },
      isPublic: settings ? settings.is_public_profile : 1
    });
  } catch (error) {
    console.error('Get public user error:', error);
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

export default router;
