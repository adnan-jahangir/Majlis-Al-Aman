export interface SpiritualWisdom {
  id: number;
  type: 'ayah' | 'hadith';
  arabic: string;
  bangla: string;
  english: string;
  reference: string;
  category: 'Tranquility' | 'Salah & Prayer' | 'Steadfastness' | 'Forgiveness' | 'Gratitude' | 'Patience';
}

export const SPIRITUAL_COLLECTION: SpiritualWisdom[] = [
  {
    id: 1,
    type: 'ayah',
    category: 'Tranquility',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    bangla: '“জেনে রেখো, আল্লাহর স্মরণেই কেবল হৃদয় প্রশান্ত ও তৃপ্ত হয়।”',
    english: '“Unquestionably, by the remembrance of Allah hearts find rest.”',
    reference: 'সূরা আর-রাদ (১৩:২৮)'
  },
  {
    id: 2,
    type: 'ayah',
    category: 'Salah & Prayer',
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا',
    bangla: '“নিশ্চয়ই নির্ধারিত সময়ে সালাত আদায় করা মুমিনদের জন্য একটি অলঙ্ঘনীয় বিধান।”',
    english: '“Indeed, prayer has been decreed upon the believers at specified times.”',
    reference: 'সূরা আন-নিসা (৪:১০৩)'
  },
  {
    id: 3,
    type: 'hadith',
    category: 'Steadfastness',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    bangla: '“আল্লাহর নিকট সর্বাধিক প্রিয় আমল তা-ই, যা নিয়মিত করা হয়—যদিও তা পরিমাণে অল্প হয়।”',
    english: '“The deeds most loved by Allah are those done regularly, even if they are small.”',
    reference: 'সহিহ বুখারি (৬৪৬৪), সহিহ মুসলিম'
  },
  {
    id: 4,
    type: 'ayah',
    category: 'Patience',
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
    bangla: '“আর তোমরা ধৈর্য এবং সালাতের মাধ্যমে সাহায্য প্রার্থনা করো।”',
    english: '“And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive.”',
    reference: 'সূরা আল-বাকারা (২:৪৫)'
  },
  {
    id: 5,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ',
    bangla: '“যে ব্যক্তি দুই শীতল সময়ের নামাজ (ফজর ও আসর) নিয়মিত আদায় করবে, সে জান্নাতে প্রবেশ করবে।”',
    english: '“Whoever performs the two cool prayers (Fajr and Asr) will enter Paradise.”',
    reference: 'সহিহ বুখারি (৫৭৪)'
  },
  {
    id: 6,
    type: 'ayah',
    category: 'Gratitude',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    bangla: '“অতএব তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আর আমার কৃতজ্ঞতা প্রকাশ করো, অকৃতজ্ঞ হয়ো না।”',
    english: '“So remember Me; I will remember you. And be grateful to Me and do not deny Me.”',
    reference: 'সূরা আল-বাকারা (২:১৫২)'
  },
  {
    id: 7,
    type: 'hadith',
    category: 'Tranquility',
    arabic: 'اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ',
    bangla: '“তোমরা কোরআন পাঠ করো, কেননা কিয়ামতের দিন এটি তার তিলাওয়াতকারীর জন্য সুপারিশকারী হিসেবে আবির্ভূত হবে।”',
    english: '“Read the Quran, for it will come on the Day of Resurrection as an intercessor for its companions.”',
    reference: 'সহিহ মুসলিম (৮০৪)'
  },
  {
    id: 8,
    type: 'ayah',
    category: 'Forgiveness',
    arabic: 'وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ',
    bangla: '“হে মুমিনগণ, তোমরা সকলে আল্লাহর দিকে তওবা করো, যাতে তোমরা সফলকাম হতে পারো।”',
    english: '“And turn to Allah in repentance, all of you, O believers, that you might succeed.”',
    reference: 'সূরা আন-নূর (২৪:৩১)'
  },
  {
    id: 9,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
    bangla: '“ফজরের দুই রাকাত (সুন্নত) নামাজ দুনিয়া এবং তার মধ্যকার সমস্ত কিছুর চেয়েও উত্তম।”',
    english: '“The two Sunnah Rakats of Fajr are better than the entire world and everything within it.”',
    reference: 'সহিহ মুসলিম (৭২৫)'
  },
  {
    id: 10,
    type: 'ayah',
    category: 'Steadfastness',
    arabic: 'إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ',
    bangla: '“নিশ্চয়ই যারা বলে আমাদের রব আল্লাহ, অতঃপর তার ওপর অবিচল ও দৃঢ় থাকে—তাদের কোনো ভয় নেই এবং তারা চিন্তিতও হবে না।”',
    english: '“Indeed, those who have said, Our Lord is Allah, and then remained steadfast — there will be no fear concerning them, nor will they grieve.”',
    reference: 'সূরা আল-আহকাফ (৪৬:১৩)'
  },
  {
    id: 11,
    type: 'hadith',
    category: 'Gratitude',
    arabic: 'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ',
    bangla: '“যে মানুষের প্রতি কৃতজ্ঞতা প্রকাশ করে না, সে আল্লাহর প্রতিও কৃতজ্ঞ হয় না।”',
    english: '“He who does not thank people does not thank Allah.”',
    reference: 'সুনান আত-তিরমিজি (১৯৫৪)'
  },
  {
    id: 12,
    type: 'ayah',
    category: 'Tranquility',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    bangla: '“আর আমার বান্দারা যখন আপনার কাছে আমার ব্যাপারে জিজ্ঞেস করে—আমি তো তাদের অতি নিকটেই আছি। কোনো আহ্বানকারী যখনই আমাকে ডাকে, আমি তার ডাকে সাড়া দিই।”',
    english: '“And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.”',
    reference: 'সূরা আল-বাকারা (২:১৮৬)'
  },
  {
    id: 13,
    type: 'hadith',
    category: 'Patience',
    arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ',
    bangla: '“মুমিনের প্রতিটি বিষয়ই আশ্চর্যজনক! তার প্রতিটি কাজই তার জন্য কল্যাণকর—সুখে শুকরিয়া আদায় করলে কল্যাণ, আর বিপদে ধৈর্য ধরলে তাও তার জন্য কল্যাণকর।”',
    english: '“How wonderful is the affair of the believer, for his affairs are all good! If something good happens, he is thankful and that is good for him; if something bad happens, he bears it with patience and that is good for him.”',
    reference: 'সহিহ মুসলিম (২৯৯৯)'
  }
];
