import express from 'express';
import { query, get, run } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { updateStreakAndAchievements } from '../services/streakService.js';
import { format } from 'date-fns';

const router = express.Router();

// 114 Surahs metadata list for easy autocomplete/dropdown
export const SURAHS = [
  { number: 1, name: 'Al-Fatihah', english: 'The Opening', totalAyahs: 7 },
  { number: 2, name: 'Al-Baqarah', english: 'The Cow', totalAyahs: 286 },
  { number: 3, name: 'Ali \'Imran', english: 'Family of Imran', totalAyahs: 200 },
  { number: 4, name: 'An-Nisa', english: 'The Women', totalAyahs: 176 },
  { number: 5, name: 'Al-Ma\'idah', english: 'The Table Spread', totalAyahs: 120 },
  { number: 6, name: 'Al-An\'am', english: 'The Cattle', totalAyahs: 165 },
  { number: 7, name: 'Al-A\'raf', english: 'The Heights', totalAyahs: 206 },
  { number: 8, name: 'Al-Anfal', english: 'The Spoils of War', totalAyahs: 75 },
  { number: 9, name: 'At-Tawbah', english: 'The Repentance', totalAyahs: 129 },
  { number: 10, name: 'Yunus', english: 'Jonah', totalAyahs: 109 },
  { number: 11, name: 'Hud', english: 'Hud', totalAyahs: 123 },
  { number: 12, name: 'Yusuf', english: 'Joseph', totalAyahs: 111 },
  { number: 13, name: 'Ar-Ra\'d', english: 'The Thunder', totalAyahs: 43 },
  { number: 14, name: 'Ibrahim', english: 'Abraham', totalAyahs: 52 },
  { number: 15, name: 'Al-Hijr', english: 'The Rocky Tract', totalAyahs: 99 },
  { number: 16, name: 'An-Nahl', english: 'The Bee', totalAyahs: 128 },
  { number: 17, name: 'Al-Isra', english: 'The Night Journey', totalAyahs: 111 },
  { number: 18, name: 'Al-Kahf', english: 'The Cave', totalAyahs: 110 },
  { number: 19, name: 'Maryam', english: 'Mary', totalAyahs: 98 },
  { number: 20, name: 'Taha', english: 'Ta-Ha', totalAyahs: 135 },
  { number: 21, name: 'Al-Anbiya', english: 'The Prophets', totalAyahs: 112 },
  { number: 22, name: 'Al-Hajj', english: 'The Pilgrimage', totalAyahs: 78 },
  { number: 23, name: 'Al-Mu\'minun', english: 'The Believers', totalAyahs: 118 },
  { number: 24, name: 'An-Nur', english: 'The Light', totalAyahs: 64 },
  { number: 25, name: 'Al-Furqan', english: 'The Criterion', totalAyahs: 77 },
  { number: 26, name: 'Ash-Shu\'ara', english: 'The Poets', totalAyahs: 227 },
  { number: 27, name: 'An-Naml', english: 'The Ants', totalAyahs: 93 },
  { number: 28, name: 'Al-Qasas', english: 'The Stories', totalAyahs: 88 },
  { number: 29, name: 'Al-\'Ankabut', english: 'The Spider', totalAyahs: 69 },
  { number: 30, name: 'Ar-Rum', english: 'The Romans', totalAyahs: 60 },
  { number: 31, name: 'Luqman', english: 'Luqman', totalAyahs: 34 },
  { number: 32, name: 'As-Sajdah', english: 'The Prostration', totalAyahs: 30 },
  { number: 33, name: 'Al-Ahzab', english: 'The Combined Forces', totalAyahs: 73 },
  { number: 34, name: 'Saba', english: 'Sheba', totalAyahs: 54 },
  { number: 35, name: 'Fatir', english: 'Originator', totalAyahs: 45 },
  { number: 36, name: 'Ya-Sin', english: 'Ya-Sin', totalAyahs: 83 },
  { number: 37, name: 'As-Saffat', english: 'Those who set the Ranks', totalAyahs: 182 },
  { number: 38, name: 'Sad', english: 'The Letter "Saad"', totalAyahs: 88 },
  { number: 39, name: 'Az-Zumar', english: 'The Troops', totalAyahs: 75 },
  { number: 40, name: 'Ghafir', english: 'The Forgiver', totalAyahs: 85 },
  { number: 41, name: 'Fussilat', english: 'Explained in Detail', totalAyahs: 54 },
  { number: 42, name: 'Ash-Shura', english: 'The Consultation', totalAyahs: 53 },
  { number: 43, name: 'Az-Zukhruf', english: 'The Ornaments of Gold', totalAyahs: 89 },
  { number: 44, name: 'Ad-Dukhan', english: 'The Smoke', totalAyahs: 59 },
  { number: 45, name: 'Al-Jathiyah', english: 'The Crouching', totalAyahs: 37 },
  { number: 46, name: 'Al-Ahqaf', english: 'The Wind-Curved Sandhills', totalAyahs: 35 },
  { number: 47, name: 'Muhammad', english: 'Muhammad', totalAyahs: 38 },
  { number: 48, name: 'Al-Fath', english: 'The Victory', totalAyahs: 29 },
  { number: 49, name: 'Al-Hujurat', english: 'The Rooms', totalAyahs: 18 },
  { number: 50, name: 'Qaf', english: 'The Letter "Qaf"', totalAyahs: 45 },
  { number: 51, name: 'Adh-Dhariyat', english: 'The Winnowing Winds', totalAyahs: 60 },
  { number: 52, name: 'At-Tur', english: 'The Mount', totalAyahs: 49 },
  { number: 53, name: 'An-Najm', english: 'The Star', totalAyahs: 62 },
  { number: 54, name: 'Al-Qamar', english: 'The Moon', totalAyahs: 55 },
  { number: 55, name: 'Ar-Rahman', english: 'The Beneficent', totalAyahs: 78 },
  { number: 56, name: 'Al-Waqi\'ah', english: 'The Inevitable', totalAyahs: 96 },
  { number: 57, name: 'Al-Hadid', english: 'The Iron', totalAyahs: 29 },
  { number: 58, name: 'Al-Mujadila', english: 'The Pleading Woman', totalAyahs: 22 },
  { number: 59, name: 'Al-Hashr', english: 'The Exile', totalAyahs: 24 },
  { number: 60, name: 'Al-Mumtahanah', english: 'She that is to be examined', totalAyahs: 13 },
  { number: 61, name: 'As-Saff', english: 'The Ranks', totalAyahs: 14 },
  { number: 62, name: 'Al-Jumu\'ah', english: 'The Congregation, Friday', totalAyahs: 11 },
  { number: 63, name: 'Al-Munafiqun', english: 'The Hypocrites', totalAyahs: 11 },
  { number: 64, name: 'At-Taghabun', english: 'The Mutual Disillusion', totalAyahs: 18 },
  { number: 65, name: 'At-Talaq', english: 'The Divorce', totalAyahs: 12 },
  { number: 66, name: 'At-Tahrim', english: 'The Prohibition', totalAyahs: 12 },
  { number: 67, name: 'Al-Mulk', english: 'The Sovereignty', totalAyahs: 30 },
  { number: 68, name: 'Al-Qalam', english: 'The Pen', totalAyahs: 52 },
  { number: 69, name: 'Al-Haqqah', english: 'The Reality', totalAyahs: 52 },
  { number: 70, name: 'Al-Ma\'arij', english: 'The Ascending Stairways', totalAyahs: 44 },
  { number: 71, name: 'Nuh', english: 'Noah', totalAyahs: 28 },
  { number: 72, name: 'Al-Jinn', english: 'The Jinn', totalAyahs: 28 },
  { number: 73, name: 'Al-Muzzammil', english: 'The Enshrouded One', totalAyahs: 20 },
  { number: 74, name: 'Al-Muddaththir', english: 'The Cloaked One', totalAyahs: 56 },
  { number: 75, name: 'Al-Qiyamah', english: 'The Resurrection', totalAyahs: 40 },
  { number: 76, name: 'Al-Insan', english: 'The Human', totalAyahs: 31 },
  { number: 77, name: 'Al-Mursalat', english: 'The Emissaries', totalAyahs: 50 },
  { number: 78, name: 'An-Naba', english: 'The Tidings', totalAyahs: 40 },
  { number: 79, name: 'An-Nazi\'at', english: 'Those who drag forth', totalAyahs: 46 },
  { number: 80, name: '\'Abasa', english: 'He Frowned', totalAyahs: 42 },
  { number: 81, name: 'At-Takwir', english: 'The Overthrowing', totalAyahs: 29 },
  { number: 82, name: 'Al-Infitar', english: 'The Cleaving', totalAyahs: 19 },
  { number: 83, name: 'Al-Mutaffifin', english: 'The Defrauding', totalAyahs: 36 },
  { number: 84, name: 'Al-Inshiqaq', english: 'The Splitting Asunder', totalAyahs: 25 },
  { number: 85, name: 'Al-Buruj', english: 'The Mansions of the Stars', totalAyahs: 22 },
  { number: 86, name: 'At-Tariq', english: 'The Nightcommer', totalAyahs: 17 },
  { number: 87, name: 'Al-A\'la', english: 'The Most High', totalAyahs: 19 },
  { number: 88, name: 'Al-Ghashiyah', english: 'The Overwhelming', totalAyahs: 26 },
  { number: 89, name: 'Al-Fajr', english: 'The Dawn', totalAyahs: 30 },
  { number: 90, name: 'Al-Balad', english: 'The City', totalAyahs: 20 },
  { number: 91, name: 'Ash-Shams', english: 'The Sun', totalAyahs: 15 },
  { number: 92, name: 'Al-Layl', english: 'The Night', totalAyahs: 21 },
  { number: 93, name: 'Ad-Duhaa', english: 'The Morning Hours', totalAyahs: 11 },
  { number: 94, name: 'Ash-Sharh', english: 'The Relief', totalAyahs: 8 },
  { number: 95, name: 'At-Tin', english: 'The Fig', totalAyahs: 8 },
  { number: 96, name: 'Al-\'Alaq', english: 'The Clot', totalAyahs: 19 },
  { number: 97, name: 'Al-Qadr', english: 'The Power', totalAyahs: 5 },
  { number: 98, name: 'Al-Bayyinah', english: 'The Clear Proof', totalAyahs: 8 },
  { number: 99, name: 'Az-Zalzalah', english: 'The Earthquake', totalAyahs: 8 },
  { number: 100, name: 'Al-\'Adiyat', english: 'The Courser', totalAyahs: 11 },
  { number: 101, name: 'Al-Qari\'ah', english: 'The Calamity', totalAyahs: 11 },
  { number: 102, name: 'At-Takathur', english: 'The Rivalry in world increase', totalAyahs: 8 },
  { number: 103, name: 'Al-\'Asr', english: 'The Declining Day', totalAyahs: 3 },
  { number: 104, name: 'Al-Humazah', english: 'The Traducer', totalAyahs: 9 },
  { number: 105, name: 'Al-Fil', english: 'The Elephant', totalAyahs: 5 },
  { number: 106, name: 'Quraysh', english: 'Quraysh', totalAyahs: 4 },
  { number: 107, name: 'Al-Ma\'un', english: 'The Small Kindness', totalAyahs: 7 },
  { number: 108, name: 'Al-Kawthar', english: 'The Abundance', totalAyahs: 3 },
  { number: 109, name: 'Al-Kafirun', english: 'The Disbelievers', totalAyahs: 6 },
  { number: 110, name: 'An-Nasr', english: 'The Divine Support', totalAyahs: 3 },
  { number: 111, name: 'Al-Masad', english: 'The Palm Fiber', totalAyahs: 5 },
  { number: 112, name: 'Al-Ikhlas', english: 'The Sincerity', totalAyahs: 4 },
  { number: 113, name: 'Al-Falaq', english: 'The Daybreak', totalAyahs: 5 },
  { number: 114, name: 'An-Nas', english: 'Mankind', totalAyahs: 6 }
];

