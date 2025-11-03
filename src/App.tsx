import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import { AppProvider } from './contexts/AppContext';
import { supabase } from './lib/supabase';
import { AlertCircle } from 'lucide-react';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { LoginForm } from './components/Auth/LoginForm';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { RequestsPage } from './pages/RequestsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { CalendarPage } from './pages/CalendarPage';
import { ConversazioniPage } from './pages/ConversazioniPage';
import { HomePage } from './pages/HomePage';
import { FaqPage } from './pages/FaqPage';
import { CentroAssistenzaPage } from './pages/CentroAssistenzaPage';
import { GuideTutorialPage } from './pages/GuideTutorialPage';
import EmailConfirmPage from './pages/EmailConfirmPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { AbbonatiPage } from './pages/AbbonatiPage';
import { FloatingActionButton } from './components/UI/FloatingActionButton';
import { NewClientModal } from './components/Clients/NewClientModal';
import { NewRequestModal } from './components/Requests/NewRequestModal';
import { QuickStatusUpdateModal } from './components/Requests/QuickStatusUpdateModal';
import { NewEventModal } from './components/Calendar/NewEventModal';
import { createClient, deleteClient, updateClient } from './services/clientsService';
import { createRequest, deleteRequest, updateRequest } from './services/requestsService';
import { createEvent } from './services/calendarService';

// Funzione per controllare se siamo sulla route di conferma email
function isEmailConfirmRoute(): boolean {
  const path = window.location.pathname;
  return path === '/email-confirm' || path === '/email-confirm/';
}

