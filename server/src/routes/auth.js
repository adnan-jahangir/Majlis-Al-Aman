import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query, get, run } from '../db.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';
import { updateStreakAndAchievements } from '../services/streakService.js';
import { User, UserSettings, Streak } from '../models/index.js';
import mongoose from 'mongoose';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In & Seamless Sign-Up
router.post('/google', async (req, res) => {
  try {
    let { email, name, avatar, googleId, credential } = req.body;

    // If Google ID Token credential was provided from Google Identity Services
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          avatar = payload.picture;
          googleId = payload.sub;
        }
      } catch (verifyErr) {
        console.log('Google token verification fallback:', verifyErr.message);
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Valid Google email is required for authentication' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = name ? name.trim() : cleanEmail.split('@')[0];
    const baseUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'user';

    // 1. Check SQLite
    let user = await get('SELECT * FROM users WHERE lower(email) = ?', [cleanEmail]);

    if (!user) {
      // Create new user via Google
      const salt = await bcrypt.genSalt(10);
      const randomPassword = (googleId || Math.random().toString(36).substring(2)) + '_gAuth_secure';
      const password_hash = await bcrypt.hash(randomPassword, salt);
      const cleanUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
      const userAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;

      const userResult = await run(
        `INSERT INTO users (name, username, email, password_hash, avatar, role, bio)
         VALUES (?, ?, ?, ?, ?, 'user', 'Seeking consistency and peace in daily worship.')`,
        [displayName, cleanUsername, cleanEmail, password_hash, userAvatar]
      );

      const userId = userResult.id;

      await run(
        `INSERT INTO user_settings (user_id, theme, location_city, location_country, latitude, longitude, calc_method, madhab)
         VALUES (?, 'dark', 'Dhaka', 'Bangladesh', 23.8103, 90.4125, 'Karachi', 'Standard')`,
        [userId]
      );

      await run(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
         VALUES (?, 0, 0, NULL, 0)`,
        [userId]
      );

      user = await get('SELECT * FROM users WHERE id = ?', [userId]);

      // Also create in MongoDB if connected
      if (mongoose.connection.readyState >= 1) {
        try {
          const mongoUser = new User({
            name: displayName,
            username: cleanUsername,
            email: cleanEmail,
            password_hash,
            avatar: userAvatar,
            role: 'user'
          });
          await mongoUser.save();
        } catch (mErr) {
          console.log('Mongo sync log:', mErr.message);
        }
      }
    }

    if (user.is_disabled) {
      return res.status(403).json({ error: 'Account has been disabled. Please contact administrator.' });
    }

    await updateStreakAndAchievements(user.id);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Google authentication successful',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, avatar } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Name, username, email, and password are required' });
    }

    if (password !== confirmPassword && confirmPassword !== undefined) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await get('SELECT id FROM users WHERE email = ? OR username = ?', [cleanEmail, cleanUsername]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userResult = await run(
      `INSERT INTO users (name, username, email, password_hash, avatar, role, bio)
       VALUES (?, ?, ?, ?, ?, 'user', 'Seeking consistency and peace in daily worship.')`,
      [name.trim(), cleanUsername, cleanEmail, password_hash, avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80']
    );

    const userId = userResult.id;

    // Create default settings
    await run(
      `INSERT INTO user_settings (user_id, theme, location_city, location_country, latitude, longitude, calc_method, madhab)
       VALUES (?, 'dark', 'Mecca', 'Saudi Arabia', 21.4225, 39.8262, 'MWL', 'Standard')`,
      [userId]
    );

    // Initialize streak
    await run(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
       VALUES (?, 0, 0, NULL, 0)`,
      [userId]
    );

    const token = jwt.sign({ id: userId, email: cleanEmail, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });

    const user = await get('SELECT id, name, username, email, avatar, role, bio FROM users WHERE id = ?', [userId]);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login can be email or username

    if (!login || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const cleanLogin = login.trim().toLowerCase();
    const user = await get(
      'SELECT * FROM users WHERE lower(email) = ? OR lower(username) = ?',
      [cleanLogin, cleanLogin]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    if (user.is_disabled) {
      return res.status(403).json({ error: 'Account has been disabled. Please contact administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    // Refresh streak status upon login
    await updateStreakAndAchievements(user.id);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Logged in successfully',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Current User profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await get('SELECT id, name, username, email, avatar, role, bio, created_at FROM users WHERE id = ?', [req.user.id]);
    const settings = await get('SELECT * FROM user_settings WHERE user_id = ?', [req.user.id]);
    const streak = await get('SELECT * FROM streaks WHERE user_id = ?', [req.user.id]);
    const achievements = await query('SELECT badge_key, unlocked_at FROM user_achievements WHERE user_id = ?', [req.user.id]);

    res.json({
      user,
      settings: settings || {},
      streak: streak || { current_streak: 0, longest_streak: 0, total_active_days: 0 },
      achievements: achievements.map(a => a.badge_key)
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;
    const userId = req.user.id;

    if (username) {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      const existing = await get('SELECT id FROM users WHERE username = ? AND id != ?', [cleanUsername, userId]);
      if (existing) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
      await run('UPDATE users SET username = ? WHERE id = ?', [cleanUsername, userId]);
    }

    if (name) {
      await run('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
    }
    if (bio !== undefined) {
      await run('UPDATE users SET bio = ? WHERE id = ?', [bio.trim(), userId]);
    }
    if (avatar) {
      await run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, userId]);
    }

    const updatedUser = await get('SELECT id, name, username, email, avatar, role, bio FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Forgot / Reset Password Mock Simulation
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
  if (!user) {
    // Return friendly message even if user doesn't exist for security
    return res.json({ message: 'If an account exists with this email, password reset instructions have been sent.' });
  }

  res.json({
    message: 'Password reset link sent to your email. (Demo simulation: Reset code is 123456)',
    demoResetCode: '123456'
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  const user = await get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(newPassword, salt);

  await run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, user.id]);

  res.json({ message: 'Password has been successfully updated. You may now log in.' });
});

export default router;
