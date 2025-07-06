import { useEffect, useState } from 'react';
import { Breakpoint, BreakpointConfig } from '@/app/types';

// Tailwind CSS 기본 브레이크포인트 (px 단위)
const breakpoints: BreakpointConfig = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
};

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm');
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // SSR 환경에서 window가 정의되지 않은 경우 처리
    if (typeof window === 'undefined') {
      return;
    }

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    // 초기 설정
    updateBreakpoint();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', updateBreakpoint);

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  // 특정 브레이크포인트 이상인지 확인하는 함수들
  const isSm = currentBreakpoint === 'sm';
  const isMd = currentBreakpoint === 'md';
  const isLg = currentBreakpoint === 'lg';
  const isXl = currentBreakpoint === 'xl';
  const is2xl = currentBreakpoint === '2xl';

  // 특정 브레이크포인트 이상인지 확인하는 함수들
  const isSmAndUp = true; // sm은 항상 true
  const isMdAndUp = ['md', 'lg', 'xl', '2xl'].includes(currentBreakpoint);
  const isLgAndUp = ['lg', 'xl', '2xl'].includes(currentBreakpoint);
  const isXlAndUp = ['xl', '2xl'].includes(currentBreakpoint);
  const is2xlAndUp = currentBreakpoint === '2xl';

  // 특정 브레이크포인트 이하인지 확인하는 함수들
  const isSmAndDown = true; // sm은 항상 true
  const isMdAndDown = ['sm', 'md'].includes(currentBreakpoint);
  const isLgAndDown = ['sm', 'md', 'lg'].includes(currentBreakpoint);
  const isXlAndDown = ['sm', 'md', 'lg', 'xl'].includes(currentBreakpoint);
  const is2xlAndDown = true; // 2xl은 항상 true

  return {
    currentBreakpoint,
    windowWidth,
    breakpoints,
    // 개별 브레이크포인트 확인
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    // 이상 확인
    isSmAndUp,
    isMdAndUp,
    isLgAndUp,
    isXlAndUp,
    is2xlAndUp,
    // 이하 확인
    isSmAndDown,
    isMdAndDown,
    isLgAndDown,
    isXlAndDown,
    is2xlAndDown,
  };
}
