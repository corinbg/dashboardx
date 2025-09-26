import React from 'react';
import { 
  ClipboardList, 
  Users, 
  CheckSquare, 
  MessageCircle, 
  Plus,
  Phone,
  Check,
  Clock,
  AlertTriangle,
  MapPin,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface HomePageProps {
  onTabChange: (tab: string) => void;
}

export function HomePage({ onTabChange }: HomePageProps) {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  // Update date and time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock data per la dashboard
  const mockStats = {
    richieste: { totale: 24, urgenti: 5, nonUrgenti: 19 },
    clienti: { totale: 156, topClients: ['Marco Rossi (8)', 'Anna Verdi (6)'] },
    checklist: { aperteOggi: 7 },
    conversazioni: { nuove24h: 3 }
  };

  const mockAgenda = [
    { orario: '09:00', cliente: 'Marco Rossi', luogo: 'Via Settembrini 3', urgente: true },
    { orario: '11:30', cliente: 'Anna Verdi', luogo: 'Corso Buenos Aires 15', urgente: false },
    { orario: '14:00', cliente: 'Giuseppe Bianchi', luogo: 'Via Torino 42', urgente: true },
    { orario: '16:30', cliente: 'Maria Neri', luogo: 'Viale Monza 88', urgente: false },
    { orario: '18:00', cliente: 'Luigi Ferrari', luogo: 'Via Padova 156', urgente: false }
  ];

  const mockAggiornamenti = [
    { tipo: 'richiesta', testo: 'Nuova richiesta da Marco Rossi', tempo: '2 min fa' },
    { tipo: 'checklist', testo: 'Attività "Controllo scorte" completata', tempo: '15 min fa' },
    { tipo: 'conversazione', testo: 'Nuova conversazione con Anna Verdi', tempo: '1h fa' },
    { tipo: 'richiesta', testo: 'Richiesta urgente da Giuseppe Bianchi', tempo: '2h fa' }
  ];

  const handleNewRequest = () => {
    // TODO: Implementare modal per nuova richiesta
    alert('Funzionalità in sviluppo: Nuova Richiesta');
  };

  const handleNewClient = () => {
    // TODO: Implementare modal per nuovo cliente  
    alert('Funzionalità in sviluppo: Nuovo Cliente');
  };

  const handleCompleteTask = () => {
    // TODO: Implementare quick complete task
    alert('Funzionalità in sviluppo: Completa Attività');
  };

  const getAggiornamentiIcon = (tipo: string) => {
    switch (tipo) {
      case 'richiesta': return <ClipboardList className="h-4 w-4" />;
      case 'checklist': return <CheckSquare className="h-4 w-4" />;
      case 'conversazione': return <MessageCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Standard */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(currentDateTime)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(currentDateTime)}</span>
                </div>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Panoramica generale dell'attività
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleNewRequest}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuova Richiesta
            </button>
          </div>
        </div>

        {/* Grid principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna sinistra - Sezioni principali */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sezione Riepilogo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Richieste */}
              <div 
                onClick={() => onTabChange('richieste')}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onTabChange('richieste')}
              >
                <div className="flex items-center justify-between mb-4">
                  <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockStats.richieste.totale}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Richieste</h3>
                <div className="flex space-x-2">
                  <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                    {mockStats.richieste.urgenti} urgenti
                  </span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                    {mockStats.richieste.nonUrgenti} normali
                  </span>
                </div>
              </div>

              {/* Card Clienti */}
              <div 
                onClick={() => onTabChange('clienti')}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onTabChange('clienti')}
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockStats.clienti.totale}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Clienti</h3>
                <div className="space-y-1">
                  {mockStats.clienti.topClients.map((client, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Star className="h-3 w-3 mr-1 text-yellow-400" />
                      {client}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Checklist */}
              <div 
                onClick={() => onTabChange('checklist')}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onTabChange('checklist')}
              >
                <div className="flex items-center justify-between mb-4">
                  <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockStats.checklist.aperteOggi}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Checklist</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Attività aperte oggi</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabChange('checklist');
                    }}
                    className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Vai alla checklist
                  </button>
                </div>
              </div>

              {/* Card Conversazioni */}
              <div 
                onClick={() => onTabChange('conversazioni')}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onTabChange('conversazioni')}
              >
                <div className="flex items-center justify-between mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockStats.conversazioni.nuove24h}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Conversazioni</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nuove ultime 24h</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Azioni Rapide */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <button
                  onClick={handleNewRequest}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Plus className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Aggiungi richiesta</div>
                </button>
                
                <button
                  onClick={handleNewClient}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Users className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Aggiungi cliente</div>
                </button>
                
                <button
                  onClick={handleCompleteTask}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Check className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Completa attività</div>
                </button>
                
                <button
                  onClick={() => onTabChange('conversazioni')}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Phone className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Apri conversazioni</div>
                </button>
              </div>
            </div>
          </div>

          {/* Colonna destra - Sidebar */}
          <div className="space-y-6">
            
            {/* Agenda di Oggi */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Agenda di Oggi</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {mockAgenda.slice(0, 5).map((appuntamento, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${
                      appuntamento.urgente 
                        ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {appuntamento.orario}
                      </div>
                      {appuntamento.urgente && (
                        <AlertTriangle className="h-3 w-3 text-red-500 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {appuntamento.cliente}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {appuntamento.luogo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiche Minime */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">18</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completate settimana</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">3</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Checklist oggi</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">7</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Nuovi clienti mese</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">7</div>
                  <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Soddisfazione</div>
              </div>
            </div>

            {/* Ultimi Aggiornamenti */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ultimi Aggiornamenti</h3>
              <div className="space-y-3">
                {mockAggiornamenti.map((aggiornamento, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {getAggiornamentiIcon(aggiornamento.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {aggiornamento.testo}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {aggiornamento.tempo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}