import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // 기본 테마를 시스템 설정으로 변경 (더 자연스러운 UX)
      theme: 'system',
      setTheme: (theme: Theme) => set({ theme }),
      isHydrated: false,
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'theme-storage',
      // 서버 사이드 렌더링 시 hydration mismatch 방지
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
