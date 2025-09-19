import React, { useEffect, useState } from 'react';
import { CheckCircle, BookOpen, Wrench, AlertCircle } from 'lucide-react';

export function EmailConfirmationPage() {
  const [status, setStatus] = useState<string>('loading');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // Leggi i parametri dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('request_id');
        const statusParam = urlParams.get('status');

        if (!requestId || !statusParam) {
          setError('Parametri mancanti nell\'URL');
          setStatus('error');
          return;
        }

        // Chiama il webhook n8n
        const webhookUrl = `https://n8n-h3a7.onrender.com/webhook/4968119c-0181-4f46-b137-893078b84a22?request_id=${requestId}&status=${statusParam}`;
        
        console.log('🔗 Calling webhook:', webhookUrl);
        
        const response = await fetch(webhookUrl, {
          method: 'GET',
          mode: 'no-cors' // Per evitare problemi CORS con webhook esterno
        });

        // Imposta il messaggio in base allo status
        let confirmMessage = '';
        switch (statusParam) {
          case 'Letto':
            confirmMessage = '📖 Richiesta segnata come vista';
            break;
          case 'Completato':
            confirmMessage = '🛠️ Richiesta segnata come completata';
            break;
          default:
            confirmMessage = '✅ Stato aggiornato con successo';
            break;
        }

        setMessage(confirmMessage);
        setStatus('success');
        
      } catch (err) {
        console.error('Error calling webhook:', err);
        setError('Errore durante l\'aggiornamento dello stato');
        setStatus('error');
      }
    };

    handleConfirmation();
  }, []);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-400 mb-6"></div>
        );
      case 'success':
        if (message.includes('vista')) {
          return <BookOpen className="h-16 w-16 text-green-400 mb-6" />;
        } else if (message.includes('completata')) {
          return <Wrench className="h-16 w-16 text-green-400 mb-6" />;
        }
        return <CheckCircle className="h-16 w-16 text-green-400 mb-6" />;
      case 'error':
        return <AlertCircle className="h-16 w-16 text-red-400 mb-6" />;
      default:
        return <CheckCircle className="h-16 w-16 text-green-400 mb-6" />;
    }
  };

  const getDisplayMessage = () => {
    switch (status) {
      case 'loading':
        return 'Aggiornamento in corso...';
      case 'success':
        return message;
      case 'error':
        return error || 'Si è verificato un errore';
      default:
        return 'Elaborazione...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Plumber Assistant
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-400 mx-auto rounded-full"></div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          {getIcon()}
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {getDisplayMessage()}
          </h2>
          
          {status === 'success' && (
            <p className="text-gray-400 text-lg">
              L'aggiornamento è stato registrato nel sistema
            </p>
          )}
          
          {status === 'error' && (
            <p className="text-gray-400 text-lg">
              Contatta l'amministratore se il problema persiste
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Questa pagina si chiuderà automaticamente
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-600/20 to-green-600/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-green-600/20 to-blue-600/20 blur-3xl"></div>
      </div>
    </div>
  );
}