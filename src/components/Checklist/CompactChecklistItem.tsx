import React from 'react';
import { AlertTriangle, Calendar, GripVertical } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from '../../types';
import { Check, Loader } from 'lucide-react';

interface CompactChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => Promise<void>;
  onEdit?: (item: ChecklistItemType) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function CompactChecklistItem({
  item,
  onToggle,
  onEdit,
  isDragging = false,
  dragHandleProps
}: CompactChecklistItemProps) {
  const [isToggling, setIsToggling] = React.useState(false);

  const getDueDateStatus = () => {
    if (!item.dataScadenza) return null;

    const due = new Date(item.dataScadenza);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return { type: 'overdue', text: `${Math.abs(diffDays)}g`, color: 'text-red-600' };
    if (diffDays === 0) return { type: 'today', text: 'Oggi', color: 'text-red-600' };
    if (diffDays === 1) return { type: 'tomorrow', text: '1g', color: 'text-amber-600' };
    if (diffDays <= 7) return { type: 'soon', text: `${diffDays}g`, color: 'text-amber-600' };
    return { type: 'future', text: `${diffDays}g`, color: 'text-gray-600' };
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

  const handleItemClick = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const getPriorityColor = () => {
    switch (item.priorita) {
      case 'alta': return 'text-red-500';
      case 'media': return 'text-amber-500';
      case 'bassa': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div
      className={`group flex items-center space-x-2 p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-1 shadow-md' : ''
      } ${item.completata ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} ${onEdit ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600' : ''}`}
      onClick={handleItemClick}
      role={onEdit ? "button" : undefined}
      tabIndex={onEdit ? 0 : undefined}
    >
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3" />
        </div>
      )}

      <div className={`flex items-center justify-center w-4 h-4 flex-shrink-0 ${getPriorityColor()}`}>
        {item.priorita !== 'none' && <AlertTriangle className="h-3 w-3" />}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        disabled={isToggling}
        className={`flex-shrink-0 w-4 h-4 border-2 rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-60 ${
          item.completata
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        {isToggling ? (
          <Loader className="h-2 w-2 animate-spin" />
        ) : (
          item.completata && <Check className="h-2 w-2" />
        )}
      </button>

      <div className="flex-1 min-w-0 flex items-center justify-between">
        <p className={`text-sm truncate ${
          item.completata
            ? 'text-gray-500 dark:text-gray-400 line-through'
            : 'text-gray-900 dark:text-white'
        }`}>
          {item.testo}
        </p>

        {dueDateStatus && (
          <span className={`flex-shrink-0 ml-2 inline-flex items-center text-xs font-medium ${dueDateStatus.color}`}>
            <Calendar className="h-3 w-3 mr-0.5" />
            {dueDateStatus.text}
          </span>
        )}
      </div>
    </div>
  );
}
