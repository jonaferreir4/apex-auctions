import React from 'react';
import { Lot } from '../types';
import { LotStatusBadge } from './LotStatusBadge';
import { LotCountdown } from './LotCountdown';
import { formatBRL } from '@/shared/lib/formatters';
import { ArrowRight } from 'lucide-react';

export interface LotCardProps {
  lot: Lot;
  onClick?: () => void;
}

export function LotCard({ lot, onClick }: LotCardProps) {
  const displayPrice = lot.currentPrice > 0 ? lot.currentPrice : lot.initialPrice;
  const priceLabel = lot.currentPrice > 0 ? 'LICITAÇÃO ATUAL' : 'LANCE INICIAL';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden flex flex-col cursor-pointer transition-all duration-150 group"
    >
      <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={lot.imageUrl}
          alt={lot.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5">
          <LotStatusBadge status={lot.status} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug line-clamp-2">
            {lot.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 m-0 leading-relaxed line-clamp-2">
            {lot.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold tracking-wider">
                {priceLabel}
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                {formatBRL(displayPrice)}
              </span>
            </div>

            <div className="text-right">
              {lot.status === 'AO_VIVO' ? (
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Restante</span>
                  <LotCountdown endTime={lot.endTime} />
                </div>
              ) : lot.status === 'AGENDADO' ? (
                <span className="text-xs text-slate-500 font-medium">
                  Em breve
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Encerrado
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700">
            <span>{lot.status === 'AO_VIVO' ? 'Participar do Pregão' : 'Ver Detalhes do Lote'}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
