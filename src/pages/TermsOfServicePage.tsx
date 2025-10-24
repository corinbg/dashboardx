import React from 'react';
import { FileText, Mail, ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
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
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Termini e Condizioni d'Uso
            </h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Ultimo aggiornamento: 22 ottobre 2025
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Benvenuto su <strong>Impresa Pronta</strong> ("la Piattaforma", "il Servizio", "noi").
              Utilizzando il sito{' '}
              <a href="https://impresapronta.it" className="text-blue-600 hover:underline">
                https://impresapronta.it
              </a>{' '}
              e i servizi collegati (inclusi la dashboard per artigiani e le automazioni su WhatsApp, Facebook,
              Instagram e sito web), l'utente accetta integralmente i presenti Termini e Condizioni.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-900 dark:text-yellow-100">
                Ti invitiamo a leggerli attentamente prima di accedere o utilizzare la piattaforma.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Oggetto del Servizio
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Impresa Pronta offre una piattaforma digitale che consente agli artigiani, in particolare
                idraulici e tecnici, di:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>
                  Ricevere e gestire automaticamente richieste da clienti provenienti da diversi canali
                  (chiamate, WhatsApp, sito web, social)
                </li>
                <li>
                  Utilizzare un assistente virtuale basato su intelligenza artificiale per rispondere, raccogliere
                  informazioni e generare schede cliente
                </li>
                <li>
                  Gestire attività, checklist, appuntamenti e promemoria tramite una dashboard centralizzata
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 font-medium">
                Il servizio è rivolto esclusivamente a professionisti o imprese che operano nel settore dei
                servizi alla persona o della manutenzione domestica.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Accettazione dei Termini
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Accedendo, registrandosi o utilizzando il servizio, l'utente dichiara di:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Aver letto, compreso e accettato integralmente i presenti Termini</li>
                <li>Avere almeno 18 anni</li>
                <li>Utilizzare la piattaforma esclusivamente per scopi professionali e legittimi</li>
                <li>Fornire dati veritieri, completi e aggiornati</li>
              </ul>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4 flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-900 dark:text-red-100">
                  In caso di mancata accettazione, l'utente è tenuto a interrompere immediatamente l'utilizzo
                  del Servizio.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Registrazione e accesso
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Per utilizzare la dashboard è necessario creare un account personale o aziendale.
                Durante la registrazione, l'utente deve fornire:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                <li>Un indirizzo e-mail valido</li>
                <li>Una password sicura</li>
                <li>
                  Eventuali informazioni professionali richieste per l'attivazione (es. nome attività, area di lavoro)
                </li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-900 dark:text-blue-100">
                  <strong>Importante:</strong> L'utente è responsabile della riservatezza delle proprie credenziali
                  e di tutte le attività svolte con il proprio account. In caso di accesso non autorizzato, dovrà
                  informare immediatamente il gestore del servizio all'indirizzo{' '}
                  <a href="mailto:info@impresapronta.it" className="underline">
                    info@impresapronta.it
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Funzionalità principali
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                L'utente, tramite la piattaforma, può:
              </p>
              <div className="grid gap-3 mb-4">
                <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Gestire automaticamente le chiamate non risposte con messaggi WhatsApp
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Raccogliere dati cliente e creare richieste nella dashboard
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Comunicare con i clienti tramite canali integrati
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Gestire promemoria, appuntamenti e checklist operative
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Impresa Pronta si riserva di modificare, migliorare o sospendere temporaneamente alcune funzioni
                senza preavviso, garantendo comunque la continuità dei servizi principali.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Uso consentito
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                L'utente si impegna a utilizzare la piattaforma nel rispetto delle leggi vigenti e in modo da non:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                <li>Compromettere la sicurezza o la disponibilità del servizio</li>
                <li>Violare la privacy di altri utenti o clienti finali</li>
                <li>Inviare messaggi o contenuti non autorizzati, pubblicitari o offensivi</li>
                <li>Utilizzare il sistema per attività fraudolente o non legittime</li>
              </ul>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-900 dark:text-red-100 font-semibold">
                  Eventuali abusi potranno comportare la sospensione immediata dell'account e la segnalazione
                  alle autorità competenti.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Responsabilità dell'utente
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                L'utente è l'unico responsabile:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                <li>
                  Dei contenuti e delle informazioni trasmesse tramite la piattaforma (es. messaggi WhatsApp,
                  e-mail, note interne)
                </li>
                <li>
                  Dei dati personali raccolti dai propri clienti finali durante l'utilizzo del servizio
                </li>
                <li>
                  Del rispetto delle normative vigenti in materia di privacy e comunicazioni elettroniche
                  (GDPR, ePrivacy, ecc.)
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Impresa Pronta fornisce solo lo strumento tecnologico, senza alcuna responsabilità per l'uso
                improprio o illecito da parte degli utenti.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Limitazione di responsabilità
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Pur adottando le migliori misure di sicurezza, Impresa Pronta non garantisce che il servizio
                sia sempre privo di errori, interruzioni o ritardi. Il Titolare non è responsabile per:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Danni indiretti o perdita di profitto derivanti dall'uso del servizio</li>
                <li>
                  Errori di terze parti (es. fornitori API, hosting, WhatsApp Cloud API, Make.com, Supabase,
                  Bolt.new, Twilio)
                </li>
                <li>Problemi di rete, manutenzione o aggiornamenti dei sistemi esterni</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Servizi di terze parti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Il sistema può integrare servizi esterni, come:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold min-w-fit">WhatsApp Business API</span>
                    <span className="text-gray-500 dark:text-gray-400">—</span>
                    <span>per l'invio automatico di messaggi</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold min-w-fit">Make.com / n8n</span>
                    <span className="text-gray-500 dark:text-gray-400">—</span>
                    <span>per l'automazione dei flussi di lavoro</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold min-w-fit">Supabase</span>
                    <span className="text-gray-500 dark:text-gray-400">—</span>
                    <span>per l'archiviazione sicura dei dati</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold min-w-fit">Bolt.new / Netlify</span>
                    <span className="text-gray-500 dark:text-gray-400">—</span>
                    <span>per l'hosting delle dashboard</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                Ogni servizio è soggetto ai propri termini e condizioni, consultabili sui rispettivi siti ufficiali.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Proprietà intellettuale
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Tutti i contenuti, i marchi, le grafiche, i loghi e il codice sorgente della piattaforma sono di
                proprietà esclusiva di <strong>Impresa Pronta – Corin Danci</strong> o dei rispettivi licenziatari.
                È vietata qualsiasi riproduzione, modifica o distribuzione senza autorizzazione scritta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Corrispettivi e pagamenti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Alcune funzionalità avanzate della piattaforma possono essere a pagamento. Le tariffe, se previste,
                saranno indicate chiaramente prima dell'attivazione del servizio.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                In caso di mancato pagamento, l'accesso potrà essere sospeso fino alla regolarizzazione.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Durata, sospensione e recesso
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                L'utente può recedere in qualsiasi momento, richiedendo la disattivazione del proprio account e
                la cancellazione dei dati.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Impresa Pronta può sospendere o interrompere il servizio in caso di:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Violazione dei presenti Termini</li>
                <li>Uso improprio o illegale del sistema</li>
                <li>Manutenzione tecnica straordinaria o chiusura del progetto</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Tutela dei dati personali
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Il trattamento dei dati personali è disciplinato dalla Privacy Policy, disponibile all'indirizzo:{' '}
                <a href="https://impresapronta.it/privacy" className="text-blue-600 hover:underline">
                  https://impresapronta.it/privacy
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                13. Modifiche ai Termini
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Impresa Pronta si riserva il diritto di aggiornare o modificare i presenti Termini in qualsiasi
                momento. Le modifiche saranno pubblicate su questa pagina e avranno effetto immediato al momento
                della pubblicazione.
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                L'uso continuato del servizio dopo la modifica costituisce accettazione delle nuove condizioni.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                14. Legge applicabile e foro competente
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                I presenti Termini sono regolati dalla <strong>legge italiana</strong>. Per qualsiasi controversia
                sarà competente in via esclusiva il <strong>Foro di Milano</strong>, salvo diversa disposizione
                inderogabile di legge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                15. Contatti
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Per domande o richieste riguardanti i Termini di Servizio, puoi contattarci a:
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
