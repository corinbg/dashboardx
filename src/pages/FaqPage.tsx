import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Phone, MessageCircle, Calendar, CheckSquare, Users, FileText, Zap, Shield } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    category: 'Generale',
    question: 'Come funziona Impresa Pronta?',
    answer: 'Impresa Pronta è un sistema completo che gestisce automaticamente tutte le richieste dei clienti — dai messaggi alle chiamate perse — con una piattaforma intelligente che integra automazioni, chat e gestione clienti in tempo reale. L\'assistente virtuale raccoglie informazioni dai clienti, crea richieste automatiche e ti mantiene sempre aggiornato.'
  },
  {
    category: 'Chiamate',
    question: 'Cosa succede quando non posso rispondere a una chiamata?',
    answer: 'Quando un cliente chiama e non puoi rispondere, la chiamata viene reindirizzata all\'assistente virtuale. L\'agente scrive subito al cliente su WhatsApp, lo ringrazia per aver chiamato e raccoglie le informazioni principali: nome e zona, tipo di problema, urgenza e orario preferito per essere richiamato. In pochi messaggi, l\'assistente crea una richiesta completa che appare automaticamente nella tua dashboard.'
  },
  {
    category: 'Chiamate',
    question: 'Ricevo una notifica quando arriva una nuova richiesta?',
    answer: 'Sì, ogni volta che l\'assistente crea una nuova richiesta, ricevi una notifica via e-mail con tutti i dettagli del cliente e del problema segnalato. Inoltre, la richiesta appare immediatamente nella dashboard con evidenza se è urgente.'
  },
  {
    category: 'Conversazioni',
    question: 'Su quali piattaforme funziona l\'assistente virtuale?',
    answer: 'L\'assistente lavora su WhatsApp, sito web, Facebook e Instagram. Tutte le conversazioni vengono centralizzate in un unico punto e gestite dallo stesso agente, garantendo risposte coerenti e professionali su ogni canale.'
  },
  {
    category: 'Conversazioni',
    question: 'Posso inoltrare messaggi personali all\'assistente?',
    answer: 'Sì, se ricevi un messaggio personale e non vuoi rispondere, puoi inoltrare il contatto all\'assistente, che se ne occupa in autonomia raccogliendo tutte le informazioni necessarie.'
  },
  {
    category: 'Conversazioni',
    question: 'L\'assistente comprende foto e messaggi vocali?',
    answer: 'Sì, l\'assistente può interpretare foto e messaggi vocali del cliente per descrivere meglio il guasto e aiutarti nella diagnosi. Questo ti permette di avere un quadro completo del problema ancora prima di chiamare il cliente.'
  },
  {
    category: 'Conversazioni',
    question: 'L\'assistente sa distinguere i diversi tipi di richiesta?',
    answer: 'Sì, l\'agente AI distingue automaticamente tra richiesta di preventivo, richiesta di informazioni, segnalazione di guasto o emergenza e richiesta di richiamata. L\'assistente fa domande di chiarimento automatiche per creare una scheda problema completa.'
  },
  {
    category: 'Dashboard',
    question: 'Cosa trovo nella dashboard?',
    answer: 'Nella dashboard trovi tutte le richieste ordinate e aggiornate in tempo reale, con possibilità di vedere lo stato di ogni richiesta (nuova, in corso, completata), aprire la conversazione WhatsApp collegata, accedere alla scheda cliente con storico lavori e zona, e chiamare o scrivere direttamente al cliente.'
  },
  {
    category: 'Dashboard',
    question: 'Posso creare richieste manualmente?',
    answer: 'Sì, oltre alle richieste generate automaticamente dall\'assistente, puoi anche crearne di nuove manualmente tramite il pulsante "Nuova Richiesta". Puoi inserire tutti i dettagli del cliente e del problema direttamente dalla dashboard.'
  },
  {
    category: 'Dashboard',
    question: 'Come funzionano gli stati delle richieste?',
    answer: 'Ogni richiesta può essere contrassegnata come "non letta", "contattata" o "completata". Le richieste urgenti vengono evidenziate in cima e marcate con un colore dedicato per garantirti massima visibilità.'
  },
  {
    category: 'Clienti',
    question: 'Come gestisco i clienti nella dashboard?',
    answer: 'Nella sezione Clienti puoi filtrare per comune o numero di richieste, creare nuovi contatti tramite "Nuovo Cliente", visualizzare rapidamente quante richieste ha fatto ogni cliente, e chiamare, inviare SMS o aprire la chat con un solo clic. Ogni cliente include storico richieste, zona, indirizzo completo e note interne.'
  },
  {
    category: 'Clienti',
    question: 'Posso vedere lo storico dei lavori per ogni cliente?',
    answer: 'Sì, ogni scheda cliente include tutto lo storico delle richieste, così hai sempre il quadro completo delle relazioni e puoi offrire un servizio più personalizzato.'
  },
  {
    category: 'Checklist',
    question: 'Come funziona la checklist?',
    answer: 'Ogni attività nasce da un semplice messaggio WhatsApp inviato al tuo assistente. Scrivendo ad esempio "ricordami di controllare la caldaia di Rossi domani", l\'agente crea una nuova voce nella checklist, completa di promemoria e priorità. Puoi anche aggiungere manualmente nuove attività tramite il pulsante "Nuova Attività".'
  },
  {
    category: 'Checklist',
    question: 'Posso organizzare le attività nella checklist?',
    answer: 'Sì, gli elementi possono essere riordinati trascinandoli e classificati per categoria, priorità e scadenza. Tutti i task vengono mostrati nella home della dashboard, così hai sempre sotto mano i lavori da completare, le manutenzioni in corso e gli appuntamenti imminenti.'
  },
  {
    category: 'Calendario',
    question: 'Come funziona il calendario integrato?',
    answer: 'La dashboard include un calendario mensile e settimanale con tutti gli appuntamenti programmati. Puoi aggiungere eventi manualmente tramite il pulsante "Nuovo Appuntamento": ogni evento rappresenta un intervento, una visita o un promemoria di lavoro.'
  },
  {
    category: 'Calendario',
    question: 'Gli appuntamenti vengono sincronizzati automaticamente?',
    answer: 'Sì, tutti gli appuntamenti creati nella dashboard vengono visualizzati nel calendario in tempo reale. Puoi vedere la vista giornaliera, settimanale o mensile per pianificare al meglio il tuo lavoro.'
  },
  {
    category: 'Home',
    question: 'Cosa vedo nella home della dashboard?',
    answer: 'La home mostra una panoramica chiara dell\'attività: statistiche principali (richieste, clienti, checklist, conversazioni), indicatori di performance come "Completate settimana", "Nuovi clienti mese", "Checklist oggi" e "Tasso completamento", e pulsanti rapidi per muoverti tra le sezioni più usate con un solo clic.'
  },
  {
    category: 'Home',
    question: 'Posso vedere gli appuntamenti di oggi dalla home?',
    answer: 'Sì, nella home c\'è una sezione "Agenda di Oggi" che mostra tutti gli appuntamenti programmati con orario, cliente e luogo. Gli interventi urgenti vengono evidenziati con un colore dedicato.'
  },
  {
    category: 'Interfaccia',
    question: 'Posso usare la dashboard da smartphone?',
    answer: 'Sì, l\'interfaccia è progettata per essere intuitiva e leggibile anche da smartphone, con colori e icone che indicano chiaramente lo stato dei lavori. Ogni sezione è pensata per ridurre i tempi di gestione e rendere tutto immediato, anche per chi lavora in movimento.'
  },
  {
    category: 'Interfaccia',
    question: 'È disponibile la modalità scura?',
    answer: 'Sì, la dashboard include una modalità scura che puoi attivare con un clic dall\'icona in alto a destra. Questo riduce l\'affaticamento degli occhi durante l\'uso prolungato, soprattutto in condizioni di scarsa illuminazione.'
  },
  {
    category: 'Sicurezza',
    question: 'I miei dati sono al sicuro?',
    answer: 'Sì, tutti i dati sono protetti con crittografia avanzata e archiviati in server sicuri. Solo tu hai accesso alle informazioni dei tuoi clienti e delle tue attività. Utilizziamo le migliori pratiche di sicurezza per garantire la privacy dei dati.'
  },
  {
    category: 'Supporto',
    question: 'Cosa faccio se l\'assistente non riesce a gestire una richiesta?',
    answer: 'Quando serve l\'intervento umano, il sistema invia un\'e-mail di ricontatto in modo che tu possa prendere in carico la situazione. L\'assistente è progettato per gestire la maggior parte delle richieste, ma sa quando è necessario il tuo intervento diretto.'
  },
  {
    category: 'Supporto',
    question: 'Come posso contattare il supporto tecnico?',
    answer: 'Per qualsiasi domanda o problema tecnico, puoi contattare il supporto tramite l\'apposito canale presente nella sezione conversazioni o inviando un\'e-mail al team di assistenza.'
  }
];

