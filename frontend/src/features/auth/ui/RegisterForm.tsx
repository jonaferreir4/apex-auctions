import React, { useState } from 'react';
import { useRegisterMutation } from '@/entities/user/model/useUserQueries';
import { UserRole } from '@/entities/user/types';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { User, Mail, Lock, Eye, EyeOff, Gavel, UserCheck } from 'lucide-react';

export interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('LICITANTE');
  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { name, email, password, role },
      {
        onSuccess: () => onSuccess?.()
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
          Selecione o seu perfil:
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setRole('LICITANTE')}
            className={`p-3 rounded-md border-2 text-left transition-all cursor-pointer ${
              role === 'LICITANTE'
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <UserCheck size={16} className={role === 'LICITANTE' ? 'text-blue-600' : 'text-slate-400'} />
              <strong className="text-sm text-slate-900 dark:text-slate-100">Licitante</strong>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block leading-tight">
              Dar lances e arrematar itens
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole('LEILOEIRO')}
            className={`p-3 rounded-md border-2 text-left transition-all cursor-pointer ${
              role === 'LEILOEIRO'
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Gavel size={16} className={role === 'LEILOEIRO' ? 'text-blue-600' : 'text-slate-400'} />
              <strong className="text-sm text-slate-900 dark:text-slate-100">Leiloeiro</strong>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block leading-tight">
              Publicar e gerenciar lotes
            </span>
          </button>
        </div>
      </div>

      <Input
        label="Nome completo"
        placeholder="Seu nome ou razão social"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        icon={<User size={18} />}
        className="rounded-md"
      />

      <Input
        label="E-mail de acesso"
        type="email"
        placeholder="seu-email@dominio.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={<Mail size={18} />}
        className="rounded-md"
      />

      <Input
        label="Crie uma senha"
        type={showPassword ? 'text' : 'password'}
        placeholder="Pelo menos 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        icon={<Lock size={18} />}
        className="rounded-md"
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-0 border-0 bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer flex items-center"
            tabIndex={-1}
            aria-label="Alternar visibilidade da senha"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      {registerMutation.isError && (
        <div className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 rounded-md py-2.5 px-3.5 text-xs font-medium text-center">
          {registerMutation.error.message}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={registerMutation.isPending}
        className="w-full font-bold mt-1"
      >
        {role === 'LICITANTE' ? 'Criar Conta de Licitante' : 'Criar Conta de Leiloeiro'}
      </Button>

      {onSwitchToLogin && (
        <div className="text-center mt-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Já possui cadastro?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="border-0 bg-transparent text-blue-600 dark:text-blue-400 font-bold text-sm cursor-pointer p-0 hover:underline"
          >
            Fazer login
          </button>
        </div>
      )}
    </form>
  );
}
