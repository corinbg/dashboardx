import React from 'react';
import { Request } from '../../types';

interface StatusBadgeProps {
  status: Request['stato'];
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (status: Request['stato']) => {
    switch (status) {
      case 'Non letto':
        return {
          color: 'bg-red-100 text-red-900 border-2 border-red-300 dark:bg-red-900/50 dark:text-red-100 dark:border-red-600 font-bold shadow-sm',
          label: 'Non letto'
        };
      case 'Letto':
        return {
          color: 'bg-amber-100 text-amber-900 border-2 border-amber-300 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-600 font-bold shadow-sm',
          label: 'Letto'
        };
      case 'Contattato':
        return {
          color: 'bg-blue-100 text-blue-900 border-2 border-blue-300 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-600 font-bold shadow-sm',
          label: 'Contattato'
        };
      case 'Completato':
        return {
          color: 'bg-green-100 text-green-900 border-2 border-green-300 dark:bg-green-900/50 dark:text-green-100 dark:border-green-600 font-bold shadow-sm',
          label: 'Completato'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-900 border-2 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 font-medium shadow-sm',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' 
    ? 'px-3 py-1.5 text-xs' 
    : 'px-4 py-2 text-sm';

  return (
    <span 
      className={`inline-flex items-center font-bold rounded-lg ${config.color} ${sizeClasses}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}