import { format } from 'date-fns';
import { 
  PrayerName, 
  PrayerStatus, 
  TodayPrayersResponse, 
  QuranResponse, 
  MonthHistoryResponse, 
  StatsResponse,
  DayDetailResponse,
  QuranLog,
  CalendarDay
} from '../types';

const DEFAULT_PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const getLocalTodayDateStr = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// 1. GUEST PRAYERS
export const getGuestPrayers = (dateStr: string = getLocalTodayDateStr()): TodayPrayersResponse => {
  try {
    const stored = localStorage.getItem(`majlis_guest_prayers_${dateStr}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.prayers)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading guest prayers from localStorage:', e);
  }

  return {
    date: dateStr,
    prayers: DEFAULT_PRAYER_NAMES.map(name => ({ name, status: 'pending' as PrayerStatus })),
    completedCount: 0,
    totalPrayers: 5,
    completionPercentage: 0
  };
};

export const saveGuestPrayers = (data: TodayPrayersResponse, dateStr: string = getLocalTodayDateStr()): void => {
  try {
    localStorage.setItem(`majlis_guest_prayers_${dateStr}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving guest prayers to localStorage:', e);
  }
};

// 2. GUEST QURAN
export const getGuestQuran = (dateStr: string = getLocalTodayDateStr()): QuranResponse => {
  try {
    const stored = localStorage.getItem(`majlis_guest_quran_${dateStr}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.todayPages === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading guest quran from localStorage:', e);
  }

  return {
    date: dateStr,
    dailyGoal: 10,
    todayPages: 0,
    todayDuration: 0,
    todayLogs: [],
    hasReadToday: false,
    goalPercentage: 0,
    totalStats: {
      totalPages: 0,
      totalReadingDays: 0,
      avgPagesPerDay: '0',
      totalDurationMins: 0,
      khatamPercentage: '0.0',
      completedKhatams: 0
    },
    recentLogs: []
  };
};

export const saveGuestQuran = (
  pagesRead: number, 
  durationMins: number = 0, 
  dailyGoal: number = 10,
  dateStr: string = getLocalTodayDateStr()
): QuranResponse => {
  const current = getGuestQuran(dateStr);
  const newTodayPages = current.todayPages + pagesRead;
  const newTodayDuration = current.todayDuration + durationMins;
  const newTotalPages = (current.totalStats?.totalPages || 0) + pagesRead;
  const newTotalDuration = (current.totalStats?.totalDurationMins || 0) + durationMins;
  const newGoalPercentage = Math.min(100, Math.round((newTodayPages / dailyGoal) * 100));

  const newLog: QuranLog = {
    id: Date.now(),
    surah_name: 'Daily Tilawah',
    pages_read: pagesRead,
    reading_duration_mins: durationMins,
    date: dateStr,
    created_at: new Date().toISOString()
  };

  const updatedResponse: QuranResponse = {
    date: dateStr,
    dailyGoal,
    todayPages: newTodayPages,
    todayDuration: newTodayDuration,
    todayLogs: [newLog, ...current.todayLogs],
    hasReadToday: true,
    goalPercentage: newGoalPercentage,
    totalStats: {
      totalPages: newTotalPages,
      totalReadingDays: (current.totalStats?.totalReadingDays || 0) + (current.todayPages === 0 ? 1 : 0),
      avgPagesPerDay: String(newTotalPages),
      totalDurationMins: newTotalDuration,
      khatamPercentage: ((newTotalPages / 604) * 100).toFixed(1),
      completedKhatams: Math.floor(newTotalPages / 604)
    },
    recentLogs: [newLog, ...current.recentLogs].slice(0, 10)
  };

  try {
    localStorage.setItem(`majlis_guest_quran_${dateStr}`, JSON.stringify(updatedResponse));
  } catch (e) {
    console.error('Error saving guest quran to localStorage:', e);
  }

  return updatedResponse;
};

// 3. GUEST MONTH HISTORY
export const getGuestMonthHistory = (year: number, month: number): MonthHistoryResponse => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays: CalendarDay[] = [];
  let totalPrayersCompleted = 0;
  let totalQuranPages = 0;
  let totalDaysWithFullPrayers = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const p = getGuestPrayers(dayStr);
    const q = getGuestQuran(dayStr);
    const dayDate = new Date(year, month - 1, d);

    if (p.completedCount === 5) {
      totalDaysWithFullPrayers++;
    }
    totalPrayersCompleted += p.completedCount;
    totalQuranPages += q.todayPages;

    let level: 'full' | 'high' | 'partial' | 'empty' = 'empty';
    if (p.completedCount === 5) level = 'full';
    else if (p.completedCount >= 3) level = 'high';
    else if (p.completedCount >= 1 || q.todayPages > 0) level = 'partial';

    calendarDays.push({
      date: dayStr,
      dayNumber: d,
      dayOfWeek: dayDate.getDay(),
      completedPrayers: p.completedCount,
      totalPrayers: 5,
      quranPages: q.todayPages,
      quranDuration: q.todayDuration,
      level,
      hasActivity: p.completedCount > 0 || q.todayPages > 0
    });
  }

  const totalPossible = daysInMonth * 5;
  const monthCompletionRate = totalPossible > 0 ? Math.round((totalPrayersCompleted / totalPossible) * 100) : 0;

  return {
    year,
    month,
    monthName: format(new Date(year, month - 1, 1), 'MMMM'),
    calendarDays,
    summary: {
      totalDaysWithFullPrayers,
      totalMonthPrayers: totalPrayersCompleted,
      totalMonthPages: totalQuranPages,
      monthCompletionRate
    }
  };
};

// 4. GUEST DAY DETAIL
export const getGuestDayDetail = (dateStr: string): DayDetailResponse => {
  const p = getGuestPrayers(dateStr);
  const q = getGuestQuran(dateStr);

  return {
    date: dateStr,
    prayers: p.prayers,
    completedCount: p.completedCount,
    totalPrayers: 5,
    prayerScore: `${p.completedCount}/5`,
    completionPercentage: p.completionPercentage,
    quranLogs: q.todayLogs,
    totalQuranPages: q.todayPages,
    totalQuranDuration: q.todayDuration
  };
};

// 5. GUEST STATS
export const getGuestStats = (): StatsResponse => {
  const todayStr = getLocalTodayDateStr();
  const p = getGuestPrayers(todayStr);
  const q = getGuestQuran(todayStr);

  const consistency: any = {};
  DEFAULT_PRAYER_NAMES.forEach(name => {
    const match = p.prayers.find(pr => pr.name === name);
    consistency[name] = {
      name,
      completed: match?.status === 'completed' ? 1 : 0,
      percentage: match?.status === 'completed' ? 100 : 0
    };
  });

  return {
    prayers: {
      totalCompleted: p.completedCount,
      consistency
    },
    quran: {
      totalPages: q.totalStats?.totalPages || q.todayPages,
      totalReadingDays: q.totalStats?.totalReadingDays || (q.todayPages > 0 ? 1 : 0),
      avgPagesPerDay: q.totalStats?.avgPagesPerDay || String(q.todayPages),
      totalDurationMins: q.totalStats?.totalDurationMins || q.todayDuration
    },
    streak: {
      current_streak: p.completedCount > 0 || q.todayPages > 0 ? 1 : 0,
      longest_streak: p.completedCount > 0 || q.todayPages > 0 ? 1 : 0,
      total_active_days: p.completedCount > 0 || q.todayPages > 0 ? 1 : 0,
      last_activity_date: todayStr
    },
    weeklyChart: [
      { date: todayStr, day: format(new Date(), 'EEE'), prayers: p.completedCount, quranPages: q.todayPages, score: p.completionPercentage }
    ],
    monthlyTrend: [
      { month: format(new Date(), 'MMMM'), shortMonth: format(new Date(), 'MMM'), completedPrayers: p.completedCount, completionRate: p.completionPercentage, quranPages: q.todayPages }
    ],
    dailyActivityTrend: [
      { date: todayStr, displayDate: format(new Date(), 'MMM d'), prayers: p.completedCount, quranPages: q.todayPages }
    ],
    heatmap: [
      { date: todayStr, level: p.completedCount === 5 ? 4 : p.completedCount >= 3 ? 3 : p.completedCount > 0 ? 2 : 0, prayers: p.completedCount, quranPages: q.todayPages }
    ]
  };
};
