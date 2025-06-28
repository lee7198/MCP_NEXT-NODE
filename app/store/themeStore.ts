import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // 기본 테마를 라이트 모드로 설정
      theme: 'light',
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      // 서버 사이드 렌더링 시 hydration mismatch 방지
      skipHydration: true,
    }
  )
);
