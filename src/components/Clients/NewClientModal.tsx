import React, { useState } from 'react';
import { X, User, MapPin, Home, Loader2 } from 'lucide-react';
import { Client } from '../../types';
import { PhoneInputWithCountryCode } from '../UI/PhoneInputWithCountryCode';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function NewClientModal({ isOpen, onClose, onSave }: NewClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nominativo: '',
    telefono: '',
    luogo: '',
    indirizzo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.nominativo.trim()) {
      newErrors.nominativo = 'Il nome è obbligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Il telefono è obbligatorio';
    } else if (!/^\+[0-9]{1,4}[0-9\s\-\(\)]{7,15}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'Formato telefono non valido';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        nominativo: formData.nominativo.trim(),
        telefono: formData.telefono.trim(),
        luogo: formData.luogo.trim() || null,
        indirizzo: formData.indirizzo.trim() || null,
      });
      
      // Reset form
      setFormData({
        nominativo: '',
        telefono: '',
        luogo: '',
        indirizzo: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
      setErrors({ general: 'Errore durante la creazione del cliente' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nominativo: '',
        telefono: '',
        luogo: '',
        indirizzo: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              Nuovo Cliente
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="Chiudi modal"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
              </div>
            )}

            {/* Nome */}
            <div>
              <label htmlFor="nominativo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="nominativo"
                  type="text"
                  value={formData.nominativo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nominativo: e.target.value }))}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.nominativo
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Mario Rossi"
                  disabled={loading}
                />
              </div>
              {errors.nominativo && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nominativo}</p>
              )}
            </div>

            {/* Telefono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefono *
              </label>
              <PhoneInputWithCountryCode
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={(value) => setFormData(prev => ({ ...prev, telefono: value }))}
                error={errors.telefono}
                disabled={loading}
                required
                placeholder="320 1234567"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefono}</p>
              )}
            </div>

            {/* Città */}
            <div>
              <label htmlFor="luogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Città
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="luogo"
                  type="text"
                  value={formData.luogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, luogo: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Milano"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Indirizzo */}
            <div>
              <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indirizzo Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="indirizzo"
                  type="text"
                  value={formData.indirizzo}
                  onChange={(e) => setFormData(prev => ({ ...prev, indirizzo: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Via Roma 123, 20100 Milano"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Salvataggio...
                  </>
                ) : (
                  'Salva Cliente'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}