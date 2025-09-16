import React from 'react';
import { User, MapPin, Wrench, Phone, Clock, Calendar, Ban } from 'lucide-react';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';

interface RequestCardsProps {
  requests: Request[];
  onRequestClick: (request: Request) => void;
  selectedIndex: number;
  onSelectedChange: (index: number) => void;
}

export function RequestCards({ requests, onRequestClick, selectedIndex, onSelectedChange }: RequestCardsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number, request: Request) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (index < requests.length - 1) {
          onSelectedChange(index + 1);
          // Focus next card
          const nextCard = document.querySelector(`[data-card-index="${index + 1}"]`) as HTMLElement;
          nextCard?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index > 0) {
          onSelectedChange(index - 1);
          // Focus previous card
          const prevCard = document.querySelector(`[data-card-index="${index - 1}"]`) as HTMLElement;
          prevCard?.focus();
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onRequestClick(request);
        break;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-500 dark:text-gray-400">
        No requests found
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {requests.map((request, index) => (
        <div
          key={request.id}
          data-card-index={index}
          tabIndex={0}
          onClick={() => onRequestClick(request)}
          onKeyDown={(e) => handleKeyDown(e, index, request)}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            selectedIndex === index ? 'ring-2 ring-blue-500 border-blue-500' : ''
          }`}
          role="button"
         aria-label={`View request details for ${request.Nome}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {request.Nome}
              </h3>
            </div>
            <div className="flex space-x-2">
              <UrgencyBadge urgent={request.Urgenza === 'true' || request.Urgenza === 'Sì'} size="sm" />
              {request.spamFuoriZona && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                  <Ban className="h-3 w-3 mr-1" aria-hidden="true" />
                  Spam
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {request.Luogo}
            </p>
          </div>

          {/* Service Type */}
          <div className="flex items-center mb-2">
            <Wrench className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {request.Problema}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-center mb-2">
            <Phone className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            <a 
              href={`tel:${request.Numero}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {request.Numero}
            </a>
          </div>

          {/* Callback Time */}
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {request.PreferenzaRicontatto}
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center mb-3">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate(request.richiestaAt)}
            </p>
          </div>

          {/* Status */}
          <div className="flex justify-end">
            <StatusBadge status={request.stato} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}