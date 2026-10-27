import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { Logo } from '@/shared/ui/Logo';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-12 pb-8 mt-auto text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!user && (
          <div className="flex items-center justify-between flex-wrap gap-5 pb-8 mb-10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold text-sm transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-5 py-2 rounded-md font-semibold text-sm transition-colors"
              >
                Criar uma conta
              </Link>
            </div>

            <p className="m-0 text-sm font-medium text-slate-600 dark:text-slate-400">
              Participe de pregões ao vivo todas as semanas, com curadoria de especialistas e liquidação segura.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-200 dark:border-slate-800">
          <div>
            <Logo size="sm" className="mb-4" />
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mb-4">
              Casa de leilões eletrônicos especializada em obras de arte, alta relojoaria, livros raros e artigos colecionáveis de alto padrão.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck size={15} className="text-blue-600" />
              Plataforma auditável e segura
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-wide">
              Comprar
            </h4>
            <ul className="p-0 m-0 flex flex-col gap-2.5 text-sm list-none">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Vitrine de Pregões Ao Vivo
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Proteção do Arrematante
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Gestão de Saldo de Custódia
                </Link>
              </li>
              <li>
                <Link to="/arremates" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Meus Arremates & Comprovantes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-wide">
              Vender
            </h4>
            <ul className="p-0 m-0 flex flex-col gap-2.5 text-sm list-none">
              <li>
                <Link to="/painel" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Painel do Leiloeiro
                </Link>
              </li>
              <li>
                <Link to="/painel" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Criação de Novos Lotes
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Regras de Pregão e Anti-Sniping
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-wide">
              Transparência & Ajuda
            </h4>
            <ul className="p-0 m-0 flex flex-col gap-2.5 text-sm list-none">
              <li>
                <Link to="/auditoria/6a7fde7b-ef9a-43bd-812e-690a2440f943" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Auditoria Pública de Lotes
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs block">Central de Atendimento:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">contato@apexauctions.com.br</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Segunda a Sexta, 09h às 18h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © 2026 Apex Auctions S.A. • CNPJ 42.189.920/0001-34 • Todos os direitos reservados.
          </div>

          <div className="flex gap-5">
            <span>Termos de Uso</span>
            <span>Política de Privacidade</span>
            <span>Segurança da Informação</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
