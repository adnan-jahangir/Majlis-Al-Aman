export interface AdhkarItem {
  id: string;
  category: 'morning' | 'evening';
  title: string;
  arabic: string;
  banglaPronunciation: string;
  transliteration: string;
  english: string;
  benefit: string;
  count: number;
  reference: string;
}

export const MORNING_EVENING_ADHKAR: AdhkarItem[] = [
  // ==========================================
  // MORNING ADHKAR (সকালের যিকির ও দু'আ)
  // ==========================================
  {
    id: 'm1',
    category: 'morning',
    title: 'Ayat al-Kursi (Verse of the Throne)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    banglaPronunciation: 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূম, লা তা\'খুযুহু সিনাতুঁও ওয়ালা নাওম, লাহু মা ফিস-সামাওয়াতি ওয়ামা ফিল আরদ্ব, মান যাল্লাযী ইয়্যাশফা\'উ \'ইন্দাহু ইল্লা বি\'ইযনিহ, ইয়া\'লামু মা বাইনা আইদীহিম ওয়ামা খালফাহুম, ওয়ালা ইউহীতূনা বিশাইইম মিন \'ইলমিহী ইল্লা বিমা শা-আ, ওয়াসি\'আ কুরসিয়্যুহুস সামাওয়াতি ওয়াল আরদ্ব, ওয়ালা ইয়াউদুহু হিফযুহুমা, ওয়াহুওয়াল \'আলিয়্যুল \'আযীম।',
    transliteration: 'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta\'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay\'im-min \'ilmihi illa bima sha\'a. Wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'uduhu hifzuhuma, wa Huwal-\'Aliyyul-\'Azim.',
    english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    benefit: 'Whoever recites this when he rises in the morning will be protected from all evil, harm, and jinn until evening.',
    count: 1,
    reference: 'Surah Al-Baqarah (2:255) / Al-Hakim (1/562)'
  },
  {
    id: 'm2',
    category: 'morning',
    title: 'Sayyidul Istighfar (The Master Supplication for Forgiveness)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    banglaPronunciation: 'আল্লাহুম্মা আনতা রববী লা ইলাহা ইল্লা আনতা, খালাক্বতানী ওয়া আনা \'আবদুকা, ওয়া আনা \'আলা \'আহদিকা ওয়া ওয়া\'দিকা মাসতাত্বা\'তু, আ\'ঊযু বিকা মিন শাররি মা সনা\'তু, আবূউ লাকা বিনি\'মাতিকা \'আলাইয়্যা, ওয়া আবূউ লাকা বিযাম্বী ফাগফির লী, ফাইন্নাহু লা ইয়াগফিরুয যুনূবা ইল্লা আনতা।',
    transliteration: 'Allahumma Anta Rabbi, la ilaha illa Anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastata\'tu, a\'udhu bika min sharri ma sana\'tu, abu\'u laka bi-ni\'matika \'alayya, wa abu\'u laka bi-dhambi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Anta.',
    english: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge before You Your favor upon me, and I acknowledge my sin, so forgive me, for indeed none forgives sins except You.',
    benefit: 'Whoever recites this with firm conviction during the day and dies that day before evening will be among the people of Paradise.',
    count: 1,
    reference: 'Sahih al-Bukhari (6306)'
  },
  {
    id: 'm3',
    category: 'morning',
    title: 'Asbahna wa Asbahal Mulku Lillah (Morning Entry Supplication)',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    banglaPronunciation: 'আসবাহনা ওয়া আসবাহাল মুলকু লিল্লাহ, ওয়াল হামদু লিল্লাহ, লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহ, লাহুল মুলকু ওয়া লাহুল হামদু ওয়াহুওয়া \'আলা কুল্লি শাইয়িন ক্বাদীর। রব্বি আসআলুকা খাইরা মা ফী হাযাল ইয়াওমি ওয়া খাইরা মা বা\'দাহ, ওয়া আ\'ঊযু বিকা মিন শাররি মা ফী হাযাল ইয়াওমি ওয়া শাররি মা বা\'দাহ, রব্বি আ\'ঊযু বিকা মিনাল কাসালি ওয়া সূইল কিবার, রব্বি আ\'ঊযু বিকা মিন \'আযাবিন ফিন-নারি ওয়া \'আযাবিন ফিল ক্বাবর।',
    transliteration: 'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadir. Rabbi as\'aluka khayra ma fi hadhal-yawmi wa khayra ma ba\'dah, wa a\'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba\'dah. Rabbi a\'udhu bika minal-kasali wa su\'il-kibar, Rabbi a\'udhu bika min \'adhabin fin-nari wa \'adhabin fil-qabr.',
    english: 'We have entered the morning and the kingdom belongs to Allah, and all praise is due to Allah. There is no deity except Allah alone, without partner. To Him belongs the dominion and to Him belongs all praise, and He is over all things competent. My Lord, I ask You for the good of what is in this day and the good of what comes after it, and I seek refuge in You from the evil of what is in this day and the evil of what comes after it. My Lord, I seek refuge in You from laziness and the trials of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.',
    benefit: 'Seeking complete blessing, protection from laziness, grave punishment, and hellfire for the entire day.',
    count: 1,
    reference: 'Sahih Muslim (2723)'
  },
  {
    id: 'm4',
    category: 'morning',
    title: 'Surah Al-Ikhlas (The Purity of Faith - 3 Times)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    banglaPronunciation: 'বিসমিল্লাহির রাহমানির রাহীম।\n১. কুল হুওয়াল্লাহু আহাদ।\n২. আল্লাহুস সামাদ।\n৩. লাম ইয়ালিদ ওয়া লাম ইউলাদ।\n৪. ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ।',
    transliteration: 'Bismillahir-Rahmanir-Rahim.\n1. Qul Huwallahu Ahad.\n2. Allahus-Samad.\n3. Lam yalid wa lam yulad.\n4. Wa lam yakul-lahu kufuwan ahad.',
    english: 'In the Name of Allah, the Entirely Merciful, the Especially Merciful.\n1. Say, "He is Allah, [who is] One,\n2. Allah, the Eternal Refuge.\n3. He neither begets nor is born,\n4. Nor is there to Him any equivalent."',
    benefit: 'Reciting Surah Al-Ikhlas 3 times in the morning and evening equals reciting the entire Quran and protects from all evil.',
    count: 3,
    reference: 'Sunan Abi Dawud (5082), Jami\' at-Tirmidhi (3575)'
  },
  {
    id: 'm5',
    category: 'morning',
    title: 'Surah Al-Falaq (The Daybreak - 3 Times)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    banglaPronunciation: 'বিসমিল্লাহির রাহমানির রাহীম।\n১. কুল আ\'ঊযু বিরব্বিল ফালাক্ব।\n২. মিন শাররি মা খালাক্ব।\n৩. ওয়া মিন শাররি গাসিক্বিন ইযা ওয়াক্বাব।\n৪. ওয়া মিন শাররিন নাফ্ফা-সা-তি ফিল \'উক্বাদ।\n৫. ওয়া মিন শাররি হা-সিদিন ইযা হাসাদ।',
    transliteration: 'Bismillahir-Rahmanir-Rahim.\n1. Qul A\'udhu bi Rabbil-Falaq.\n2. Min sharri ma khalaq.\n3. Wa min sharri ghasiqin idha waqab.\n4. Wa min sharrin-naffathati fil-\'uqad.\n5. Wa min sharri hasidin idha hasad.',
    english: 'In the Name of Allah, the Entirely Merciful, the Especially Merciful.\n1. Say, "I seek refuge in the Lord of daybreak,\n2. From the evil of that which He created,\n3. And from the evil of darkness when it settles,\n4. And from the evil of the blowers in knots,\n5. And from the evil of an envier when he envies."',
    benefit: 'Supreme divine protection against black magic, evil eye, jealousy, and harm.',
    count: 3,
    reference: 'Sunan Abi Dawud (5082), At-Tirmidhi'
  },
  {
    id: 'm6',
    category: 'morning',
    title: 'Surah An-Nas (Mankind - 3 Times)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    banglaPronunciation: 'বিসমিল্লাহির রাহমানির রাহীম।\n১. কুল আ\'ঊযু বিরব্বিন-না-স।\n২. মালিকিন-না-স।\n৩. ইলা-হিন-না-স।\n৪. মিন শাররিল ওয়াসওয়াসিল খান্না-স।\n৫. আল্লাযী ইউওয়াসউিসু ফী সুদূরিন-না-স।\n৬. মিনাল জিন্নাতি ওয়ান-না-স।',
    transliteration: 'Bismillahir-Rahmanir-Rahim.\n1. Qul A\'udhu bi Rabbin-Nas.\n2. Malikin-Nas.\n3. Ilahin-Nas.\n4. Min sharril-waswasil-khannas.\n5. Alladhi yuwaswisu fi sudurin-nas.\n6. Minal-jinnati wan-nas.',
    english: 'In the Name of Allah, the Entirely Merciful, the Especially Merciful.\n1. Say, "I seek refuge in the Lord of mankind,\n2. The Sovereign of mankind,\n3. The God of mankind,\n4. From the evil of the retreating whisperer,\n5. Who whispers into the breasts of mankind,\n6. From among the jinn and mankind."',
    benefit: 'Shield against Satanic whispers, doubts, anxiety, and hidden spiritual harms.',
    count: 3,
    reference: 'Sunan Abi Dawud (5082), At-Tirmidhi'
  },
  {
    id: 'm7',
    category: 'morning',
    title: 'Protection in the Name of Allah (3 Times)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    banglaPronunciation: 'বিসমিল্লাহিল্লাযী লা ইয়াদুররু মা\'আসমিহী শাইউন ফিল আরদ্বি ওয়ালা ফিস-সামা-ই, ওয়াহুওয়াস সামী\'উল \'আলীম।',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Alim.',
    english: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.',
    benefit: 'Whoever recites this 3 times in the morning will not be harmed by anything that entire day.',
    count: 3,
    reference: 'Sunan Abi Dawud (5088), At-Tirmidhi (3388)'
  },
  {
    id: 'm8',
    category: 'morning',
    title: 'Satisfaction with Allah, Islam, and the Prophet ﷺ (3 Times)',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    banglaPronunciation: 'রাদীতু বিল্লাহি রববাওঁ, ওয়া বিল ইসলামি দ্বীনাওঁ, ওয়া বি মুহাম্মাদিন সাল্লাল্লাহু \'আলাইহি ওয়া সাল্লামা নাবিয়্যা।',
    transliteration: 'Radheetu billahi Rabban, wa bil-Islami deenan, wa bi-Muhammadin sallallahu \'alayhi wa sallama Nabiyya.',
    english: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
    benefit: 'Allah has promised that whoever recites this 3 times every morning will be granted complete satisfaction on the Day of Resurrection.',
    count: 3,
    reference: 'Sunan Abi Dawud (5072), Musnad Ahmad'
  },
  {
    id: 'm9',
    category: 'morning',
    title: 'Glorification and Praise of Allah (100 Times)',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    banglaPronunciation: 'সুবহানাল্লাহি ওয়া বিহামদিহী।',
    transliteration: 'Subhanallahi wa bihamdihi.',
    english: 'Glory is to Allah and praise is to Him.',
    benefit: 'Whoever recites this 100 times in the morning will have all his sins forgiven even if they are like the foam of the sea.',
    count: 100,
    reference: 'Sahih Muslim (2691), Sahih al-Bukhari (6405)'
  },

  // ==========================================
  // EVENING ADHKAR (সন্ধ্যার যিকির ও দু'আ)
  // ==========================================
  {
    id: 'e1',
    category: 'evening',
    title: 'Ayat al-Kursi (Evening Protection)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    banglaPronunciation: 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূম, লা তা\'খুযুহু সিনাতুঁও ওয়ালা নাওম, লাহু মা ফিস-সামাওয়াতি ওয়ামা ফিল আরদ্ব, মান যাল্লাযী ইয়্যাশফা\'উ \'ইন্দাহু ইল্লা বি\'ইযনিহ, ইয়া\'লামু মা বাইনা আইদীহিম ওয়ামা খালফাহুম, ওয়ালা ইউহীতূনা বিশাইইম মিন \'ইলমিহী ইল্লা বিমা শা-আ, ওয়াসি\'আ কুরসিয়্যুহুস সামাওয়াতি ওয়াল আরদ্ব, ওয়ালা ইয়াউদুহু হিফযুহুমা, ওয়াহুওয়াল \'আলিয়্যুল \'আযীম।',
    transliteration: 'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta\'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay\'im-min \'ilmihi illa bima sha\'a. Wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'uduhu hifzuhuma, wa Huwal-\'Aliyyul-\'Azim.',
    english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    benefit: 'Whoever recites this in the evening will remain under Allah\'s direct protection until morning.',
    count: 1,
    reference: 'Surah Al-Baqarah (2:255) / Al-Hakim'
  },
  {
    id: 'e2',
    category: 'evening',
    title: 'Sayyidul Istighfar (Evening Supplication)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    banglaPronunciation: 'আল্লাহুম্মা আনতা রববী লা ইলাহা ইল্লা আনতা, খালাক্বতানী ওয়া আনা \'আবদুকা, ওয়া আনা \'আলা \'আহদিকা ওয়া ওয়া\'দিকা মাসতাত্বা\'তু, আ\'ঊযু বিকা মিন শাররি মা সনা\'তু, আবূউ লাকা বিনি\'মাতিকা \'আলাইয়্যা, ওয়া আবূউ লাকা বিযাম্বী ফাগফির লী, ফাইন্নাহু লা ইয়াগফিরুয যুনূবা ইল্লা আনতা।',
    transliteration: 'Allahumma Anta Rabbi, la ilaha illa Anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastata\'tu, a\'udhu bika min sharri ma sana\'tu, abu\'u laka bi-ni\'matika \'alayya, wa abu\'u laka bi-dhambi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Anta.',
    english: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge before You Your favor upon me, and I acknowledge my sin, so forgive me, for indeed none forgives sins except You.',
    benefit: 'Whoever recites this in the evening with conviction and dies during that night will be among the dwellers of Paradise.',
    count: 1,
    reference: 'Sahih al-Bukhari (6306)'
  },
  {
    id: 'e3',
    category: 'evening',
    title: 'Amseyna wa Amsal Mulku Lillah (Evening Entry Supplication)',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    banglaPronunciation: 'আমসাইনা ওয়া আমসাল মুলকু লিল্লাহ, ওয়াল হামদু লিল্লাহ, লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহ, লাহুল মুলকু ওয়া লাহুল হামদু ওয়াহুওয়া \'আলা কুল্লি শাইয়িন ক্বাদীর। রব্বি আসআলুকা খাইরা মা ফী হাযিহিল লাইলাতি ওয়া খাইরা মা বা\'দাহা, ওয়া আ\'ঊযু বিকা মিন শাররি মা ফী হাযিহিল লাইলাতি ওয়া শাররি মা বা\'দাহা, রব্বি আ\'ঊযু বিকা মিনাল কাসালি ওয়া সূইল কিবার, রব্বি আ\'ঊযু বিকা মিন \'আযাবিন ফিন-নারি ওয়া \'আযাবিন ফিল ক্বাবর।',
    transliteration: 'Amseyna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadir. Rabbi as\'aluka khayra ma fi hadhihil-laylati wa khayra ma ba\'daha, wa a\'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba\'daha. Rabbi a\'udhu bika minal-kasali wa su\'il-kibar, Rabbi a\'udhu bika min \'adhabin fin-nari wa \'adhabin fil-qabr.',
    english: 'We have reached the evening and the kingdom belongs to Allah, and all praise is due to Allah. There is no deity except Allah alone, without partner. To Him belongs the dominion and to Him belongs all praise, and He is over all things competent. My Lord, I ask You for the good of what is in this night and the good of what comes after it, and I seek refuge in You from the evil of what is in this night and the evil of what comes after it. My Lord, I seek refuge in You from laziness and the trials of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.',
    benefit: 'Seeking complete blessing, protection from laziness, grave punishment, and hellfire for the entire night.',
    count: 1,
    reference: 'Sahih Muslim (2723)'
  },
  {
    id: 'e4',
    category: 'evening',
    title: 'Seeking Refuge in Allah\'s Perfect Words (3 Times)',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    banglaPronunciation: 'আ\'ঊযু বিকালিমা-তিল্লা-হিত তা-ম্মা-তি মিন শাররি মা- খালাক্ব।',
    transliteration: 'A\'udhu bi-kalimatil-lahit-tammati min sharri ma khalaq.',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    benefit: 'Whoever recites this 3 times in the evening will not be afflicted by any poisonous sting, snake, scorpion, or harmful creature throughout the night.',
    count: 3,
    reference: 'Sahih Muslim (2709)'
  },
  {
    id: 'e5',
    category: 'evening',
    title: 'Protection in the Name of Allah (3 Times)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    banglaPronunciation: 'বিসমিল্লাহিল্লাযী লা ইয়াদুররু মা\'আসমিহী শাইউন ফিল আরদ্বি ওয়ালা ফিস-সামা-ই, ওয়াহুওয়াস সামী\'উল \'আলীম।',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Alim.',
    english: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.',
    benefit: 'Protection from all sudden afflictions and unexpected calamities throughout the night.',
    count: 3,
    reference: 'Sunan Abi Dawud (5088), At-Tirmidhi'
  },
  {
    id: 'e6',
    category: 'evening',
    title: 'Surah Al-Ikhlas (The Purity of Faith - 3 Times)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    banglaPronunciation: 'বিসমিল্লাহির রাহমানির রাহীম।\n১. কুল হুওয়াল্লাহু আহাদ।\n২. আল্লাহুস সামাদ।\n৩. লাম ইয়ালিদ ওয়া লাম ইউলাদ।\n৪. ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ।',
    transliteration: 'Bismillahir-Rahmanir-Rahim.\n1. Qul Huwallahu Ahad.\n2. Allahus-Samad.\n3. Lam yalid wa lam yulad.\n4. Wa lam yakul-lahu kufuwan ahad.',
    english: 'In the Name of Allah, the Entirely Merciful, the Especially Merciful.\n1. Say, "He is Allah, [who is] One,\n2. Allah, the Eternal Refuge.\n3. He neither begets nor is born,\n4. Nor is there to Him any equivalent."',
    benefit: 'Protects from all evil throughout the night and equals reciting one-third of the Quran per repetition.',
    count: 3,
    reference: 'Sunan Abi Dawud (5082), At-Tirmidhi'
  },
  {
    id: 'e7',
    category: 'evening',
    title: 'Surah Al-Falaq (The Daybreak - 3 Times)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    banglaPronunciation: 'বিসমিল্লাহির রাহমানির রাহীম।\n১. কুল আ\'ঊযু বিরব্বিল ফালাক্ব।\n২. মিন শাররি মা খালাক্ব।\n৩. ওয়া মিন শাররি গাসিক্বিন ইযা ওয়াক্বাব।\n৪. ওয়া মিন শাররিন নাফ্ফা-সা-তি ফিল \'উক্বাদ।\n৫. ওয়া মিন শাররি হা-সিদিন ইযা হাসাদ।',
    transliteration: 'Bismillahir-Rahmanir-Rahim.\n1. Qul A\'udhu bi Rabbil-Falaq.\n2. Min sharri ma khalaq.\n3. Wa min sharri ghasiqin idha waqab.\n4. Wa min sharrin-naffathati fil-\'uqad.\n5. Wa min sharri hasidin idha hasad.',
    english: 'In the Name of Allah, the Entirely Merciful, the Especially Merciful.\n1. Say, "I seek refuge in the Lord of daybreak,\n2. From the evil of that which He created,\n3. And from the evil of darkness when it settles,\n4. And from the evil of the blowers in knots,\n5. And from the evil of an envier when he envies."',
    benefit: 'Complete nightly protection against magic, jealousy, and evil souls.',
    count: 3,
    reference: 'Sunan Abi Dawud (5082), At-Tirmidhi'
  },
  {
    id: 'e8',
    category: 'evening',
    title: 'Surah An-Nas (Mankind - 3 Times)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    banglaPronunciation: 'বিসমিল্লাহির রাহমানির রাহীম।\n১. কুল আ\'ঊযু বিরব্বিন-না-স।\n২. মালিকিন-না-স।\n৩. ইলা-হিন-না-স।\n৪. মিন শাররিল ওয়াসওয়াসিল খান্না-স।\n৫. আল্লাযী ইউওয়াসউিসু ফী সুদূরিন-না-স।\n৬. মিনাল জিন্নাতি ওয়ান-না-স।',
    transliteration: 'Bismillahir-Rahmanir-Rahim.\n1. Qul A\'udhu bi Rabbin-Nas.\n2. Malikin-Nas.\n3. Ilahin-Nas.\n4. Min sharril-waswasil-khannas.\n5. Alladhi yuwaswisu fi sudurin-nas.\n6. Minal-jinnati wan-nas.',
    english: 'In the Name of Allah, the Entirely Merciful, the Especially Merciful.\n1. Say, "I seek refuge in the Lord of mankind,\n2. The Sovereign of mankind,\n3. The God of mankind,\n4. From the evil of the retreating whisperer,\n5. Who whispers into the breasts of mankind,\n6. From among the jinn and mankind."',
    benefit: 'Protects your mind and sleep from night terrors, sleep paralysis, and whispers of Satan.',
    count: 3,
    reference: 'Sunan Abi Dawud (5082), At-Tirmidhi'
  }
];
