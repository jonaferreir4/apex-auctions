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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          backgroundColor: 'var(--bg-input)',
          padding: '0.4rem 0.875rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          cursor: onOpenDeposit ? 'pointer' : 'default',
          transition: 'all var(--transition-fast)'
        }}
      >
        <Wallet size={16} color="var(--primary)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {formatBRL(balance.availableBalance)}
        </span>
        {balance.committedBalance > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (retido: {formatBRL(balance.committedBalance)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        width: '100%'
      }}
    >
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Saldo Total</span>
          <Wallet size={18} color="var(--primary)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatBRL(balance.totalBalance)}</div>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Saldo Comprometido</span>
          <Lock size={18} color="var(--accent-gold)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          {formatBRL(balance.committedBalance)}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Saldo Disponível</span>
          <CheckCircle2 size={18} color="var(--status-live)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-live)' }}>
          {formatBRL(balance.availableBalance)}
        </div>
      </div>
    </div>
  );
}
