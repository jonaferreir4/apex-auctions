import React, { useState, useMemo } from 'react';
import { useMyLotsQuery } from '@/entities/lot/model/useLotQueries';
import { User } from '@/entities/user/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { LotStatusBadge } from '@/entities/lot/ui/LotStatusBadge';
import { CreateLotModal } from '@/features/create-lot/ui/CreateLotModal';
import { CancelLotButton } from '@/features/cancel-lot/ui/CancelLotButton';
import { formatBRL, formatDateBR } from '@/shared/lib/formatters';
import { Plus, DollarSign, Package, CheckCircle2, LayoutDashboard } from 'lucide-react';

export interface AuctioneerPageProps {
  currentUser: User | null;
}

export function AuctioneerPage({ currentUser }: AuctioneerPageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isAuctioneer = currentUser?.role === 'LEILOEIRO';

  const { data: myLots = [], isLoading } = useMyLotsQuery(isAuctioneer);

  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let closedCount = 0;
    let activeCount = 0;

    myLots.forEach(lot => {
      if (lot.status === 'ENCERRADO') {
        closedCount++;
        if (lot.currentPrice > 0 && lot.currentLeaderId) {
          totalRevenue += lot.currentPrice;
        }
      } else if (lot.status === 'AO_VIVO') {
        activeCount++;
      }
    });

    return { totalRevenue, closedCount, activeCount, total: myLots.length };
  }, [myLots]);

  if (!isAuctioneer) {
    return (
      <div className="py-12 px-8 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <h3 className="text-lg font-bold mb-2 text-red-600">Acesso Restrito</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Esta página é exclusiva para leiloeiros cadastrados.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <LayoutDashboard size={16} />
            Painel do Leiloeiro
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 m-0">
            Gestão de Lotes & Faturamento
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Criar Lote com API Externa
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Faturamento Realizado</span>
            <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatBRL(metrics.totalRevenue)}
          </div>
          <span className="text-xs text-slate-400 mt-1">Lotes encerrados arrematados</span>
        </Card>

        <Card className="bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lotes Ao Vivo</span>
            <Package size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.activeCount}
          </div>
          <span className="text-xs text-slate-400 mt-1">Disputando lances agora</span>
        </Card>

        <Card className="bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total de Lotes</span>
            <CheckCircle2 size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.total}
          </div>
          <span className="text-xs text-slate-400 mt-1">{metrics.closedCount} encerrados</span>
        </Card>
      </div>

      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
          Lotes Cadastrados
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Carregando lotes...</div>
        ) : myLots.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            Nenhum lote criado ainda. Clique em "Criar Lote com API Externa" para começar!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myLots.map((lot) => {
              const isClosed = lot.status === 'ENCERRADO';
              const wasArrematado = isClosed && lot.currentPrice > 0;

              return (
                <div
                  key={lot.id}
                  className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={lot.imageUrl}
                      alt={lot.title}
                      className="w-14 h-14 rounded-md object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <LotStatusBadge status={lot.status} />
                        <span className="text-xs text-slate-400">{lot.category}</span>
                      </div>
                      <h4 className="text-sm font-bold m-0 text-slate-900 dark:text-slate-100">
                        {lot.title}
                      </h4>
                      <span className="text-xs text-slate-500">
                        Fim previsto: {formatDateBR(lot.endTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-xs text-slate-400 block">
                        {isClosed ? (wasArrematado ? 'Arrematado Por' : 'Resultado') : 'Valor Atual'}
                      </span>
                      <strong className={`text-base ${wasArrematado ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {wasArrematado ? formatBRL(lot.currentPrice) : isClosed ? 'Não Vendido' : formatBRL(lot.currentPrice || lot.initialPrice)}
                      </strong>
                    </div>

                    {lot.status !== 'ENCERRADO' && lot.status !== 'CANCELADO' && (
                      <CancelLotButton
                        lotId={lot.id}
                        lotTitle={lot.title}
                        hasBids={Boolean(lot.currentLeaderId && lot.currentPrice > 0)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isCreateOpen && (
        <CreateLotModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
}
