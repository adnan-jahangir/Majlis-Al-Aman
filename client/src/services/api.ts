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
  LeaderboardUserDetail,
  CommunityPost,
  CalculatedPrayerTimes,
  AdminMetrics,
  Announcement
} from '../types';
import { API_BASE } from '../config';

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

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Clear expired or invalid tokens automatically
        setAuthToken(null);
      }
      const errorMsg = data.error || data.message || `Request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection or server status.');
    }
    throw err;
  }
};

export const api = {
  // Auth
  register: (body: any) => request<{ message: string; token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<{ message: string; token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleAuth: (body: any) => request<{ message: string; token: string; user: User }>('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<{ user: User; settings: UserSettings; streak: StreakInfo; achievements: string[] }>('/auth/me'),
  updateProfile: (body: any) => request<{ message: string; user: User }>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  forgotPassword: (email: string) => request<{ message: string; demoResetCode?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body: any) => request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Prayers
  getTodayPrayers: (date?: string) => request<TodayPrayersResponse>(`/prayers${date ? `?date=${date}` : ''}`),
  togglePrayer: (body: { prayerName: string; status: string; date?: string; notes?: string }) =>
    request<TodayPrayersResponse & { completedAllToday?: boolean }>('/prayers/toggle', { method: 'POST', body: JSON.stringify(body) }),
  markAllPrayers: (body: { date?: string; status?: string }) =>
    request<{ message: string; streak: StreakInfo }>('/prayers/mark-all', { method: 'POST', body: JSON.stringify(body) }),

  // Quran
  getQuranSummary: () => request<QuranResponse>('/quran/summary'),
  logQuranSession: (body: { date?: string; pagesRead: number; durationMins?: number; surahNumber?: number; surahName?: string; notes?: string }) =>
    request<{ message: string; summary: QuranResponse }>('/quran/log', { method: 'POST', body: JSON.stringify(body) }),
  logQuranReading: (body: { date?: string; pagesRead: number; durationMins?: number; surahNumber?: number; surahName?: string; notes?: string }) =>
    request<{ message: string; summary: QuranResponse }>('/quran/log', { method: 'POST', body: JSON.stringify(body) }),
  getSurahs: () => request<Surah[]>('/quran/surahs'),

  // History & Calendar
  getMonthHistory: (year?: number, month?: number) => {
    const y = year || new Date().getFullYear();
    const m = month || (new Date().getMonth() + 1);
    return request<MonthHistoryResponse>(`/history/month?year=${y}&month=${m}`);
  },
  getDayDetail: (date: string) => request<DayDetailResponse>(`/history/day/${date}`),

  // Analytics & Stats
  getStats: (timeframe: 'week' | 'month' | 'year' | 'all' = 'month') => request<StatsResponse>(`/stats?timeframe=${timeframe}`),

  // Leaderboard
  getLeaderboard: (timeframe: 'today' | 'this_week' | 'this_month' | 'all_time' = 'today') =>
    request<{ timeframe: string; leaderboard: LeaderboardItem[]; userRank: LeaderboardItem | null }>(`/leaderboard?timeframe=${timeframe}`),
  getUserLeaderboardDetail: (userId: number) =>
    request<LeaderboardUserDetail>(`/leaderboard/user/${userId}`),

  // Community
  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    const res = await request<any>('/community/feed');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.feed)) return res.feed;
    if (res && Array.isArray(res.posts)) return res.posts;
    return [];
  },
  getCommunityFeed: async (): Promise<{ feed: CommunityPost[] }> => {
    const res = await request<any>('/community/feed');
    if (Array.isArray(res)) return { feed: res };
    if (res && Array.isArray(res.feed)) return { feed: res.feed };
    if (res && Array.isArray(res.posts)) return { feed: res.posts };
    return { feed: [] };
  },
  createCommunityPost: (body: { content: string; postType?: string; badgeInfo?: any }) =>
    request<{ message: string; post: CommunityPost }>('/community/posts', { method: 'POST', body: JSON.stringify(body) }),
  createPost: (body: { content: string; postType?: string; badgeInfo?: any }) =>
    request<{ message: string; post: CommunityPost }>('/community/posts', { method: 'POST', body: JSON.stringify(body) }),
  toggleReaction: (postId: number, reactionType: string) =>
    request<{ message: string; reactions: Record<string, number>; userReactions?: string[]; totalReactions?: number }>(`/community/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reactionType })
    }),
  reactToPost: async (postId: number, reactionType: string) => {
    const res = await request<{ message?: string; reactions: Record<string, number>; userReactions?: string[]; totalReactions?: number }>(`/community/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reactionType })
    });
    const total = res.totalReactions !== undefined ? res.totalReactions : Object.values(res.reactions || {}).reduce((a, b) => a + b, 0);
    return {
      message: res.message || 'Reacted successfully',
      reactions: res.reactions || {},
      userReactions: res.userReactions || [reactionType],
      totalReactions: total
    };
  },
  addComment: (postId: number, comment: string) =>
    request<{ message: string; comment: any; comments?: any[] }>(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment })
    }),

  // Settings
  getSettings: () => request<UserSettings>('/settings'),
  updateSettings: (body: Partial<UserSettings>) => request<{ message: string; settings: UserSettings }>('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  sendTestReminder: () => request<{ message: string; result?: any }>('/settings/test-reminder', { method: 'POST' }),

  // Prayer Times (Dynamic Astronomical Adhan)
  getPrayerTimes: (params: { latitude: number; longitude: number; date?: string; method?: string; madhab?: string }) => {
    const queryStr = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      ...(params.date ? { date: params.date } : {}),
      ...(params.method ? { method: params.method } : {}),
      ...(params.madhab ? { madhab: params.madhab } : {})
    }).toString();
    return request<CalculatedPrayerTimes>(`/prayer-times?${queryStr}`);
  },

  // Admin
  getAdminMetrics: () => request<AdminMetrics>('/admin/metrics'),
  getAdminUsers: async (search?: string): Promise<{ users: User[] }> => {
    const queryStr = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await request<any>(`/admin/users${queryStr}`);
    return { users: Array.isArray(res) ? res : (res.users || []) };
  },
  getAnnouncements: async (): Promise<{ announcements: Announcement[] }> => {
    const res = await request<any>('/admin/announcements');
    return { announcements: Array.isArray(res) ? res : (res.announcements || []) };
  },
  toggleUserDisable: (userId: number, isDisabled: boolean) =>
    request<{ message: string; isDisabled?: boolean }>(`/admin/users/${userId}/disable`, { method: 'POST', body: JSON.stringify({ isDisabled }) }),
  toggleUserStatus: async (userId: number, isDisabled?: boolean) => {
    const res = await request<{ message: string; isDisabled?: boolean }>(`/admin/users/${userId}/disable`, { method: 'POST', body: JSON.stringify({ isDisabled: !!isDisabled }) });
    return { message: res.message, isDisabled: res.isDisabled ?? !isDisabled };
  },
  postAnnouncement: (body: { title: string; content: string }) =>
    request<{ message: string; announcement: Announcement }>('/admin/announcements', { method: 'POST', body: JSON.stringify(body) }),
  createAnnouncement: (body: { title: string; content: string }) =>
    request<{ message: string; announcement: Announcement }>('/admin/announcements', { method: 'POST', body: JSON.stringify(body) }),
  deleteAnnouncement: (id: number) =>
    request<{ message: string }>(`/admin/announcements/${id}`, { method: 'DELETE' })
};
