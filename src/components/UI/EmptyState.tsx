import React from 'react';
import { FileX, Users, CheckSquare, Calendar, Settings } from 'lucide-react';

interface EmptyStateProps {
  type: 'requests' | 'clients' | 'checklist' | 'calendar' | 'settings';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'requests':
        return <FileX className="h-12 w-12 text-gray-400" aria-hidden="true" />;
      case 'clients':
        return <Users className="h-12 w-12 text-gray-400" aria-hidden="true" />;
      case 'checklist':
        return <CheckSquare className="h-12 w-12 text-gray-400" aria-hidden="true" />;
      case 'calendar':
        return <Calendar className="h-12 w-12 text-gray-400" aria-hidden="true" />;
      case 'settings':
        return <Settings className="h-12 w-12 text-gray-400" aria-hidden="true" />;
      default:
        return <FileX className="h-12 w-12 text-gray-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="text-center py-16" role="status" aria-live="polite">
      <div className="mx-auto w-16 h-16 mb-6 p-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
        {getIcon()}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <div className="mt-8">
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-soft text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}