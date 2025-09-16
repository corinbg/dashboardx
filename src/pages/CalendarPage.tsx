import React from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';

export function CalendarPage() {
  // Mock calendar events
  const mockEvents = [
    {
      id: '1',
      time: '09:00 - 10:30',
      title: 'Sopralluogo caldaia',
      client: 'Marco Rossi',
      location: 'via Luigi Settembrini 3',
      type: 'Sopralluogo'
    },
    {
      id: '2',
      time: '11:00 - 12:00',
      title: 'Riparazione perdita',
      client: 'Anna Verdi',
      location: 'corso Buenos Aires 15',
      type: 'Riparazione'
    },
    {
      id: '3',
      time: '14:30 - 16:00',
      title: 'Installazione boiler',
      client: 'Giuseppe Bianchi',
      location: 'via Torino 42',
      type: 'Installazione'
    },
    {
      id: '4',
      time: '17:00 - 18:00',
      title: 'Manutenzione impianto',
      client: 'Maria Neri',
      location: 'viale Monza 88',
      type: 'Manutenzione'
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Sopralluogo':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
      case 'Riparazione':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
      case 'Installazione':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'Manutenzione':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Appointment management and daily schedule
          </p>
        </div>

        {/* Status Banner */}
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Feature in development
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>
                  Soon the agent will receive requests and create appointments automatically when the plumber is available. 
                  Calendar integration will allow synchronizing appointments with Google Calendar, Outlook and other services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Wednesday, January 27, 2025
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              4 appointments
            </span>
          </div>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            title="Feature not yet available"
          >
            <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
            Connect Calendar
          </button>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 border rounded-lg ${getEventColor(event.type)}`}
                  role="article"
                  aria-labelledby={`event-${event.id}-title`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                          {event.time}
                        </span>
                      </div>
                      <h3 
                        id={`event-${event.id}-title`}
                        className="text-base font-semibold mb-1"
                      >
                        {event.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <User className="h-3 w-3 mr-1" aria-hidden="true" />
                          {event.client}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-50">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            disabled
            className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
            title="Disponibile quando sarà attivata l'integrazione calendario"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                New Appointment
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Create a new appointment with a client
              </p>
            </div>
          </button>

          <button
            disabled
            className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
            title="Disponibile quando sarà attivata l'integrazione calendario"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Free Slots
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                View available time slots
              </p>
            </div>
          </button>

          <button
            disabled
            className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
            title="Disponibile quando sarà attivata l'integrazione calendario"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                <User className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Clients of the Day
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                See all scheduled clients
              </p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}