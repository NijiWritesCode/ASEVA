import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-sand-200/90 rounded-sm animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-sand-300/80 p-6 rounded-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr className="border-b border-sand-200">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function LoadingSkeleton({ variant = 'card', count = 1, className = '' }) {
  if (variant === 'title') {
    return <Skeleton className={`h-8 w-64 ${className}`} />;
  }
  if (variant === 'table') {
    return (
      <div className={`bg-white border border-sand-300 rounded-sm p-6 space-y-3 ${className}`}>
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
  }
  return <SkeletonCard />;
}

export default LoadingSkeleton;
