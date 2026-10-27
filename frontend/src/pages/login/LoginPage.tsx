import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { Logo } from '@/shared/ui/Logo';
import { ArrowLeft } from 'lucide-react';

export function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between items-center p-6 sm:p-8">
      <div className="w-full max-w-md flex justify-start items-center mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para a vitrine
        </Link>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 sm:p-10 flex flex-col items-center">
        <Link
          to="/"
          className="flex flex-col items-center gap-2 mb-7 text-center"
        >
          <Logo size="lg" />
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Acesso à plataforma oficial de leilões
          </span>
        </Link>

        <div className="flex w-full bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-7">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-md text-sm transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-md text-sm transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setTab('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setTab('login')}
          />
        )}
      </div>

      <div className="w-full max-w-lg text-center text-xs text-slate-400 p-4">
        <span>© 2026 Apex Auctions S.A. Todos os direitos reservados.</span>
      </div>
    </div>
  );
}
