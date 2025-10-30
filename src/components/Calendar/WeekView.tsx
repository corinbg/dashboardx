import React from 'react';
import { CalendarEvent } from '../../types';
import { EventCard } from './EventCard';

interface WeekViewProps {
  events: CalendarEvent[];
  weekStart: Date;
  onEventClick: (event: CalendarEvent) => void;
}

export function WeekView({ events, weekStart, onEventClick }: WeekViewProps) {
  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.data_inizio);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const today = isToday(day);

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 min-h-[200px]"
            >
              <div
                className={`p-2 text-center border-b border-gray-200 dark:border-gray-700 ${
                  today ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {daysOfWeek[index]}
                </div>
                <div
                  className={`mt-1 text-lg font-semibold ${
                    today
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {formatDate(day)}
                </div>
                {dayEvents.length > 0 && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {dayEvents.length}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2 space-y-2">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      compact
                    />
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400 dark:text-gray-600">Nessun evento</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
