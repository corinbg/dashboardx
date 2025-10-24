import React from 'react';
import { Shield, Mail, MapPin, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Ultimo aggiornamento: 22 ottobre 2025
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Benvenuto su <strong>Impresa Pronta</strong> (di seguito "la Piattaforma" o "il Servizio"),
              un sistema digitale sviluppato per semplificare la gestione delle richieste dei clienti e
              l'automazione dei processi di comunicazione per artigiani e professionisti del settore idraulico.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              La presente informativa descrive come vengono raccolti, utilizzati e protetti i dati personali
              trattati tramite il sito web <a href="https://impresapronta.it" className="text-blue-600 hover:underline">https://impresapronta.it</a>,
              la dashboard dedicata agli artigiani e le integrazioni con canali di comunicazione (WhatsApp,
              e-mail, sito web e social network collegati).
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Titolare del trattamento
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white font-semibold mb-2">
                  Impresa Pronta – Corin Angelo Danci
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a href="mailto:info@impresapronta.it" className="hover:text-blue-600">
                      info@impresapronta.it
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>Cassano d'Adda, via Galileo Galilei 2</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Tipologie di dati raccolti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Durante l'utilizzo della Piattaforma vengono raccolti i seguenti dati:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    a) Dati forniti direttamente dall'utente
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Nome e cognome</li>
                    <li>Indirizzo e-mail e numero di telefono</li>
                    <li>Zona di lavoro o copertura del servizio</li>
                    <li>Informazioni inserite volontariamente nei moduli o durante le conversazioni (es. descrizione del problema, foto, orari di ricontatto)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    b) Dati generati automaticamente
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Log tecnici (IP, data, ora e tipo di dispositivo)</li>
                    <li>Statistiche di utilizzo della dashboard</li>
                    <li>Dati aggregati sul comportamento dell'utente (es. numero richieste gestite, attività pianificate)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    c) Dati provenienti da integrazioni
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Messaggi e richieste ricevuti tramite WhatsApp, sito web, Facebook o Instagram, solo ai fini
                    di gestione operativa dell'assistenza.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mt-2">
                    Nessun dato viene utilizzato per fini pubblicitari o ceduto a terzi.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Finalità del trattamento
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                I dati personali sono trattati per:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Fornire accesso e funzionamento alla dashboard e ai servizi automatizzati</li>
                <li>Inviare notifiche, promemoria o riepiloghi di richieste</li>
                <li>Gestire conversazioni e richieste provenienti dai clienti finali</li>
                <li>Analizzare statistiche anonime di utilizzo per migliorare il servizio</li>
                <li>Adempiere a obblighi legali e fiscali derivanti dalla gestione del rapporto contrattuale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Base giuridica del trattamento
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Il trattamento dei dati si fonda su:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>L'esecuzione di un contratto o misure precontrattuali (art. 6, par. 1, lett. b GDPR)</li>
                <li>L'interesse legittimo del titolare nel fornire un servizio efficiente e sicuro (art. 6, par. 1, lett. f GDPR)</li>
                <li>Il consenso esplicito dell'utente, ove richiesto, per comunicazioni o salvataggio dei dati di contatto</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Modalità del trattamento
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                I dati vengono trattati mediante strumenti informatici e telematici, con logiche organizzative
                correlate alle finalità indicate e adottando misure di sicurezza adeguate per prevenirne perdita,
                accesso non autorizzato, uso improprio o divulgazione.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                L'accesso ai dati è consentito solo a personale autorizzato e, ove necessario, ai fornitori
                tecnologici che supportano il funzionamento della Piattaforma (es. hosting, database, API WhatsApp,
                servizi di e-mail).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Conservazione dei dati
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                I dati vengono conservati:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Per tutta la durata dell'utilizzo del servizio da parte dell'utente</li>
                <li>Successivamente, per un periodo massimo di 12 mesi, salvo obblighi legali diversi o richiesta di cancellazione da parte dell'interessato</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Comunicazione e trasferimento dei dati
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                I dati non vengono comunicati a terzi, se non nei seguenti casi:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Fornitori tecnici di hosting, cloud e servizi digitali (es. Supabase, Make.com, Twilio, Bolt.new)</li>
                <li>Autorità competenti, ove previsto dalla legge</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                I dati non vengono trasferiti al di fuori dell'Unione Europea, salvo verso Paesi che garantiscono
                un adeguato livello di protezione ai sensi del GDPR.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Diritti dell'utente
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                L'utente può esercitare in qualsiasi momento i seguenti diritti (artt. 15-22 GDPR):
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Accesso ai dati personali</li>
                <li>Rettifica o aggiornamento</li>
                <li>Cancellazione ("diritto all'oblio")</li>
                <li>Limitazione o opposizione al trattamento</li>
                <li>Portabilità dei dati in formato strutturato</li>
                <li>Revoca del consenso (senza pregiudicare la liceità del trattamento precedente)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Per esercitare tali diritti, è sufficiente inviare una richiesta a{' '}
                <a href="mailto:info@impresapronta.it" className="text-blue-600 hover:underline">
                  info@impresapronta.it
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Cookie e tracciamento
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Il sito utilizza cookie tecnici e di analisi per garantire il corretto funzionamento della
                piattaforma e migliorare l'esperienza utente. Non vengono utilizzati cookie di profilazione o
                tracciamento pubblicitario. Per ulteriori informazioni consulta la sezione dedicata Cookie Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Sicurezza dei dati
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Impresa Pronta adotta misure tecniche e organizzative per garantire la protezione dei dati
                personali, tra cui:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Connessioni sicure HTTPS</li>
                <li>Autenticazione tramite email e password</li>
                <li>Limitazione degli accessi interni</li>
                <li>Backup periodici dei dati</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Modifiche alla Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Impresa Pronta si riserva il diritto di modificare in qualsiasi momento la presente informativa,
                pubblicando la versione aggiornata sul sito. Si consiglia di consultarla periodicamente per
                restare informati su eventuali aggiornamenti.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Contatti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Per qualsiasi domanda o richiesta in materia di privacy:
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
