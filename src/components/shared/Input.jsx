import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    trailingIcon: TrailingIcon,
    onTrailingIconClick,
    required,
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold text-obsidian-800 uppercase tracking-widest"
        >
          {label} {required && <span className="text-gold-600">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-obsidian-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full px-3.5 py-2.5 bg-sand-50/80 border text-xs text-obsidian-900 rounded-sm placeholder:text-sand-500 transition-colors focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-400 ${
            Icon ? 'pl-9' : ''
          } ${TrailingIcon ? 'pr-9' : ''} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
              : 'border-sand-300'
          } ${className}`}
          {...props}
        />

        {TrailingIcon && (
          <button
            type="button"
            onClick={onTrailingIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-obsidian-400 hover:text-obsidian-800"
          >
            <TrailingIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-[11px] text-rose-700 font-medium">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-obsidian-500 font-light">{helperText}</p>
      )}
    </div>
  );
});
