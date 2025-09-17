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
    <div className="text-center py-12" role="status" aria-live="polite">
      <div className="mx-auto w-12 h-12 mb-4">
        {getIcon()}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}