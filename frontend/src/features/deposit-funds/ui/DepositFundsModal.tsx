import React, { useState } from 'react';
import { useDepositMutation } from '@/entities/wallet/model/useWalletQueries';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { formatBRL } from '@/shared/lib/formatters';
import { PlusCircle, Wallet } from 'lucide-react';

export interface DepositFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositFundsModal({ isOpen, onClose }: DepositFundsModalProps) {
  const [amount, setAmount] = useState<number>(5000);
  const depositMutation = useDepositMutation();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    depositMutation.mutate(
      { amount },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Saldo Simulado">
      <form onSubmit={handleDeposit} className="flex flex-col gap-5">
        <p className="text-sm text-slate-600 dark:text-slate-400 m-0">
          Este é um saldo simulado para testes na plataforma de leilões. Nenhum valor real será cobrado.
        </p>

        <Input
          label="Valor do Depósito (R$)"
          type="number"
          min="100"
          step="100"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          icon={<Wallet size={16} />}
          className="text-lg font-bold"
          required
        />

        <div className="grid grid-cols-3 gap-2">
          {[1000, 5000, 10000].map((val) => (
            <Button
              key={val}
              type="button"
              variant={amount === val ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setAmount(val)}
            >
              +{formatBRL(val)}
            </Button>
          ))}
        </div>

        {depositMutation.isError && (
          <div className="text-red-500 text-xs font-medium">
            {depositMutation.error.message}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" isLoading={depositMutation.isPending} className="w-full">
          <PlusCircle size={18} />
          Confirmar Depósito de {formatBRL(amount)}
        </Button>
      </form>
    </Modal>
  );
}
