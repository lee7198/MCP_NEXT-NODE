// 공통으로 사용되는 타입 정의

// 서버 상태 관련 타입
export type ServerStatus = 'offline' | 'loading' | 'success';
export type PingStatus = 'idle' | 'loading' | 'success';

// 기본 API 응답 타입
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// 편집 상태 관련 타입
export interface EditState<T> {
  [key: string]: T;
}

// 폼 데이터 타입
export interface FormData {
  [key: string]: string | number | boolean | Date;
}

// 페이지네이션 관련 타입
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

// 반응형 디자인 관련 타입
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointConfig {
  'sm': number;
  'md': number;
  'lg': number;
  'xl': number;
  '2xl': number;
}

// UI 컴포넌트 관련 타입
export interface GridHeaderProps {
  columns: Array<{ label: string; span?: number }>;
  // 12까지 밖에 그리드 표현이 안됨
  totalColumns?: number;
}

export interface LoadingSkeletonProps {
  columns: Array<{ span?: number }>;
  totalColumns?: number;
}

export interface EditableInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface ActionButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'danger';
  children: React.ReactNode;
  className?: string;
}
