import React, { useState, useEffect } from 'react';
import { usePlaceBidMutation } from '@/entities/bid/model/useBidQueries';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { formatBRL } from '@/shared/lib/formatters';
import confetti from 'canvas-confetti';
import { Zap, AlertCircle, ShieldCheck } from 'lucide-react';

export interface PlaceBidFormProps {
  lotId: string;
  minNextBid: number;
  availableBalance?: number;
  isLeader?: boolean;
  isAuctioneer?: boolean;
  isLive?: boolean;
  status?: string;
}

export function PlaceBidForm({
  lotId,
  minNextBid,
  availableBalance = 0,
  isLeader = false,
  isAuctioneer = false,
  isLive = true,
  status = 'AO_VIVO'
}: PlaceBidFormProps) {
  const [amount, setAmount] = useState<number>(minNextBid);
  const [localError, setLocalError] = useState<string | null>(null);
  const placeBidMutation = usePlaceBidMutation();

  useEffect(() => {
    if (minNextBid > amount) {
      setAmount(minNextBid);
    }
  }, [minNextBid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (isAuctioneer) {
      setLocalError('Leiloeiro não pode dar lances.');
      return;
    }

    if (status !== 'AO_VIVO' || !isLive) {
      setLocalError('Este lote não está ao vivo para receber lances.');
      return;
    }

    if (isLeader) {
      setLocalError('Você já é o maior lance deste leilão!');
      return;
    }

    if (amount < minNextBid) {
      setLocalError(`O lance deve ser de no mínimo ${formatBRL(minNextBid)}`);
      return;
    }

    if (amount > availableBalance) {
      setLocalError(`Saldo insuficiente. Você tem ${formatBRL(availableBalance)} disponível.`);
      return;
    }

    placeBidMutation.mutate(
      { lotId, amount },
      {
        onSuccess: () => {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
          setLocalError(null);
        },
        onError: (err: any) => {
          setLocalError(err.message || 'Falha ao enviar lance');
        }
      }
    );
  };

  if (isAuctioneer) {
    return (
      <div className="p-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-center text-slate-500 dark:text-slate-400 text-xs">
        Você é o leiloeiro responsável por este lote (perfil desabilitado para lances).
      </div>
    );
  }

  const hasEnoughBalance = availableBalance >= amount;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div>
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Próximo lance mínimo: <strong className="text-slate-900 dark:text-slate-100">{formatBRL(minNextBid)}</strong>
          </span>
          <span className={`font-semibold ${hasEnoughBalance ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            Saldo: {formatBRL(availableBalance)}
          </span>
        </div>

        <Input
          type="number"
          step="50"
          min={minNextBid}
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value));
            setLocalError(null);
          }}
          disabled={isLeader || !isLive}
          className="text-lg font-extrabold"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[minNextBid, minNextBid + 100, minNextBid + 250].map((val) => (
          <button
            key={val}
            type="button"
            disabled={isLeader || !isLive}
            onClick={() => {
              setAmount(val);
              setLocalError(null);
            }}
            className={`py-2 px-1 rounded-md text-xs font-bold text-center transition-colors ${
              amount === val
                ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300'
            } ${isLeader || !isLive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {formatBRL(val)}
          </button>
        ))}
      </div>

      {localError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 rounded-md text-xs font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={placeBidMutation.isPending}
        disabled={isLeader || !isLive || !hasEnoughBalance}
        className="w-full"
      >
        <Zap size={16} />
        {isLeader ? 'Você já lidera este leilão' : `Confirmar Lance de ${formatBRL(amount)}`}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
        <ShieldCheck size={13} className="text-blue-600" />
        <span>Saldo retido em custódia até encerramento ou superação</span>
      </div>
    </form>
  );
}
