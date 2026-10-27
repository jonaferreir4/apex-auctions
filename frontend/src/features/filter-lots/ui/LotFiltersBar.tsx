import React from 'react';
import { LotStatus } from '@/entities/lot/types';
import { Input } from '@/shared/ui/Input';
import { Search, Calendar, CheckCircle2, LayoutGrid } from 'lucide-react';

export interface LotFiltersBarProps {
  currentStatus?: LotStatus | 'TODOS';
  onStatusChange: (status: LotStatus | 'TODOS') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function LotFiltersBar({
  currentStatus = 'TODOS',
  onStatusChange,
  searchQuery,
  onSearchChange
}: LotFiltersBarProps) {
  const tabs: Array<{ id: LotStatus | 'TODOS'; label: string; icon: React.ReactNode }> = [
    { id: 'TODOS', label: 'Todos os Lotes', icon: <LayoutGrid size={15} /> },
    { id: 'AO_VIVO', label: 'Ao Vivo', icon: <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" /> },
    { id: 'AGENDADO', label: 'Agendados', icon: <Calendar size={15} /> },
    { id: 'ENCERRADO', label: 'Encerrados', icon: <CheckCircle2 size={15} /> }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col gap-3.5">
      <div className="flex flex-wrap gap-2 pb-3.5 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Buscar por lote, título, marca..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>
    </div>
  );
}
