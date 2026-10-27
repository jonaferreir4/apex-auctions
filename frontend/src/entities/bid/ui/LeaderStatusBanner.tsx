import React from 'react';
import { Trophy, AlertCircle, ArrowUpCircle } from 'lucide-react';
import { formatBRL } from '@/shared/lib/formatters';

export interface LeaderStatusBannerProps {
  isLeader: boolean;
  hasBidInLot: boolean;
  minNextBid: number;
}

export function LeaderStatusBanner({ isLeader, hasBidInLot, minNextBid }: LeaderStatusBannerProps) {
  if (!hasBidInLot) {
    return (
      <div className="flex items-center gap-2.5 p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-md text-slate-800 dark:text-slate-200 text-xs">
        <ArrowUpCircle size={18} className="text-blue-600 shrink-0" />
        <span>
          Você ainda não deu lances neste lote. O próximo lance mínimo é de <strong>{formatBRL(minNextBid)}</strong>.
        </span>
      </div>
    );
  }

  if (isLeader) {
    return (
      <div className="flex items-center gap-3 p-3 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-md text-slate-900 dark:text-slate-100">
        <Trophy size={18} className="text-blue-600 shrink-0" />
        <div>
          <strong className="text-sm block text-blue-700 dark:text-blue-400">
            Você é o maior lance atual!
          </strong>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Seu saldo correspondente está em custódia até o encerramento do lote.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md text-red-600 dark:text-red-400">
      <AlertCircle size={20} className="text-red-600 shrink-0" />
      <div>
        <strong className="text-sm block text-red-600 dark:text-red-400">
          Seu lance foi superado!
        </strong>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Seu saldo anterior foi estornado para sua carteira. Você pode cobrir a qualquer momento!
        </span>
      </div>
    </div>
  );
}
