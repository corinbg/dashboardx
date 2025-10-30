import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ChecklistItem } from '../../types';

interface QuickCompleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCompleteTaskModal({ isOpen, onClose }: QuickCompleteTaskModalProps) {
  const { checklist, toggleChecklistItem } = useApp();
  const [completing, setCompleting] = useState<string | null>(null);

  // Filter pending tasks (not completed)
  const pendingTasks = checklist.filter(item => !item.completata).slice(0, 8); // Show max 8 tasks

  const handleCompleteTask = async (taskId: string) => {
    setCompleting(taskId);
    try {
      await toggleChecklistItem(taskId);
      onClose();
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setCompleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'media':
        return <AlertTriangle className="h-3 w-3 text-amber-500" />;
      case 'bassa':
        return <AlertTriangle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              Completa Attività
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Chiudi modal"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Tutto completato!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Non ci sono attività in sospeso da completare.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Seleziona un'attività da completare ({pendingTasks.length} attività in sospeso):
                </p>
                
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                      {getPriorityIcon(task.priorita)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {task.testo}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {task.categoria}
                        </span>
                        
                        {task.dataScadenza && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(task.dataScadenza)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={completing === task.id}
                      className="inline-flex items-center px-3 py-2 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/70 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                    >
                      {completing === task.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completa
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {pendingTasks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  // Navigate to checklist page for full management
                  onClose();
                  // This would need to be passed as a prop, but for now we'll close the modal
                }}
                className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
              >
                Vai alla Checklist Completa →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}