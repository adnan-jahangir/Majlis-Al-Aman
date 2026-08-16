import express from 'express';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab, Qibla } from 'adhan';
import { format } from 'date-fns';
const router = express.Router();

const METHOD_MAP = {
  'MWL': CalculationMethod.MuslimWorldLeague(),
  'ISNA': CalculationMethod.NorthAmerica(),
  'Egypt': CalculationMethod.Egyptian(),
  'Makkah': CalculationMethod.UmmAlQura(),
  'Karachi': CalculationMethod.Karachi(),
  'Tehran': CalculationMethod.Tehran(),
  'Dubai': CalculationMethod.Dubai(),
  'Qatar': CalculationMethod.Qatar(),
  'Kuwait': CalculationMethod.Kuwait(),
  'Singapore': CalculationMethod.Singapore(),
  'Turkey': CalculationMethod.Turkey()
};

router.get('/', (req, res) => {
  try {
    const latitude = parseFloat(req.query.latitude || '40.7128'); // default New York
    const longitude = parseFloat(req.query.longitude || '-74.0060');
    const dateStr = req.query.date; // Optional yyyy-MM-dd
    const methodKey = req.query.method || 'ISNA';
    const madhabKey = req.query.madhab || 'Standard';

    const coordinates = new Coordinates(latitude, longitude);
    const date = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();

    const params = METHOD_MAP[methodKey] || CalculationMethod.NorthAmerica();
    if (madhabKey.toLowerCase() === 'hanafi') {
      params.madhab = Madhab.Hanafi;
    } else {
      params.madhab = Madhab.Shafi;
    }

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const qiblaDirection = Math.round(Qibla(coordinates));

    const formattedTimes = {
      Fajr: format(prayerTimes.fajr, 'hh:mm a'),
      Sunrise: format(prayerTimes.sunrise, 'hh:mm a'),
      Dhuhr: format(prayerTimes.dhuhr, 'hh:mm a'),
      Asr: format(prayerTimes.asr, 'hh:mm a'),
      Maghrib: format(prayerTimes.maghrib, 'hh:mm a'),
      Isha: format(prayerTimes.isha, 'hh:mm a'),
    };

    const rawTimes = {
      Fajr: prayerTimes.fajr,
      Sunrise: prayerTimes.sunrise,
      Dhuhr: prayerTimes.dhuhr,
      Asr: prayerTimes.asr,
      Maghrib: prayerTimes.maghrib,
      Isha: prayerTimes.isha,
    };

    // Calculate current and next prayer
    const currentPrayerName = prayerTimes.currentPrayer();
    const nextPrayerName = prayerTimes.nextPrayer();
    const nextPrayerTime = prayerTimes.timeForPrayer(nextPrayerName);

    let nextPrayerObj = null;
    if (nextPrayerName && nextPrayerName !== 'none' && nextPrayerTime) {
      nextPrayerObj = {
        name: nextPrayerName.charAt(0).toUpperCase() + nextPrayerName.slice(1),
        time: format(nextPrayerTime, 'hh:mm a'),
        rawTime: nextPrayerTime,
        remainingMs: Math.max(0, nextPrayerTime.getTime() - new Date().getTime())
      };
    }

    res.json({
      date: format(date, 'yyyy-MM-dd'),
      coordinates: { latitude, longitude },
      method: methodKey,
      madhab: madhabKey,
      times: formattedTimes,
      rawTimes,
      currentPrayer: currentPrayerName ? (currentPrayerName.charAt(0).toUpperCase() + currentPrayerName.slice(1)) : 'Isha',
      nextPrayer: nextPrayerObj,
      qiblaDirection
    });
  } catch (error) {
    console.error('Prayer times calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate prayer times' });
  }
});

export default router;
