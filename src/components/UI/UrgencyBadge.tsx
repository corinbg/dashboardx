import React from 'react';

interface UrgencyBadgeProps {
  urgent: boolean;
  size?: 'sm' | 'md';
}

export function UrgencyBadge({ urgent, size = 'md' }: UrgencyBadgeProps) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs font-medium' 
    : 'px-3 py-1.5 text-sm font-semibold';

  if (urgent) {
    return (
      <span 
        className={`inline-flex items-center rounded-lg bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 shadow-sm ${sizeClasses}`}
        role="status"
        aria-label="Richiesta urgente"
      >
        <span className="mr-1">🚨</span>
        <span>URGENTE</span>
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center rounded-lg bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-600 shadow-sm ${sizeClasses}`}
      role="status"
      aria-label="Richiesta non urgente"
    >
      ✅ NORMALE
    </span>
  );
}