import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-sand-300/80 shadow-sm rounded-sm p-6 ${
        hover ? 'transition-all duration-300 hover:shadow-md hover:border-gold-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-sand-200 mb-4 ${className}`}>
      <div>
        <h3 className="font-serif text-lg font-semibold text-obsidian-950">{title}</h3>
        {subtitle && <p className="text-xs text-obsidian-600 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
