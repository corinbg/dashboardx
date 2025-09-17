import React from 'react';
import { ChecklistItem as ChecklistItemType } from '../../types';
import { Check, Loader } from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => Promise<void>;
}

export function ChecklistItemComponent({ item, onToggle }: ChecklistItemProps) {
  const [isToggling, setIsToggling] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle(item.id);
    } catch (error) {
      console.error('Error toggling item:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-soft hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200">
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`flex-shrink-0 w-6 h-6 border-2 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-60 shadow-sm ${
          item.completata
            ? 'bg-gradient-to-r from-success-500 to-success-600 border-success-500 text-white hover:from-success-600 hover:to-success-700'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700'
        }`}
        title={item.completata ? 'Mark as not completed' : 'Mark as completed'}
        aria-label={item.completata ? 'Mark as not completed' : 'Mark as completed'}
      >
        {isToggling ? (
          <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          item.completata && (
          <Check className="h-4 w-4" aria-hidden="true" />
          )
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${
          item.completata 
            ? 'text-gray-500 dark:text-gray-400 line-through' 
            : 'text-gray-900 dark:text-white'
        }`}>
          {item.testo}
        </p>
        {item.completata && item.completataAt && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Completed on {formatDate(item.completataAt)}
          </p>
        )}
      </div>
    </div>
  );
}