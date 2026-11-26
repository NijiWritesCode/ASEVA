import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    options = [],
    required,
    className = '',
    id,
    placeholder = 'Select an option...',
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-semibold text-obsidian-800 uppercase tracking-widest"
        >
          {label} {required && <span className="text-gold-600">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={`w-full px-3.5 py-2.5 bg-sand-50/80 border text-xs text-obsidian-900 rounded-sm appearance-none transition-colors focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-400 pr-9 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
              : 'border-sand-300'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children
            ? children
            : options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-obsidian-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="text-[11px] text-rose-700 font-medium">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-obsidian-500 font-light">{helperText}</p>
      )}
    </div>
  );
});
