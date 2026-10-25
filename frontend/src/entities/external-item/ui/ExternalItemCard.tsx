import React from 'react';
import { ExternalItem } from '../types';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { formatBRL } from '@/shared/lib/formatters';
import { PlusCircle } from 'lucide-react';

export interface ExternalItemCardProps {
  item: ExternalItem;
  onSelect: (item: ExternalItem) => void;
  selected?: boolean;
}

export function ExternalItemCard({ item, onSelect, selected = false }: ExternalItemCardProps) {
  return (
    <Card
      style={{
        padding: '1rem',
        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
        boxShadow: selected ? 'var(--shadow-glow)' : undefined
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{item.category}</span>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.title}
          </h5>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Sugerido: <strong>{formatBRL(item.suggestedPrice)}</strong>
          </span>
        </div>
        <Button
          variant={selected ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onSelect(item)}
        >
          <PlusCircle size={16} />
          {selected ? 'Selecionado' : 'Usar'}
        </Button>
      </div>
    </Card>
  );
}
