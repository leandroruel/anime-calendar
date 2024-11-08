import { create } from 'zustand';
import { DaySchedule, ScheduledEpisode } from './types';

interface CalendarStore {
  selectedDate: Date | null;
  schedule: DaySchedule[];
  setSelectedDate: (date: Date | null) => void;
  addSchedule: (date: Date, schedule: ScheduledEpisode) => void;
  clearSchedule: () => void;
  getExistingEpisodes: (animeId: number) => number[];
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  selectedDate: null,
  schedule: [],
  setSelectedDate: (date) => set({ selectedDate: date }),
  addSchedule: (date, schedule) =>
    set((state) => {
      const existingDayIndex = state.schedule.findIndex(
        (day) => day.date.toDateString() === date.toDateString()
      );

      if (existingDayIndex >= 0) {
        const newSchedule = [...state.schedule];
        newSchedule[existingDayIndex] = {
          date,
          schedules: [...newSchedule[existingDayIndex].schedules, schedule],
        };
        return { schedule: newSchedule };
      }

      return {
        schedule: [...state.schedule, { date, schedules: [schedule] }],
      };
    }),
  clearSchedule: () => set({ schedule: [], selectedDate: null }),
  getExistingEpisodes: (animeId: number) => {
    const { schedule } = get();
    const existingEpisodes = new Set<number>();
    
    schedule.forEach((day) => {
      day.schedules.forEach((schedule) => {
        if (schedule.animeId === animeId) {
          schedule.episodes.forEach((episode) => existingEpisodes.add(episode));
        }
      });
    });
    
    return Array.from(existingEpisodes).sort((a, b) => a - b);
  },
}));