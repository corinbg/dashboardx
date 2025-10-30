import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarEvent, CalendarView } from '../types';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/calendarService';
import { CalendarViewToggle } from '../components/Calendar/CalendarViewToggle';
import { DayView } from '../components/Calendar/DayView';
import { WeekView } from '../components/Calendar/WeekView';
import { MonthView } from '../components/Calendar/MonthView';
import { NewEventModal } from '../components/Calendar/NewEventModal';
import { EventDrawer } from '../components/Calendar/EventDrawer';

export function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const eventsData = await getEvents();
    setEvents(eventsData);
    setLoading(false);
  };

  const handleCreateEvent = async (eventData: any) => {
    const eventId = await createEvent(eventData);
    if (eventId) {
      await loadEvents();
    }
  };

  const handleUpdateEvent = async (id: string, updates: any) => {
    const success = await updateEvent(id, updates);
    if (success) {
      await loadEvents();

      // Update selectedEvent with fresh data from database
      if (selectedEvent && selectedEvent.id === id) {
        const eventsData = await getEvents();
        const updatedEvent = eventsData.find(e => e.id === id);
        if (updatedEvent) {
          setSelectedEvent(updatedEvent);
        }
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const success = await deleteEvent(id);
    if (success) {
      await loadEvents();
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDrawerOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const handleNewEventClick = (date?: Date) => {
    setNewEventDate(date || currentDate);
    setIsNewEventModalOpen(true);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDisplayedEvents = () => {
    if (view === 'day') {
      return events.filter(event => {
        const eventDate = new Date(event.data_inizio);
        return (
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      });
    } else if (view === 'week') {
      const weekStart = getWeekStart(currentDate);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return events.filter(event => {
        const eventDate = new Date(event.data_inizio);
        return eventDate >= weekStart && eventDate <= weekEnd;
      });
    } else {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      return events.filter(event => {
        const eventDate = new Date(event.data_inizio);
        return eventDate >= monthStart && eventDate <= monthEnd;
      });
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (view === 'day') {
      return currentDate.toLocaleDateString('it-IT', {
        weekday: 'long',
        ...options,
      });
    } else if (view === 'week') {
      const weekStart = getWeekStart(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${weekStart.toLocaleDateString('it-IT', options)} - ${weekEnd.toLocaleDateString('it-IT', options)}`;
    } else {
      return currentDate.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
      });
    }
  };

  const displayedEvents = getDisplayedEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Caricamento calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Calendario
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestione appuntamenti e programmazione giornaliera
              </p>
            </div>
            <button
              onClick={() => handleNewEventClick()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Appuntamento
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  aria-label="Periodo precedente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Oggi
                </button>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  aria-label="Periodo successivo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {formatDateRange()}
                </h2>
                {displayedEvents.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {displayedEvents.length} {displayedEvents.length === 1 ? 'appuntamento' : 'appuntamenti'}
                  </p>
                )}
              </div>
            </div>

            <CalendarViewToggle currentView={view} onViewChange={setView} />
          </div>
        </div>

        <div className="mb-8">
          {view === 'day' && (
            <DayView
              events={displayedEvents}
              date={currentDate}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'week' && (
            <WeekView
              events={displayedEvents}
              weekStart={getWeekStart(currentDate)}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'month' && (
            <MonthView
              events={events}
              currentMonth={currentDate}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </main>

      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSave={handleCreateEvent}
        initialDate={newEventDate}
      />

      <EventDrawer
        event={selectedEvent}
        isOpen={isEventDrawerOpen}
        onClose={() => {
          setIsEventDrawerOpen(false);
          setSelectedEvent(null);
        }}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}