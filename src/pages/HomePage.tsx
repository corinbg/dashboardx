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
import { useApp } from '../contexts/AppContext';
import { getEventsByDate } from '../services/calendarService';
import { getAllConversations } from '../services/conversationsService';
import { CalendarEvent } from '../types';
import { InlineLoadingSpinner } from '../components/UI/LoadingScreen';

interface HomePageProps {
  onTabChange: (tab: string) => void;
  onNewRequest: () => void;
  onNewClient: () => void;
}

interface AgendaItem {
  orario: string;
  cliente: string;
  luogo: string;
  urgente: boolean;
}

interface Aggiornamento {
  tipo: 'richiesta' | 'checklist' | 'conversazione';
  testo: string;
  tempo: string;
  timestamp: Date;
}

export function HomePage({ onTabChange, onNewRequest, onNewClient }: HomePageProps) {
  const { requests, clients, checklist, loading } = useApp();
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
  const [todayEvents, setTodayEvents] = React.useState<CalendarEvent[]>([]);
  const [recentConversationsCount, setRecentConversationsCount] = React.useState(0);
  const [aggiornamenti, setAggiornamenti] = React.useState<Aggiornamento[]>([]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const loadTodayEvents = async () => {
      const today = new Date().toISOString().split('T')[0];
      const events = await getEventsByDate(today);
      setTodayEvents(events);
    };

    loadTodayEvents();
  }, []);

  React.useEffect(() => {
    const loadRecentConversations = async () => {
      try {
        const allConversations = await getAllConversations();
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const recentConversations = allConversations.filter(conv => {
          if (!conv.lastMessage) return false;
          const messageDate = new Date(conv.lastMessage.timestamp);
          return messageDate >= twentyFourHoursAgo;
        });

        setRecentConversationsCount(recentConversations.length);
      } catch (error) {
        console.error('Error loading recent conversations:', error);
        setRecentConversationsCount(0);
      }
    };

    loadRecentConversations();
  }, []);

  React.useEffect(() => {
    const updates: Aggiornamento[] = [];

    requests.slice(0, 5).forEach(req => {
      updates.push({
        tipo: 'richiesta',
        testo: `Nuova richiesta da ${req.Nome}`,
        tempo: '',
        timestamp: new Date(req.richiestaAt)
      });
    });

    checklist
      .filter(item => item.completata && item.completataAt)
      .slice(0, 3)
      .forEach(item => {
        updates.push({
          tipo: 'checklist',
          testo: `Attività "${item.testo.substring(0, 30)}${item.testo.length > 30 ? '...' : ''}" completata`,
          tempo: '',
          timestamp: new Date(item.completataAt!)
        });
      });

    updates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const topUpdates = updates.slice(0, 4).map(update => ({
      ...update,
      tempo: getRelativeTime(update.timestamp)
    }));

    setAggiornamenti(topUpdates);
  }, [requests, checklist]);

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

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec fa`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min fa`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h fa`;
    return `${Math.floor(diffInSeconds / 86400)}gg fa`;
  };

  const stats = React.useMemo(() => {
    const urgentCount = requests.filter(r => r.Urgenza === true || r.Urgenza === 'true' || r.Urgenza === 'Sì').length;
    const nonUrgentCount = requests.length - urgentCount;

    const clientRequestCounts = new Map<string, number>();
    clients.forEach(client => {
      if (client.telefono) {
        const count = requests.filter(req =>
          req.Numero && client.telefono &&
          req.Numero.replace(/\s+/g, '') === client.telefono.replace(/\s+/g, '')
        ).length;
        if (count > 0) {
          clientRequestCounts.set(client.nominativo || 'N/A', count);
        }
      }
    });

    const topClients = Array.from(clientRequestCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([name, count]) => `${name} (${count})`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const checklistToday = checklist.filter(item => {
      if (item.completata) return false;
      if (!item.dataScadenza) return false;
      const dueDate = new Date(item.dataScadenza);
      return dueDate >= today && dueDate <= todayEnd;
    }).length;

    return {
      richieste: { totale: requests.length, urgenti: urgentCount, nonUrgenti: nonUrgentCount },
      clienti: { totale: clients.length, topClients },
      checklist: { aperteOggi: checklistToday },
      conversazioni: { nuove24h: recentConversationsCount }
    };
  }, [requests, clients, checklist, recentConversationsCount]);

  const agenda: AgendaItem[] = React.useMemo(() => {
    return todayEvents.slice(0, 5).map(event => {
      const startTime = new Date(event.data_inizio);
      return {
        orario: startTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        cliente: event.cliente_nome || event.titolo,
        luogo: event.indirizzo || 'Nessun indirizzo specificato',
        urgente: event.tipo_intervento === 'Riparazione'
      };
    });
  }, [todayEvents]);

  const weeklyStats = React.useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const completedThisWeek = checklist.filter(item => {
      if (!item.completata || !item.completataAt) return false;
      const completedDate = new Date(item.completataAt);
      return completedDate >= weekStart && completedDate <= now;
    }).length;

    const checklistTodayCount = checklist.filter(item => {
      if (!item.completata || !item.completataAt) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);
      const completedDate = new Date(item.completataAt);
      return completedDate >= today && completedDate <= todayEnd;
    }).length;

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newClientsThisMonth = clients.filter(client => {
      if (!client.created_at) return false;
      const createdDate = new Date(client.created_at);
      return createdDate >= monthStart && createdDate <= now;
    }).length;

    const completionRate = requests.length > 0
      ? Math.round((requests.filter(r => r.stato === 'Completato').length / requests.length) * 100)
      : 0;

    return {
      completedWeek: completedThisWeek,
      checklistToday: checklistTodayCount,
      newClientsMonth: newClientsThisMonth,
      satisfaction: completionRate
    };
  }, [requests, clients, checklist]);

  const getAggiornamentiIcon = (tipo: string) => {
    switch (tipo) {
      case 'richiesta': return <ClipboardList className="h-4 w-4" />;
      case 'checklist': return <CheckSquare className="h-4 w-4" />;
      case 'conversazione': return <MessageCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <InlineLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
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
                    {stats.richieste.totale}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Richieste</h3>
                <div className="flex space-x-2">
                  <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                    {stats.richieste.urgenti} urgenti
                  </span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                    {stats.richieste.nonUrgenti} normali
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
                    {stats.clienti.totale}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Clienti</h3>
                <div className="space-y-1">
                  {stats.clienti.topClients.length > 0 ? (
                    stats.clienti.topClients.map((client, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="h-3 w-3 mr-1 text-yellow-400" />
                        {client}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Nessun cliente con richieste</span>
                  )}
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
                    {stats.checklist.aperteOggi}
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
                    {stats.conversazioni.nuove24h}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Conversazioni</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nuove ultime 24h</span>
                  {stats.conversazioni.nuove24h > 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Azioni Rapide */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <button
                  onClick={onNewRequest}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Plus className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Aggiungi richiesta</div>
                </button>
                
                <button
                  onClick={onNewClient}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Users className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Aggiungi cliente</div>
                </button>
                
                <button
                  onClick={() => {
                    onTabChange('checklist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <CheckSquare className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Vai a checklist</div>
                </button>

                <button
                  onClick={() => {
                    onTabChange('conversazioni');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
              {agenda.length > 0 ? (
                <div className="space-y-3">
                  {agenda.map((appuntamento, index) => (
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
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nessun appuntamento oggi</p>
                </div>
              )}
            </div>

            {/* Statistiche Minime */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {weeklyStats.completedWeek}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completate settimana</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {weeklyStats.checklistToday}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Checklist oggi</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {weeklyStats.newClientsMonth}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Nuovi clienti mese</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {weeklyStats.satisfaction}
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tasso completamento</div>
              </div>
            </div>

            {/* Ultimi Aggiornamenti */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ultimi Aggiornamenti</h3>
              {aggiornamenti.length > 0 ? (
                <div className="space-y-3">
                  {aggiornamenti.map((aggiornamento, index) => (
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
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nessun aggiornamento recente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}