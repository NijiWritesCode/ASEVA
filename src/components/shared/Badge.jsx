import React from 'react';

export function Badge({ status, label, className = '' }) {
  const displayLabel = label || status?.replace(/_/g, ' ') || 'unknown';

  const styles = {
    // Enquiry statuses
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-amber-50 text-amber-800 border-amber-200',
    quotation_sent: 'bg-purple-50 text-purple-700 border-purple-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    declined: 'bg-rose-50 text-rose-700 border-rose-200',
    converted: 'bg-gold-100 text-gold-900 border-gold-300',

    // Payment statuses
    confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    fully_paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    partially_paid: 'bg-amber-50 text-amber-800 border-amber-200',
    unpaid: 'bg-rose-50 text-rose-800 border-rose-200',
    pending: 'bg-stone-100 text-stone-800 border-stone-200',

    // Task & Priority statuses
    completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    in_progress: 'bg-blue-50 text-blue-800 border-blue-200',
    cancelled: 'bg-stone-100 text-stone-500 border-stone-200',
    critical: 'bg-red-50 text-red-800 border-red-200',
    high: 'bg-orange-50 text-orange-800 border-orange-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-stone-50 text-stone-700 border-stone-200',
  }[status] || 'bg-stone-100 text-stone-700 border-stone-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase border ${styles} ${className}`}>
      {displayLabel}
    </span>
  );
}
