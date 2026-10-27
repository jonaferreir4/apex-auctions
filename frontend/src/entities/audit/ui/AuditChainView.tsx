import { AuditRecordItem } from '../types';
import { formatBRL, formatDateBR } from '@/shared/lib/formatters';
import { Link2, ShieldCheck, ShieldAlert, Database } from 'lucide-react';

export interface AuditChainViewProps {
  records: AuditRecordItem[];
  genesisHash: string;
}

export function AuditChainView({ records, genesisHash }: AuditChainViewProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center gap-3.5">
        <Database size={20} className="text-blue-600 shrink-0" />
        <div className="flex-1 overflow-hidden">
          <span className="font-bold text-blue-600 dark:text-blue-400 text-xs block mb-0.5">
            Bloco Gênese do Lote (Root Hash Inicial)
          </span>
          <code className="text-xs font-mono break-all text-slate-600 dark:text-slate-400">
            {genesisHash}
          </code>
        </div>
      </div>

      {records.map((record) => {
        const isValid = record.isHashValid && record.isChainLinkValid;

        return (
          <div key={record.bidId} className="flex flex-col items-center">
            <div className="py-1 text-slate-400">
              <Link2 size={16} />
            </div>

            <div
              className={`w-full p-5 bg-white dark:bg-slate-900 border rounded-xl shadow-xs border-l-4 ${isValid
                  ? 'border-slate-200 dark:border-slate-800 border-l-emerald-600'
                  : 'border-red-300 dark:border-red-900 border-l-red-600'
                }`}
            >
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${isValid ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                  >
                    #{record.index}
                  </span>
                  <strong className="text-sm text-slate-900 dark:text-slate-100">
                    {record.bidderMasked}
                  </strong>
                  <span className="text-xs text-slate-400">
                    • {formatDateBR(record.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-base font-extrabold ${isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                    {formatBRL(record.amount)}
                  </span>
                  {isValid ? (
                    <ShieldCheck size={18} className="text-emerald-600" />
                  ) : (
                    <ShieldAlert size={18} className="text-red-600" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <div>
                  <span className="text-slate-400">Previous Hash: </span>
                  <code className={`break-all ${record.isChainLinkValid ? 'text-slate-600 dark:text-slate-300' : 'text-red-500 font-bold'}`}>
                    {record.previousHash}
                  </code>
                </div>
                <div>
                  <span className="text-slate-400">Current Hash: </span>
                  <code className={`break-all ${record.isHashValid ? 'text-slate-600 dark:text-slate-300' : 'text-red-500 font-bold'}`}>
                    {record.hash}
                  </code>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
