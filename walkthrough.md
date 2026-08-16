# Majlis Al-Aman (مَجْلِسُ الأَمَان)
### Modern Islamic Prayer & Quran Habit Tracker

Majlis Al-Aman is a full-stack, responsive web application designed with a peaceful, elegant, and modern aesthetic. It combines habit tracking, astronomical prayer schedules, Quran reading goals, consistency streaks, community encouragement, and privacy-conscious analytics.

---

## Key Features & Highlights

### 1. 🌟 Serene, Modern & Responsive UI
* **Design Philosophy:** Deep navy/charcoal background (`#090d16`), soft emerald green accents (`#10b981`), subtle warm gold highlights (`#f59e0b`), glassmorphic panels, and minimal Islamic geometric background patterns.
* **Typography:** Modern typography using *Outfit*, *Plus Jakarta Sans*, and *Amiri* calligraphy.
* **Responsive Layout:** Sleek collapsible desktop sidebar, sticky header with Gregorian & Hijri calendar display, plus a mobile bottom navigation bar with floating action button `(+)`.

### 2. 🕌 Dynamic Prayer Tracker & 5 Daily Salah Cards
* **Astronomical Calculations:** Dynamically computes Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha times using local coordinates and multiple calculation authorities (ISNA, MWL, Umm Al-Qura, Egypt, Karachi, Dubai, Singapore, Turkey).
* **Next Prayer Countdown:** Live real-time countdown timer to the upcoming prayer.
* **Interactive Prayer Cards:** Dedicated cards with Arabic names, one-click toggle, confirmation modal (*“Did you complete Fajr?”*), and undo toast notifications.
* **Celebration:** Smooth confetti animation upon completing all 5 daily prayers.

### 3. 📖 Quran Habit Tracker
* **Reading Progress:** Daily page counter, goal progress bar, and duration tracking.
* **Log Modal:** Searchable dropdown with all 114 Surahs, quick `+2`, `+5`, `+10`, `+20` page presets, and reflection notes.
* **Khatam Tracker:** Overall Khatam progress percentage and total completed Khatams count.

### 4. 🔥 Consistency Streak System
* Animated flame effect displaying current streak, longest historical streak, and total active days.
* Milestones and spiritual steadfastness motivation without excessive gamification.

### 5. 📅 Calendar & Habit History
* Interactive monthly grid with color-coded badges:
  * 🟢 **Green:** 5/5 all prayers completed.
  * 🔵 **Teal:** 3–4 prayers completed.
  * 🟡 **Yellow:** Partial completion / Quran logged.
  * ⚪ **Slate:** Low activity.
* Clicking any day opens a detailed daily breakdown drawer showing exact prayer statuses, Surahs recited, and reflections.

### 6. 📊 Analytics & Deep Statistics (Recharts)
* **Prayer Consistency Breakdown:** Individual completion rates for Fajr, Dhuhr, Asr, Maghrib, and Isha.
* **Interactive Charts:**
  * Weekly Prayer Completion (Bar chart, max 5/day)
  * Daily Quran Momentum (Area chart, past 30 days)
  * Monthly Salah Completion Rate (Area chart, past 6 months)

### 7. 🏆 Consistency Leaderboard
* Filterable by **This Week**, **This Month**, and **All Time**.
* Top 3 podium highlights with gold, silver, and bronze badges.
* Highlighted current user row and privacy-toggle compliance.

### 8. 🤲 Community Encouragement Feed
* Minimal, respectful social space to share milestones and du'as.
* Reaction buttons: **🤲 BarakAllah**, **✨ MashAllah**, **🎉 Mabrook**, and **❤️ Heart**.
* Inline discussion comments and milestone badge tags.

### 9. 👤 User Profile & 365-Day Activity Heatmap
* **GitHub-Style Annual Heatmap:** Visual representation of all 365 days of spiritual activity.
* **Trophy Case:** Unlocked achievement badges (*3-Day Momentum, 7-Day Steadfastness, 14-Day Consistency, 30-Day Master, 100 Salah Century, Fajr Champion, Khatam Club*).
* Editable profile info, bio, and custom avatar.

### 10. ⚙️ Privacy & Prayer Settings
* Location detection (GPS Auto-detect or manual coordinates).
* Calculation method and Madhab (Shafi'i/Standard vs. Hanafi).
* Granular privacy controls: toggle visibility on the leaderboard, prayer stats, or Quran activity.
* Web notifications for all 5 prayers, Quran, and streak reminders.

### 11. 🛡️ Admin Management Console
* Platform analytics (Total Users, Daily Active Users, Total Prayers, Quran Pages).
* User management table with search and account status toggle.
* Broadcast platform announcements manager.

### 12. ✨ Digital Tasbih & Qibla Compass
* Digital Tasbih counter with SubhanAllah, Alhamdulillah, Allahu Akbar presets and vibration/click feel.
* Qibla compass calculating the exact angle to the Holy Kaaba from your coordinates.

---

## ⚡ Demo Credentials

| Role | Email / Username | Password | Notes |
|---|---|---|---|
| **Active User** | `adnan@majlis.app` / `adnan` | `password123` | Pre-populated with 60 days of prayer & Quran logs, 14d+ streak, 11 badges |
| **Admin** | `admin@majlis.app` / `admin` | `admin123` | Platform administrator with access to Admin Portal & moderation |
| **Community Members** | `sarah_h`, `rahim_k`, `layla_n`, `zayn_m` | `password123` | Seeded community interactions and leaderboard rankings |

---

## Running Locally

1. **Start Backend Server:**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5000
   ```
2. **Start Frontend Client:**
   ```bash
   cd client
   npm run dev
   # Client runs on http://127.0.0.1:5173
   ```
