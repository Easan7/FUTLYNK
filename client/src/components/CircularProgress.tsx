/**
 * Circular Progress Component - Inspired by WHOOP app
 * Clean, minimal circular progress indicator
 */

interface CircularProgressProps {
  value: number; // 0-100
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function CircularProgress({
  value,
  max,
  size = 80,
  strokeWidth = 6,
  color = "#39ff14",
  label,
}: CircularProgressProps) {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white">
          {value}/{max}
        </span>
        {label && (
          <span className="text-[10px] uppercase text-gray-500 tracking-wide">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
