import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

type SubscriptionStatus = 'pending' | 'active' | 'trial' | 'inactive' | 'expired';

export default function ProtectedDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !currentUser) {
        window.dispatchEvent(new CustomEvent('footer-nav', { detail: { tab: 'home' } }));
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        throw new Error('Errore nel recupero del profilo');
      }

      if (!profile) {
        window.dispatchEvent(new CustomEvent('footer-nav', { detail: { tab: 'abbonati' } }));
        return;
      }

      const status = profile.subscription_status as SubscriptionStatus;
      setSubscriptionStatus(status);

      if (status !== 'active' && status !== 'trial') {
        window.dispatchEvent(new CustomEvent('footer-nav', { detail: { tab: 'abbonati' } }));
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error('Error checking access:', err);
      setError('Errore di connessione');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Caricamento in corso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Errore di connessione</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Non è stato possibile verificare il tuo accesso. Controlla la tua connessione e riprova.
          </p>
          <button
            onClick={checkAccess}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Protetta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Benvenuto nella dashboard riservata agli abbonati
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Stato Abbonamento
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                {subscriptionStatus === 'trial' ? 'Prova Gratuita' : 'Attivo'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Accesso Completo
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Tutte le funzionalità sono disponibili
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Supporto Premium
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Assistenza prioritaria attiva
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contenuto Riservato
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Questa è un'area protetta accessibile solo agli utenti con abbonamento attivo o in prova.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Qui puoi inserire tutti i contenuti e le funzionalità premium della tua applicazione.
            </p>
          </div>

          {user && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Account: <span className="font-medium text-gray-700 dark:text-gray-300">{user.email}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
