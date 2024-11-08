import { create } from 'zustand';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider, signInWithReddit } from '../lib/firebase';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithReddit: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    error: null,
    signInWithGoogle: async () => {
      try {
        set({ loading: true, error: null });
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ loading: false });
      }
    },
    signInWithReddit: async () => {
      try {
        set({ loading: true, error: null });
        await signInWithReddit();
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ loading: false });
      }
    },
    signOut: async () => {
      try {
        set({ loading: true, error: null });
        await firebaseSignOut(auth);
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ loading: false });
      }
    },
  };
});