const categories = [
  { id: 'all', label: 'Tutte', icon: HelpCircle },
  { id: 'Generale', label: 'Generale', icon: Zap },
  { id: 'Chiamate', label: 'Chiamate', icon: Phone },
  { id: 'Conversazioni', label: 'Conversazioni', icon: MessageCircle },
  { id: 'Dashboard', label: 'Dashboard', icon: FileText },
  { id: 'Clienti', label: 'Clienti', icon: Users },
  { id: 'Checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'Calendario', label: 'Calendario', icon: Calendar },
  { id: 'Home', label: 'Home', icon: HelpCircle },
  { id: 'Interfaccia', label: 'Interfaccia', icon: Shield },
  { id: 'Sicurezza', label: 'Sicurezza', icon: Shield },
  { id: 'Supporto', label: 'Supporto', icon: HelpCircle }
];

export function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
              <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Domande Frequenti
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Trova risposte alle domande più comuni su Impresa Pronta
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cerca nelle FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'risultato' : 'risultati'}
            {searchQuery && ` per "${searchQuery}"`}
          </p>
        </div>

        {/* FAQ List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                          <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {faq.question}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedItems.has(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedItems.has(index) && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="pl-14">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nessun risultato trovato
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Prova a modificare la ricerca o seleziona una categoria diversa
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8 border border-blue-100 dark:border-blue-800">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Non hai trovato quello che cercavi?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Il nostro team di supporto è sempre disponibile per aiutarti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = 'mailto:support@impresapronta.it'}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contatta il supporto</span>
              </button>
              <button
                onClick={() => window.location.href = 'tel:+393520845493'}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <Phone className="h-5 w-5" />
                <span>Chiamaci</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
