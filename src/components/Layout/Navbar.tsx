import React, { useState } from 'react';
import { Search, Moon, Sun, Menu, X, LogOut, FileText, Users, CheckSquare, Calendar, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { 
    id: 'richieste', 
    label: 'Richieste', 
    icon: FileText,
    description: 'Gestione richieste di servizio'
  },
  { 
    id: 'clienti', 
    label: 'Clienti', 
    icon: Users,
    description: 'Database clienti e contatti'
  },
  { 
    id: 'checklist', 
    label: 'Checklist', 
    icon: CheckSquare,
    description: 'Lista attività da completare'
  },
  { 
    id: 'calendario', 
    label: 'Calendario', 
    icon: Calendar,
    description: 'Gestione appuntamenti'
  },
  { 
    id: 'conversazioni', 
    label: 'Conversazioni', 
    icon: MessageCircle,
    description: 'Chat e messaggi clienti'
  }
];

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav 
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      role="navigation"
      aria-label="Menu principale"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src={darkMode ? "/Logo-dark.png" : "/Logo.png"} 
              alt="Logo Assistente Idraulico" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${tab.id === 'calendario' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={tab.id === 'calendario'}
                    title={tab.id === 'calendario' ? 'Funzionalità in arrivo' : tab.description}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent 
                        className="h-4 w-4" 
                        aria-hidden="true"
                      />
                      <span>{tab.label}</span>
                    </div>
                    {tab.id === 'calendario' && (
                      <span className="ml-1 text-sm opacity-75">(in arrivo)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                placeholder="Cerca in tutto il sito..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Ricerca globale"
              />
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Cambia modalità colore"
              aria-label={darkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Esci"
                aria-label="Esci dall'applicazione"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Apri menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-900">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${tab.id === 'calendario' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={tab.id === 'calendario'}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent 
                      className="h-5 w-5" 
                      aria-hidden="true"
                    />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'calendario' && (
                    <span className="ml-1 text-sm opacity-75">(in arrivo)</span>
                  )}
                </button>
              );
            })}
            {/* Mobile search */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  placeholder="Cerca in tutto il sito..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  aria-label="Ricerca globale"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}