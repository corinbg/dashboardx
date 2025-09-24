import React from 'react';
import { User, MapPin, Wrench, Zap, Phone, Clock, Calendar, FileText, Ban } from 'lucide-react';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';

interface RequestTableProps {
  requests: Request[];
  onRequestClick: (request: Request) => void;
  selectedIndex: number;
  onSelectedChange: (index: number) => void;
}

export function RequestTable({ requests, onRequestClick, selectedIndex, onSelectedChange }: RequestTableProps) {
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
          // Focus next row
          const nextRow = document.querySelector(`[data-row-index="${index + 1}"]`) as HTMLElement;
          nextRow?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index > 0) {
          onSelectedChange(index - 1);
          // Focus previous row
          const prevRow = document.querySelector(`[data-row-index="${index - 1}"]`) as HTMLElement;
          prevRow?.focus();
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
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
          Nessuna richiesta trovata
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md relative">
      {/* Scroll indicator */}
      <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none opacity-60 md:hidden"></div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 md:hidden">
        <div className="text-xs text-gray-400 dark:text-gray-500 writing-vertical-rl">
          ← Scorri →
        </div>
      </div>
      <div className="overflow-x-auto">
        {/* Mobile hint */}
        <div className="md:hidden p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            💡 Scorri orizzontalmente per vedere tutti i campi
          </p>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" aria-hidden="true" />
                  Nome
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
                  Luogo
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-1" aria-hidden="true" />
                  Tipo
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" aria-hidden="true" />
                  Urgenza
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" aria-hidden="true" />
                  Telefono
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  Ricontatto
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                  Data/Ora
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" aria-hidden="true" />
                  Stato
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Ban className="h-4 w-4 mr-1" aria-hidden="true" />
                  Spam/Fuori zona
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request, index) => (
              <tr
                key={request.id}
                data-row-index={index}
                tabIndex={0}
                onClick={() => onRequestClick(request)}
                onKeyDown={(e) => handleKeyDown(e, index, request)}
                className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors ${
                  selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                role="button"
                aria-label={`View request details for ${request.Nome}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {request.Nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {request.Luogo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {request.Problema}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <UrgencyBadge urgent={request.Urgenza === 'true' || request.Urgenza === 'Sì'} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <a 
                    href={`tel:${request.Numero}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {request.Numero}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {request.PreferenzaRicontatto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(request.richiestaAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={request.stato} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.spamFuoriZona ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                      Sì
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}