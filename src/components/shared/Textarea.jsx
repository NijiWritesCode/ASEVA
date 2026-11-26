import React, { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    required,
    rows = 4,
    className = '',
    id,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[11px] font-semibold text-obsidian-800 uppercase tracking-widest"
        >
          {label} {required && <span className="text-gold-600">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={`w-full px-3.5 py-2.5 bg-sand-50/80 border text-xs text-obsidian-900 rounded-sm placeholder:text-sand-500 transition-colors focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-400 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
            : 'border-sand-300'
        } ${className}`}
        {...props}
      />

      {error && (
        <p id={`${textareaId}-error`} className="text-[11px] text-rose-700 font-medium">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-obsidian-500 font-light">{helperText}</p>
      )}
    </div>
  );
});
