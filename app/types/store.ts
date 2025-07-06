// 사용자 상태 관리 관련 타입 정의
export interface UserState {
  userId: string | null;
  isLoading: boolean;
  setUserId: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

// 테마 관련 타입 정의
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}
