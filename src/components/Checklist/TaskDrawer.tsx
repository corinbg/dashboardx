import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Tag, Trash2, CreditCard as Edit2, Check, Clock, Repeat, RotateCcw } from 'lucide-react';
import { ChecklistItem, Priority, Category } from '../../types';
import { CategoryTag } from './CategoryTag';
import { PrioritySelector } from './PrioritySelector';
import { DueDatePicker } from './DueDatePicker';
import { ConfirmDialog } from '../UI/ConfirmDialog';

interface TaskDrawerProps {
  task: ChecklistItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ChecklistItem>) => Promise<void>;
  onDelete: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export function TaskDrawer({ task, isOpen, onClose, onUpdate, onDelete, onToggle }: TaskDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editData, setEditData] = useState({
    testo: '',
    priorita: 'media' as Priority,
    categoria: 'Generale' as Category,
    categoriaCustom: '',
    dataScadenza: '',
    dataPromemoria: '',
    ricorrente: 'none' as 'none' | 'giornaliero' | 'settimanale' | 'mensile',
  });

  useEffect(() => {
    if (task && isOpen) {
      setEditData({
        testo: task.testo,
        priorita: task.priorita,
        categoria: task.categoria,
        categoriaCustom: task.categoriaCustom || '',
        dataScadenza: task.dataScadenza || '',
        dataPromemoria: task.dataPromemoria || '',
        ricorrente: task.ricorrente || 'none',
      });
    }
  }, [
    task?.id,
    task?.testo,
    task?.priorita,
    task?.categoria,
    task?.categoriaCustom,
    task?.dataScadenza,
    task?.dataPromemoria,
    task?.ricorrente,
    isOpen
  ]);

  const handleSave = async () => {
    if (!task) return;

    setLoading(true);
    try {
      await onUpdate(task.id, {
        testo: editData.testo,
        priorita: editData.priorita,
        categoria: editData.categoria,
        categoriaCustom: editData.categoriaCustom || null,
        dataScadenza: editData.dataScadenza || null,
        dataPromemoria: editData.dataPromemoria || null,
        ricorrente: editData.ricorrente,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Errore durante l\'aggiornamento dell\'attività');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setLoading(true);
    try {
      await onDelete(task.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Errore durante l\'eliminazione dell\'attività');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    setLoading(true);
    try {
      await onToggle(task.id);
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Errore durante l\'aggiornamento dello stato');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDueDateStatus = () => {
    if (!task?.dataScadenza) return null;

    const due = new Date(task.dataScadenza);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return { type: 'overdue', text: `Scaduta da ${Math.abs(diffDays)} giorni`, color: 'text-red-600' };
    if (diffDays === 0) return { type: 'today', text: 'Scade oggi', color: 'text-red-600' };
    if (diffDays === 1) return { type: 'tomorrow', text: 'Scade domani', color: 'text-amber-600' };
    if (diffDays <= 3) return { type: 'soon', text: `Scade in ${diffDays} giorni`, color: 'text-amber-600' };
    return { type: 'future', text: `Scade in ${diffDays} giorni`, color: 'text-gray-600' };
  };

  const dueDateStatus = getDueDateStatus();

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="drawer-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
          <div className="w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-scroll">
              <div className="flex-1">
                <div className="px-4 py-6 bg-blue-600 dark:bg-blue-800 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 id="drawer-title" className="text-lg font-medium text-white">
                      {isEditing ? 'Modifica Attività' : 'Dettagli Attività'}
                    </h2>
                    <div className="ml-3 h-7 flex items-center">
                      <button
                        onClick={onClose}
                        className="bg-blue-700 dark:bg-blue-900 rounded-md text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <span className="sr-only">Chiudi pannello</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-6 sm:px-6">
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          {task.testo}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            task.completata
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {task.completata ? 'Completata' : 'Da fare'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Priorità</p>
                            <p className={`text-base font-medium ${
                              task.priorita === 'alta' ? 'text-red-600 dark:text-red-400' :
                              task.priorita === 'media' ? 'text-amber-600 dark:text-amber-400' :
                              'text-green-600 dark:text-green-400'
                            }`}>
                              {task.priorita.charAt(0).toUpperCase() + task.priorita.slice(1)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</p>
                            <div className="mt-1">
                              <CategoryTag category={task.categoria} customName={task.categoriaCustom} />
                            </div>
                          </div>
                        </div>

                        {task.dataScadenza && (
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Scadenza</p>
                              <p className="text-base text-gray-900 dark:text-white">{formatDate(task.dataScadenza)}</p>
                              {dueDateStatus && (
                                <p className={`text-sm font-medium mt-1 ${dueDateStatus.color}`}>
                                  {dueDateStatus.text}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {task.dataPromemoria && (
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Promemoria</p>
                              <p className="text-base text-gray-900 dark:text-white">{formatDate(task.dataPromemoria)}</p>
                            </div>
                          </div>
                        )}

                        {task.ricorrente && task.ricorrente !== 'none' && (
                          <div className="flex items-start">
                            <Repeat className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ricorrenza</p>
                              <p className="text-base text-gray-900 dark:text-white capitalize">{task.ricorrente}</p>
                            </div>
                          </div>
                        )}

                        {task.completata && task.completataAt && (
                          <div className="flex items-start">
                            <Check className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completata il</p>
                              <p className="text-base text-gray-900 dark:text-white">{formatDate(task.completataAt)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Azione Rapida</p>
                        {!task.completata ? (
                          <button
                            onClick={handleToggleComplete}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Segna come completata
                          </button>
                        ) : (
                          <button
                            onClick={handleToggleComplete}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Segna come non completata
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="edit-testo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Descrizione *
                        </label>
                        <textarea
                          id="edit-testo"
                          required
                          rows={3}
                          value={editData.testo}
                          onChange={(e) => setEditData({ ...editData, testo: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Priorità *
                        </label>
                        <PrioritySelector
                          value={editData.priorita}
                          onChange={(priorita) => setEditData({ ...editData, priorita })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Categoria *
                        </label>
                        <select
                          required
                          value={editData.categoria}
                          onChange={(e) => setEditData({ ...editData, categoria: e.target.value as Category })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        >
                          <option value="Generale">Generale</option>
                          <option value="Lavoro">Lavoro</option>
                          <option value="Personale">Personale</option>
                          <option value="Acquisti">Acquisti</option>
                          <option value="Casa">Casa</option>
                          <option value="Custom">Personalizzata</option>
                        </select>
                      </div>

                      {editData.categoria === 'Custom' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nome Categoria Personalizzata
                          </label>
                          <input
                            type="text"
                            value={editData.categoriaCustom}
                            onChange={(e) => setEditData({ ...editData, categoriaCustom: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                            placeholder="es. Fitness"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Data Scadenza
                        </label>
                        <DueDatePicker
                          value={editData.dataScadenza}
                          onChange={(dataScadenza) => setEditData({ ...editData, dataScadenza })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Data Promemoria
                        </label>
                        <input
                          type="datetime-local"
                          value={editData.dataPromemoria}
                          onChange={(e) => setEditData({ ...editData, dataPromemoria: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ricorrenza
                        </label>
                        <select
                          value={editData.ricorrente}
                          onChange={(e) => setEditData({ ...editData, ricorrente: e.target.value as any })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        >
                          <option value="none">Nessuna</option>
                          <option value="giornaliero">Giornaliero</option>
                          <option value="settimanale">Settimanale</option>
                          <option value="mensile">Mensile</option>
                        </select>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 px-4 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                <div>
                  {!isEditing && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Elimina
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Annulla
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Salvataggio...' : 'Salva'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Chiudi
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifica
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Conferma Eliminazione"
        message={`Sei sicuro di voler eliminare l'attività "${task?.testo}"? Questa azione non può essere annullata.`}
        confirmLabel="Elimina Attività"
        cancelLabel="Annulla"
        isLoading={loading}
      />
    </div>
  );
}
