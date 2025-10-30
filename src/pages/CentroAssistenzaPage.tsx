import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Book,
  Video,
  FileText,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  Headphones,
  LifeBuoy,
  Zap,
  ArrowRight
} from 'lucide-react';

export function CentroAssistenzaPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normale'
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('success');
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'normale'
      });
      setSubmitStatus('idle');
    }, 3000);
  };

  const supportOptions = [
    {
      icon: Phone,
      title: 'Assistenza Telefonica',
      description: 'Parla direttamente con il nostro team di supporto',
      action: 'Chiama ora',
      link: 'tel:+393520845493',
      color: 'bg-blue-500',
      available: 'Lun-Ven 9:00-18:00'
    },
    {
      icon: MessageCircle,
      title: 'Chat WhatsApp',
      description: 'Contattaci su WhatsApp per assistenza rapida',
      action: 'Apri chat',
      link: 'https://wa.me/393520845493',
      color: 'bg-green-500',
      available: '24/7'
    },
    {
      icon: Mail,
      title: 'Email di Supporto',
      description: 'Inviaci una email dettagliata',
      action: 'Invia email',
      link: 'mailto:support@impresapronta.it',
      color: 'bg-purple-500',
      available: 'Risposta in 24h'
    },
    {
      icon: Video,
      title: 'Video Tutorial',
      description: 'Guarda le nostre guide video passo-passo',
      action: 'Guarda ora',
      link: '#video',
      color: 'bg-red-500',
      available: 'Disponibili sempre',
      comingSoon: true
    }
  ];

  const quickLinks = [
    {
      icon: HelpCircle,
      title: 'Domande Frequenti',
      description: 'Trova risposte alle domande più comuni',
      link: 'faq'
    },
    {
      icon: Book,
      title: 'Guide e Tutorial',
      description: 'Istruzioni dettagliate per ogni funzionalità',
      link: 'guide-tutorial'
    },
    {
      icon: FileText,
      title: 'Documentazione',
      description: 'Documentazione tecnica completa',
      link: '#docs',
      comingSoon: true
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Unisciti alla community degli utenti',
      link: '#community',
      comingSoon: true
    }
  ];

  const commonIssues = [
    {
      icon: AlertCircle,
      title: 'Non riesco ad accedere',
      description: 'Problemi di login o password dimenticata',
      solutions: [
        'Verifica di aver inserito correttamente email e password',
        'Usa la funzione "Password dimenticata" per reimpostarla',
        'Controlla che la tua email sia stata verificata',
        'Svuota la cache del browser e riprova'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Le richieste non arrivano',
      description: 'Non ricevo notifiche delle nuove richieste',
      solutions: [
        'Verifica che l\'assistente virtuale sia attivo',
        'Controlla le impostazioni email e notifiche',
        'Assicurati che il numero WhatsApp sia collegato',
        'Verifica che le email non finiscano nello spam'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Problemi con il calendario',
      description: 'Gli appuntamenti non si sincronizzano',
      solutions: [
        'Ricarica la pagina per aggiornare i dati',
        'Verifica di aver salvato correttamente l\'evento',
        'Controlla che la data e l\'ora siano nel formato corretto',
        'Prova a disconnetterti e riconnetterti'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Errori di sincronizzazione clienti',
      description: 'I dati dei clienti non si aggiornano',
      solutions: [
        'Verifica la tua connessione internet',
        'Aggiorna la pagina e riprova',
        'Controlla che tutti i campi obbligatori siano compilati',
        'Contatta il supporto se il problema persiste'
      ]
    }
  ];

  const handleNavigation = (link: string, comingSoon?: boolean) => {
    if (comingSoon) {
      setShowComingSoonModal(true);
      return;
    }
    if (link.startsWith('#')) {
      return;
    }
    const event = new CustomEvent('footer-nav', { detail: { tab: link } });
    window.dispatchEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowComingSoonModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-blue-500" onClick={(e) => e.stopPropagation()}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Prossimamente
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Questa funzionalità sarà disponibile molto presto. Stiamo lavorando per offrirti la migliore esperienza possibile.
            </p>
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
            <LifeBuoy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Centro Assistenza
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Siamo qui per aiutarti. Trova risposte rapide, guide dettagliate e supporto personalizzato.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca nella documentazione e nelle FAQ..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Support Options Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Headphones className="h-6 w-6 mr-2 text-blue-600" />
            Opzioni di Supporto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option: any, index) => {
              const IconComponent = option.icon;
              const Element = option.comingSoon ? 'button' : 'a';
              const props = option.comingSoon ? {
                onClick: () => setShowComingSoonModal(true),
                className: "relative bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-left"
              } : {
                href: option.link,
                target: option.link.startsWith('http') ? '_blank' : undefined,
                rel: option.link.startsWith('http') ? 'noopener noreferrer' : undefined,
                className: "bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              };
              return (
                <Element
                  key={index}
                  {...props}
                >
                  {option.comingSoon && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      Presto
                    </div>
                  )}
                  <div className={`${option.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {option.action}
                    </span>
                    <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{option.available}</span>
                  </div>
                </Element>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-blue-600" />
            Accesso Rapido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link: any, index) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.link, link.comingSoon)}
                  className="relative bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {link.comingSoon && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      Presto
                    </div>
                  )}
                  <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Common Issues */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
            Problemi Comuni e Soluzioni
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {commonIssues.map((issue, index) => {
              const IconComponent = issue.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-3">
                      <IconComponent className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                  <div className="ml-14">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Soluzioni:
                    </p>
                    <ul className="space-y-2">
                      {issue.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Non hai trovato quello che cercavi?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Invia una richiesta di supporto e ti risponderemo il prima possibile
                </p>
              </div>

              {submitStatus === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Richiesta inviata con successo!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Il nostro team ti risponderà entro 24 ore
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mario Rossi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="mario.rossi@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Oggetto
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrivi brevemente il problema"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priorità
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bassa">Bassa</option>
                      <option value="normale">Normale</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Messaggio
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrivi il problema in dettaglio..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Invia Richiesta</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Risorse Aggiuntive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => setShowComingSoonModal(true)} className="relative text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                Presto
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Documentazione
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Guide complete per ogni funzionalità della piattaforma
              </p>
            </button>
            <button onClick={() => setShowComingSoonModal(true)} className="relative text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                Presto
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Video Tutorial
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Impara con le nostre guide video passo-passo
              </p>
            </button>
            <button onClick={() => setShowComingSoonModal(true)} className="relative text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                Presto
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Community
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Confrontati con altri utenti e condividi esperienze
              </p>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
