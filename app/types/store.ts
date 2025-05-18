export interface UserState {
  userId: string | null;
  isLoading: boolean;
  setUserId: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
}
