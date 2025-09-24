import React from 'react';

interface UrgencyBadgeProps {
  urgent: boolean;
  size?: 'sm' | 'md';
}

export function UrgencyBadge({ urgent, size = 'md' }: UrgencyBadgeProps) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs' 
    : 'px-2.5 py-0.5 text-sm';

  if (urgent) {
    return (
      <span 
        className={`inline-flex items-center font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 ${sizeClasses}`}
        role="status"
        aria-label="Richiesta urgente"
      >
        URGENTE
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 ${sizeClasses}`}
      role="status"
      aria-label="Richiesta non urgente"
    >
      NON URGENTE
    </span>
  );
}