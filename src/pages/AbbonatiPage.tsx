import { Mail, Phone, MessageCircle, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AbbonatiPage() {
  const { user } = useAuth();

  const handleNavigateHome = () => {
    window.dispatchEvent(new CustomEvent('footer-nav', { detail: { tab: 'home' } }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Attiva il tuo abbonamento
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Per accedere a Impresa Pronta è necessario un abbonamento attivo
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Come procedere:
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                <span>Contatta il nostro team commerciale per attivare il tuo abbonamento</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                <span>Riceverai le credenziali per accedere alla piattaforma</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                <span>Inizia subito a gestire la tua attività con tutti gli strumenti disponibili</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              Contattaci:
            </h3>
            <a
              href="mailto:supporto@impresapronta.it"
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Email</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">supporto@impresapronta.it</div>
              </div>
            </a>

            <a
              href="tel:+393331234567"
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Telefono</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">+39 333 123 4567</div>
              </div>
            </a>
          </div>

          {user && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Account attivo: {user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Torna alla home
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hai già un abbonamento attivo?{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Ricarica la pagina
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
