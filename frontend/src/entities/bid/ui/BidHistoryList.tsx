import React from 'react';
import { Bid } from '../types';
import { formatBRL, formatDateBR, truncateHash } from '@/shared/lib/formatters';

export interface BidHistoryListProps {
  bids: Bid[];
  currentUserId?: string;
}

export function BidHistoryList({ bids, currentUserId }: BidHistoryListProps) {
  if (bids.length === 0) {
    return (
      <div className="py-8 px-4 text-center text-slate-400 text-sm">
        Nenhum lance registrado até o momento. Seja o primeiro a dar um lance!
      </div>
    );
  }

  const reversedBids = [...bids].reverse();

  return (
    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
      {reversedBids.map((bid, index) => {
        const isLatest = index === 0;
        const isUserBid = currentUserId && (bid.bidderId === currentUserId || bid.bidderId.includes(currentUserId.slice(-4)));

        return (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
              isLatest
                ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
                : 'bg-transparent border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isLatest
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                #{bids.length - index}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {bid.bidderId}
                  </span>
                  {isUserBid && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded-full font-semibold">
                      Você
                    </span>
                  )}
                  {isLatest && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-full font-bold">
                      Líder
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 block">
                  {formatDateBR(bid.createdAt)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                {formatBRL(bid.amount)}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                #{truncateHash(bid.hash, 4)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
