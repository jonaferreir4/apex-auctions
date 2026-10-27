import React, { useState } from 'react';
import { User } from '@/entities/user/types';
import { useWalletQuery } from '@/entities/wallet/model/useWalletQueries';
import { WalletDisplay } from '@/entities/wallet/ui/WalletDisplay';
import { DepositFundsModal } from '@/features/deposit-funds/ui/DepositFundsModal';
import { Button } from '@/shared/ui/Button';
import { Wallet, PlusCircle, Info } from 'lucide-react';

export interface WalletPageProps {
  currentUser: User | null;
}

export function WalletPage({ currentUser }: WalletPageProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const isBidder = currentUser?.role === 'LICITANTE';
  const { data: balance, isLoading } = useWalletQuery(isBidder);

  if (!currentUser) {
    return (
      <div className="py-12 px-8 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <p className="text-sm text-slate-600 dark:text-slate-400">Faça login para acessar sua carteira.</p>
      </div>
    );
  }

  if (!isBidder) {
    return (
      <div className="py-12 px-8 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <p className="text-sm text-slate-600 dark:text-slate-400">Leiloeiros não possuem carteira de lances.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Wallet size={16} />
            Gestão Financeira & Custódia
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold m-0 text-slate-900 dark:text-slate-100">
            Carteira do Licitante
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsDepositOpen(true)}>
          <PlusCircle size={16} />
          Adicionar Saldo Simulado
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Carregando saldos...</div>
      ) : (
        <WalletDisplay balance={balance} onOpenDeposit={() => setIsDepositOpen(true)} />
      )}

      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex gap-3.5">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-100 block mb-1">
            Como funciona a Custódia e o Saldo Comprometido?
          </strong>
          Quando você efetua um lance e assume a liderança do lote, o valor correspondente é temporariamente
          bloqueado para garantir a arrematação. Caso outro participante supere seu lance, seu saldo volta
          <strong> instantaneamente para o saldo disponível</strong>. Ao término do leilão com sua vitória,
          o valor é liquidado e o certificado oficial de arrematação é emitido.
        </div>
      </div>

      <DepositFundsModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}
