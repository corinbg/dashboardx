import React from 'react';

interface UrgencyBadgeProps {
  urgent: boolean;
  size?: 'sm' | 'md';
}

export function UrgencyBadge({ urgent, size = 'md' }: UrgencyBadgeProps) {
  const sizeClasses = size === 'sm' 
    ? 'px-3 py-1.5 text-sm font-bold' 
    : 'px-4 py-2 text-base font-bold';

  if (urgent) {
    return (
      <span 
        className={`inline-flex items-center rounded-full bg-red-600 text-white border-2 border-red-700 shadow-lg animate-pulse ${sizeClasses}`}
        role="status"
        aria-label="Richiesta urgente"
      >
        🚨 URGENTE
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center rounded-full bg-gray-200 text-gray-800 border border-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 ${sizeClasses}`}
      role="status"
      aria-label="Richiesta non urgente"
    >
      NON URGENTE
    </span>
  );
}