import mongoose from 'mongoose';

const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: { type: String, default: 'Seeking consistency and peace in daily worship.' },
  is_disabled: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// User Settings Schema
const UserSettingsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  theme: { type: String, default: 'dark' },
  location_city: { type: String, default: 'Dhaka' },
  location_country: { type: String, default: 'Bangladesh' },
  latitude: { type: Number, default: 23.8103 },
  longitude: { type: Number, default: 90.4125 },
  calc_method: { type: String, default: 'Karachi' },
  madhab: { type: String, default: 'Standard' },
  fajr_reminder: { type: Number, default: 1 },
  dhuhr_reminder: { type: Number, default: 1 },
  asr_reminder: { type: Number, default: 1 },
  maghrib_reminder: { type: Number, default: 1 },
  isha_reminder: { type: Number, default: 1 },
  quran_reminder: { type: Number, default: 1 },
  streak_reminder: { type: Number, default: 1 },
  daily_quran_goal: { type: Number, default: 10 },
  is_public_profile: { type: Number, default: 1 },
  show_prayer_stats: { type: Number, default: 1 },
  show_quran_stats: { type: Number, default: 1 },
  appear_on_leaderboard: { type: Number, default: 1 },
  show_community_activity: { type: Number, default: 1 }
});

// Prayer Record Schema
const PrayerRecordSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // 'yyyy-MM-dd'
  prayer_name: { type: String, enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], required: true },
  status: { type: String, enum: ['completed', 'missed', 'late', 'excused', 'pending'], required: true },
  notes: { type: String, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
PrayerRecordSchema.index({ user_id: 1, date: 1, prayer_name: 1 }, { unique: true });

// Quran Record Schema
const QuranRecordSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // 'yyyy-MM-dd'
  surah_number: { type: Number },
  surah_name: { type: String, default: 'General Recitation' },
  pages_read: { type: Number, required: true, min: 1 },
  reading_duration_mins: { type: Number, default: 0 },
  notes: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Streak Schema
const StreakSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  current_streak: { type: Number, default: 0 },
  longest_streak: { type: Number, default: 0 },
  last_activity_date: { type: String, default: null },
  total_active_days: { type: Number, default: 0 }
});

// User Achievement Schema
const UserAchievementSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badge_key: { type: String, required: true },
  unlocked_at: { type: Date, default: Date.now }
});
UserAchievementSchema.index({ user_id: 1, badge_key: 1 }, { unique: true });

// Community Post Schema
const CommunityPostSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  post_type: { type: String, default: 'general' },
  badge_info: { type: Schema.Types.Mixed, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Post Reaction Schema
const PostReactionSchema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reaction_type: { type: String, enum: ['barakallah', 'mashallah', 'mabrook', 'heart'], default: 'barakallah' }
}, {
  timestamps: { createdAt: 'created_at' }
});
PostReactionSchema.index({ post_id: 1, user_id: 1, reaction_type: 1 }, { unique: true });

// Post Comment Schema
const PostCommentSchema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true, trim: true }
}, {
  timestamps: { createdAt: 'created_at' }
});

// Announcement Schema
const AnnouncementSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  is_active: { type: Number, default: 1 }
}, {
  timestamps: { createdAt: 'created_at' }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const UserSettings = mongoose.models.UserSettings || mongoose.model('UserSettings', UserSettingsSchema);
export const PrayerRecord = mongoose.models.PrayerRecord || mongoose.model('PrayerRecord', PrayerRecordSchema);
export const QuranRecord = mongoose.models.QuranRecord || mongoose.model('QuranRecord', QuranRecordSchema);
export const Streak = mongoose.models.Streak || mongoose.model('Streak', StreakSchema);
export const UserAchievement = mongoose.models.UserAchievement || mongoose.model('UserAchievement', UserAchievementSchema);
export const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
export const PostReaction = mongoose.models.PostReaction || mongoose.model('PostReaction', PostReactionSchema);
export const PostComment = mongoose.models.PostComment || mongoose.model('PostComment', PostCommentSchema);
export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
