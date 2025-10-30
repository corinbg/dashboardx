import React, { useState } from 'react';
import { Moon, Sun, Menu, X, LogOut, FileText, Users, CheckSquare, Calendar, MessageCircle, Home, HelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home,
    description: 'Dashboard principale'
  },
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
    id: 'conversazioni', 
    label: 'Conversazioni', 
    icon: MessageCircle,
    description: 'Chat e messaggi clienti'
  },
  {
    id: 'calendario',
    label: 'Calendario',
    icon: Calendar,
    description: 'Gestione appuntamenti'
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
    description: 'Domande frequenti'
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
            <div className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <img 
                src={darkMode ? "/Logo-dark.png" : "/Logo.png"} 
                alt="Logo Assistente Idraulico" 
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-3">
            <div className="ml-6 flex items-baseline space-x-2">
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
                    } whitespace-nowrap`}
                    title={tab.description}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <div className="flex items-center space-x-1.5">
                      <IconComponent 
                        className="h-3.5 w-3.5" 
                        aria-hidden="true"
                      />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
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
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-2.5">
                    <IconComponent 
                      className="h-4 w-4" 
                      aria-hidden="true"
                    />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}