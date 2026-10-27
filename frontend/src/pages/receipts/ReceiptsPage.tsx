import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '@/entities/user/types';
import { useMyReceiptsQuery } from '@/entities/receipt/model/useReceiptQueries';
import { ReceiptCard } from '@/entities/receipt/ui/ReceiptCard';
import { Button } from '@/shared/ui/Button';
import { Award, ShoppingBag, ArrowRight } from 'lucide-react';

export interface ReceiptsPageProps {
  currentUser: User | null;
}

export function ReceiptsPage({ currentUser }: ReceiptsPageProps) {
  const navigate = useNavigate();
  const isBidder = currentUser?.role === 'LICITANTE';

  const { data: receipts = [], isLoading } = useMyReceiptsQuery(Boolean(isBidder));

  if (!currentUser) {
    return (
      <div className="py-12 px-8 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <Award size={36} className="text-amber-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Acesse sua conta</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Faça login para visualizar seus lotes arrematados e certificados oficiais.
        </p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Entrar na Plataforma
        </Button>
      </div>
    );
  }

  if (!isBidder) {
    return (
      <div className="py-12 px-8 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Apenas licitantes possuem histórico de arremates.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Award size={16} />
          Histórico de Vitórias & Certificados
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold m-0 text-slate-900 dark:text-slate-100">
          Meus Lotes Arrematados
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Todos os lotes vencidos por você, com seus respectivos certificados digitais e comprovantes de liquidação.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          Carregando seus arremates...
        </div>
      ) : receipts.length === 0 ? (
        <div className="py-14 px-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <ShoppingBag size={42} className="text-slate-400 mx-auto mb-4 opacity-60" />
          <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-slate-100">
            Nenhum lote arrematado ainda
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
            Participe dos leilões ao vivo na vitrine para disputar lotes exclusivos!
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Explorar Lotes ao Vivo <ArrowRight size={15} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {receipts.map((item) => (
            <ReceiptCard
              key={item.receipt.id}
              item={item}
              onOpenPublicLink={(token) => navigate(`/receipts/share/${token}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
