import React, { useState } from 'react';
import { useLoginMutation } from '@/entities/user/model/useUserQueries';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => onSuccess?.()
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <Input
        label="E-mail de acesso"
        type="email"
        placeholder="exemplo@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={<Mail size={18} />}
        className="rounded-md"
      />

      <Input
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        placeholder="Digite sua senha"
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

      {loginMutation.isError && (
        <div className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 rounded-md py-2.5 px-3.5 text-xs font-medium text-center">
          {loginMutation.error.message}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={loginMutation.isPending}
        className="w-full font-bold mt-1"
      >
        Entrar na Plataforma
      </Button>

      {onSwitchToRegister && (
        <div className="text-center mt-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Ainda não tem cadastro?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="border-0 bg-transparent text-blue-600 dark:text-blue-400 font-bold text-sm cursor-pointer p-0 hover:underline"
          >
            Criar conta
          </button>
        </div>
      )}
    </form>
  );
}
