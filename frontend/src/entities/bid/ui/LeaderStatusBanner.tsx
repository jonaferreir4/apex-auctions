import React from 'react';
import { Trophy, AlertCircle, ArrowUpCircle } from 'lucide-react';

export interface LeaderStatusBannerProps {
  isLeader: boolean;
  hasBidInLot: boolean;
  minNextBid: number;
}

export function LeaderStatusBanner({ isLeader, hasBidInLot, minNextBid }: LeaderStatusBannerProps) {
  if (!hasBidInLot) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)'
        }}
      >
        <ArrowUpCircle size={20} color="var(--primary)" />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Você ainda não deu lances neste lote. O próximo lance mínimo é de <strong>R$ {minNextBid.toFixed(2)}</strong>.
        </span>
      </div>
    );
  }

  if (isLeader) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.25rem',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-md)',
          color: '#10b981',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
        }}
      >
        <Trophy size={22} color="#10b981" />
        <div>
          <strong style={{ fontSize: '1rem', display: 'block' }}>Você está ganhando!</strong>
          <span style={{ fontSize: '0.825rem', opacity: 0.9 }}>
            Seu lance é o maior registrado no momento.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1.25rem',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid var(--danger)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--danger)',
        animation: 'pulse 2s infinite'
      }}
    >
      <AlertCircle size={22} color="var(--danger)" />
      <div>
        <strong style={{ fontSize: '1rem', display: 'block' }}>Você foi superado!</strong>
        <span style={{ fontSize: '0.825rem', opacity: 0.9 }}>
          Outro licitante cobriu seu lance. Seu saldo foi liberado para você cobrir!
        </span>
      </div>
    </div>
  );
}
