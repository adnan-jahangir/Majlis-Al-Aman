import React, { useState, useEffect } from 'react';
import { X, Compass, MapPin, Navigation, Sparkles, RotateCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QiblaModalProps {
  isOpen: boolean;
  onClose: () => void;
  qiblaDegree?: number;
  city?: string;
  country?: string;
}

// Kaaba Coordinates (Mecca, Saudi Arabia)
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

// Convert degrees to radians
const toRad = (deg: number) => (deg * Math.PI) / 180;
// Convert radians to degrees
const toDeg = (rad: number) => (rad * 180) / Math.PI;

// Calculate exact Great Circle Qibla bearing from True North
const calculateQiblaBearing = (lat: number, lng: number): number => {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qibla = toDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;
  return Math.round(qibla);
};

// Calculate distance to Kaaba in kilometers
const calculateKaabaDistance = (lat: number, lng: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(KAABA_LAT - lat);
  const dLng = toRad(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Get cardinal direction name
const getCompassDirectionName = (degree: number): string => {
  const directions = [
    'North', 'North-North-East', 'North-East', 'East-North-East',
    'East', 'East-South-East', 'South-East', 'South-South-East',
    'South', 'South-South-West', 'South-West', 'West-South-West',
    'West', 'West-North-West', 'North-West', 'North-North-West'
  ];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

export const QiblaModal: React.FC<QiblaModalProps> = ({
  isOpen,
  onClose,
  qiblaDegree: propDegree,
  city: propCity,
  country: propCountry
}) => {
  const { settings } = useAuth();
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  const lat = settings?.latitude ?? 23.8103;
  const lng = settings?.longitude ?? 90.4125;
  const displayCity = propCity || settings?.location_city || 'Dhaka';
  const displayCountry = propCountry || settings?.location_country || 'Bangladesh';

  // Exact calculated Qibla bearing based on current coordinates
  const qiblaAngle = propDegree !== undefined ? propDegree : calculateQiblaBearing(lat, lng);
  const distanceKm = calculateKaabaDistance(lat, lng);
  const directionName = getCompassDirectionName(qiblaAngle);

  // Device orientation / physical compass sensor support on mobile
  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compass = (e as any).webkitCompassHeading;
      if (compass === undefined && e.alpha !== null) {
        compass = 360 - e.alpha;
      }
      if (compass !== undefined && compass !== null) {
        setDeviceHeading(Math.round(compass));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Relative angle to point needle if compass sensor is active
  const needleRotation = deviceHeading !== null ? (qiblaAngle - deviceHeading + 360) % 360 : qiblaAngle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/10 p-6 sm:p-7 shadow-2xl shadow-emerald-950/50 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft background ambient glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Qibla Direction (قبلة)</h3>
              <p className="text-[10px] text-slate-400 font-cinzel">Holy Kaaba Direction</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location & GPS Info */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 w-fit mx-auto">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">{displayCity}, {displayCountry}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 text-[11px] font-mono">{lat}°, {lng}°</span>
        </div>

        {/* Compass Visual Representation */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border-2 border-slate-700/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900 relative flex items-center justify-center shadow-2xl ring-1 ring-white/5">
            {/* Degree Tick Ring Marks */}
            <div className="absolute inset-2 rounded-full border border-dashed border-slate-800/80 pointer-events-none" />

            {/* Cardinal Points */}
            <span className="absolute top-2.5 font-extrabold text-xs text-rose-400 tracking-wider font-mono">N (0°)</span>
            <span className="absolute bottom-2.5 font-bold text-xs text-slate-400 tracking-wider font-mono">S (180°)</span>
            <span className="absolute right-3 font-bold text-xs text-slate-400 tracking-wider font-mono">E (90°)</span>
            <span className="absolute left-3 font-bold text-xs text-slate-400 tracking-wider font-mono">W (270°)</span>

            {/* Rotating Qibla Needle */}
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-700 ease-out pointer-events-none"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              {/* Kaaba indicator on needle tip */}
              <div className="absolute top-4 flex flex-col items-center">
                <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-xl border-2 border-slate-950 shadow-xl shadow-amber-500/50 flex items-center justify-center text-sm font-bold animate-bounce">
                  🕋
                </div>
                <div className="w-1 h-20 bg-gradient-to-b from-amber-400 via-emerald-400 to-transparent rounded-full mt-1" />
              </div>
            </div>

            {/* Center Dial Display */}
            <div className="w-20 h-20 rounded-full bg-slate-900/95 border-2 border-emerald-500/40 flex flex-col items-center justify-center shadow-2xl z-10">
              <span className="text-base font-black text-emerald-300 font-mono">{qiblaAngle}°</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Qibla</span>
            </div>
          </div>
        </div>

        {/* Direction & Distance Details */}
        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <p className="text-slate-200">
              Turn towards <strong className="text-emerald-300 font-bold">{qiblaAngle}° {directionName}</strong> to face the Holy Kaaba.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>Distance to Holy Mecca:</span>
            <strong className="text-amber-300 font-mono font-semibold">{distanceKm.toLocaleString()} km</strong>
          </div>

          {deviceHeading !== null && (
            <p className="text-[10px] text-emerald-400 font-semibold animate-pulse">
              🧭 Live compass heading detected: {deviceHeading}°
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
