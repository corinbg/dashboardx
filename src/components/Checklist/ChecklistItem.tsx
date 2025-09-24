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
    <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow">
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`flex-shrink-0 w-5 h-5 border-2 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-60 ${
          item.completata
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        title={item.completata ? 'Segna come non completata' : 'Segna come completata'}
        aria-label={item.completata ? 'Segna come non completata' : 'Segna come completata'}
      >
        {isToggling ? (
          <Loader className="h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          item.completata && (
          <Check className="h-3 w-3" aria-hidden="true" />
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
            Completata il {formatDate(item.completataAt)}
          </p>
        )}
      </div>
    </div>
  );
}