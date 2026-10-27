import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLotsQuery } from '@/entities/lot/model/useLotQueries';
import { LotStatus } from '@/entities/lot/types';
import { LotCard } from '@/entities/lot/ui/LotCard';
import { Search, Flame, Calendar, CheckCircle2, LayoutGrid, ArrowUpDown, X, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

type SortOption = 'RELEVANCIA' | 'MENOR_VALOR' | 'MAIOR_VALOR' | 'RECENTES';

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const paramStatus = searchParams.get('status') as LotStatus | null;
  const paramPage = parseInt(searchParams.get('page') || '1', 10);

  const [statusFilter, setStatusFilter] = useState<LotStatus | 'TODOS'>(paramStatus || 'TODOS');
  const [sortBy, setSortBy] = useState<SortOption>('RELEVANCIA');
  const [currentPage, setCurrentPage] = useState<number>(isNaN(paramPage) ? 1 : paramPage);
  const pageSize = 8;

  useEffect(() => {
    if (paramStatus && ['AO_VIVO', 'AGENDADO', 'ENCERRADO'].includes(paramStatus)) {
      setStatusFilter(paramStatus);
    }
  }, [paramStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, sortBy]);

  const { data: lots = [], isLoading } = useLotsQuery({
    excludeCanceled: true
  });

  const filteredLots = useMemo(() => {
    let result = lots.filter((lot) => {
      if (statusFilter !== 'TODOS' && lot.status !== statusFilter) {
        return false;
      }
      if (query.trim() !== '') {
        const q = query.toLowerCase();
        const matchTitle = lot.title.toLowerCase().includes(q);
        const matchDesc = lot.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });

    if (sortBy === 'MENOR_VALOR') {
      result = [...result].sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'MAIOR_VALOR') {
      result = [...result].sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'RECENTES') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [lots, statusFilter, query, sortBy]);

  const totalItems = filteredLots.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedLots = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredLots.slice(startIndex, startIndex + pageSize);
  }, [filteredLots, safePage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearQuery = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const statusTabs: Array<{ id: LotStatus | 'TODOS'; label: string; icon: React.ReactNode }> = [
    { id: 'TODOS', label: 'Todos os Status', icon: <LayoutGrid size={15} /> },
    { id: 'AO_VIVO', label: 'Ao Vivo', icon: <Flame size={15} /> },
    { id: 'AGENDADO', label: 'Agendados', icon: <Calendar size={15} /> },
    { id: 'ENCERRADO', label: 'Encerrados', icon: <CheckCircle2 size={15} /> }
  ];

  const startRecord = (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Voltar para a página inicial"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {query.trim() ? (
                <>
                  Resultados para: <span className="text-blue-600 dark:text-blue-400">"{query}"</span>
                </>
              ) : statusFilter !== 'TODOS' ? (
                `Lotes em status: ${statusFilter === 'AO_VIVO' ? 'Ao Vivo' : statusFilter === 'AGENDADO' ? 'Agendados' : 'Encerrados'}`
              ) : (
                'Catálogo Geral de Lotes'
              )}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {totalItems} {totalItems === 1 ? 'lote encontrado' : 'lotes encontrados'}
              {totalItems > 0 && ` • Página ${safePage} de ${totalPages}`}
            </p>
          </div>
        </div>

        {query.trim() && (
          <button
            type="button"
            onClick={handleClearQuery}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <X size={14} />
            Limpar termo pesquisado
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  const nextParams = new URLSearchParams(searchParams);
                  if (tab.id === 'TODOS') nextParams.delete('status');
                  else nextParams.set('status', tab.id);
                  nextParams.delete('page');
                  setSearchParams(nextParams);
                }}
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

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium shrink-0">
            <ArrowUpDown size={14} /> Ordenar por:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="RELEVANCIA">Mais relevantes</option>
            <option value="MENOR_VALOR">Menor valor</option>
            <option value="MAIOR_VALOR">Maior valor</option>
            <option value="RECENTES">Mais recentes</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          Carregando resultados...
        </div>
      ) : totalItems === 0 ? (
        <div className="py-16 px-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <Search size={26} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            Nenhum lote encontrado
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
            Não encontramos nenhum lote para esta seleção. Tente ajustar os filtros ou pesquisar outros termos.
          </p>
          <div className="flex gap-3">
            {query && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Limpar busca
              </button>
            )}
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Voltar para o Início
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedLots.map((lot) => (
              <LotCard
                key={lot.id}
                lot={lot}
                onClick={() => navigate(`/lote/${lot.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Mostrando <strong className="text-slate-800 dark:text-slate-200">{startRecord}</strong> a <strong className="text-slate-800 dark:text-slate-200">{endRecord}</strong> de <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> lotes
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage <= 1}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  Anterior
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                        safePage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Próximo
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
