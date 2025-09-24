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
          color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
          label: 'Non letto'
        };
      case 'Letto':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
          label: 'Letto'
        };
      case 'Contattato':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
          label: 'Contattato'
        };
      case 'Completato':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
          label: 'Completato'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs' 
    : 'px-2.5 py-0.5 text-sm';

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