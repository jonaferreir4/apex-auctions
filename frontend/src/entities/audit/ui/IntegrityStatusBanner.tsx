import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export interface IntegrityStatusBannerProps {
  isVerified: boolean;
  message: string;
  tamperedIndex?: number | null;
}

export function IntegrityStatusBanner({ isVerified, message, tamperedIndex }: IntegrityStatusBannerProps) {
  if (isVerified) {
    return (
      <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-4 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-emerald-800 dark:text-emerald-300 m-0 mb-1">
            Auditoria Concluída: Histórico 100% Autêntico e Íntegro
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-4 shadow-xs">
      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
        <ShieldAlert size={24} />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-red-700 dark:text-red-300 m-0 mb-1">
          ALERTA: Adulteração Detectada no Banco de Dados {tamperedIndex ? `(Lance #${tamperedIndex})` : ''}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
