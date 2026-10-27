import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, icon, rightIcon, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
          } rounded-md text-sm outline-none transition-colors duration-150 ${
            icon ? 'pl-10' : 'pl-3'
          } ${rightIcon ? 'pr-11' : 'pr-3'} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 pl-2">
          {error}
        </span>
      )}
    </div>
  );
}
