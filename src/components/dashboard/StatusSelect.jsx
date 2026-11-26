import React from 'react';
import { Badge } from '../shared/Badge';

export function StatusSelect({
  value,
  onChange,
  options = [],
  disabled = false,
  className = '',
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
        aria-label="Change status"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none">
        <Badge status={value} />
      </div>
    </div>
  );
}
