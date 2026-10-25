import React, { useState } from 'react';
import { ReceiptItem } from '../types';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { formatBRL, formatDateBR } from '@/shared/lib/formatters';
import { Award, Share2, Check, ExternalLink } from 'lucide-react';

export interface ReceiptCardProps {
  item: ReceiptItem;
  onOpenPublicLink?: (token: string) => void;
}

export function ReceiptCard({ item, onOpenPublicLink }: ReceiptCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/receipts/share/${item.receipt.shareToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Card style={{ borderColor: 'rgba(245, 158, 11, 0.3)', boxShadow: '0 0 15px rgba(245, 158, 11, 0.1)' }}>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        {item.lot?.imageUrl && (
          <img
            src={item.lot.imageUrl}
            alt={item.lot.title}
            style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Award size={18} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
              Lote Arrematado com Sucesso!
            </span>
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            {item.lot?.title || 'Lote Arrematado'}
          </h4>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Valor Final:</span>
              <strong style={{ fontSize: '1rem', color: 'var(--status-live)' }}>{formatBRL(item.receipt.finalAmount)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Data do Arremate:</span>
              <span>{formatDateBR(item.receipt.createdAt)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={handleCopyLink}>
            {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
            {copied ? 'Link Copiado!' : 'Copiar Link'}
          </Button>
          {onOpenPublicLink && (
            <Button variant="outline" size="sm" onClick={() => onOpenPublicLink(item.receipt.shareToken)}>
              <ExternalLink size={14} />
              Ver Comprovante
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
