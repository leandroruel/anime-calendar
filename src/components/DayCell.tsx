import React from 'react';
import { format } from 'date-fns';
import { useFloating, offset, shift, flip } from '@floating-ui/react';
import { useCalendarStore } from '../store';
import clsx from 'clsx';

interface DayCellProps {
  date: Date;
  isSelected: boolean;
  onSelect: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({ date, isSelected, onSelect }) => {
  const [showPopover, setShowPopover] = React.useState(false);
  const { schedule } = useCalendarStore();
  const daySchedule = schedule.find((s) => 
    s.date.toDateString() === date.toDateString()
  );

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), shift(), flip()],
  });

  return (
    <div
      ref={refs.setReference}
      className={clsx(
        'relative p-2 min-h-[80px] border rounded-lg transition-all cursor-pointer',
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300'
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      <span className="text-sm text-gray-600">{format(date, 'd')}</span>
      <div className="mt-1 flex flex-wrap gap-1">
        {daySchedule?.schedules.map((anime, idx) => (
          <img
            key={`${anime.animeId}-${idx}`}
            src={anime.image}
            alt={anime.title}
            className="w-6 h-6 rounded-full"
          />
        ))}
      </div>
      {showPopover && daySchedule && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 bg-white rounded-lg shadow-lg p-4 w-64"
        >
          {daySchedule.schedules.map((anime, idx) => (
            <div key={`${anime.animeId}-${idx}`} className="mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-sm">{anime.title}</h4>
                  <p className="text-xs text-gray-600">
                    Episodes: {anime.episodes.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};