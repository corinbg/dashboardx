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
          color: 'bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-700 font-semibold',
          label: 'Non letto'
        };
      case 'Letto':
        return {
          color: 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-700 font-semibold',
          label: 'Letto'
        };
      case 'Contattato':
        return {
          color: 'bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700 font-semibold',
          label: 'Contattato'
        };
      case 'Completato':
        return {
          color: 'bg-green-50 text-green-900 border border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-700 font-semibold',
          label: 'Completato'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-900 border border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 font-medium',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' 
    ? 'px-3 py-1.5 text-sm' 
    : 'px-4 py-2 text-base';

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${config.color} ${sizeClasses}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}