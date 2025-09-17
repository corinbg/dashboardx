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
          color: 'bg-gradient-to-r from-danger-100 to-danger-50 text-danger-700 border border-danger-200 dark:from-danger-900/50 dark:to-danger-800/30 dark:text-danger-300 dark:border-danger-700/50',
          label: 'Unread'
        };
      case 'Letto':
        return {
          color: 'bg-gradient-to-r from-warning-100 to-warning-50 text-warning-700 border border-warning-200 dark:from-warning-900/50 dark:to-warning-800/30 dark:text-warning-300 dark:border-warning-700/50',
          label: 'Read'
        };
      case 'Contattato':
        return {
          color: 'bg-gradient-to-r from-primary-100 to-accent-50 text-primary-700 border border-primary-200 dark:from-primary-900/50 dark:to-accent-800/30 dark:text-primary-300 dark:border-primary-700/50',
          label: 'Contacted'
        };
      case 'Completato':
        return {
          color: 'bg-gradient-to-r from-success-100 to-success-50 text-success-700 border border-success-200 dark:from-success-900/50 dark:to-success-800/30 dark:text-success-300 dark:border-success-700/50',
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300 dark:border-gray-600',
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
      className={`inline-flex items-center font-medium rounded-full shadow-sm ${config.color} ${sizeClasses}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}