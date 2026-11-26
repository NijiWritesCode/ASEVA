import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No records located',
  description = 'There are no active records in this section matching your current query.',
  action,
  className = '',
}) {
  return (
    <div
      className={`min-h-[220px] flex flex-col items-center justify-center p-8 text-center bg-sand-50/50 border border-dashed border-sand-300 rounded-sm ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-sand-200/80 text-obsidian-600 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gold-600" />
      </div>

      <h4 className="font-serif text-base font-semibold text-obsidian-950 mb-1">
        {title}
      </h4>

      <p className="text-xs text-obsidian-500 max-w-sm mb-5 leading-relaxed font-light">
        {description}
      </p>

      {action && (
        <Button
          variant={action.variant || 'primary'}
          size="sm"
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
