import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuditQuery } from '@/entities/audit/model/useAuditQueries';
import { IntegrityStatusBanner } from '@/entities/audit/ui/IntegrityStatusBanner';
import { AuditChainView } from '@/entities/audit/ui/AuditChainView';
import { Button } from '@/shared/ui/Button';
import { formatBRL } from '@/shared/lib/formatters';
import { ShieldCheck, ShieldAlert, ArrowLeft, Info, Hash } from 'lucide-react';

export function AuditPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const { data: report, isLoading, isError } = useAuditQuery(lotId || '');

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        Computando e validando cadeia criptográfica SHA-256...
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <ShieldAlert size={44} className="text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-red-600">
          Falha na Auditoria do Lote
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Não foi possível carregar o relatório de integridade criptográfica para este lote.
        </p>
        <Link to="/">
          <Button variant="primary">Voltar para a Vitrine</Button>
        </Link>
      </div>
    );
  }

  const latestBid = report.records.length > 0 ? report.records[report.records.length - 1] : null;

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <Link
          to={`/lote/${report.lotId}`}
          className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm font-semibold mb-3.5 transition-colors"
        >
          <ArrowLeft size={15} /> Voltar para a Sala do Lote
        </Link>

        <div className="flex items-center gap-1.5 mb-1">
          <ShieldCheck size={20} className={report.isIntegrityVerified ? 'text-emerald-600' : 'text-red-600'} />
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              report.isIntegrityVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'
            }`}
          >
            Portal de Transparência & Auditoria Pública
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold m-0 tracking-tight text-slate-900 dark:text-slate-100">
          Auditoria Criptográfica do Lote
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inspecione publicamente o histórico e a comprovação matemática de que nenhum lance deste leilão sofreu adulterações.
        </p>
      </div>

      <IntegrityStatusBanner
        isVerified={report.isIntegrityVerified}
        message={report.statusMessage}
        tamperedIndex={report.tamperedAtBidIndex}
      />

      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">
            Lote Auditado
          </span>
          <strong className="text-sm text-slate-900 dark:text-slate-100">{report.lotTitle}</strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">
            Status
          </span>
          <strong
            className={`text-sm ${
              report.lotStatus === 'AO_VIVO' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {report.lotStatus}
          </strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">
            Maior Lance Registrado
          </span>
          <strong className="text-sm text-emerald-600 dark:text-emerald-400">
            {latestBid ? formatBRL(latestBid.amount) : 'Sem lances'}
          </strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">
            Blocos Auditados
          </span>
          <strong className="text-sm text-slate-900 dark:text-slate-100">{report.totalBids} lances</strong>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex gap-3.5">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-slate-100 block mb-1">
            Como funciona a Prova de Integridade SHA-256?
          </strong>
          Cada lance efetuado no sistema possui uma chave de encadeamento criptográfico contendo o hash do lance anterior.
          Caso qualquer registro seja alterado no banco de dados, todos os hashes subsequentes tornam-se inválidos,
          revelando imediatamente o ponto exato da tentativa de fraude.
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold mb-3.5 flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <Hash size={16} className="text-blue-600" />
          Sequência Cronológica de Blocos
        </h3>
        <AuditChainView records={report.records} genesisHash={report.genesisHash} />
      </div>
    </div>
  );
}
