import React from 'react';
import { CalendarEvent } from '../../types';
import { EventCard } from './EventCard';

interface DayViewProps {
  events: CalendarEvent[];
  date: Date;
  onEventClick: (event: CalendarEvent) => void;
}

export function DayView({ events, date, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.data_inizio);
      const eventEnd = new Date(event.data_fine);
      const hourStart = new Date(date);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(date);
      hourEnd.setHours(hour, 59, 59, 999);

      return (
        (eventStart >= hourStart && eventStart <= hourEnd) ||
        (eventEnd >= hourStart && eventEnd <= hourEnd) ||
        (eventStart <= hourStart && eventEnd >= hourEnd)
      );
    });
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const isCurrentHour = (hour: number) => {
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    return isToday && now.getHours() === hour;
  };

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Nessun evento per questo giorno</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          const isNow = isCurrentHour(hour);

          return (
            <div
              key={hour}
              className={`flex ${isNow ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className="w-20 flex-shrink-0 py-3 px-4 text-right border-r border-gray-200 dark:border-gray-700">
                <span
                  className={`text-sm font-medium ${
                    isNow
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatHour(hour)}
                </span>
              </div>

              <div className="flex-1 py-2 px-4 min-h-[60px]">
                {hourEvents.length > 0 ? (
                  <div className="space-y-2">
                    {hourEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                        compact
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
