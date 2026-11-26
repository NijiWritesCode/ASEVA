import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Building2,
  CreditCard,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function CalendarPage() {
  const { formatNaira } = useKobo();

  // Current calendar month view state (Defaults to December 2026 for active seed events)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 11, 1));
  const [selectedDateStr, setSelectedDateStr] = useState('2026-12-28');

  const { data: calendarItems = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'calendar'],
    queryFn: () => dashboardService.getCalendarEvents(),
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build grid of days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({
      day: d,
      dateStr: dStr,
    });
  }

  // Items for the selected date inspector
  const selectedDayItems = calendarItems.filter((item) => item.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Master Production & Milestone Calendar
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Unified schedule displaying confirmed event execution days, task completion deadlines, and payment installment due dates.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
            <span className="text-obsidian-800">Event Execution</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-obsidian-800">Task Deadline</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-obsidian-800">Payment Milestone</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Monthly Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-sand-300 rounded-sm p-6 shadow-sm space-y-4">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-obsidian-950">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-obsidian-500 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-24 bg-sand-50/40 rounded-sm" />;
              }

              const itemsOnDay = calendarItems.filter((it) => it.date === cell.dateStr);
              const isSelected = selectedDateStr === cell.dateStr;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`h-24 p-2 text-left rounded-sm border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-gold-500 bg-gold-50/50 ring-1 ring-gold-400'
                      : 'border-sand-200 hover:border-sand-400 bg-white'
                  }`}
                >
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-gold-700' : 'text-obsidian-800'}`}>
                    {cell.day}
                  </span>

                  {/* Marker Dots & Preview */}
                  <div className="space-y-1 overflow-hidden w-full">
                    {itemsOnDay.slice(0, 2).map((it) => (
                      <div
                        key={it.id}
                        className={`text-[9px] truncate px-1 py-0.5 rounded font-medium ${
                          it.type === 'event'
                            ? 'bg-gold-100 text-gold-900 border border-gold-300'
                            : it.type === 'task'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {it.title}
                      </div>
                    ))}
                    {itemsOnDay.length > 2 && (
                      <span className="text-[9px] text-obsidian-500 font-semibold block">
                        +{itemsOnDay.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector Side-Panel */}
        <div className="lg:col-span-4 bg-white border border-sand-300 rounded-sm p-6 shadow-sm space-y-5">
          <div className="border-b border-sand-200 pb-3">
            <span className="text-[10px] uppercase font-semibold text-gold-600 tracking-wider block">
              Day Schedule Inspector
            </span>
            <h3 className="font-serif text-lg font-bold text-obsidian-950 font-mono mt-0.5">
              {selectedDateStr}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedDayItems.length === 0 ? (
              <p className="text-xs text-obsidian-500 py-8 text-center font-light">
                No events, tasks, or payment installments scheduled on this date.
              </p>
            ) : (
              selectedDayItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-sm bg-sand-50/70 border border-sand-300 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white border text-obsidian-800">
                      {item.type}
                    </span>
                    {item.amount_kobo && (
                      <span className="font-mono font-bold text-emerald-800">
                        {formatNaira(item.amount_kobo, false)}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-obsidian-950">{item.title}</p>
                  <p className="text-[11px] text-obsidian-600 font-light">{item.details}</p>

                  <div className="pt-2 border-t border-sand-200">
                    <Link
                      to={item.url}
                      className="text-[11px] text-gold-700 font-semibold hover:underline flex items-center"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
