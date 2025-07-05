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
