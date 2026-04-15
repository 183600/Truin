import React from 'react';

interface Props {
  value: number; // -1 to 1 normalized, or 0 to 1
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  color?: string;
  bipolar?: boolean;
  showValue?: boolean;
}

export const ProgressBar: React.FC<Props> = ({
  value,
  label,
  leftLabel,
  rightLabel,
  color = 'bg-indigo-500',
  bipolar = false,
  showValue = true,
}) => {
  if (bipolar) {
    // value is -1 to 1
    const pct = Math.abs(value) * 50;
    const isPositive = value >= 0;
    return (
      <div className="w-full">
        {label && <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>}
        <div className="flex items-center gap-2">
          {leftLabel && <span className="text-xs text-gray-500 w-16 text-right shrink-0">{leftLabel}</span>}
          <div className="flex-1 relative h-4 bg-gray-100 rounded-full overflow-hidden flex">
            {/* Left half */}
            <div className="w-1/2 flex justify-end">
              {!isPositive && (
                <div
                  className="h-full bg-purple-400 rounded-l-full"
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>
            {/* Center line */}
            <div className="w-px bg-gray-400 z-10" />
            {/* Right half */}
            <div className="w-1/2 flex justify-start">
              {isPositive && (
                <div
                  className={`h-full ${color} rounded-r-full`}
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>
          </div>
          {rightLabel && <span className="text-xs text-gray-500 w-16 shrink-0">{rightLabel}</span>}
          {showValue && (
            <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">
              {value > 0 ? '+' : ''}{(value * 100).toFixed(0)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // value is 0 to 1
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div className="w-full">
      {label && <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>}
      <div className="flex items-center gap-2">
        {leftLabel && <span className="text-xs text-gray-500 w-16 text-right shrink-0">{leftLabel}</span>}
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {showValue && (
          <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">
            {pct.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};
