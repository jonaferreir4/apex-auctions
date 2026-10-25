import { useQuery } from '@tanstack/react-query';
import { auditService } from '../api/auditService';

export const AUDIT_QUERY_KEY = ['audit'] as const;

export function useAuditQuery(lotId: string) {
  return useQuery({
    queryKey: [...AUDIT_QUERY_KEY, lotId],
    queryFn: () => auditService.getLotAuditReport(lotId),
    enabled: Boolean(lotId),
    staleTime: 1000 * 10
  });
}
