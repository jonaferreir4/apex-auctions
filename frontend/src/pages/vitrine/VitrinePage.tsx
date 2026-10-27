import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLotsQuery } from '@/entities/lot/model/useLotQueries';
import { LotCard } from '@/entities/lot/ui/LotCard';
import { FeaturedLotsHero } from '@/widgets/featured-hero/FeaturedLotsHero';
import { Calendar, CheckCircle2 } from 'lucide-react';

export function VitrinePage() {
  const navigate = useNavigate();

  const { data: lots = [], isLoading } = useLotsQuery({
    excludeCanceled: true
  });

  const liveLots = useMemo(() => {
    return lots.filter((lot) => lot.status === 'AO_VIVO');
  }, [lots]);

  const scheduledLots = useMemo(() => {
    return lots.filter((lot) => lot.status === 'AGENDADO');
  }, [lots]);

  const finishedLots = useMemo(() => {
    return lots.filter((lot) => lot.status === 'ENCERRADO');
  }, [lots]);

  return (
    <div className="flex flex-col gap-10">
      <FeaturedLotsHero
        lots={lots}
        onSelectLot={(id) => navigate(`/lote/${id}`)}
      />

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          Carregando leilões e lotes...
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Pregões Ao Vivo
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Lotes em andamento recebendo propostas em tempo real
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-full">
                {liveLots.length} {liveLots.length === 1 ? 'lote ao vivo' : 'lotes ao vivo'}
              </span>
            </div>

            {liveLots.length === 0 ? (
              <div className="py-8 px-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
                  Nenhum leilão ao vivo neste instante. Confira os próximos lotes agendados logo abaixo!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {liveLots.slice(0, 4).map((lot) => (
                    <LotCard
                      key={lot.id}
                      lot={lot}
                      onClick={() => navigate(`/lote/${lot.id}`)}
                    />
                  ))}
                </div>
                {liveLots.length > 4 && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => navigate('/busca?status=AO_VIVO')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Ver todos os {liveLots.length} lotes ao vivo →
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Próximos Leilões Agendados
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Lotes catalogados prontos para pré-lance e acompanhamento
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-full">
                  {scheduledLots.length} {scheduledLots.length === 1 ? 'agendado' : 'agendados'}
                </span>
                {scheduledLots.length > 4 && (
                  <button
                    type="button"
                    onClick={() => navigate('/busca?status=AGENDADO')}
                    className="hidden sm:inline-flex text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Ver todos →
                  </button>
                )}
              </div>
            </div>

            {scheduledLots.length === 0 ? (
              <div className="py-8 px-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
                  Não há leilões agendados no momento.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {scheduledLots.slice(0, 4).map((lot) => (
                    <LotCard
                      key={lot.id}
                      lot={lot}
                      onClick={() => navigate(`/lote/${lot.id}`)}
                    />
                  ))}
                </div>
                {scheduledLots.length > 4 && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => navigate('/busca?status=AGENDADO')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Ver todos os {scheduledLots.length} lotes agendados →
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {finishedLots.length > 0 && (
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Pregões Encerrados Recentemente
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Histórico dos lotes arrematados e licitações concluídas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full">
                    {finishedLots.length} {finishedLots.length === 1 ? 'encerrado' : 'encerrados'}
                  </span>
                  {finishedLots.length > 4 && (
                    <button
                      type="button"
                      onClick={() => navigate('/busca?status=ENCERRADO')}
                      className="hidden sm:inline-flex text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Ver todos →
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {finishedLots.slice(0, 4).map((lot) => (
                    <LotCard
                      key={lot.id}
                      lot={lot}
                      onClick={() => navigate(`/lote/${lot.id}`)}
                    />
                  ))}
                </div>
                {finishedLots.length > 4 && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => navigate('/busca?status=ENCERRADO')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Ver todos os {finishedLots.length} lotes encerrados →
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
