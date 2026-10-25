import React from 'react';
import { LotStatus } from '../types';
import { Badge } from '@/shared/ui/Badge';

export interface LotStatusBadgeProps {
  status: LotStatus;
}

export function LotStatusBadge({ status }: LotStatusBadgeProps) {
  switch (status) {
    case 'AO_VIVO':
      return <Badge variant="live">Ao Vivo</Badge>;
    case 'AGENDADO':
      return <Badge variant="scheduled">Agendado</Badge>;
    case 'ENCERRADO':
      return <Badge variant="closed">Encerrado</Badge>;
    case 'CANCELADO':
      return <Badge variant="danger">Cancelado</Badge>;
    default:
      return null;
  }
}
