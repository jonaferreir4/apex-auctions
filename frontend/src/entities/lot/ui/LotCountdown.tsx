import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '@/shared/lib/formatters';
import { Clock } from 'lucide-react';

export interface LotCountdownProps {
  endTime: string;
  onExpire?: () => void;
}

export function LotCountdown({ endTime, onExpire }: LotCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = formatTimeRemaining(endTime);
      setTimeLeft(remaining);
      if (remaining.isExpired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const isUrgent = timeLeft.totalSeconds > 0 && timeLeft.totalSeconds <= 120;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold ${
        isUrgent
          ? 'text-red-600 animate-pulse'
          : timeLeft.isExpired
          ? 'text-slate-400'
          : 'text-slate-900 dark:text-slate-100'
      }`}
    >
      <Clock size={14} className={isUrgent ? 'text-red-600' : 'text-current'} />
      <span>{timeLeft.formatted}</span>
      {isUrgent && <span className="text-[10px] text-red-600 font-semibold">(Últimos minutos)</span>}
    </div>
  );
}
