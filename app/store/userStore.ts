import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  isLoading: boolean;
  setUserId: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      isLoading: true,
      setUserId: (userId: string) => set({ userId, isLoading: false }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ userId: state.userId }),
    }
  )
);

if (typeof window !== 'undefined') {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    useUserStore.getState().setUserId(storedUserId);
  } else {
    useUserStore.getState().setLoading(false);
  }
}
