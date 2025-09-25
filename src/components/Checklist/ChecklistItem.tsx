import React from 'react';
import { AlertTriangle, Calendar, Clock, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from '../../types';
import { Check, Loader } from 'lucide-react';
import { CategoryTag } from './CategoryTag';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => Promise<void>;
  onEdit?: (item: ChecklistItemType) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function ChecklistItemComponent({ 
  item, 
  onToggle, 
  onEdit, 
  onDelete,
  isDragging = false,
  dragHandleProps 
}: ChecklistItemProps) {
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

  const getPriorityColor = () => {
    switch (item.priorita) {
      case 'alta':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'media':
        return 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/10';
      case 'bassa':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default:
        return 'border-l-4 border-l-gray-300 dark:border-l-gray-600';
    }
  };

  const getDueDateStatus = () => {
    if (!item.dataScadenza) return null;
    
    const due = new Date(item.dataScadenza);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { type: 'overdue', text: `Scaduta da ${Math.abs(diffDays)} giorni`, color: 'text-red-600', icon: '🔴' };
    if (diffDays === 0) return { type: 'today', text: 'Scade oggi', color: 'text-red-600', icon: '🔴' };
    if (diffDays === 1) return { type: 'tomorrow', text: 'Scade domani', color: 'text-amber-600', icon: '🟡' };
    if (diffDays <= 3) return { type: 'soon', text: `Scade in ${diffDays} giorni`, color: 'text-amber-600', icon: '🟡' };
    return { type: 'future', text: `Scade in ${diffDays} giorni`, color: 'text-gray-600', icon: '📅' };
  };

  const dueDateStatus = getDueDateStatus();

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
    <div 
      className={`flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${getPriorityColor()} ${
        isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''
      } ${item.completata ? 'opacity-75' : ''}`}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {/* Priority Indicator */}
      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
        {item.priorita === 'alta' && <AlertTriangle className="h-4 w-4 text-red-500" />}
        {item.priorita === 'media' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
        {item.priorita === 'bassa' && <AlertTriangle className="h-4 w-4 text-green-500" />}
      </div>

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
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <p className={`text-sm font-medium ${
              item.completata 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {item.testo}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Modifica attività"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Elimina attività"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          
          {/* Tags and Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <CategoryTag 
              category={item.categoria} 
              customName={item.categoriaCustom} 
              size="sm" 
            />
            
            {dueDateStatus && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                dueDateStatus.type === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                dueDateStatus.type === 'today' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                dueDateStatus.type === 'soon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                <Calendar className="h-3 w-3 mr-1" />
                {dueDateStatus.text}
              </span>
            )}
            
            {item.ricorrente && item.ricorrente !== 'none' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                🔄 {item.ricorrente}
              </span>
            )}
          </div>
          
          {item.completata && item.completataAt && (
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Completata il {formatDate(item.completataAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}