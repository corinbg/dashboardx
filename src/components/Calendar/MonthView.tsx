import React from 'react';
import { CalendarEvent } from '../../types';

interface MonthViewProps {
  events: CalendarEvent[];
  currentMonth: Date;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function MonthView({ events, currentMonth, onDateClick, onEventClick }: MonthViewProps) {
  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let dayOfWeek = firstDay.getDay();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < dayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -dayOfWeek + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Sopralluogo':
        return 'bg-blue-500';
      case 'Riparazione':
        return 'bg-amber-500';
      case 'Installazione':
        return 'bg-green-500';
      case 'Manutenzione':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-gray-50 dark:bg-gray-900 py-2 text-center"
          >
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day.date);
          const today = isToday(day.date);

          return (
            <button
              key={index}
              onClick={() => onDateClick(day.date)}
              className={`
                bg-white dark:bg-gray-800 min-h-[100px] p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                ${!day.isCurrentMonth ? 'opacity-40' : ''}
                ${today ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`
                      text-sm font-medium
                      ${today
                        ? 'flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white'
                        : day.isCurrentMonth
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-600'
                      }
                    `}
                  >
                    {day.date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`
                        w-full text-left px-1.5 py-0.5 rounded text-xs truncate
                        ${getEventTypeColor(event.tipo_intervento)} text-white
                        hover:opacity-80 transition-opacity
                      `}
                      title={event.titolo}
                    >
                      {new Date(event.data_inizio).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} {event.titolo}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                      +{dayEvents.length - 3} altri
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
