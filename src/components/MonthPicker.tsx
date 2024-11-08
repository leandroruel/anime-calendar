import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { useCalendarStore } from '../store/calendar';

export const MonthPicker: React.FC = () => {
  const { currentMonth, setCurrentMonth } = useCalendarStore();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePreviousMonth}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h2 className="text-2xl font-bold text-gray-800">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};