# 🕌 Majlis Al-Aman (مَجْلِسُ الأَمَان)
> **A Serene, Modern Islamic Prayer & Quran Habit Sanctuary**

Majlis Al-Aman is an aesthetically crafted, full-stack Islamic lifestyle and habit tracker designed to foster spiritual discipline, *Istiqaamah* (consistency), and tranquility in daily worship.

---

## 🌟 Key Features

- 📍 **Live GPS Astronomical Prayer Schedule:** Millisecond-accurate Salah times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) computed dynamically from exact astronomical sun positions via GPS coordinates.
- 🕋 **Spherical Trigonometry Qibla Compass:** Great-Circle bearing direction indicator (`277° WNW` for BD) with live device compass orientation and exact kilometer distance to the Holy Kaaba in Mecca.
- 📖 **Noble Quran Tilawah & Khatam Tracker:** Set daily page goals, log reading minutes, track completed Khatams, and monitor progress bars.
- 📿 **Interactive Spiritual Wisdom Engine:** Dynamic daily Quranic Ayahs & authentic Hadiths with instant Arabic audio recitation, Bangla/English translations, and one-click copy.
- 📿 **Digital Tasbih Counter:** Integrated touch counter with gentle feedback, customizable Dhikr phrases, and automatic cycle resets.
- 🔥 **Istiqaamah Streaks & Halal Leaderboard:** Privacy-first community consistency board highlighting active streaks and spiritual steadfastness.
- 🔐 **Google Cloud OAuth 2.0 & MongoDB Atlas:** Seamless, passwordless Google authentication and secure cloud database syncing.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Vanilla CSS & Tailwind CSS with Custom Arabesque Design System
- **Icons:** Lucide React
- **Auth:** `@react-oauth/google`

### Backend
- **Runtime:** Node.js (ES Modules) & Express.js
- **Database:** MongoDB Atlas (via Mongoose) & SQLite (Local failover)
- **Calculations:** `adhan` (Astronomical calculation library)
- **Auth & Security:** `google-auth-library`, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or newer)
- MongoDB Atlas cluster or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/adnan-jahangir/Majlis-Al-Aman.git
cd Majlis-Al-Aman
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGODB_URI and GOOGLE_CLIENT_ID
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
# Fill in your VITE_GOOGLE_CLIENT_ID
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📄 License
MIT License. Open-source and free for all Muslim developers and the global Ummah.
