import React from 'react';
import { User } from '../types';
import { Badge } from '@/shared/ui/Badge';

export interface UserBadgeProps {
  user: User;
}

export function UserBadge({ user }: UserBadgeProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: user.role === 'LEILOEIRO' ? 'var(--accent-gold)' : 'var(--primary)',
          color: '#ffffff',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          boxShadow: user.role === 'LEILOEIRO' ? '0 0 10px var(--accent-gold-glow)' : 'var(--shadow-glow)'
        }}
      >
        {initial}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
        <Badge
          variant={user.role === 'LEILOEIRO' ? 'warning' : 'info'}
          style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', width: 'fit-content' }}
        >
          {user.role}
        </Badge>
      </div>
    </div>
  );
}
