import React from 'react';
import { Cookie, Mail, ArrowLeft, ExternalLink } from 'lucide-react';

interface CookiePolicyPageProps {
  onBack: () => void;
}

export function CookiePolicyPage({ onBack }: CookiePolicyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Torna indietro</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Cookie className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cookie Policy
            </h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Ultimo aggiornamento: 22 ottobre 2025
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              La presente Cookie Policy descrive le modalità di utilizzo dei cookie e delle tecnologie simili
              sul sito{' '}
              <a href="https://impresapronta.it" className="text-blue-600 hover:underline">
                https://impresapronta.it
              </a>{' '}
              (di seguito "il Sito" o "la Piattaforma"), gestito da <strong>Impresa Pronta – Corin Angelo Danci</strong>,
              in conformità al Regolamento UE 2016/679 (GDPR) e alle Linee Guida del Garante per la protezione
              dei dati personali.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Cosa sono i cookie
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I cookie sono piccoli file di testo che i siti web inviano al browser dell'utente, dove vengono
                memorizzati per essere poi ritrasmessi allo stesso sito alla visita successiva. Servono per
                migliorare la navigazione, abilitare funzionalità tecniche o raccogliere dati statistici anonimi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Tipologie di cookie utilizzati
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Il sito <strong>Impresa Pronta</strong> utilizza esclusivamente cookie tecnici e cookie di analisi
                anonimi, indispensabili per il corretto funzionamento della piattaforma e per monitorarne le
                prestazioni.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-blue-900 dark:text-blue-100 font-semibold">
                  Non vengono installati cookie di profilazione o tracciamento pubblicitario.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    a) Cookie tecnici
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Questi cookie sono necessari per:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Garantire la navigazione e la fruizione del sito (es. login alla dashboard, preferenze di lingua)</li>
                    <li>Mantenere le sessioni utente attive</li>
                    <li>Ricordare le scelte di consenso sui cookie</li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                    Base giuridica: art. 6, par. 1, lett. f GDPR (legittimo interesse del titolare).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    b) Cookie analitici anonimi
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Utilizzati per raccogliere informazioni aggregate e anonime sull'uso del sito (es. numero di
                    visitatori, pagine più visitate, tempo medio di permanenza). Servono esclusivamente per analisi
                    statistiche interne e miglioramento dei servizi.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Esempi di strumenti utilizzati:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Netlify Analytics (statistiche anonime di traffico)</li>
                    <li>Supabase logs (metriche tecniche del database e accessi API)</li>
                    <li>Make.com / n8n (monitoraggio eventi automatici non riconducibili a singoli utenti)</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mt-3">
                    Questi cookie non raccolgono dati personali identificativi.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Cookie di terze parti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Il sito può includere funzionalità esterne (es. mappe, video, chatbot o moduli di contatto) che
                potrebbero utilizzare propri cookie tecnici o di servizio. In tal caso, tali cookie sono gestiti
                direttamente dai fornitori terzi.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3 font-medium">
                Esempi di servizi che potrebbero essere integrati:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>WhatsApp Business API (comunicazione automatica cliente-idraulico)</li>
                <li>Facebook/Instagram Messenger API (per conversazioni assistite)</li>
                <li>Google Maps Embed (per localizzazione zone di lavoro)</li>
              </ul>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
                <p className="text-green-900 dark:text-green-100">
                  In ogni caso, non vengono utilizzati cookie di profilazione e nessun dato è usato per scopi
                  pubblicitari.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Gestione del consenso
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Poiché il sito utilizza solo cookie tecnici e analitici anonimi, non è richiesto un banner di
                consenso esplicito al primo accesso. Tuttavia, l'utente può in qualsiasi momento:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-6">
                <li>Disattivare i cookie non essenziali dal proprio browser</li>
                <li>Cancellare i cookie installati seguendo le istruzioni del browser in uso</li>
              </ul>

              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Come gestire i cookie nei principali browser:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Chrome: Impostazioni cookie
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <a
                      href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Mozilla Firefox: Gestione cookie
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <a
                      href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Safari: Impostazioni privacy
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <a
                      href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Microsoft Edge: Gestione cookie
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Durata dei cookie
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>
                  I <strong>cookie tecnici</strong> vengono mantenuti solo per il tempo necessario al corretto
                  funzionamento del sito e vengono eliminati automaticamente alla chiusura del browser o al
                  termine della sessione
                </li>
                <li>
                  I <strong>cookie analitici anonimi</strong> possono restare attivi fino a <strong>12 mesi</strong>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Trasferimento dei dati
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                I dati raccolti tramite cookie non vengono trasferiti a terzi, né al di fuori dell'Unione
                Europea, salvo utilizzo di provider certificati conformi al GDPR (es. Supabase, Netlify).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Aggiornamenti della Cookie Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                La presente Cookie Policy può essere aggiornata periodicamente. Eventuali modifiche saranno
                pubblicate su questa pagina, con data di revisione aggiornata in alto.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Contatti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Per qualsiasi informazione o richiesta relativa all'uso dei cookie:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a href="mailto:info@impresapronta.it" className="hover:text-blue-600">
                      info@impresapronta.it
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">🌐</span>
                    <a href="https://impresapronta.it" className="hover:text-blue-600">
                      https://impresapronta.it
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
