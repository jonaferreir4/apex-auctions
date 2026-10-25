import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, style, id, ...props }: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', textAlign: 'left' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: icon ? '0.65rem 0.875rem 0.65rem 2.5rem' : '0.65rem 0.875rem',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
            ...style
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
