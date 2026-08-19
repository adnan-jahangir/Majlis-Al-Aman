import { Coordinates, CalculationMethod, PrayerTimes, Madhab, Qibla } from 'adhan';
import { format, addDays } from 'date-fns';
import { CalculatedPrayerTimes } from '../types';

export const METHOD_MAP: Record<string, any> = {
  'Karachi': CalculationMethod.Karachi(),
  'MWL': CalculationMethod.MuslimWorldLeague(),
  'ISNA': CalculationMethod.NorthAmerica(),
  'Egypt': CalculationMethod.Egyptian(),
  'Makkah': CalculationMethod.UmmAlQura(),
  'Tehran': CalculationMethod.Tehran(),
  'Dubai': CalculationMethod.Dubai(),
  'Qatar': CalculationMethod.Qatar(),
  'Kuwait': CalculationMethod.Kuwait(),
  'Singapore': CalculationMethod.Singapore(),
  'Turkey': CalculationMethod.Turkey()
};

/**
 * Calculates 100% accurate, real-time astronomical prayer times using device's local timezone
 */
export const calculateLocalPrayerTimes = (
  latitude: number = 23.8103,
  longitude: number = 90.4125,
  methodKey: string = 'Karachi',
  madhabKey: string = 'Hanafi',
  targetDate: Date = new Date()
): CalculatedPrayerTimes => {
  const coordinates = new Coordinates(latitude, longitude);
  const params = METHOD_MAP[methodKey] || CalculationMethod.Karachi();

  if (madhabKey.toLowerCase() === 'hanafi' || madhabKey.toLowerCase() === 'standard') {
    params.madhab = Madhab.Hanafi;
  } else {
    params.madhab = Madhab.Shafi;
  }

  const prayerTimes = new PrayerTimes(coordinates, targetDate, params);
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
    Fajr: prayerTimes.fajr.toISOString(),
    Sunrise: prayerTimes.sunrise.toISOString(),
    Dhuhr: prayerTimes.dhuhr.toISOString(),
    Asr: prayerTimes.asr.toISOString(),
    Maghrib: prayerTimes.maghrib.toISOString(),
    Isha: prayerTimes.isha.toISOString(),
  };

  const now = new Date();
  const currentPrayerName = prayerTimes.currentPrayer();
  let nextPrayerName = prayerTimes.nextPrayer();
  let nextPrayerTime: Date | null = null;
  let isTomorrow = false;

  if (nextPrayerName && nextPrayerName !== 'none') {
    nextPrayerTime = prayerTimes.timeForPrayer(nextPrayerName);
  } else {
    // If today's Isha has passed, next prayer is Tomorrow's Fajr!
    const tomorrow = addDays(targetDate, 1);
    const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);
    nextPrayerName = 'fajr';
    nextPrayerTime = tomorrowPrayerTimes.fajr;
    isTomorrow = true;
  }

  let nextPrayerObj = null;
  if (nextPrayerTime) {
    const remainingMs = Math.max(0, nextPrayerTime.getTime() - now.getTime());
    nextPrayerObj = {
      name: (nextPrayerName.charAt(0).toUpperCase() + nextPrayerName.slice(1)) + (isTomorrow ? ' (Tomorrow)' : ''),
      time: format(nextPrayerTime, 'hh:mm a'),
      rawTime: nextPrayerTime.toISOString(),
      remainingMs
    };
  }

  return {
    date: format(targetDate, 'yyyy-MM-dd'),
    coordinates: { latitude, longitude },
    method: methodKey,
    madhab: madhabKey,
    times: formattedTimes,
    rawTimes,
    currentPrayer: currentPrayerName && currentPrayerName !== 'none'
      ? (currentPrayerName.charAt(0).toUpperCase() + currentPrayerName.slice(1))
      : 'Isha',
    nextPrayer: nextPrayerObj,
    qiblaDirection
  };
};
