import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/Layout/Navbar';
import { LoginForm } from './components/Auth/LoginForm';
import { RequestsPage } from './pages/RequestsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { CalendarPage } from './pages/CalendarPage';
import { ConversazioniPage } from './pages/ConversazioniPage';
import EmailConfirmPage from './pages/EmailConfirmPage';

// Funzione per controllare se siamo sulla route di conferma email
function isEmailConfirmRoute(): boolean {
  const path = window.location.pathname;
  return path === '/email-confirm' || path === '/email-confirm/';
}

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('richieste');
  const [conversationSearchPhoneNumber, setConversationSearchPhoneNumber] = useState<string | null>(null);
  const [initialRequestId, setInitialRequestId] = useState<string | null>(null);

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
}

function AppContent({ 
  activeTab, 
  setActiveTab, 
  conversationSearchPhoneNumber, 
  setConversationSearchPhoneNumber,
  initialRequestId,
  onInitialRequestHandled
}: AppContentProps) {
  const renderContent = () => {
    switch (activeTab) {
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
          <RequestsPage 
            onTabChange={setActiveTab}
            setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
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