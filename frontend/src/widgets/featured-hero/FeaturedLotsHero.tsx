import React, { useState, useEffect, useMemo } from 'react';
import { Lot } from '@/entities/lot/types';
import { formatBRL } from '@/shared/lib/formatters';
import { LotCountdown } from '@/entities/lot/ui/LotCountdown';
import { Button } from '@/shared/ui/Button';
import { Calendar, Gavel, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface FeaturedLotsHeroProps {
  lots: Lot[];
  onSelectLot: (id: string) => void;
}

export function FeaturedLotsHero({ lots, onSelectLot }: FeaturedLotsHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featuredList = useMemo(() => {
    const live = lots.filter((l) => l.status === 'AO_VIVO');
    if (live.length >= 3) return live.slice(0, 5);
    const scheduled = lots.filter((l) => l.status === 'AGENDADO');
    const combined = [...live, ...scheduled];
    if (combined.length === 0) return lots.slice(0, 3);
    return combined.slice(0, 4);
  }, [lots]);

  useEffect(() => {
    if (featuredList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [featuredList.length, isPaused]);

  if (featuredList.length === 0) return null;

  const currentLot = featuredList[currentIndex] || featuredList[0];
  const isLive = currentLot.status === 'AO_VIVO';

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 md:h-[300px]">
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                  Pregão Ao Vivo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 uppercase tracking-wider">
                  <Calendar size={12} />
                  Próximo Lote Agendado
                </span>
              )}
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Destaque da Coleção
              </span>
            </div>

            <h1
              onClick={() => onSelectLot(currentLot.id)}
              className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
            >
              {currentLot.title}
            </h1>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 leading-relaxed">
              {currentLot.description}
            </p>
          </div>

          <div className="pt-3 my-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {isLive ? 'Licitação Atual' : 'Lance Inicial'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                {formatBRL(currentLot.currentPrice || currentLot.initialPrice)}
              </span>
            </div>

            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {isLive ? 'Tempo Restante' : 'Início Previsto'}
              </span>
              <LotCountdown endTime={currentLot.endTime} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSelectLot(currentLot.id)}
              className="font-bold flex items-center gap-1.5 shadow-sm"
            >
              {isLive ? (
                <>
                  <Gavel size={15} />
                  Entrar no Pregão Ao Vivo
                </>
              ) : (
                <>
                  <ArrowRight size={15} />
                  Acompanhar Pregão
                </>
              )}
            </Button>

            {featuredList.length > 1 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-1">
                  {featuredList.map((lot, idx) => (
                    <button
                      key={lot.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? 'w-6 bg-blue-600 dark:bg-blue-400'
                          : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                    aria-label="Lote anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                    aria-label="Próximo lote"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => onSelectLot(currentLot.id)}
          className="md:col-span-5 relative h-52 md:h-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer group"
        >
          <img
            key={currentLot.id}
            src={currentLot.imageUrl}
            alt={currentLot.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out animate-fadeIn"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-3 left-3 md:hidden">
            <span className="text-white text-xs font-bold truncate block drop-shadow-md">
              {currentLot.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
