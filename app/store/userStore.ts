import { create } from 'zustand';

interface UserState {
  userId: string | null;
  isLoading: boolean;
  setUserId: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  userId: null,
  isLoading: true,
  setUserId: (userId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);
    }
    set({ userId, isLoading: false });
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

if (typeof window !== 'undefined') {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    useUserStore.getState().setUserId(storedUserId);
  } else {
    useUserStore.getState().setLoading(false);
  }
}
