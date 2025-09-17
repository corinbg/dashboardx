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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200">
            Checklist
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your daily activities
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-gradient-to-r from-warning-50 to-warning-25 dark:from-warning-900/20 dark:to-warning-800/10 border border-warning-200 dark:border-warning-800 rounded-xl">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-warning-500" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-warning-700 dark:text-warning-200 font-medium">
                    You must be authenticated to use the checklist
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
                placeholder="Add new activity..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!newItemText.trim() || isAdding || !user}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-soft text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px] justify-center"
              aria-label="Add activity"
            >
              {isAdding ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Adding...</span>
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="ml-1 hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Todo Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            To do ({todoItems.length})
          </h2>
          {todoItems.length === 0 ? (
            <EmptyState
              type="checklist"
              title="No activities to do"
              description="Great job! You have no pending activities."
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
                  Completed ({completedItems.length})
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