import React, { useState } from 'react';
import { User, MapPin, Wrench, Phone, Clock, Calendar, Ban, ExternalLink, CheckCircle, CalendarCheck, Eye } from 'lucide-react';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';
import { useApp } from '../../contexts/AppContext';

interface RequestCardsProps {
  requests: Request[];
  onRequestClick: (request: Request) => void;
  selectedIndex: number;
  onSelectedChange: (index: number) => void;
}

export function RequestCards({ requests, onRequestClick, selectedIndex, onSelectedChange }: RequestCardsProps) {
  const { updateRequestStatus } = useApp();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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
          const nextCard = document.querySelector(`[data-card-index="${index + 1}"]`) as HTMLElement;
          nextCard?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index > 0) {
          onSelectedChange(index - 1);
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

  const handleQuickCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleQuickNavigate = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const handleQuickStatusUpdate = async (e: React.MouseEvent, requestId: string, newStatus: Request['stato']) => {
    e.stopPropagation();
    setUpdatingStatus(requestId);
    
    try {
      await updateRequestStatus(requestId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-500 dark:text-gray-400">
        Nessuna richiesta trovata
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {requests.map((request, index) => {
        const isUrgent = request.Urgenza === 'true' || request.Urgenza === 'Sì';
        const isUnread = request.stato === 'Non letto';
        
        // Enhanced color coding based on urgency and status
        let cardBgClass = 'bg-white dark:bg-gray-800';
        let borderClass = 'border-gray-200 dark:border-gray-700';
        
        if (isUrgent && isUnread) {
          cardBgClass = 'bg-red-50 dark:bg-red-900/10';
          borderClass = 'border-red-300 dark:border-red-700 border-l-4 border-l-red-500';
        } else if (isUrgent) {
          cardBgClass = 'bg-orange-50 dark:bg-orange-900/10';
          borderClass = 'border-orange-300 dark:border-orange-700 border-l-4 border-l-orange-500';
        } else if (request.stato === 'Completato') {
          cardBgClass = 'bg-green-50 dark:bg-green-900/10';
          borderClass = 'border-green-300 dark:border-green-700';
        }

        return (
          <div
            key={request.id}
            data-card-index={index}
            tabIndex={0}
            onClick={() => onRequestClick(request)}
            onKeyDown={(e) => handleKeyDown(e, index, request)}
            className={`${cardBgClass} rounded-lg shadow-sm border ${borderClass} p-4 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all transform hover:scale-[1.02] ${
              selectedIndex === index ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            role="button"
            aria-label={`View request details for ${request.Nome}`}
          >
            {/* Header with Urgent Flag */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center flex-1 min-w-0">
                <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {request.Nome}
                </h3>
              </div>
              <div className="flex space-x-2 ml-2">
                <UrgencyBadge urgent={isUrgent} size="sm" />
                {request.spamFuoriZona && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                    <Ban className="h-3 w-3 mr-1" aria-hidden="true" />
                    Spam
                  </span>
                )}
              </div>
            </div>

            {/* Location with Navigation */}
            <div className="flex items-center mb-2 group">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                {request.Luogo}
              </p>
              <button
                onClick={(e) => handleQuickNavigate(e, request.Luogo)}
                className="ml-2 p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Naviga verso indirizzo"
              >
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Service Type */}
            <div className="flex items-center mb-2">
              <Wrench className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {request.Problema}
              </p>
            </div>

            {/* Phone with Call Action */}
            <div className="flex items-center mb-2 group">
              <Phone className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
              <button
                onClick={(e) => handleQuickCall(e, request.Numero)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded flex-1 text-left"
                title={`Chiama ${request.Numero}`}
              >
                {request.Numero}
              </button>
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

            {/* Status and Quick Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <StatusBadge status={request.stato} size="sm" />
              
              {/* Quick Status Actions */}
              <div className="flex items-center space-x-1">
                {request.stato !== 'Completato' && (
                  <button
                    onClick={(e) => handleQuickStatusUpdate(e, request.id, 'Completato')}
                    disabled={updatingStatus === request.id}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/70 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                    title="Segna come completato"
                  >
                    {updatingStatus === request.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completa
                      </>
                    )}
                  </button>
                )}
                
                {request.stato === 'Non letto' && (
                  <button
                    onClick={(e) => handleQuickStatusUpdate(e, request.id, 'Contattato')}
                    disabled={updatingStatus === request.id}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    title="Segna come contattato"
                  >
                    {updatingStatus === request.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    ) : (
                      <>
                        <CalendarCheck className="h-3 w-3 mr-1" />
                        Contatta
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}