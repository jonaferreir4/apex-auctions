import React from 'react';
import { AuditRecordItem } from '../types';
import { formatBRL, formatDateBR } from '@/shared/lib/formatters';
import { Link2, ShieldCheck, ShieldAlert, Database } from 'lucide-react';

export interface AuditChainViewProps {
  records: AuditRecordItem[];
  genesisHash: string;
}

export function AuditChainView({ records, genesisHash }: AuditChainViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-input)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem'
        }}
      >
        <Database size={18} color="var(--primary)" />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block' }}>Bloco Gênese do Lote (Root Hash)</span>
          <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
            {genesisHash}
          </code>
        </div>
      </div>

      {records.map((record) => {
        const isValid = record.isHashValid && record.isChainLinkValid;

        return (
          <div key={record.bidId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ padding: '0.25rem 0', color: 'var(--text-muted)' }}>
              <Link2 size={16} />
            </div>

            <div
              className="glass-panel"
              style={{
                width: '100%',
                padding: '1.25rem',
                borderLeft: `4px solid ${isValid ? 'var(--status-live)' : 'var(--danger)'}`,
                backgroundColor: isValid ? 'var(--bg-card)' : 'rgba(239, 68, 68, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isValid ? 'var(--status-live)' : 'var(--danger)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    #{record.index}
                  </span>
                  <strong style={{ fontSize: '1rem' }}>{record.bidderMasked}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {formatDateBR(record.createdAt)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: isValid ? 'var(--text-primary)' : 'var(--danger)' }}>
                    {formatBRL(record.amount)}
                  </span>
                  {isValid ? <ShieldCheck size={20} color="#10b981" /> : <ShieldAlert size={20} color="#ef4444" />}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Previous Hash: </span>
                  <code style={{ color: record.isChainLinkValid ? 'var(--text-secondary)' : 'var(--danger)' }}>
                    {record.previousHash}
                  </code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Computed Hash: </span>
                  <code style={{ color: record.isHashValid ? 'var(--status-live)' : 'var(--danger)', fontWeight: 600 }}>
                    {record.hash}
                  </code>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