// Get Surahs metadata list
router.get('/surahs', (req, res) => {
  res.json(SURAHS);
});

// Get Quran stats and today summary
router.get(['/', '/summary'], authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date || format(new Date(), 'yyyy-MM-dd');

    // Get user daily goal
    const settings = await get('SELECT daily_quran_goal FROM user_settings WHERE user_id = ?', [userId]);
    const dailyGoal = (settings && settings.daily_quran_goal) || 10;

    // Get today's logs
    const todayLogs = await query(
      'SELECT id, surah_number, surah_name, pages_read, reading_duration_mins, notes, created_at FROM quran_records WHERE user_id = ? AND date = ? ORDER BY id DESC',
      [userId, date]
    );

    const todayPages = todayLogs.reduce((acc, curr) => acc + curr.pages_read, 0);
    const todayDuration = todayLogs.reduce((acc, curr) => acc + (curr.reading_duration_mins || 0), 0);

    // Get overall stats
    const totalStats = await get(
      `SELECT 
        SUM(pages_read) as total_pages, 
        COUNT(DISTINCT date) as total_reading_days,
        SUM(reading_duration_mins) as total_duration_mins
       FROM quran_records WHERE user_id = ?`,
      [userId]
    );

    const recentLogs = await query(
      'SELECT id, date, surah_number, surah_name, pages_read, reading_duration_mins, notes, created_at FROM quran_records WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 15',
      [userId]
    );

    const totalPages = (totalStats && totalStats.total_pages) || 0;
    const totalReadingDays = (totalStats && totalStats.total_reading_days) || 0;
    const avgPagesPerDay = totalReadingDays > 0 ? (totalPages / totalReadingDays).toFixed(1) : '0';

    res.json({
      date,
      dailyGoal,
      todayPages,
      todayDuration,
      todayLogs,
      hasReadToday: todayPages > 0,
      goalPercentage: Math.min(100, Math.round((todayPages / dailyGoal) * 100)),
      totalStats: {
        totalPages,
        totalReadingDays,
        avgPagesPerDay,
        totalDurationMins: (totalStats && totalStats.total_duration_mins) || 0,
        khatamPercentage: ((totalPages % 604) / 604 * 100).toFixed(1),
        completedKhatams: Math.floor(totalPages / 604)
      },
      recentLogs
    });
  } catch (error) {
    console.error('Get quran error:', error);
    res.status(500).json({ error: 'Server error fetching Quran logs' });
  }
});

