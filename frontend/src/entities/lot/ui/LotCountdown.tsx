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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        color: isUrgent ? 'var(--danger)' : timeLeft.isExpired ? 'var(--text-muted)' : 'var(--text-primary)',
        animation: isUrgent ? 'pulse 1s infinite' : 'none'
      }}
    >
      <Clock size={15} color={isUrgent ? 'var(--danger)' : 'currentColor'} />
      <span>{timeLeft.formatted}</span>
      {isUrgent && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>(+2m sniper)</span>}
    </div>
  );
}
