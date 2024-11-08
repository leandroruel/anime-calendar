import { create } from 'zustand';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './auth';
import { DaySchedule, ScheduledEpisode } from '../types';
import { format } from 'date-fns';

interface CalendarStore {
  selectedDate: Date | null;
  currentMonth: Date;
  schedule: DaySchedule[];
  loading: boolean;
  error: string | null;
  setSelectedDate: (date: Date | null) => void;
  setCurrentMonth: (date: Date) => void;
  addSchedule: (date: Date, schedule: ScheduledEpisode) => Promise<void>;
  clearSchedule: () => Promise<void>;
  getExistingEpisodes: (animeId: number) => number[];
  fetchMonthSchedule: (date: Date) => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  selectedDate: null,
  currentMonth: new Date(),
  schedule: [],
  loading: false,
  error: null,

  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setCurrentMonth: async (date) => {
    set({ currentMonth: date });
    await get().fetchMonthSchedule(date);
  },

  addSchedule: async (date, schedule) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const monthKey = format(date, 'yyyy-MM');
      const scheduleRef = doc(db, 'users', user.uid, 'schedules', monthKey);
      
      const existingDoc = await getDoc(scheduleRef);
      const existingSchedule = existingDoc.exists() ? existingDoc.data().schedule : [];
      
      const updatedSchedule = [...existingSchedule];
      const dayIndex = updatedSchedule.findIndex(
        (day) => day.date.toDate().toDateString() === date.toDateString()
      );

      if (dayIndex >= 0) {
        updatedSchedule[dayIndex].schedules.push(schedule);
      } else {
        updatedSchedule.push({
          date,
          schedules: [schedule],
        });
      }

      await setDoc(scheduleRef, { schedule: updatedSchedule });
      
      set((state) => ({
        schedule: updatedSchedule,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearSchedule: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const monthKey = format(get().currentMonth, 'yyyy-MM');
      const scheduleRef = doc(db, 'users', user.uid, 'schedules', monthKey);
      await setDoc(scheduleRef, { schedule: [] });
      
      set({
        schedule: [],
        selectedDate: null,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

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

  fetchMonthSchedule: async (date: Date) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const monthKey = format(date, 'yyyy-MM');
      const scheduleRef = doc(db, 'users', user.uid, 'schedules', monthKey);
      const scheduleDoc = await getDoc(scheduleRef);
      
      if (scheduleDoc.exists()) {
        set({
          schedule: scheduleDoc.data().schedule,
          loading: false,
        });
      } else {
        set({ schedule: [], loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));