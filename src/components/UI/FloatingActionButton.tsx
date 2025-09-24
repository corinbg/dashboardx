import React, { useState } from 'react';
import { Plus, Phone, UserPlus, FileText, X, Wrench } from 'lucide-react';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

interface FloatingActionButtonProps {
  onNewRequest: () => void;
  onNewClient: () => void;
  onEmergencyCall: () => void;
  onQuickUpdate: () => void;
}

export function FloatingActionButton({
  onNewRequest,
  onNewClient,
  onEmergencyCall,
  onQuickUpdate
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions: FABAction[] = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Chiamata Emergenza",
      onClick: onEmergencyCall,
      color: "bg-red-600 hover:bg-red-700 text-white shadow-lg"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Nuova Richiesta",
      onClick: onNewRequest,
      color: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
    },
    {
      icon: <UserPlus className="h-5 w-5" />,
      label: "Nuovo Cliente",
      onClick: onNewClient,
      color: "bg-green-600 hover:bg-green-700 text-white shadow-lg"
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      label: "Aggiorna Stato",
      onClick: onQuickUpdate,
      color: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
    }
  ];

  return (
    <>
      {/* Overlay per chiudere il menu */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Pulsanti di azione espansi */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col-reverse space-y-reverse space-y-3">
        {isExpanded && actions.map((action, index) => (
          <div 
            key={index}
            className="flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Label del pulsante (solo desktop) */}
            <span className="hidden md:block bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {action.label}
            </span>
            
            <button
              onClick={() => {
                action.onClick();
                setIsExpanded(false);
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${action.color}`}
              title={action.label}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          </div>
        ))}
        
        {/* Pulsante principale FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            isExpanded ? 'rotate-45' : ''
          }`}
          title={isExpanded ? "Chiudi menu" : "Azioni rapide"}
          aria-label={isExpanded ? "Chiudi menu azioni rapide" : "Apri menu azioni rapide"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <X className="h-8 w-8" />
          ) : (
            <Plus className="h-8 w-8" />
          )}
        </button>
      </div>
    </>
  );
}