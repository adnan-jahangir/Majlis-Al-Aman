export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  bio?: string;
  created_at?: string;
  is_disabled?: number;
}

export interface UserSettings {
  user_id: number;
  theme: 'dark' | 'light';
  location_city: string;
  location_country: string;
  latitude: number;
  longitude: number;
  calc_method: string;
  madhab: string;
  fajr_reminder: number;
  dhuhr_reminder: number;
  asr_reminder: number;
  maghrib_reminder: number;
  isha_reminder: number;
  quran_reminder: number;
  streak_reminder: number;
  daily_quran_goal: number;
  is_public_profile: number;
  show_prayer_stats: number;
  show_quran_stats: number;
  appear_on_leaderboard: number;
  show_community_activity: number;
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
  last_activity_date?: string;
}

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type PrayerStatus = 'completed' | 'missed' | 'late' | 'excused' | 'pending';

export interface PrayerItem {
  name: PrayerName;
  status: PrayerStatus;
  notes?: string | null;
  updated_at?: string | null;
}

export interface TodayPrayersResponse {
  date: string;
  prayers: PrayerItem[];
  completedCount: number;
  totalPrayers: number;
  completionPercentage: number;
  quranSummary: {
    pagesRead: number;
    durationMins: number;
  };
}

export interface QuranLog {
  id: number;
  surah_number?: number;
  surah_name: string;
  pages_read: number;
  reading_duration_mins: number;
  notes?: string;
  date?: string;
  created_at?: string;
}

export interface QuranResponse {
  date: string;
  dailyGoal: number;
  todayPages: number;
  todayDuration: number;
  todayLogs: QuranLog[];
  hasReadToday: boolean;
  goalPercentage: number;
  totalStats: {
    totalPages: number;
    totalReadingDays: number;
    avgPagesPerDay: string;
    totalDurationMins: number;
    khatamPercentage: string;
    completedKhatams: number;
  };
  recentLogs: QuranLog[];
}

export interface Surah {
  number: number;
  name: string;
  english: string;
  totalAyahs: number;
}

export interface CalendarDay {
  date: string;
  dayNumber: number;
  dayOfWeek: number;
  completedPrayers: number;
  totalPrayers: number;
  quranPages: number;
  quranDuration: number;
  level: 'full' | 'high' | 'partial' | 'empty';
  hasActivity: boolean;
}

export interface MonthHistoryResponse {
  year: number;
  month: number;
  monthName: string;
  calendarDays: CalendarDay[];
  summary: {
    totalDaysWithFullPrayers: number;
    totalMonthPrayers: number;
    totalMonthPages: number;
    monthCompletionRate: number;
  };
}

export interface DayDetailResponse {
  date: string;
  prayers: PrayerItem[];
  completedCount: number;
  totalPrayers: number;
  prayerScore: string;
  completionPercentage: number;
  quranLogs: QuranLog[];
  totalQuranPages: number;
  totalQuranDuration: number;
}

export interface StatsResponse {
  prayers: {
    totalCompleted: number;
    consistency: Record<PrayerName, { name: PrayerName; completed: number; percentage: number }>;
  };
  quran: {
    totalPages: number;
    totalReadingDays: number;
    avgPagesPerDay: string;
    totalDurationMins: number;
  };
  streak: StreakInfo;
  weeklyChart: Array<{ date: string; day: string; prayers: number; quranPages: number; score: number }>;
  monthlyTrend: Array<{ month: string; shortMonth: string; completedPrayers: number; completionRate: number; quranPages: number }>;
  dailyActivityTrend: Array<{ date: string; displayDate: string; prayers: number; quranPages: number }>;
  heatmap: Array<{ date: string; level: number; prayers: number; quranPages: number }>;
}

export interface LeaderboardItem {
  rank: number;
  id: number;
  name: string;
  username: string;
  avatar?: string;
  prayerConsistency: string;
  prayerConsistencyVal: number;
  prayerCompleted: number;
  quranDays: number;
  quranPages: number;
  streak: number;
  score: number;
  isCurrentUser: boolean;
  isPrivate: boolean;
}

export interface CommunityComment {
  id: number;
  post_id: number;
  comment: string;
  created_at: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface CommunityPost {
  id: number;
  user_id: number;
  name: string;
  username: string;
  avatar?: string;
  content: string;
  post_type: 'streak' | 'milestone' | 'quran_goal' | 'general';
  badge_info?: { title: string; icon: string } | null;
  current_streak?: number;
  created_at: string;
  reactions: {
    barakallah: number;
    mashallah: number;
    mabrook: number;
    heart: number;
  };
  totalReactions: number;
  userReactions: string[];
  comments: CommunityComment[];
  commentsCount: number;
}

export interface CalculatedPrayerTimes {
  date: string;
  coordinates: { latitude: number; longitude: number };
  method: string;
  madhab: string;
  times: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  currentPrayer: string;
  nextPrayer: {
    name: string;
    time: string;
    rawTime: string;
    remainingMs: number;
  } | null;
  qiblaDirection: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: number;
  created_at: string;
}

export interface AdminMetrics {
  totalUsers: number;
  disabledUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  totalPrayerRecords: number;
  totalQuranPages: number;
  totalCommunityPosts: number;
  recentSignups: Array<{ date: string; count: number }>;
}
