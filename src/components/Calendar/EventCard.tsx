import React from 'react';
import { Clock, MapPin, User, FileText } from 'lucide-react';
import { CalendarEvent, EventType } from '../../types';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'Sopralluogo':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
      case 'Riparazione':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700';
      case 'Installazione':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'Manutenzione':
        return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusBadge = () => {
    switch (event.stato) {
      case 'Programmato':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            Programmato
          </span>
        );
      case 'In corso':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
            In corso
          </span>
        );
      case 'Completato':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            Completato
          </span>
        );
      case 'Cancellato':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
            Cancellato
          </span>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeRange = () => {
    return `${formatTime(event.data_inizio)} - ${formatTime(event.data_fine)}`;
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-2 border rounded ${getEventTypeColor(event.tipo_intervento)} hover:opacity-80 transition-opacity`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{event.titolo}</p>
            <p className="text-xs opacity-75">{getTimeRange()}</p>
          </div>
          {getStatusBadge()}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border rounded-lg ${getEventTypeColor(event.tipo_intervento)} hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">{getTimeRange()}</span>
          </div>
          <h3 className="text-base font-semibold">{event.titolo}</h3>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-1">
        {(event.cliente_nome || event.cliente_id) && (
          <div className="flex items-center text-sm">
            <User className="h-3 w-3 mr-1.5" aria-hidden="true" />
            <span>{event.cliente_nome || 'Cliente collegato'}</span>
          </div>
        )}

        {event.indirizzo && (
          <div className="flex items-center text-sm">
            <MapPin className="h-3 w-3 mr-1.5" aria-hidden="true" />
            <span>{event.indirizzo}</span>
          </div>
        )}

        {event.note && (
          <div className="flex items-start text-sm">
            <FileText className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{event.note}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-20">
          {event.tipo_intervento}
        </span>
      </div>
    </button>
  );
}
