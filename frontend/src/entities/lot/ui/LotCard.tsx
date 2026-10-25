import React from 'react';
import { Lot } from '../types';
import { Card } from '@/shared/ui/Card';
import { LotStatusBadge } from './LotStatusBadge';
import { LotCountdown } from './LotCountdown';
import { formatBRL } from '@/shared/lib/formatters';

export interface LotCardProps {
  lot: Lot;
  onClick?: () => void;
}

export function LotCard({ lot, onClick }: LotCardProps) {
  const displayPrice = lot.currentPrice > 0 ? lot.currentPrice : lot.initialPrice;
  const priceLabel = lot.currentPrice > 0 ? 'Lance Atual' : 'Lance Inicial';

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: lot.status === 'AO_VIVO' ? '1px solid rgba(16, 185, 129, 0.4)' : undefined,
        boxShadow: lot.status === 'AO_VIVO' ? '0 0 20px rgba(16, 185, 129, 0.15)' : undefined
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
        <img
          src={lot.imageUrl}
          alt={lot.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
          <LotStatusBadge status={lot.status} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#fff'
          }}
        >
          {lot.category}
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {lot.title}
          </h4>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {lot.description}
          </p>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{priceLabel}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: lot.status === 'AO_VIVO' ? 'var(--status-live)' : 'var(--text-primary)' }}>
              {formatBRL(displayPrice)}
            </span>
          </div>
          {lot.status === 'AO_VIVO' && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.1rem' }}>Encerra em</span>
              <LotCountdown endTime={lot.endTime} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
