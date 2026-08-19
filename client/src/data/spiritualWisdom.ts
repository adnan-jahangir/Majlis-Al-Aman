export interface SpiritualWisdom {
  id: number;
  type: 'ayah' | 'hadith';
  arabic: string;
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
    english: '“Unquestionably, by the remembrance of Allah hearts find rest.”',
    reference: 'Surah Ar-Ra\'d (13:28)'
  },
  {
    id: 2,
    type: 'ayah',
    category: 'Salah & Prayer',
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا',
    english: '“Indeed, prayer has been decreed upon the believers at specified times.”',
    reference: 'Surah An-Nisa (4:103)'
  },
  {
    id: 3,
    type: 'hadith',
    category: 'Steadfastness',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    english: '“The deeds most loved by Allah are those done regularly, even if they are small.”',
    reference: 'Sahih al-Bukhari (6464), Sahih Muslim'
  },
  {
    id: 4,
    type: 'ayah',
    category: 'Patience',
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
    english: '“And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive.”',
    reference: 'Surah Al-Baqarah (2:45)'
  },
  {
    id: 5,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ',
    english: '“Whoever performs the two cool prayers (Fajr and Asr) will enter Paradise.”',
    reference: 'Sahih al-Bukhari (574)'
  },
  {
    id: 6,
    type: 'ayah',
    category: 'Gratitude',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    english: '“So remember Me; I will remember you. And be grateful to Me and do not deny Me.”',
    reference: 'Surah Al-Baqarah (2:152)'
  },
  {
    id: 7,
    type: 'hadith',
    category: 'Tranquility',
    arabic: 'اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ',
    english: '“Read the Quran, for it will come on the Day of Resurrection as an intercessor for its companions.”',
    reference: 'Sahih Muslim (804)'
  },
  {
    id: 8,
    type: 'ayah',
    category: 'Forgiveness',
    arabic: 'وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ',
    english: '“And turn to Allah in repentance, all of you, O believers, that you might succeed.”',
    reference: 'Surah An-Nur (24:31)'
  },
  {
    id: 9,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
    english: '“The two Sunnah Rakats of Fajr are better than the entire world and everything within it.”',
    reference: 'Sahih Muslim (725)'
  },
  {
    id: 10,
    type: 'ayah',
    category: 'Steadfastness',
    arabic: 'إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ',
    english: '“Indeed, those who have said, Our Lord is Allah, and then remained steadfast — there will be no fear concerning them, nor will they grieve.”',
    reference: 'Surah Al-Ahqaf (46:13)'
  },
  {
    id: 11,
    type: 'hadith',
    category: 'Gratitude',
    arabic: 'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ',
    english: '“He who does not thank people does not thank Allah.”',
    reference: 'Jami\' at-Tirmidhi (1954)'
  },
  {
    id: 12,
    type: 'ayah',
    category: 'Tranquility',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    english: '“And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.”',
    reference: 'Surah Al-Baqarah (2:186)'
  },
  {
    id: 13,
    type: 'hadith',
    category: 'Patience',
    arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ',
    english: '“How wonderful is the affair of the believer, for his affairs are all good! If something good happens, he is thankful and that is good for him; if something bad happens, he bears it with patience and that is good for him.”',
    reference: 'Sahih Muslim (2999)'
  }
];
