import React from 'react';

interface UrgencyBadgeProps {
  urgent: boolean;
  size?: 'sm' | 'md';
}

export function UrgencyBadge({ urgent, size = 'md' }: UrgencyBadgeProps) {
  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs font-extrabold' 
    : 'px-3 py-1.5 text-sm font-extrabold';

  if (urgent) {
    return (
      <span 
        className={`inline-flex items-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-700 shadow-lg ${sizeClasses}`}
        role="status"
        aria-label="Richiesta urgente"
      >
        <span className="animate-pulse">🚨</span>
        <span className="ml-1">URGENTE</span>
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center rounded-lg bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-600 shadow-sm ${sizeClasses}`}
      role="status"
      aria-label="Richiesta non urgente"
    >
      ✅ NORMALE
    </span>
  );
}