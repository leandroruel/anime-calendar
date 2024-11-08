import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';
import { useCalendarStore } from '../store';
import { DayCell } from './DayCell';

export const Calendar: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendarStore();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(today, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((date) => (
          <DayCell
            key={date.toString()}
            date={date}
            isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
            onSelect={() => setSelectedDate(date)}
          />
        ))}
      </div>
    </div>
  );
};