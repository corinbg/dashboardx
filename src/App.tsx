import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/Layout/Navbar';
import { LoginForm } from './components/Auth/LoginForm';
import { RequestsPage } from './pages/RequestsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { CalendarPage } from './pages/CalendarPage';
import { ConversazioniPage } from './pages/ConversazioniPage';
import { HomePage } from './pages/HomePage';
import EmailConfirmPage from './pages/EmailConfirmPage';
import { FloatingActionButton } from './components/UI/FloatingActionButton';
import { NewClientModal } from './components/Clients/NewClientModal';
import { NewRequestModal } from './components/Requests/NewRequestModal';
import { createClient } from './services/clientsService';
import { createRequest } from './services/requestsService';

// Funzione per controllare se siamo sulla route di conferma email
function isEmailConfirmRoute(): boolean {
  const path = window.location.pathname;
  return path === '/email-confirm' || path === '/email-confirm/';
}

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [conversationSearchPhoneNumber, setConversationSearchPhoneNumber] = useState<string | null>(null);
  const [initialRequestId, setInitialRequestId] = useState<string | null>(null);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);

  // Read request_id from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('request_id');
    if (requestId) {
      console.log('📖 Found request_id in URL:', requestId);
      setInitialRequestId(requestId);
      setActiveTab('richieste'); // Switch to requests tab
      
      // Clean URL to avoid confusion
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
    // STATUS UPDATE: Redirect to requests page for better UX
    // This approach is chosen because:
    // 1. Avoids duplicating complex request filtering logic
    // 2. Users can see all available filters and options
    // 3. Maintains consistency with existing app navigation
    // 4. Allows full request management capabilities
    console.log('📊 Status update: Redirecting to requests page');
    setActiveTab('richieste');
    
    // Optional: Show a brief hint to user about what they can do
    setTimeout(() => {
      const requestsContainer = document.querySelector('[role="main"]');
      if (requestsContainer) {
        requestsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show main application if user is authenticated
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
  onStatusUpdate
}: AppContentProps) {
  const { refreshData } = useApp();

  const handleCreateClient = async (clientData: any) => {
    const result = await createClient(clientData);
    if (result) {
      await refreshData();
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
    } else {
      throw new Error('Failed to create request');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={setActiveTab} />;
      case 'richieste':
        return (
          <RequestsPage 
            onTabChange={setActiveTab}
            setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
            initialRequestId={initialRequestId}
            onInitialRequestHandled={onInitialRequestHandled}
          />
        );
      case 'clienti':
        return (
          <ClientsPage 
            onTabChange={setActiveTab}
            setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
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
      default:
        return (
          <HomePage 
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Salta al contenuto principale
      </a>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div id="main-content" role="main">
        {renderContent()}
      </div>
      
      {/* FAB - Solo se autenticato e non in pagina di login */}
      <FloatingActionButton
        onNewRequest={handleNewRequest}
        onNewClient={handleNewClient}
        onEmergencyCall={handleEmergencyCall}
        onStatusUpdate={onStatusUpdate}
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
      
      {/* Quick Complete Task Modal */}
      <QuickCompleteTaskModal
        isOpen={quickCompleteTaskModalOpen}
        onClose={() => setQuickCompleteTaskModalOpen(false)}
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