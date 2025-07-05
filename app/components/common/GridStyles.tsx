import React from 'react';

// 공통 그리드 스타일 상수들
export const GRID_STYLES = {
  container:
    'overflow-auto rounded-lg bg-white shadow dark:bg-zinc-800 dark:shadow-gray-900/20',
  header:
    'grid grid-cols-8 gap-4 bg-gray-50 p-4 text-xs font-medium tracking-wider text-gray-500 uppercase dark:bg-zinc-300 dark:text-zinc-300',
  row: 'grid grid-cols-8 gap-4 p-4 hover:bg-gray-100 dark:hover:bg-zinc-600',
  cell: 'text-sm',
  cellMedium: 'text-sm font-medium text-gray-900 dark:text-zinc-100',
  cellMuted: 'text-sm text-gray-500 dark:text-zinc-400',
  actions: 'col-span-1 flex justify-between gap-2',
  input:
    'w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100',
  button: {
    common: 'w-full cursor-pointer rounded-md px-2 py-1 text-xs flex-',
    primary:
      'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800',
    danger:
      'bg-red-100 text-gray-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800',
  },
  loading: {
    container: 'grid grid-cols-8 gap-4 p-4',
    skeleton:
      'my-1 h-4 w-24 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600',
  },
  divider: 'divide-y divide-gray-200 dark:divide-zinc-700',
} as const;

// 유틸리티 함수들
export const getColSpanClass = (span: number): string => `col-span-${span}`;

export const getGridRowClass = (totalColumns: number = 8): string =>
  `grid grid-cols-${totalColumns} gap-4 p-4 hover:bg-gray-100 dark:hover:bg-zinc-700`;

// 공통 그리드 헤더 컴포넌트
interface GridHeaderProps {
  columns: Array<{ label: string; span?: number }>;
  totalColumns?: number;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  totalColumns = 8,
}) => {
  return (
    <div
      className={`grid grid-cols-${totalColumns} gap-4 bg-gray-50 p-4 text-xs font-medium tracking-wider text-gray-500 uppercase dark:bg-zinc-700 dark:text-zinc-400`}
    >
      {columns.map((column, index) => (
        <div key={index} className={`col-span-${column.span || 1}`}>
          {column.label}
        </div>
      ))}
    </div>
  );
};

// 공통 로딩 스켈레톤 컴포넌트
interface LoadingSkeletonProps {
  columns: Array<{ span?: number }>;
  totalColumns?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  columns,
  totalColumns = 8,
}) => {
  return (
    <div className={`grid grid-cols-${totalColumns} gap-4 p-4`}>
      {columns.map((column, index) => (
        <div
          key={index}
          className={`col-span-${column.span || 1} my-1 h-4 w-24 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600`}
        />
      ))}
    </div>
  );
};

// 공통 입력 필드 컴포넌트
interface EditableInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const EditableInput: React.FC<EditableInputProps> = ({
  value,
  onChange,
  className = GRID_STYLES.input,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
};

// 공통 액션 버튼 컴포넌트
interface ActionButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = 'primary',
  children,
  className,
}) => {
  const commonClass = GRID_STYLES.button.common;
  const baseClass =
    variant === 'danger'
      ? GRID_STYLES.button.danger
      : GRID_STYLES.button.primary;
  const finalClass = className || baseClass;

  return (
    <button onClick={onClick} className={`${commonClass} ${finalClass}`}>
      {children}
    </button>
  );
};
