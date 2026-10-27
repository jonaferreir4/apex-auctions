import React, { useState } from 'react';
import { useCancelLotMutation } from '@/entities/lot/model/useLotQueries';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Ban, AlertTriangle } from 'lucide-react';

export interface CancelLotButtonProps {
  lotId: string;
  lotTitle: string;
  hasBids: boolean;
  disabled?: boolean;
}

export function CancelLotButton({ lotId, lotTitle, hasBids, disabled }: CancelLotButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelMutation = useCancelLotMutation();

  const handleConfirmCancel = () => {
    cancelMutation.mutate(lotId, {
      onSuccess: () => setIsOpen(false)
    });
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
        <Ban size={14} />
        Cancelar Lote
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmar Cancelamento do Lote">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 text-red-600">
            <AlertTriangle size={24} className="shrink-0" />
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                Tem certeza de que deseja cancelar o lote "{lotTitle}"?
              </p>
              <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
                {hasBids
                  ? 'Este lote possui lances ativos. Ao cancelar, o saldo comprometido do licitante líder será estornado automaticamente.'
                  : 'Este lote não recebeu lances e será cancelado imediatamente.'}
              </p>
            </div>
          </div>

          {cancelMutation.isError && (
            <div className="text-red-500 text-xs font-medium">
              {cancelMutation.error.message}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Voltar
            </Button>
            <Button variant="danger" isLoading={cancelMutation.isPending} onClick={handleConfirmCancel}>
              Confirmar Cancelamento
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
