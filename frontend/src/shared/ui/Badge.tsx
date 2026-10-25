import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'scheduled' | 'closed' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'info', className = '', style }: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    live: {
      backgroundColor: 'var(--status-live-bg)',
      color: 'var(--status-live)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    scheduled: {
      backgroundColor: 'var(--status-scheduled-bg)',
      color: 'var(--status-scheduled)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    closed: {
      backgroundColor: 'var(--status-closed-bg)',
      color: 'var(--status-closed)',
      borderColor: 'rgba(107, 114, 128, 0.3)'
    },
    success: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      color: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      color: '#f59e0b',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    info: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: '#3b82f6',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    }
  };

  return (
    <span
      className={`badge ${variant === 'live' ? 'badge-live' : ''} ${className}`}
      style={{
        border: '1px solid',
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </span>
  );
}
