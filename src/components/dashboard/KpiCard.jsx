import React from 'react';
import { Card } from '../shared/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  loading = false,
}) {
  const iconThemes = {
    default: 'bg-sand-200 text-obsidian-800',
    gold: 'bg-gold-100 text-gold-700',
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  const textThemes = {
    default: 'text-obsidian-950',
    gold: 'text-gold-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-800',
    blue: 'text-blue-800',
  };

  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-obsidian-600">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconThemes[variant] || iconThemes.default}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-24 bg-sand-200 animate-pulse rounded my-1" />
        ) : (
          <p className={`font-serif text-2xl font-bold tracking-tight ${textThemes[variant] || textThemes.default}`}>
            {value}
          </p>
        )}

        <div className="flex items-center justify-between mt-1 text-[11px] text-obsidian-500">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center font-medium ${
                trend.direction === 'up' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {trend.label}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
