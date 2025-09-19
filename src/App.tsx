import React, { useState } from 'react';
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
import { EmailConfirmationPage } from './pages/EmailConfirmationPage';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('richieste');
  const [conversationSearchPhoneNumber, setConversationSearchPhoneNumber] = useState<string | null>(null);

  // Check if we're on the email confirmation route
  const isEmailConfirmationRoute = window.location.pathname === '/email-confirm' || 
    window.location.search.includes('request_id');

  // Show email confirmation page if on that route
  if (isEmailConfirmationRoute) {
    return <EmailConfirmationPage />;
  }

  // Show loading while authentication state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
      />
    </AppProvider>
  );
}

interface AppContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  conversationSearchPhoneNumber: string | null;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
}

function AppContent({ 
  activeTab, 
  setActiveTab, 
  conversationSearchPhoneNumber, 
  setConversationSearchPhoneNumber 
}: AppContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'richieste':
        return (
          <RequestsPage 
            onTabChange={setActiveTab}
            setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
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
        Skip to main content
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