type SubscriptionStatus = 'pending' | 'active' | 'trial' | 'inactive' | 'expired';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [conversationSearchPhoneNumber, setConversationSearchPhoneNumber] = useState<string | null>(null);
  const [initialRequestId, setInitialRequestId] = useState<string | null>(null);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [quickStatusUpdateModalOpen, setQuickStatusUpdateModalOpen] = useState(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Check subscription status when user is authenticated
  useEffect(() => {
    if (user) {
      checkSubscriptionAccess();
    }
  }, [user]);

  const checkSubscriptionAccess = async () => {
    try {
      setSubscriptionLoading(true);
      setSubscriptionError(null);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user!.id)
        .maybeSingle();

      if (profileError) {
        throw new Error('Errore nel recupero del profilo');
      }

      if (!profile) {
        setHasAccess(false);
        setActiveTab('abbonati');
        setSubscriptionLoading(false);
        return;
      }

      const status = profile.subscription_status as SubscriptionStatus;

      if (status === 'active' || status === 'trial') {
        setHasAccess(true);
      } else {
        setHasAccess(false);
        setActiveTab('abbonati');
      }

      setSubscriptionLoading(false);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setSubscriptionError('Errore di connessione');
      setSubscriptionLoading(false);
    }
  };

  // Read request_id from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('request_id');
    if (requestId) {
      console.log('📖 Found request_id in URL:', requestId);
      setInitialRequestId(requestId);
      setActiveTab('richieste');

      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const clearInitialRequestId = () => {
    setInitialRequestId(null);
  };

  // Handlers per FAB
  const handleNewRequest = () => {
    setNewRequestModalOpen(true);
  };

  const handleNewClient = () => {
    setNewClientModalOpen(true);
  };

  const handleEmergencyCall = () => {
    // EMERGENCY CALL: Direct dial to specified emergency number
    // This works on both mobile and desktop browsers
    // Mobile devices will open the phone app, desktop will prompt with default phone app
    const emergencyNumber = '+393520845493';
    console.log(`🚨 Emergency call initiated to: ${emergencyNumber}`);
    window.location.href = `tel:${emergencyNumber}`;
  };

  const handleStatusUpdate = () => {
    setQuickStatusUpdateModalOpen(true);
  };

  const handleNewEvent = () => {
    setNewEventModalOpen(true);
  };

  // Controlla se siamo sulla route di conferma email PRIMA di qualsiasi controllo di autenticazione
  if (isEmailConfirmRoute()) {
    console.log('📧 Rendering Email Confirmation Page');
    return <EmailConfirmPage />;
  }

  // Controlla se siamo sulla route di conferma email PRIMA di qualsiasi altra logica
  if (isEmailConfirmRoute()) {
    console.log('📧 Rendering Email Confirmation Page');
    return <EmailConfirmPage />;
  }

  // Show loading while authentication state is being determined
  if (authLoading) {
    return <LoadingScreen message="Verifica autenticazione..." />;
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show subscription loading state
  if (subscriptionLoading) {
    return <LoadingScreen message="" />;
  }

  // Show subscription error
  if (subscriptionError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Errore di connessione</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Non è stato possibile verificare il tuo abbonamento. Controlla la tua connessione e riprova.
          </p>
          <button
            onClick={checkSubscriptionAccess}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  // Show subscription page if user doesn't have access
  if (hasAccess === false) {
    return <AbbonatiPage />;
  }

  // Show main application if user is authenticated and has access
  return (
    <AppProvider>
      <AppContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        conversationSearchPhoneNumber={conversationSearchPhoneNumber}
        setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
        initialRequestId={initialRequestId}
        onInitialRequestHandled={clearInitialRequestId}
        newClientModalOpen={newClientModalOpen}
        setNewClientModalOpen={setNewClientModalOpen}
        newRequestModalOpen={newRequestModalOpen}
        setNewRequestModalOpen={setNewRequestModalOpen}
        handleNewRequest={handleNewRequest}
        handleNewClient={handleNewClient}
        handleEmergencyCall={handleEmergencyCall}
        onStatusUpdate={handleStatusUpdate}
        quickStatusUpdateModalOpen={quickStatusUpdateModalOpen}
        setQuickStatusUpdateModalOpen={setQuickStatusUpdateModalOpen}
        handleNewEvent={handleNewEvent}
        newEventModalOpen={newEventModalOpen}
        setNewEventModalOpen={setNewEventModalOpen}
      />
    </AppProvider>
  );
}

interface AppContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  conversationSearchPhoneNumber: string | null;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
  initialRequestId: string | null;
  onInitialRequestHandled: () => void;
  newClientModalOpen: boolean;
  setNewClientModalOpen: (open: boolean) => void;
  newRequestModalOpen: boolean;
  setNewRequestModalOpen: (open: boolean) => void;
  handleNewRequest: () => void;
  handleNewClient: () => void;
  handleEmergencyCall: () => void;
  onStatusUpdate: () => void;
  quickStatusUpdateModalOpen: boolean;
  setQuickStatusUpdateModalOpen: (open: boolean) => void;
  handleNewEvent: () => void;
  newEventModalOpen: boolean;
  setNewEventModalOpen: (open: boolean) => void;
}

function AppContent({
  activeTab,
  setActiveTab,
  conversationSearchPhoneNumber,
  setConversationSearchPhoneNumber,
  initialRequestId,
  onInitialRequestHandled,
  newClientModalOpen,
  setNewClientModalOpen,
  newRequestModalOpen,
  setNewRequestModalOpen,
  handleNewRequest,
  handleNewClient,
  handleEmergencyCall,
  onStatusUpdate,
  quickStatusUpdateModalOpen,
  setQuickStatusUpdateModalOpen,
  handleNewEvent,
  newEventModalOpen,
  setNewEventModalOpen
}: AppContentProps) {
  const { refreshData } = useApp();

  React.useEffect(() => {
    const handleFooterNav = (event: CustomEvent) => {
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('footer-nav', handleFooterNav as EventListener);
    return () => window.removeEventListener('footer-nav', handleFooterNav as EventListener);
  }, [setActiveTab]);

  const handleCreateClient = async (clientData: any) => {
    const result = await createClient(clientData);
    if (result) {
      await refreshData();
      setActiveTab('clienti');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      throw new Error('Failed to create client');
    }
  };

  const handleCreateRequest = async (requestData: any) => {
    // Add current timestamp and spam flag
    const requestWithTimestamp = {
      ...requestData,
      richiestaAt: new Date().toISOString(),
      spamFuoriZona: false
    };

    const result = await createRequest(requestWithTimestamp);
    if (result) {
      await refreshData();
      setActiveTab('richieste');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      throw new Error('Failed to create request');
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    const result = await createEvent(eventData);
    if (result) {
      await refreshData();
    } else {
      throw new Error('Failed to create event');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    const result = await deleteRequest(requestId);
    if (result) {
      await refreshData();
    } else {
      throw new Error('Failed to delete request');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    const result = await deleteClient(clientId);
    if (result) {
      await refreshData();
    } else {
      throw new Error('Failed to delete client');
    }
  };

  const handleUpdateRequest = async (requestId: string, updates: Partial<any>) => {
    const result = await updateRequest(requestId, updates);
    if (result) {
      await refreshData();
    } else {
      throw new Error('Failed to update request');
    }
  };

  const handleUpdateClient = async (clientId: string, updates: Partial<any>) => {
    const result = await updateClient(clientId, updates);
    if (result) {
      await refreshData();
    } else {
      throw new Error('Failed to update client');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            onTabChange={setActiveTab}
            onNewRequest={handleNewRequest}
            onNewClient={handleNewClient}
          />
        );
      case 'richieste':
        return (
          <RequestsPage
            onTabChange={setActiveTab}
            setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
            initialRequestId={initialRequestId}
            onInitialRequestHandled={onInitialRequestHandled}
            onNewRequest={handleNewRequest}
            onDeleteRequest={handleDeleteRequest}
            onUpdateRequest={handleUpdateRequest}
            onUpdateClient={handleUpdateClient}
          />
        );
      case 'clienti':
        return (
          <ClientsPage
            onTabChange={setActiveTab}
            setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
            onDeleteClient={handleDeleteClient}
            onUpdateClient={handleUpdateClient}
            onUpdateRequest={handleUpdateRequest}
            onDeleteRequest={handleDeleteRequest}
          />
        );
      case 'checklist':
        return <ChecklistPage />;
      case 'calendario':
        return <CalendarPage />;
      case 'conversazioni':
        return (
          <ConversazioniPage
            initialPhoneNumber={conversationSearchPhoneNumber}
            onPhoneNumberCleared={() => setConversationSearchPhoneNumber(null)}
          />
        );
      case 'faq':
        return <FaqPage />;
      case 'centro-assistenza':
        return <CentroAssistenzaPage />;
      case 'guide-tutorial':
        return <GuideTutorialPage />;
      case 'privacy':
        return <PrivacyPolicyPage onBack={() => setActiveTab('home')} />;
      case 'cookies':
        return <CookiePolicyPage onBack={() => setActiveTab('home')} />;
      case 'terms':
        return <TermsOfServicePage onBack={() => setActiveTab('home')} />;
      default:
        return (
          <HomePage
            onTabChange={setActiveTab}
           onNewRequest={handleNewRequest}
           onNewClient={handleNewClient}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Salta al contenuto principale
      </a>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div id="main-content" role="main" className="flex-grow">
        {renderContent()}
      </div>

      <Footer />

      {/* FAB - Solo se autenticato e non in pagina di login */}
      <FloatingActionButton
        onNewRequest={handleNewRequest}
        onNewClient={handleNewClient}
        onEmergencyCall={handleEmergencyCall}
        onStatusUpdate={onStatusUpdate}
        onNewEvent={handleNewEvent}
      />

      {/* New Client Modal */}
      <NewClientModal
        isOpen={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onSave={handleCreateClient}
      />

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={newRequestModalOpen}
        onClose={() => setNewRequestModalOpen(false)}
        onSave={handleCreateRequest}
      />

      {/* Quick Status Update Modal */}
      <QuickStatusUpdateModal
        isOpen={quickStatusUpdateModalOpen}
        onClose={() => setQuickStatusUpdateModalOpen(false)}
      />

      {/* New Event Modal */}
      <NewEventModal
        isOpen={newEventModalOpen}
        onClose={() => setNewEventModalOpen(false)}
        onSave={handleCreateEvent}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;