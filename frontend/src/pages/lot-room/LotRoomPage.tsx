import React from 'react';
import { useParams } from 'react-router-dom';
import { useLotDetailQuery } from '@/entities/lot/model/useLotQueries';
import { BiddingRoomWidget } from '@/widgets/bidding-room/BiddingRoomWidget';
import { User } from '@/entities/user/types';

export interface LotRoomPageProps {
  currentUser: User | null;
}

export function LotRoomPage({ currentUser }: LotRoomPageProps) {
  const { id } = useParams<{ id: string }>();
  const { data: lot, isLoading, isError } = useLotDetailQuery(id || '');

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        Carregando sala do lote ao vivo...
      </div>
    );
  }

  if (isError || !lot) {
    return (
      <div className="p-16 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <h3 className="text-xl font-bold mb-4 text-red-600">
          Lote não encontrado
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          O lote solicitado não existe ou foi removido.
        </p>
      </div>
    );
  }

  return <BiddingRoomWidget lot={lot} currentUser={currentUser} />;
}
