import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from '@/app/types';

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
