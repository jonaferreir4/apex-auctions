import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base'
  }[size];

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs border-transparent',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-transparent',
    outline: 'bg-transparent text-slate-800 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-md border transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap outline-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
