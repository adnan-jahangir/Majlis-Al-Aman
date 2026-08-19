export interface SpiritualWisdom {
  id: number;
  type: 'ayah' | 'hadith';
  arabic: string;
  english: string;
  reference: string;
  category: 'Tranquility' | 'Salah & Prayer' | 'Steadfastness' | 'Forgiveness' | 'Gratitude' | 'Patience' | 'Quran' | 'Tawakkul';
}

export const SPIRITUAL_COLLECTION: SpiritualWisdom[] = [
  // 1-10: TRANQUILITY & SALAH
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
    reference: 'Sahih al-Bukhari (6464), Sahih Muslim (782)'
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
    category: 'Quran',
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

  // 11-20: TAWAKKUL, FORGIVENESS & PATIENCE
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
  },
  {
    id: 14,
    type: 'ayah',
    category: 'Tawakkul',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    english: '“And whoever relies upon Allah — then He is sufficient for him.”',
    reference: 'Surah At-Talaq (65:3)'
  },
  {
    id: 15,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ كَفَّارَاتٌ لِمَا بَيْنَهُنَّ مَا لَمْ تُغْشَ الْكَبَائِرُ',
    english: '“The five daily prayers and Friday to Friday are expiation for whatever sins occur between them, so long as major sins are avoided.”',
    reference: 'Sahih Muslim (233)'
  },
  {
    id: 16,
    type: 'ayah',
    category: 'Forgiveness',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    english: '“Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.”',
    reference: 'Surah Az-Zumar (39:53)'
  },
  {
    id: 17,
    type: 'hadith',
    category: 'Quran',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: '“The best among you are those who learn the Quran and teach it to others.”',
    reference: 'Sahih al-Bukhari (5027)'
  },
  {
    id: 18,
    type: 'ayah',
    category: 'Patience',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: '“Indeed, with hardship comes ease.”',
    reference: 'Surah Ash-Sharh (94:6)'
  },
  {
    id: 19,
    type: 'hadith',
    category: 'Tawakkul',
    arabic: 'احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ',
    english: '“Be mindful of Allah and Allah will protect you. Be mindful of Allah and you will find Him in front of you.”',
    reference: 'Jami\' at-Tirmidhi (2516)'
  },
  {
    id: 20,
    type: 'ayah',
    category: 'Gratitude',
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    english: '“If you are grateful, I will surely increase you [in favor].”',
    reference: 'Surah Ibrahim (14:7)'
  },

  // 21-30: PROSTRATION, NIGHT PRAYER & SPIRITUAL NOURISHMENT
  {
    id: 21,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ',
    english: '“The closest a servant comes to his Lord is when he is prostrating (in Sujood), so make frequent supplication.”',
    reference: 'Sahih Muslim (482)'
  },
  {
    id: 22,
    type: 'ayah',
    category: 'Salah & Prayer',
    arabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي',
    english: '“And establish prayer for My remembrance.”',
    reference: 'Surah Taha (20:14)'
  },
  {
    id: 23,
    type: 'hadith',
    category: 'Steadfastness',
    arabic: 'قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ',
    english: '“Say: I believe in Allah, and then remain steadfast and firm.”',
    reference: 'Sahih Muslim (38)'
  },
  {
    id: 24,
    type: 'ayah',
    category: 'Tranquility',
    arabic: 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَّعَ إِيمَانِهِمْ',
    english: '“It is He who sent down tranquility into the hearts of the believers that they would increase in faith along with their [present] faith.”',
    reference: 'Surah Al-Fath (48:4)'
  },
  {
    id: 25,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'عَلَيْكُمْ بِقِيَامِ اللَّيْلِ فَإِنَّهُ دَأْبُ الصَّالِحِينَ قَبْلَكُمْ',
    english: '“Hold fast to the night prayer (Tahajjud), for it was the habit of the righteous before you and a means of drawing near to your Lord.”',
    reference: 'Jami\' at-Tirmidhi (3549)'
  },
  {
    id: 26,
    type: 'ayah',
    category: 'Patience',
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    english: '“Indeed, Allah is with the patient.”',
    reference: 'Surah Al-Baqarah (2:153)'
  },
  {
    id: 27,
    type: 'hadith',
    category: 'Forgiveness',
    arabic: 'التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لَا ذَنْبَ لَهُ',
    english: '“The one who repents from sin is like one who has no sin at all.”',
    reference: 'Sunan Ibn Majah (4250)'
  },
  {
    id: 28,
    type: 'ayah',
    category: 'Quran',
    arabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
    english: '“And We send down of the Quran that which is healing and mercy for the believers.”',
    reference: 'Surah Al-Isra (17:82)'
  },
  {
    id: 29,
    type: 'hadith',
    category: 'Gratitude',
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ',
    english: '“Purity is half of faith, and Alhamdulillah (praise be to Allah) fills the balance on the Day of Judgment.”',
    reference: 'Sahih Muslim (223)'
  },
  {
    id: 30,
    type: 'ayah',
    category: 'Tawakkul',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    english: '“Sufficient for us is Allah, and [He is] the best Disposer of affairs.”',
    reference: 'Surah Ali \'Imran (3:173)'
  },

  // 31-40: SUPREME SUPPLICATIONS & DIVINE COMPASSION
  {
    id: 31,
    type: 'hadith',
    category: 'Tranquility',
    arabic: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
    english: '“The example of the one who remembers his Lord compared to the one who does not is like that of the living and the dead.”',
    reference: 'Sahih al-Bukhari (6407)'
  },
  {
    id: 32,
    type: 'ayah',
    category: 'Salah & Prayer',
    arabic: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ ۗ وَلَذِكْرُ اللَّهِ أَكْبَرُ',
    english: '“Indeed, prayer prevents immorality and wrongdoing, and the remembrance of Allah is greater.”',
    reference: 'Surah Al-\'Ankabut (29:45)'
  },
  {
    id: 33,
    type: 'hadith',
    category: 'Patience',
    arabic: 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلا وَصَبٍ وَلا هَمٍّ وَلا حُزْنٍ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
    english: '“No fatigue, illness, worry, sorrow, or harm afflicts a Muslim, even the prick of a thorn, except that Allah expiates some of his sins because of it.”',
    reference: 'Sahih al-Bukhari (5641), Sahih Muslim (2573)'
  },
  {
    id: 34,
    type: 'ayah',
    category: 'Forgiveness',
    arabic: 'وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ',
    english: '“And seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful.”',
    reference: 'Surah Al-Muzzammil (73:20)'
  },
  {
    id: 35,
    type: 'hadith',
    category: 'Quran',
    arabic: 'الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ',
    english: '“The one who recites the Quran proficiently will be with the noble, obedient angels in the hereafter.”',
    reference: 'Sahih al-Bukhari (4937), Sahih Muslim (798)'
  },
  {
    id: 36,
    type: 'ayah',
    category: 'Tawakkul',
    arabic: 'إِن يَنصُرْكُمُ اللَّهُ فَلَا غَالِبَ لَكُمْ',
    english: '“If Allah should aid you, no one can overcome you.”',
    reference: 'Surah Ali \'Imran (3:160)'
  },
  {
    id: 37,
    type: 'hadith',
    category: 'Salah & Prayer',
    arabic: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلَاتُهُ',
    english: '“The first matter that the slave will be brought to account for on the Day of Judgment is his prayer.”',
    reference: 'Sunan an-Nasa\'i (465), Jami\' at-Tirmidhi (413)'
  },
  {
    id: 38,
    type: 'ayah',
    category: 'Tranquility',
    arabic: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
    english: '“Peace it is until the emergence of dawn.”',
    reference: 'Surah Al-Qadr (97:5)'
  },
  {
    id: 39,
    type: 'hadith',
    category: 'Steadfastness',
    arabic: 'سَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا',
    english: '“Adopt a moderate course, aim for steadfastness, and be of good cheer!”',
    reference: 'Sahih al-Bukhari (6463), Sahih Muslim (2818)'
  },
  {
    id: 40,
    type: 'ayah',
    category: 'Gratitude',
    arabic: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا ۗ إِنَّ اللَّهَ لَغَفُورٌ رَّحِيمٌ',
    english: '“And if you should count the favors of Allah, you could not enumerate them. Indeed, Allah is Forgiving and Merciful.”',
    reference: 'Surah An-Nahl (16:18)'
  }
];
