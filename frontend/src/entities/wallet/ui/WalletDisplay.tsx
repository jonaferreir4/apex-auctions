import React from 'react';
import { WalletBalance } from '../types';
import { formatBRL } from '@/shared/lib/formatters';
import { Wallet, Lock, CheckCircle2 } from 'lucide-react';

export interface WalletDisplayProps {
  balance?: WalletBalance | null;
  onOpenDeposit?: () => void;
  compact?: boolean;
}

export function WalletDisplay({ balance, onOpenDeposit, compact = false }: WalletDisplayProps) {
  if (!balance) return null;

  if (compact) {
    return (
      <div
        onClick={onOpenDeposit}
        title="Clique para adicionar saldo simulado"
        className={`flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors ${
          onOpenDeposit ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700' : 'cursor-default'
        }`}
      >
        <Wallet size={15} className="text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {formatBRL(balance.availableBalance)}
        </span>
        {balance.committedBalance > 0 && (
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            (retido: {formatBRL(balance.committedBalance)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saldo Total</span>
          <Wallet size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {formatBRL(balance.totalBalance)}
        </div>
      </div>

      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saldo em Custódia (Lances Ativos)</span>
          <Lock size={18} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
          {formatBRL(balance.committedBalance)}
        </div>
      </div>

      <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Saldo Disponível para Lances</span>
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
          {formatBRL(balance.availableBalance)}
        </div>
      </div>
    </div>
  );
}
