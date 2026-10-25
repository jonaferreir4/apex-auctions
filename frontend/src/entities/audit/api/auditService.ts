import { httpClient } from '@/shared/api/httpClient';
import { LotAuditReport } from '../types';

export const auditService = {
  getLotAuditReport: async (lotId: string): Promise<LotAuditReport> => {
    const response = await httpClient.get<LotAuditReport>(`/lots/${lotId}/audit`);
    return response.data;
  }
};
