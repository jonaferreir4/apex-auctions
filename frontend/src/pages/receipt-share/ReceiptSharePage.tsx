import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReceiptByTokenQuery } from '@/entities/receipt/model/useReceiptQueries';
import { formatBRL, formatDateBR } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import {
  Award,
  ShieldCheck,
  Share2,
  Check,
  Printer,
  ExternalLink,
  Gavel,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';

export function ReceiptSharePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useReceiptByTokenQuery(token || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        Verificando autenticidade do certificado...
      </div>
    );
  }

  if (isError || !data || !data.receipt) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <ShieldCheck size={44} className="text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-red-600">
          Comprovante Não Encontrado
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          O token informado é inválido ou este certificado não consta no livro-razão de leilões da Apex Auctions.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Voltar para a Vitrine
        </Button>
      </div>
    );
  }

  const { receipt, lot } = data;

  return (
    <div className="max-w-3xl mx-auto my-4 mb-12 flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:text-blue-600 transition-colors">
          <Gavel size={15} /> Apex Auctions
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            {copied ? 'Link Copiado!' : 'Copiar Link'}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={14} />
            Imprimir Comprovante
          </Button>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-2xl border-2 border-amber-300 dark:border-amber-800/60 shadow-md relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

        <div className="text-center mb-7">
          <div className="w-13 h-13 rounded-full bg-amber-50 dark:bg-amber-950/40 inline-flex items-center justify-center text-amber-600 mb-3 border border-amber-200 dark:border-amber-900">
            <Award size={28} />
          </div>
          <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tracking-widest uppercase block">
            Certificado Digital Oficial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold my-1 text-slate-900 dark:text-slate-100 tracking-tight">
            Comprovante de Liquidação de Arremate
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm m-0">
            Emitido pela Apex Auctions • Registro de arrematação oficial e verificável
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-5 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-6 border border-slate-200 dark:border-slate-700/60 items-center">
          {lot?.imageUrl && (
            <img
              src={lot.imageUrl}
              alt={lot.title}
              className="w-28 h-28 rounded-lg object-cover mx-auto"
            />
          )}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {lot?.category || 'Item Arrematado'}
            </span>
            <h3 className="text-lg font-extrabold my-1 text-slate-900 dark:text-slate-100">
              {lot?.title || 'Lote Arrematado'}
            </h3>
            {lot?.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 m-0 line-clamp-2">
                {lot.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <UserCheck size={14} /> Arrematante Vencedor
            </div>
            <strong className="text-base text-slate-900 dark:text-slate-100 block truncate">
              {receipt.winnerId}
            </strong>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Identidade Auditada
            </span>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <DollarSign size={14} /> Valor Final Arrematado
            </div>
            <strong className="text-lg text-emerald-600 dark:text-emerald-400 block">
              {formatBRL(receipt.finalAmount)}
            </strong>
            <span className="text-xs text-slate-400">
              Liquidado via Custódia
            </span>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Calendar size={14} /> Data do Arremate
            </div>
            <strong className="text-sm text-slate-900 dark:text-slate-100 block">
              {formatDateBR(receipt.createdAt)}
            </strong>
            <span className="text-xs text-slate-400">
              Horário Oficial de Brasília
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={18} className="text-emerald-600" />
              <strong className="text-xs text-slate-900 dark:text-slate-100">
                Autenticidade e Verificação Digital
              </strong>
            </div>
            <Link
              to={`/auditoria/${receipt.lotId}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 hover:underline"
            >
              Verificar histórico de lances <ExternalLink size={12} />
            </Link>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">
              Token Único do Comprovante:
            </span>
            <code className="text-xs font-mono text-slate-900 dark:text-slate-100 break-all">
              {receipt.shareToken}
            </code>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">
              Identificador do Lote:
            </span>
            <code className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all">
              {receipt.lotId}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
