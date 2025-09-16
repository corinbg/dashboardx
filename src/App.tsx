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
import ConversazioniPage from './pages/ConversazioniPage';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('richieste');

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
      <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </AppProvider>
  );
}

function AppContent({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'richieste':
        return <RequestsPage />;
      case 'clienti':
        return <ClientsPage />;
      case 'checklist':
        return <ChecklistPage />;
      case 'calendario':
        return <CalendarPage />;
      case 'conversazioni':
        return <ConversazioniPage />;
      case 'conversazioni':
        return <ConversazioniPage />;
      default:
        return <RequestsPage />;
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