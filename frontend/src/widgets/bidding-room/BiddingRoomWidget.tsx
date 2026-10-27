import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lot } from '@/entities/lot/types';
import { User } from '@/entities/user/types';
import { LotStatusBadge } from '@/entities/lot/ui/LotStatusBadge';
import { LotCountdown } from '@/entities/lot/ui/LotCountdown';
import { BidHistoryList } from '@/entities/bid/ui/BidHistoryList';
import { LeaderStatusBanner } from '@/entities/bid/ui/LeaderStatusBanner';
import { PlaceBidForm } from '@/features/place-bid/ui/PlaceBidForm';
import { useLotBidsQuery } from '@/entities/bid/model/useBidQueries';
import { useWalletQuery } from '@/entities/wallet/model/useWalletQueries';
import { joinLotRoom, leaveLotRoom, getSocket } from '@/shared/socket/socketClient';
import { formatBRL, formatDateBR } from '@/shared/lib/formatters';
import { ShieldCheck, ArrowLeft, Users, AlertTriangle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { BIDS_QUERY_KEY } from '@/entities/bid/model/useBidQueries';
import { LOTS_QUERY_KEY } from '@/entities/lot/model/useLotQueries';
import confetti from 'canvas-confetti';

export interface BiddingRoomWidgetProps {
  lot: Lot;
  currentUser: User | null;
}

export function BiddingRoomWidget({ lot, currentUser }: BiddingRoomWidgetProps) {
  const [antiSnipingAlert, setAntiSnipingAlert] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isBidder = currentUser?.role === 'LICITANTE';
  const isAuctioneer = currentUser?.role === 'LEILOEIRO';

  const { data: bids = [] } = useLotBidsQuery(lot.id);
  const { data: wallet } = useWalletQuery(isBidder && !!currentUser);

  const highestBid = bids[0];
  const isLeader = currentUser ? highestBid?.bidderId === currentUser.id : false;
  const hasBidInLot = currentUser ? bids.some((b) => b.bidderId === currentUser.id) : false;

  useEffect(() => {
    joinLotRoom(lot.id);
    const socket = getSocket();

    const handleBidPlaced = (data: { lotId: string; bid: any }) => {
      if (data.lotId === lot.id) {
        queryClient.invalidateQueries({ queryKey: [BIDS_QUERY_KEY, lot.id] });
        queryClient.invalidateQueries({ queryKey: [LOTS_QUERY_KEY] });
      }
    };

    const handleAntiSniping = (data: { lotId: string; newEndTime: string; message: string }) => {
      if (data.lotId === lot.id) {
        setAntiSnipingAlert(data.message);
        queryClient.invalidateQueries({ queryKey: [LOTS_QUERY_KEY] });
        setTimeout(() => setAntiSnipingAlert(null), 8000);
      }
    };

    const handleLotClosed = (data: { lotId: string; winnerId?: string; finalPrice?: number }) => {
      if (data.lotId === lot.id) {
        queryClient.invalidateQueries({ queryKey: [LOTS_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [BIDS_QUERY_KEY, lot.id] });
      }
      if (currentUser && data.winnerId === currentUser.id) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    };

    socket.on('bid_placed', handleBidPlaced);
    socket.on('anti_sniping_triggered', handleAntiSniping);
    socket.on('lot_closed', handleLotClosed);

    return () => {
      leaveLotRoom(lot.id);
      socket.off('bid_placed', handleBidPlaced);
      socket.off('anti_sniping_triggered', handleAntiSniping);
      socket.off('lot_closed', handleLotClosed);
    };
  }, [lot.id, currentUser, queryClient]);

  const displayPrice = lot.currentPrice > 0 ? lot.currentPrice : lot.initialPrice;

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">Vitrine</Link>
          <span>›</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">Lote #{lot.id.slice(-6)}</span>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={15} />
          Voltar para a Vitrine
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
            {lot.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Iniciado em {formatDateBR(lot.startTime)}</span>
            <span>•</span>
            <span>Pregão Oficial Apex Auctions</span>
          </div>
        </div>
      </div>

      {antiSnipingAlert && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-md text-amber-700 dark:text-amber-400 font-bold text-sm">
          <AlertTriangle size={18} />
          <span>{antiSnipingAlert}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="relative w-full h-96 sm:h-[440px] bg-slate-100 dark:bg-slate-800">
              <img
                src={lot.imageUrl}
                alt={lot.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3.5 left-3.5">
                <LotStatusBadge status={lot.status} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-bold mb-3 text-slate-900 dark:text-slate-100">
              Descrição do Lote
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed m-0">
              {lot.description}
            </p>
          </div>

          {lot.itemAttributes && Object.keys(lot.itemAttributes).length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(lot.itemAttributes).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-3 rounded-md"
                  >
                    <span className="text-slate-400 block capitalize text-[11px] font-semibold mb-0.5">
                      {key}
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-slate-100 break-words">
                      {String(val)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-20">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tempo Restante
              </span>

              {lot.status === 'AO_VIVO' ? (
                <LotCountdown endTime={lot.endTime} />
              ) : (
                <LotStatusBadge status={lot.status} />
              )}
            </div>

            <div className="p-6">
              <div className="mb-5">
                <span className="text-xs text-slate-400 block font-bold tracking-wider uppercase mb-1">
                  {lot.currentPrice > 0 ? 'LICITAÇÃO ATUAL' : 'PREÇO INICIAL'}
                </span>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-none my-1">
                  {formatBRL(displayPrice)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Incremento mínimo obrigatório: <strong className="text-slate-800 dark:text-slate-200">+{formatBRL(lot.minIncrement)}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md mb-5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AA
                </div>
                <div>
                  <strong className="text-xs text-slate-900 dark:text-slate-100 block">
                    Curadoria Apex Auctions
                  </strong>
                  <span className="text-xs text-slate-400">
                    Lote autenticado e catalogado com procedência verificada
                  </span>
                </div>
              </div>

              {currentUser && isBidder && lot.status === 'AO_VIVO' && (
                <div className="mb-5">
                  <LeaderStatusBanner
                    isLeader={isLeader}
                    hasBidInLot={hasBidInLot}
                    minNextBid={lot.minNextBid}
                  />
                </div>
              )}

              {currentUser ? (
                <PlaceBidForm
                  lotId={lot.id}
                  minNextBid={lot.minNextBid}
                  availableBalance={wallet?.availableBalance || 0}
                  isLeader={isLeader}
                  isAuctioneer={isAuctioneer}
                  isLive={lot.status === 'AO_VIVO'}
                  status={lot.status}
                />
              ) : (
                <div className="text-center p-5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="m-0 mb-3.5 text-sm text-slate-600 dark:text-slate-400">
                    Faça login para dar lances ao vivo neste lote.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-sm transition-colors"
                  >
                    Entrar na Plataforma
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Users size={17} className="text-blue-600" />
                <h3 className="text-sm font-bold m-0 text-slate-900 dark:text-slate-100">
                  Histórico de Lances
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {bids.length} lance{bids.length !== 1 ? 's' : ''}
              </span>
            </div>

            <BidHistoryList bids={bids} currentUserId={currentUser?.id} />

            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                to={`/auditoria/${lot.id}`}
                className="text-xs text-slate-400 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck size={13} className="text-blue-600" />
                Auditoria pública de integridade do lote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
