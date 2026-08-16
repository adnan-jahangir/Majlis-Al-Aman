import jwt from 'jsonwebtoken';
import { get } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'majlis_al_aman_super_secret_key_2026';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await get('SELECT id, name, username, email, role, avatar, is_disabled FROM users WHERE id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (user.is_disabled) {
      return res.status(403).json({ error: 'Account has been disabled. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await get('SELECT id, name, username, email, role, avatar, is_disabled FROM users WHERE id = ?', [decoded.id]);
      if (user && !user.is_disabled) {
        req.user = user;
      }
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};
