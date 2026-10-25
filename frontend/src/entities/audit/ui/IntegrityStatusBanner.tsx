import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export interface IntegrityStatusBannerProps {
  isVerified: boolean;
  message: string;
  tamperedIndex?: number | null;
}

export function IntegrityStatusBanner({ isVerified, message, tamperedIndex }: IntegrityStatusBannerProps) {
  if (isVerified) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.15)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-live)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <ShieldCheck size={28} />
        </div>
        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--status-live)', margin: '0 0 0.25rem 0' }}>
            Auditoria Concluída: Histórico 100% Íntegro
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, opacity: 0.9 }}>
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderColor: 'var(--danger)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.25)'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--danger)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <ShieldAlert size={28} />
      </div>
      <div>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--danger)', margin: '0 0 0.25rem 0' }}>
          ALERTA: Violação de Integridade Detectada {tamperedIndex ? `(Lance #${tamperedIndex})` : ''}
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, opacity: 0.9 }}>
          {message}
        </p>
      </div>
    </div>
  );
}
