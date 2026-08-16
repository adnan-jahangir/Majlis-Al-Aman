import {
  User,
  UserSettings,
  StreakInfo,
  TodayPrayersResponse,
  QuranResponse,
  Surah,
  MonthHistoryResponse,
  DayDetailResponse,
  StatsResponse,
  LeaderboardItem,
  CommunityPost,
  CalculatedPrayerTimes,
  AdminMetrics,
  Announcement
} from '../types';

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('majlis_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('majlis_token', token);
  } else {
    localStorage.removeItem('majlis_token');
  }
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
};

export const api = {
  // Auth
  register: (body: any) => request<{ message: string; token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<{ message: string; token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleAuth: (body: { email: string; name?: string; avatar?: string; googleId?: string }) => 
    request<{ message: string; token: string; user: User }>('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<{ user: User; settings: UserSettings; streak: StreakInfo; achievements: string[] }>('/auth/me'),
  updateProfile: (body: any) => request<{ message: string; user: User }>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  forgotPassword: (email: string) => request<{ message: string; demoResetCode?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body: any) => request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Prayers
  getTodayPrayers: (date?: string) => request<TodayPrayersResponse>(`/prayers${date ? `?date=${date}` : ''}`),
  togglePrayer: (body: { prayerName: string; status: string; date?: string; notes?: string }) =>
    request<{
      message: string;
      date: string;
      prayerName: string;
      status: string;
      prayers: any[];
      completedCount: number;
      completionPercentage: number;
      streak: StreakInfo;
      completedAllToday: boolean;
    }>('/prayers/toggle', { method: 'POST', body: JSON.stringify(body) }),
  markAllPrayers: (date?: string, status?: string) =>
    request<{ message: string; date: string; streak: StreakInfo }>('/prayers/mark-all', { method: 'POST', body: JSON.stringify({ date, status }) }),

  // Quran
  getQuranSummary: (date?: string) => request<QuranResponse>(`/quran${date ? `?date=${date}` : ''}`),
  getSurahs: () => request<Surah[]>('/quran/surahs'),
  logQuranReading: (body: { pagesRead: number; surahNumber?: number; surahName?: string; durationMins?: number; notes?: string; date?: string }) =>
    request<{ message: string; id: number; streak: StreakInfo }>('/quran/log', { method: 'POST', body: JSON.stringify(body) }),
  deleteQuranRecord: (id: number) => request<{ message: string; streak: StreakInfo }>(`/quran/${id}`, { method: 'DELETE' }),

  // History & Calendar
  getMonthHistory: (year: number, month: number) => request<MonthHistoryResponse>(`/history/month?year=${year}&month=${month}`),
  getDayDetail: (date: string) => request<DayDetailResponse>(`/history/day/${date}`),

  // Analytics & Stats
  getStats: () => request<StatsResponse>('/stats'),

  // Leaderboard
  getLeaderboard: (timeframe: 'this_week' | 'this_month' | 'all_time') =>
    request<{ timeframe: string; leaderboard: LeaderboardItem[]; userRank: LeaderboardItem | null; totalParticipants: number }>(`/leaderboard?timeframe=${timeframe}`),

  // Community
  getCommunityFeed: (page = 1) => request<{ feed: CommunityPost[]; page: number; hasMore: boolean }>(`/community/feed?page=${page}`),
  createPost: (body: { content: string; postType?: string; badgeInfo?: any }) => request<{ message: string; post: CommunityPost }>('/community/posts', { method: 'POST', body: JSON.stringify(body) }),
  reactToPost: (postId: number, reactionType: string) =>
    request<{ postId: number; reactions: Record<string, number>; userReactions: string[]; totalReactions: number }>(`/community/posts/${postId}/react`, { method: 'POST', body: JSON.stringify({ reactionType }) }),
  addComment: (postId: number, comment: string) => request<{ message: string; comment: any }>(`/community/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ comment }) }),
  getPublicProfile: (username: string) => request<any>(`/community/user/${username}`),

  // Settings
  getSettings: () => request<{ settings: UserSettings }>('/settings'),
  updateSettings: (settings: Partial<UserSettings>) => request<{ message: string; settings: UserSettings }>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  // Prayer Times Calculation
  getPrayerTimes: (params: { latitude?: number; longitude?: number; date?: string; method?: string; madhab?: string }) => {
    const query = new URLSearchParams();
    if (params.latitude) query.set('latitude', params.latitude.toString());
    if (params.longitude) query.set('longitude', params.longitude.toString());
    if (params.date) query.set('date', params.date);
    if (params.method) query.set('method', params.method);
    if (params.madhab) query.set('madhab', params.madhab);
    return request<CalculatedPrayerTimes>(`/prayer-times?${query.toString()}`);
  },

  // Admin
  getAdminMetrics: () => request<AdminMetrics>('/admin/metrics'),
  getAdminUsers: (search?: string) => request<{ users: any[] }>(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  toggleUserStatus: (id: number) => request<{ message: string; isDisabled: number }>(`/admin/users/${id}/toggle-status`, { method: 'PUT' }),
  getAnnouncements: () => request<{ announcements: Announcement[] }>('/admin/announcements'),
  createAnnouncement: (body: { title: string; content: string }) => request<{ message: string; announcement: Announcement }>('/admin/announcements', { method: 'POST', body: JSON.stringify(body) }),
  deleteAnnouncement: (id: number) => request<{ message: string }>(`/admin/announcements/${id}`, { method: 'DELETE' }),
  deleteCommunityPost: (id: number) => request<{ message: string }>(`/admin/posts/${id}`, { method: 'DELETE' })
};
