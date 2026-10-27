import React from 'react';
import { ExternalItem } from '../types';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { formatBRL } from '@/shared/lib/formatters';
import { PlusCircle, Check } from 'lucide-react';

export interface ExternalItemCardProps {
  item: ExternalItem;
  onSelect: (item: ExternalItem) => void;
  selected?: boolean;
}

export function ExternalItemCard({ item, onSelect, selected = false }: ExternalItemCardProps) {
  return (
    <Card
      className={`p-3.5 transition-all ${
        selected
          ? 'border-2 border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 shadow-md'
          : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs'
      }`}
    >
      <div className="flex gap-3.5 items-center">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-16 h-16 rounded-md object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold uppercase">
            {item.category}
          </span>
          <h5 className="text-sm font-bold my-0.5 truncate text-slate-900 dark:text-slate-100">
            {item.title}
          </h5>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Preço sugerido: <strong className="text-emerald-600 dark:text-emerald-400">{formatBRL(item.suggestedPrice)}</strong>
          </span>
        </div>
        <Button
          variant={selected ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onSelect(item)}
        >
          {selected ? <Check size={14} /> : <PlusCircle size={14} />}
          {selected ? 'Selecionado' : 'Usar'}
        </Button>
      </div>
    </Card>
  );
}