// Add reading session
router.post('/log', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { pagesRead, surahNumber, surahName, durationMins, notes, date } = req.body;
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    const pages = parseInt(pagesRead, 10);
    if (isNaN(pages) || pages <= 0) {
      return res.status(400).json({ error: 'Please enter a valid positive number of pages' });
    }

    let sName = surahName;
    if (!sName && surahNumber) {
      const found = SURAHS.find(s => s.number === parseInt(surahNumber, 10));
      if (found) sName = `${found.number}. ${found.name}`;
    }

    const result = await run(
      `INSERT INTO quran_records (user_id, date, surah_number, surah_name, pages_read, reading_duration_mins, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, targetDate, surahNumber || null, sName || 'General Recitation', pages, parseInt(durationMins, 10) || 0, notes || null]
    );

    // Refresh streak and check achievements
    const streakInfo = await updateStreakAndAchievements(userId);

    // Fetch updated summary for immediate UI sync
    const settings = await get('SELECT daily_quran_goal FROM user_settings WHERE user_id = ?', [userId]);
    const dailyGoal = (settings && settings.daily_quran_goal) || 10;
    const todayLogs = await query(
      'SELECT id, surah_number, surah_name, pages_read, reading_duration_mins, notes, created_at FROM quran_records WHERE user_id = ? AND date = ? ORDER BY id DESC',
      [userId, targetDate]
    );
    const todayPages = todayLogs.reduce((acc, curr) => acc + curr.pages_read, 0);
    const todayDuration = todayLogs.reduce((acc, curr) => acc + (curr.reading_duration_mins || 0), 0);
    const totalStats = await get(
      `SELECT SUM(pages_read) as total_pages, COUNT(DISTINCT date) as total_reading_days, SUM(reading_duration_mins) as total_duration_mins FROM quran_records WHERE user_id = ?`,
      [userId]
    );
    const totalPages = (totalStats && totalStats.total_pages) || 0;
    const totalReadingDays = (totalStats && totalStats.total_reading_days) || 0;

    const summary = {
      date: targetDate,
      dailyGoal,
      todayPages,
      todayDuration,
      todayLogs,
      hasReadToday: todayPages > 0,
      goalPercentage: Math.min(100, Math.round((todayPages / dailyGoal) * 100)),
      totalStats: {
        totalPages,
        totalReadingDays,
        avgPagesPerDay: totalReadingDays > 0 ? (totalPages / totalReadingDays).toFixed(1) : '0',
        totalDurationMins: (totalStats && totalStats.total_duration_mins) || 0,
        khatamPercentage: ((totalPages % 604) / 604 * 100).toFixed(1),
        completedKhatams: Math.floor(totalPages / 604)
      }
    };

    res.status(201).json({
      message: 'Quran reading logged successfully',
      id: result.id,
      streak: streakInfo,
      summary
    });
  } catch (error) {
    console.error('Add quran log error:', error);
    res.status(500).json({ error: 'Server error saving Quran reading' });
  }
});

// Delete a reading record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const recordId = req.params.id;

    await run('DELETE FROM quran_records WHERE id = ? AND user_id = ?', [recordId, userId]);
    const streakInfo = await updateStreakAndAchievements(userId);

    res.json({ message: 'Reading record removed', streak: streakInfo });
  } catch (error) {
    console.error('Delete quran log error:', error);
    res.status(500).json({ error: 'Server error deleting record' });
  }
});

export default router;
