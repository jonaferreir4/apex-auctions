import React from 'react';
import { User } from '../types';
import { Badge } from '@/shared/ui/Badge';

export interface UserBadgeProps {
  user: User;
}

export function UserBadge({ user }: UserBadgeProps) {
  const initial = user.name.charAt(0).toUpperCase();
  const roleLabel = user.role === 'LEILOEIRO' ? 'Leiloeiro' : 'Licitante';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs ${
          user.role === 'LEILOEIRO' ? 'bg-amber-600' : 'bg-blue-600'
        }`}
      >
        {initial}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
        <Badge
          variant={user.role === 'LEILOEIRO' ? 'warning' : 'info'}
          className="text-[10px] py-0 px-1.5 w-fit mt-0.5"
        >
          {roleLabel}
        </Badge>
      </div>
    </div>
  );
}
