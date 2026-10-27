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
    <Card className="border border-amber-300 dark:border-amber-800/60 bg-white dark:bg-slate-900 shadow-xs">
      <div className="flex gap-5 items-center flex-wrap">
        {item.lot?.imageUrl && (
          <img
            src={item.lot.imageUrl}
            alt={item.lot.title}
            className="w-20 h-20 rounded-md object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Award size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Lote Arrematado com Sucesso
            </span>
          </div>
          <h4 className="text-base font-bold my-1 text-slate-900 dark:text-slate-100">
            {item.lot?.title || 'Lote Arrematado'}
          </h4>
          <div className="flex gap-6 text-xs">
            <div>
              <span className="text-slate-400 block">Valor Final:</span>
              <strong className="text-base text-emerald-600 dark:text-emerald-400">{formatBRL(item.receipt.finalAmount)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Data do Arremate:</span>
              <span className="text-slate-800 dark:text-slate-200">{formatDateBR(item.receipt.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="secondary" size="sm" onClick={handleCopyLink}>
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
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
