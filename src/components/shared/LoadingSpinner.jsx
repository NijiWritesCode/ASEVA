import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }[size] || 'w-8 h-8 border-2';

  return (
    <div className={`inline-block animate-spin rounded-full border-solid border-gold-400 border-t-transparent ${sizeClasses} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-xs font-serif tracking-widest text-obsidian-700 uppercase">
        Loading ASEVA...
      </p>
    </div>
  );
}
