import React from 'react';
import { Bid } from '../types';
import { formatBRL, formatDateBR, truncateHash } from '@/shared/lib/formatters';
import { ShieldCheck } from 'lucide-react';

export interface BidHistoryListProps {
  bids: Bid[];
  currentUserId?: string;
}

export function BidHistoryList({ bids, currentUserId }: BidHistoryListProps) {
  if (bids.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Nenhum lance registrado até o momento. Seja o primeiro a dar um lance!
      </div>
    );
  }

  const reversedBids = [...bids].reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
      {reversedBids.map((bid, index) => {
        const isLatest = index === 0;
        const isUserBid = currentUserId && (bid.bidderId === currentUserId || bid.bidderId.includes(currentUserId.slice(-4)));

        return (
          <div
            key={bid.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              backgroundColor: isLatest ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-input)',
              border: isLatest ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isLatest ? 'var(--status-live)' : 'var(--bg-secondary)',
                  color: isLatest ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                #{bids.length - index}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{bid.bidderId}</span>
                  {isUserBid && (
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-full)' }}>
                      Você
                    </span>
                  )}
                  {isLatest && (
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--status-live-bg)', color: 'var(--status-live)', border: '1px solid var(--status-live)', borderRadius: 'var(--radius-full)' }}>
                      Líder
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatDateBR(bid.createdAt)}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isLatest ? 'var(--status-live)' : 'var(--text-primary)' }}>
                {formatBRL(bid.amount)}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={12} color="#10b981" />
                <span>{truncateHash(bid.hash, 4)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
