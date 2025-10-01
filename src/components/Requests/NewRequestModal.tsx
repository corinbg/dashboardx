import React, { useState } from 'react';
import { X, User, MapPin, Wrench, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Request } from '../../types';
import { PhoneInputWithCountryCode } from '../UI/PhoneInputWithCountryCode';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: Omit<Request, 'id' | 'richiestaAt' | 'spamFuoriZona'>) => Promise<void>;
}

export function NewRequestModal({ isOpen, onClose, onSave }: NewRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Nome: '',
    Numero: '',
    Citta: '',
    Indirizzo: '',
    Problema: '',
    PreferenzaRicontatto: '',
    Urgenza: false,
    stato: 'Non letto' as Request['stato']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.Nome.trim()) {
      newErrors.Nome = 'Il nome è obbligatorio';
    }
    if (!formData.Numero.trim()) {
      newErrors.Numero = 'Il telefono è obbligatorio';
    } else if (!/^\+[0-9]{1,4}[0-9\s\-\(\)]{7,15}$/.test(formData.Numero.trim())) {
      newErrors.Numero = 'Formato telefono non valido';
    }
    if (!formData.Citta.trim()) {
      newErrors.Citta = 'La città è obbligatoria';
    }
    if (!formData.Problema.trim()) {
      newErrors.Problema = 'Il tipo di problema è obbligatorio';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        Nome: formData.Nome.trim(),
        Numero: formData.Numero.trim(),
        Citta: formData.Citta.trim(),
        Indirizzo: formData.Indirizzo.trim(),
        Problema: formData.Problema.trim(),
        PreferenzaRicontatto: formData.PreferenzaRicontatto.trim() || 'Non specificato',
        Urgenza: formData.Urgenza,
        stato: formData.stato
      });
      
      // Reset form
      setFormData({
        Nome: '',
        Numero: '',
        Citta: '',
        Indirizzo: '',
        Problema: '',
        PreferenzaRicontatto: '',
        Urgenza: false,
        stato: 'Non letto'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      setErrors({ general: 'Errore durante la creazione della richiesta' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        Nome: '',
        Numero: '',
        Citta: '',
        Indirizzo: '',
        Problema: '',
        PreferenzaRicontatto: '',
        Urgenza: false,
        stato: 'Non letto'
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              Nuova Richiesta
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

            {/* Nome Cliente */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Cliente *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="nome"
                  type="text"
                  value={formData.Nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, Nome: e.target.value }))}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.Nome
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Mario Rossi"
                  disabled={loading}
                />
              </div>
              {errors.Nome && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Nome}</p>
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
                value={formData.Numero}
                onChange={(value) => setFormData(prev => ({ ...prev, Numero: value }))}
                error={errors.Numero}
                disabled={loading}
                required
                placeholder="320 1234567"
              />
              {errors.Numero && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Numero}</p>
              )}
            </div>

            {/* Città */}
            <div>
              <label htmlFor="citta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Città *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="citta"
                  type="text"
                  value={formData.Citta}
                  onChange={(e) => setFormData(prev => ({ ...prev, Citta: e.target.value }))}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.Citta
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Milano"
                  disabled={loading}
                />
              </div>
              {errors.Citta && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Citta}</p>
              )}
            </div>

            {/* Indirizzo */}
            <div>
              <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indirizzo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="indirizzo"
                  type="text"
                  value={formData.Indirizzo}
                  onChange={(e) => setFormData(prev => ({ ...prev, Indirizzo: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Via Roma 123"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Tipo Problema */}
            <div>
              <label htmlFor="problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo di Problema *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wrench className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="problema"
                  value={formData.Problema}
                  onChange={(e) => setFormData(prev => ({ ...prev, Problema: e.target.value }))}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.Problema
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  disabled={loading}
                >
                  <option value="">Seleziona tipo problema</option>
                  <option value="Riparazione perdita">Riparazione perdita</option>
                  <option value="Manutenzione caldaia">Manutenzione caldaia</option>
                  <option value="Installazione boiler">Installazione boiler</option>
                  <option value="Spurgo scarichi">Spurgo scarichi</option>
                  <option value="Controllo impianto">Controllo impianto</option>
                  <option value="Sostituzione rubinetteria">Sostituzione rubinetteria</option>
                  <option value="Altro">Altro</option>
                </select>
              </div>
              {errors.Problema && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Problema}</p>
              )}
            </div>

            {/* Preferenza Ricontatto */}
            <div>
              <label htmlFor="ricontatto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferenza Ricontatto
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="ricontatto"
                  type="text"
                  value={formData.PreferenzaRicontatto}
                  onChange={(e) => setFormData(prev => ({ ...prev, PreferenzaRicontatto: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Il prima possibile, oggi pomeriggio, etc."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Urgenza */}
            <div className="flex items-center space-x-2">
              <input
                id="urgenza"
                type="checkbox"
                checked={formData.Urgenza}
                onChange={(e) => setFormData(prev => ({ ...prev, Urgenza: e.target.checked }))}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:opacity-50"
                disabled={loading}
              />
              <label htmlFor="urgenza" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Richiesta Urgente
              </label>
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
                  'Crea Richiesta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}