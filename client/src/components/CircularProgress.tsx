import React from 'react';

interface CircularProgressProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  subtitle?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  completed,
  total,
  size = 180,
  strokeWidth = 14,
  subtitle = 'Prayers Completed',
  className = ''
}) => {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800/80 fill-none"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#emeraldGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="fill-none transition-all duration-700 ease-out"
        />
        {/* SVG Gradient */}
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="text-3xl font-bold tracking-tight text-white flex items-baseline gap-1">
          <span>{completed}</span>
          <span className="text-xl font-medium text-emerald-400/80">/ {total}</span>
        </span>
        <span className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</span>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/20">
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
};
