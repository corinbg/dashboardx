import React, { useState } from 'react';
import { User, MapPin, Wrench, Phone, Clock, Calendar, Settings, ChevronDown, ExternalLink, CheckCircle, CalendarCheck, Eye } from 'lucide-react';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';

interface RequestTableProps {
  requests: Request[];
  onRequestClick: (request: Request) => void;
  selectedIndex: number;
  onSelectedChange: (index: number) => void;
}

type ColumnId = 'customer' | 'location' | 'service' | 'phone' | 'callback' | 'combined_status' | 'spam';

interface ColumnConfig {
  id: ColumnId;
  label: string;
  icon: React.ComponentType<any>;
  required: boolean;
  width: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'customer', label: 'Cliente', icon: User, required: true, width: 'w-32' },
  { id: 'location', label: 'Luogo', icon: MapPin, required: true, width: 'w-40' },
  { id: 'service', label: 'Servizio', icon: Wrench, required: true, width: 'w-32' },
  { id: 'phone', label: 'Telefono', icon: Phone, required: false, width: 'w-32' },
  { id: 'callback', label: 'Ricontatto', icon: Clock, required: false, width: 'w-32' },
  { id: 'combined_status', label: 'Stato & Data', icon: Calendar, required: true, width: 'w-40' },
  { id: 'spam', label: 'Spam', icon: Eye, required: false, width: 'w-20' }
];

export function RequestTable({ requests, onRequestClick, selectedIndex, onSelectedChange }: RequestTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(['customer', 'location', 'service', 'combined_status']);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleColumnToggle = (columnId: ColumnId) => {
    const column = COLUMNS.find(c => c.id === columnId);
    if (column?.required) return;

    setVisibleColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number, request: Request) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (index < requests.length - 1) {
          onSelectedChange(index + 1);
          const nextRow = document.querySelector(`[data-row-index="${index + 1}"]`) as HTMLElement;
          nextRow?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index > 0) {
          onSelectedChange(index - 1);
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

  const handleQuickCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleQuickNavigate = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
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

  const visibleColumnConfigs = COLUMNS.filter(col => visibleColumns.includes(col.id));

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      {/* Column Settings */}
      <div className="relative border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {requests.length} richieste
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Settings className="h-4 w-4 mr-1" />
              Colonne
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>

            {showColumnSettings && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                <div className="p-2">
                  {COLUMNS.map((column) => {
                    const IconComponent = column.icon;
                    return (
                      <label
                        key={column.id}
                        className="flex items-center px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.id)}
                          onChange={() => handleColumnToggle(column.id)}
                          disabled={column.required}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <IconComponent className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100">
                          {column.label}
                          {column.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Notice */}
      <div className="md:hidden p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
          💡 Scorri orizzontalmente o usa la vista schede per mobile
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {visibleColumnConfigs.map((column) => {
                const IconComponent = column.icon;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.width}`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-1" aria-hidden="true" />
                      {column.label}
                    </div>
                  </th>
                );
              })}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request, index) => {
              const isUrgent = request.Urgenza;
              const rowBgClass = isUrgent 
                ? 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700';

              return (
                <tr
                  key={request.id}
                  data-row-index={index}
                  tabIndex={0}
                  onClick={() => onRequestClick(request)}
                  onKeyDown={(e) => handleKeyDown(e, index, request)}
                  className={`cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors ${rowBgClass} ${
                    selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  role="button"
                  aria-label={`View request details for ${request.Nome}`}
                >
                  {/* Customer */}
                  {visibleColumns.includes('customer') && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.Nome}
                        </div>
                        <UrgencyBadge urgent={isUrgent} size="sm" />
                      </div>
                    </td>
                  )}

                  {/* Location */}
                  {visibleColumns.includes('location') && (
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs" title={request.Luogo}>
                        {request.Luogo}
                      </div>
                    </td>
                  )}

                  {/* Service */}
                  {visibleColumns.includes('service') && (
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs" title={request.Problema}>
                        {request.Problema}
                      </div>
                    </td>
                  )}

                  {/* Phone */}
                  {visibleColumns.includes('phone') && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {request.Numero}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickCall(e, request.Numero);
                          }}
                          className="flex-shrink-0 p-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title={`Chiama ${request.Numero}`}
                          aria-label={`Chiama ${request.Numero}`}
                        >
                          <Phone className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Callback */}
                  {visibleColumns.includes('callback') && (
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {request.PreferenzaRicontatto}
                      </div>
                    </td>
                  )}

                  {/* Combined Status */}
                  {visibleColumns.includes('combined_status') && (
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(request.richiestaAt)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={request.stato} size="sm" />
                          {request.spamFuoriZona && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                              Spam
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Spam Flag */}
                  {visibleColumns.includes('spam') && (
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {request.spamFuoriZona ? (
                        <span className="text-yellow-500 dark:text-yellow-400" title="Segnalato come spam">
                          ⚠️
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                  )}

                  {/* Quick Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => handleQuickCall(e, request.Numero)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Chiama cliente"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleQuickNavigate(e, request.Luogo)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Naviga verso indirizzo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}