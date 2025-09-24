import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ChecklistItemComponent } from '../components/Checklist/ChecklistItem';
import { EmptyState } from '../components/UI/EmptyState';

export function ChecklistPage() {
  const { checklist, addChecklistItem, toggleChecklistItem, loading } = useApp();
  const { user } = useAuth();
  const [newItemText, setNewItemText] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const todoItems = checklist.filter(item => !item.completata);
  const completedItems = checklist.filter(item => item.completata)
    .sort((a, b) => {
      if (!a.completataAt || !b.completataAt) return 0;
      return new Date(b.completataAt).getTime() - new Date(a.completataAt).getTime();
    });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Devi essere autenticato per aggiungere elementi alla checklist');
      return;
    }
    if (newItemText.trim()) {
      setIsAdding(true);
      addChecklistItem(newItemText.trim())
        .then(() => {
          // Item added successfully
        })
        .catch((error) => {
          console.error('Error adding item:', error);
          alert('Errore durante l\'aggiunta dell\'elemento');
        })
        .finally(() => {
          setIsAdding(false);
        });
      setNewItemText('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Checklist
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestisci le tue attività quotidiane
          </p>
          {!user && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Devi essere autenticato per usare la checklist
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add New Item */}
        <form onSubmit={handleAddItem} className="mb-8">
          <div className="flex space-x-3">
            <div className="flex-1">
              <label htmlFor="new-item" className="sr-only">
                Add new activity
              </label>
              <input
                id="new-item"
                type="text"
                placeholder="Aggiungi nuova attività..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!newItemText.trim() || isAdding || !user}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] justify-center"
              aria-label="Add activity"
            >
              {isAdding ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Aggiunta...</span>
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="ml-1 hidden sm:inline">Aggiungi</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Todo Items */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Da fare ({todoItems.length})
          </h2>
          {todoItems.length === 0 ? (
            <EmptyState
              type="checklist"
              title="Nessuna attività da fare"
              description="Ottimo lavoro! Non hai attività in sospeso."
            />
          ) : (
            <div className="space-y-3">
              {todoItems.map((item) => (
                <ChecklistItemComponent
                  key={item.id}
                  item={item}
                  onToggle={toggleChecklistItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center w-full text-left p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              aria-expanded={showCompleted}
              aria-controls="completed-items"
            >
              <div className="flex-1">
                <h2 className="text-lg font-medium text-green-800 dark:text-green-200">
                  Completate ({completedItems.length})
                </h2>
              </div>
              {showCompleted ? (
                <ChevronUp className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              )}
            </button>

            <div 
              id="completed-items"
              className={`space-y-3 transition-all duration-200 ease-in-out ${
                showCompleted ? 'block' : 'hidden'
              }`}
            >
              {completedItems.map((item) => (
                <ChecklistItemComponent
                  key={item.id}
                  item={item}
                  onToggle={toggleChecklistItem}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}