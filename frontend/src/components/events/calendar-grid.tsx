/**
 * @project AncestorTree
 * @file src/components/events/calendar-grid.tsx
 * @description Monthly calendar grid with lunar dates and events overlay
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useMemo } from 'react';
import { parseLunarString, getNextLunarOccurrence, solarToLunar } from '@/lib/lunar-calendar';
import { EVENT_TYPE_LABELS } from './event-constants';
import type { Event, Person } from '@/types';

interface CalendarGridProps {
  month: number;
  year: number;
  events: Event[];
  people: Person[];
}

export function CalendarGrid({ month, year, events, people }: CalendarGridProps) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Pre-compute all lunar dates for the month in a single pass (fix m1)
  const lunarDates = useMemo(() => {
    const dates: { day: number; month: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const lunar = solarToLunar(d, month, year);
      dates.push({ day: lunar.day, month: lunar.month });
    }
    return dates;
  }, [daysInMonth, month, year]);

  // Map events to solar dates in this month
  const eventsByDay = useMemo(() => {
    const map = new Map<number, { event: Event; person?: Person }[]>();

    for (const event of events) {
      // Check by lunar date
      if (event.event_lunar) {
        const parsed = parseLunarString(event.event_lunar);
        if (parsed) {
          const next = getNextLunarOccurrence(parsed.day, parsed.month);
          if (next.getMonth() + 1 === month && next.getFullYear() === year) {
            const dayEvents = map.get(next.getDate()) || [];
            const person = event.person_id ? people.find(p => p.id === event.person_id) : undefined;
            dayEvents.push({ event, person });
            map.set(next.getDate(), dayEvents);
          }
        }
      }
      // Check by solar date
      if (event.event_date) {
        const d = new Date(event.event_date);
        if (d.getMonth() + 1 === month && d.getFullYear() === year) {
          const dayEvents = map.get(d.getDate()) || [];
          const person = event.person_id ? people.find(p => p.id === event.person_id) : undefined;
          dayEvents.push({ event, person });
          map.set(d.getDate(), dayEvents);
        }
      }
    }

    return map;
  }, [events, people, month, year]);

  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
  const todayDate = today.getDate();

  return (
    <div>
      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border">
        {dayNames.map(d => (
          <div key={d} className="bg-muted-foreground/5 p-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-background p-2 min-h-[80px]" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvts = eventsByDay.get(day) || [];
          const isToday = isCurrentMonth && day === todayDate;
          const lunar = lunarDates[i];

          return (
            <div
              key={day}
              className={`bg-background p-1.5 min-h-[80px] ${
                isToday ? 'ring-2 ring-primary ring-inset' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                  {day}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {lunar.day}/{lunar.month}
                </span>
              </div>
              {dayEvts.map(({ event }) => {
                const typeInfo = EVENT_TYPE_LABELS[event.event_type];
                return (
                  <div
                    key={event.id}
                    className={`text-[10px] px-1 py-0.5 rounded mb-0.5 truncate ${typeInfo.color}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
