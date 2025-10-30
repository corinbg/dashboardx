import React, { useState } from 'react';
import {
  Book,
  Video,
  FileText,
  Play,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  MessageCircle,
  ClipboardList,
  Settings,
  Search,
  Filter,
  Star,
  TrendingUp,
  Layers,
  Zap,
  Download,
  ExternalLink
} from 'lucide-react';

type Category = 'tutte' | 'introduzione' | 'richieste' | 'clienti' | 'calendario' | 'avanzate';
type Format = 'tutti' | 'video' | 'articolo' | 'guida';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: Category;
  format: Format;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzato';
  views: number;
  popular: boolean;
  thumbnail?: string;
  icon: React.ElementType;
}

export function GuideTutorialPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('tutte');
  const [selectedFormat, setSelectedFormat] = useState<Format>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComingSoon] = useState(true);

  const categories = [
    { id: 'tutte' as Category, label: 'Tutte le Guide', icon: Layers },
    { id: 'introduzione' as Category, label: 'Introduzione', icon: Star },
    { id: 'richieste' as Category, label: 'Gestione Richieste', icon: FileText },
    { id: 'clienti' as Category, label: 'Gestione Clienti', icon: Users },
    { id: 'calendario' as Category, label: 'Calendario', icon: Calendar },
    { id: 'avanzate' as Category, label: 'Funzioni Avanzate', icon: Zap }
  ];

  const guides: Guide[] = [
    {
      id: '1',
      title: 'Primi Passi con la Piattaforma',
      description: 'Scopri come iniziare a utilizzare la piattaforma e configurare il tuo account per la prima volta.',
      category: 'introduzione',
      format: 'video',
      duration: '10 min',
      difficulty: 'Principiante',
      views: 2543,
      popular: true,
      icon: Star
    },
    {
      id: '2',
      title: 'Come Creare e Gestire Richieste',
      description: 'Guida completa su come creare nuove richieste, aggiornarle e gestire lo stato di avanzamento.',
      category: 'richieste',
      format: 'video',
      duration: '15 min',
      difficulty: 'Principiante',
      views: 1892,
      popular: true,
      icon: FileText
    },
    {
      id: '3',
      title: 'Aggiungere e Organizzare Clienti',
      description: 'Impara a gestire il database clienti, aggiungere nuovi contatti e organizzare le informazioni.',
      category: 'clienti',
      format: 'articolo',
      duration: '8 min',
      difficulty: 'Principiante',
      views: 1654,
      popular: true,
      icon: Users
    },
    {
      id: '4',
      title: 'Utilizzo del Calendario e Appuntamenti',
      description: 'Scopri come pianificare appuntamenti, visualizzare il calendario e gestire gli eventi.',
      category: 'calendario',
      format: 'video',
      duration: '12 min',
      difficulty: 'Intermedio',
      views: 1423,
      popular: false,
      icon: Calendar
    },
    {
      id: '5',
      title: 'Stati delle Richieste e Workflow',
      description: 'Comprendi il ciclo di vita delle richieste e come gestire i diversi stati.',
      category: 'richieste',
      format: 'articolo',
      duration: '6 min',
      difficulty: 'Intermedio',
      views: 1201,
      popular: false,
      icon: TrendingUp
    },
    {
      id: '6',
      title: 'Gestione Conversazioni WhatsApp',
      description: 'Come utilizzare l\'assistente virtuale e gestire le conversazioni con i clienti.',
      category: 'avanzate',
      format: 'video',
      duration: '18 min',
      difficulty: 'Avanzato',
      views: 987,
      popular: false,
      icon: MessageCircle
    },
    {
      id: '7',
      title: 'Filtri e Ricerca Avanzata',
      description: 'Usa i filtri e la ricerca per trovare rapidamente richieste e clienti specifici.',
      category: 'avanzate',
      format: 'articolo',
      duration: '5 min',
      difficulty: 'Intermedio',
      views: 876,
      popular: false,
      icon: Filter
    },
    {
      id: '8',
      title: 'Checklist e Gestione Attività',
      description: 'Organizza il tuo lavoro con checklist personalizzate e gestisci le priorità.',
      category: 'avanzate',
      format: 'guida',
      duration: '10 min',
      difficulty: 'Intermedio',
      views: 765,
      popular: false,
      icon: ClipboardList
    },
    {
      id: '9',
      title: 'Sincronizzazione Dati Cliente-Richiesta',
      description: 'Come i dati dei clienti si sincronizzano automaticamente con le richieste.',
      category: 'clienti',
      format: 'articolo',
      duration: '7 min',
      difficulty: 'Avanzato',
      views: 654,
      popular: false,
      icon: Users
    },
    {
      id: '10',
      title: 'Visualizzazioni Calendario: Giorno, Settimana, Mese',
      description: 'Scopri le diverse visualizzazioni del calendario e quando usarle.',
      category: 'calendario',
      format: 'guida',
      duration: '8 min',
      difficulty: 'Principiante',
      views: 543,
      popular: false,
      icon: Calendar
    },
    {
      id: '11',
      title: 'Notifiche e Promemoria',
      description: 'Configura notifiche email e promemoria per non perdere mai un appuntamento.',
      category: 'avanzate',
      format: 'articolo',
      duration: '6 min',
      difficulty: 'Intermedio',
      views: 432,
      popular: false,
      icon: Settings
    },
    {
      id: '12',
      title: 'Scorciatoie da Tastiera',
      description: 'Velocizza il tuo lavoro con le scorciatoie da tastiera disponibili.',
      category: 'avanzate',
      format: 'guida',
      duration: '4 min',
      difficulty: 'Avanzato',
      views: 321,
      popular: false,
      icon: Zap
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'tutte' || guide.category === selectedCategory;
    const matchesFormat = selectedFormat === 'tutti' || guide.format === selectedFormat;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFormat && matchesSearch;
  });

  const popularGuides = guides.filter(g => g.popular).slice(0, 3);

  const getFormatIcon = (format: Format) => {
    switch (format) {
      case 'video':
        return Video;
      case 'articolo':
        return FileText;
      case 'guida':
        return Book;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Avanzato':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Coming Soon Overlay */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-purple-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
              <Book className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Prossimamente
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Stiamo preparando guide e tutorial dettagliati per aiutarti a utilizzare al meglio tutte le funzionalità della piattaforma.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-900 dark:text-purple-200 font-medium">
                Nel frattempo, puoi consultare il Centro Assistenza per qualsiasi domanda.
              </p>
            </div>
            <button
              onClick={() => {
                const event = new CustomEvent('footer-nav', { detail: { tab: 'centro-assistenza' } });
                window.dispatchEvent(event);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Vai al Centro Assistenza
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
            <Book className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Guide e Tutorial
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Impara a usare ogni funzionalità della piattaforma con le nostre guide dettagliate e video tutorial.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca guide e tutorial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Popular Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
            Guide Popolari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularGuides.map((guide) => {
              const FormatIcon = getFormatIcon(guide.format);
              const IconComponent = guide.icon;
              return (
                <button
                  key={guide.id}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <FormatIcon className="h-5 w-5 text-white/80" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-white/90 mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white/80">
                      <div className="flex items-center text-xs">
                        <Clock className="h-4 w-4 mr-1" />
                        {guide.duration}
                      </div>
                      <div className="flex items-center text-xs">
                        <Play className="h-4 w-4 mr-1" />
                        {guide.views}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filtra per Categoria
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Format Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filtra per Formato
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'tutti' as Format, label: 'Tutti', icon: Layers },
              { id: 'video' as Format, label: 'Video', icon: Video },
              { id: 'articolo' as Format, label: 'Articoli', icon: FileText },
              { id: 'guida' as Format, label: 'Guide', icon: Book }
            ].map((format) => {
              const IconComponent = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    selectedFormat === format.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{format.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-white">{filteredGuides.length}</span> {filteredGuides.length === 1 ? 'guida' : 'guide'}
          </p>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredGuides.map((guide) => {
              const FormatIcon = getFormatIcon(guide.format);
              const IconComponent = guide.icon;
              return (
                <button
                  key={guide.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormatIcon className="h-4 w-4 text-gray-400" />
                      {guide.popular && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.duration}
                      </div>
                      <div className="flex items-center text-xs">
                        <Play className="h-3 w-3 mr-1" />
                        {guide.views}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {guide.format === 'video' ? 'Guarda ora' : 'Leggi ora'}
                    </span>
                    <ExternalLink className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nessuna guida trovata
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Prova a modificare i filtri o il termine di ricerca
            </p>
          </div>
        )}

        {/* Additional Resources */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 border border-purple-100 dark:border-purple-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Altre Risorse Utili
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Scarica PDF
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Scarica le guide in formato PDF per consultarle offline
              </p>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Vai ai download
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Supporto Live
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Hai bisogno di aiuto? Contatta il nostro team di supporto
              </p>
              <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
                Contatta supporto
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Community
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Unisciti alla community e condividi la tua esperienza
              </p>
              <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                Entra in community
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
