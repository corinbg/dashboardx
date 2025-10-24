import React, { useState } from 'react';
import { ChevronDown, Phone, MessageCircle, Users, CheckSquare, Calendar, Home, Bot, Zap, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

export function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<number[]>([0]);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqCategories: FAQCategory[] = [
    {
      title: 'Panoramica Sistema',
      icon: <Zap className="h-5 w-5" />,
      items: [
        {
          question: 'Come funziona Impresa Pronta?',
          answer: 'Impresa Pronta è un sistema intelligente che gestisce automaticamente tutte le richieste dei clienti — dai messaggi alle chiamate perse — con un\'unica piattaforma che integra automazioni, chat e gestione clienti in tempo reale. L\'assistente virtuale raccoglie informazioni, crea richieste automatiche e centralizza tutte le conversazioni.',
          icon: <Bot className="h-4 w-4" />
        },
        {
          question: 'Quali canali supporta l\'assistente virtuale?',
          answer: 'L\'assistente non lavora solo su WhatsApp, ma anche su sito web, Facebook e Instagram. Tutte le conversazioni vengono centralizzate in un unico punto e gestite dallo stesso agente, garantendo risposte coerenti e professionali su ogni canale.',
          icon: <MessageCircle className="h-4 w-4" />
        },
        {
          question: 'L\'assistente può gestire messaggi vocali e foto?',
          answer: 'Sì! L\'assistente può interpretare foto e messaggi vocali del cliente per descrivere meglio il guasto e aiutare nella diagnosi. Questo permette di avere una comprensione più completa del problema prima dell\'intervento.',
          icon: <Bot className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Chiamate e WhatsApp',
      icon: <Phone className="h-5 w-5" />,
      items: [
        {
          question: 'Cosa succede quando un cliente chiama e non rispondo?',
          answer: 'Quando un cliente chiama e non puoi rispondere, la chiamata viene reindirizzata all\'assistente virtuale. L\'agente scrive subito al cliente su WhatsApp, lo ringrazia per aver chiamato e raccoglie le informazioni principali: nome e zona, tipo di problema, urgenza e orario preferito per essere richiamato.',
          icon: <Phone className="h-4 w-4" />
        },
        {
          question: 'Come viene creata una richiesta da una chiamata persa?',
          answer: 'In pochi messaggi WhatsApp, l\'assistente crea una richiesta completa che appare automaticamente nella dashboard. Genera anche una notifica via e-mail con tutti i dettagli raccolti durante la conversazione con il cliente.',
          icon: <MessageCircle className="h-4 w-4" />
        },
        {
          question: 'Posso inoltrare messaggi personali all\'assistente?',
          answer: 'Sì! Se ricevi un messaggio personale e non vuoi rispondere, puoi inoltrare il contatto all\'assistente, che se ne occupa in autonomia gestendo la conversazione in modo professionale.',
          icon: <MessageCircle className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Conversazioni Intelligenti',
      icon: <Bot className="h-5 w-5" />,
      items: [
        {
          question: 'Che tipi di richieste riconosce l\'assistente?',
          answer: 'L\'agente AI distingue automaticamente diversi tipi di richiesta: richiesta di preventivo, richiesta di informazioni, segnalazione di guasto o emergenza, e fissare una richiamata. Si adatta automaticamente al contesto della conversazione.',
          icon: <Bot className="h-4 w-4" />
        },
        {
          question: 'L\'assistente fa domande di chiarimento?',
          answer: 'Sì! L\'assistente fa domande di chiarimento automatiche (es. "La perdita è sotto il lavandino o nel muro?") per creare una scheda problema completa. Questo aiuta a raccogliere tutte le informazioni necessarie prima dell\'intervento.',
          icon: <MessageCircle className="h-4 w-4" />
        },
        {
          question: 'Quando serve l\'intervento umano?',
          answer: 'Quando l\'assistente determina che serve l\'intervento umano o una decisione che va oltre le sue capacità, il sistema invia un\'e-mail di ricontatto all\'idraulico con tutti i dettagli della conversazione.',
          icon: <Bot className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Dashboard e Richieste',
      icon: <Home className="h-5 w-5" />,
      items: [
        {
          question: 'Cosa trovo nella dashboard?',
          answer: 'Nella dashboard trovi tutte le richieste ordinate e aggiornate in tempo reale, con statistiche principali (richieste, clienti, checklist, conversazioni), indicatori di performance come "Completate settimana", "Nuovi clienti mese", e pulsanti rapidi per accedere alle sezioni più usate.',
          icon: <Home className="h-4 w-4" />
        },
        {
          question: 'Come gestisco le richieste?',
          answer: 'Puoi vedere lo stato di ogni richiesta (nuova, in corso, completata), aprire la conversazione WhatsApp collegata, accedere alla scheda cliente con storico lavori e zona, e chiamare o scrivere direttamente al cliente. Ogni richiesta può essere contrassegnata come "non letta", "contattata" o "completata".',
          icon: <CheckSquare className="h-4 w-4" />
        },
        {
          question: 'Posso creare richieste manualmente?',
          answer: 'Sì! Oltre alle richieste generate automaticamente dall\'assistente, puoi anche crearne di nuove manualmente tramite il pulsante "Nuova Richiesta". Questo è utile per inserire lavori ricevuti tramite altri canali.',
          icon: <CheckSquare className="h-4 w-4" />
        },
        {
          question: 'Come vengono evidenziate le richieste urgenti?',
          answer: 'Le richieste urgenti vengono evidenziate in cima e marcate con un colore dedicato (rosso). I promemoria sono sempre visibili nella home per non dimenticare nulla.',
          icon: <Zap className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Gestione Clienti',
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          question: 'Cosa posso fare nella sezione Clienti?',
          answer: 'Nella sezione Clienti puoi: filtrare per comune o numero di richieste, creare nuovi contatti tramite "Nuovo Cliente", visualizzare rapidamente quante richieste ha fatto ogni cliente, e chiamare, inviare SMS o aprire la chat con un solo clic.',
          icon: <Users className="h-4 w-4" />
        },
        {
          question: 'Quali informazioni contiene la scheda cliente?',
          answer: 'Ogni cliente include storico richieste completo, zona di appartenenza, indirizzo completo e note interne, così da avere sempre il quadro completo delle relazioni e degli interventi precedenti.',
          icon: <Users className="h-4 w-4" />
        },
        {
          question: 'Come contatto rapidamente un cliente?',
          answer: 'Dalla scheda cliente puoi chiamare, inviare SMS o aprire la chat WhatsApp con un solo clic. Tutte le azioni di contatto sono accessibili rapidamente per ridurre i tempi di gestione.',
          icon: <Phone className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Checklist e Attività',
      icon: <CheckSquare className="h-5 w-5" />,
      items: [
        {
          question: 'Come creo attività nella checklist?',
          answer: 'Ogni attività può nascere da un semplice messaggio WhatsApp inviato al tuo assistente. Scrivendo ad esempio "ricordami di controllare la caldaia di Rossi domani", l\'agente crea una nuova voce nella checklist, completa di promemoria e priorità. Puoi anche aggiungere manualmente nuove attività tramite il pulsante "Nuova Attività".',
          icon: <CheckSquare className="h-4 w-4" />
        },
        {
          question: 'Come organizzo le attività?',
          answer: 'Gli elementi possono essere riordinati trascinandoli e classificati per categoria (riparazione, follow-up, materiali, trasferte, amministrativo, formazione), priorità (alta, media, bassa) e scadenza. Puoi anche filtrare per vedere solo le attività rilevanti.',
          icon: <CheckSquare className="h-4 w-4" />
        },
        {
          question: 'Dove vedo le attività da completare?',
          answer: 'Tutti i task vengono mostrati nella home della dashboard, così hai sempre sotto mano i lavori da completare, le manutenzioni in corso e gli appuntamenti imminenti. Le attività con scadenza imminente sono evidenziate.',
          icon: <Home className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Calendario',
      icon: <Calendar className="h-5 w-5" />,
      items: [
        {
          question: 'Come funziona il calendario?',
          answer: 'La dashboard include un calendario mensile e settimanale con tutti gli appuntamenti programmati. Puoi visualizzare gli eventi per giorno, settimana o mese a seconda delle tue esigenze.',
          icon: <Calendar className="h-4 w-4" />
        },
        {
          question: 'Come aggiungo eventi al calendario?',
          answer: 'Puoi aggiungere eventi manualmente tramite il pulsante "Nuovo Appuntamento". Ogni evento rappresenta un intervento, una visita o un promemoria di lavoro con data, ora e dettagli del cliente.',
          icon: <Calendar className="h-4 w-4" />
        },
        {
          question: 'Posso collegare eventi a clienti e richieste?',
          answer: 'Sì! Ogni evento del calendario può essere collegato a un cliente specifico e a una richiesta, permettendoti di avere una visione completa degli appuntamenti programmati e del contesto di ogni intervento.',
          icon: <Calendar className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Interfaccia e Usabilità',
      icon: <Zap className="h-5 w-5" />,
      items: [
        {
          question: 'L\'app funziona da smartphone?',
          answer: 'Sì! L\'interfaccia è progettata per essere intuitiva e leggibile anche da smartphone, con colori e icone che indicano chiaramente lo stato dei lavori. Puoi gestire tutto anche in movimento.',
          icon: <Zap className="h-4 w-4" />
        },
        {
          question: 'Come navigo tra le sezioni?',
          answer: 'Ogni sezione — Richieste, Clienti, Checklist, Conversazioni, Calendario — è accessibile dalla barra di navigazione. La home include anche pulsanti rapidi per "Vai a checklist" e "Apri conversazioni" per accedere velocemente alle sezioni più usate.',
          icon: <Home className="h-4 w-4" />
        },
        {
          question: 'C\'è una modalità scura?',
          answer: 'Sì! L\'applicazione supporta sia la modalità chiara che quella scura. Puoi cambiare tema usando il toggle nella barra di navigazione, così da lavorare comodamente in qualsiasi condizione di luce.',
          icon: <Zap className="h-4 w-4" />
        }
      ]
    }
  ];

  const toggleCategory = (index: number) => {
    setOpenCategories(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Domande Frequenti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tutto quello che devi sapere su Impresa Pronta
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Cerca nelle FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nessun risultato trovato per "{searchTerm}"
              </p>
            </div>
          ) : (
            filteredCategories.map((category, categoryIndex) => {
              const originalIndex = faqCategories.findIndex(c => c.title === category.title);
              const isCategoryOpen = openCategories.includes(originalIndex);

              return (
                <div
                  key={originalIndex}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(originalIndex)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600 dark:text-blue-400">
                        {category.icon}
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.title}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({category.items.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                        isCategoryOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Category Items */}
                  {isCategoryOpen && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      {category.items.map((item, itemIndex) => {
                        const itemKey = `${originalIndex}-${itemIndex}`;
                        const isItemOpen = openItems.includes(itemKey);

                        return (
                          <div
                            key={itemIndex}
                            className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <button
                              onClick={() => toggleItem(originalIndex, itemIndex)}
                              className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="mt-1 text-gray-400 dark:text-gray-500">
                                  {item.icon}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {item.question}
                                </span>
                              </div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ml-2 ${
                                  isItemOpen ? 'transform rotate-180' : ''
                                }`}
                              />
                            </button>

                            {isItemOpen && (
                              <div className="px-6 pb-4 pl-14">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Non hai trovato quello che cercavi?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Se hai altre domande o hai bisogno di assistenza, non esitare a contattarci.
            Il nostro team è sempre disponibile ad aiutarti.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contatta Supporto
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Richiedi Demo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
