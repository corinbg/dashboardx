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
        className={`inline-flex items-center font-medium rounded-full bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-soft animate-pulse-soft border border-danger-300 dark:border-danger-700 ${sizeClasses}`}
        role="status"
        aria-label="Urgent request"
      >
        URGENT
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200 dark:from-gray-700 dark:to-gray-600 dark:text-gray-400 dark:border-gray-600 ${sizeClasses}`}
      role="status"
      aria-label="Non-urgent request"
    >
      NO
    </span>
  );
}