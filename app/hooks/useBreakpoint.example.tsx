import React from 'react';
import { useBreakpoint } from './useBreakpoint';

export default function BreakpointExample() {
  const { currentBreakpoint, windowWidth, isLg, isLgAndUp, isMdAndDown } =
    useBreakpoint();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">브레이크포인트 테스트</h2>

      <div className="space-y-2">
        <p>
          현재 브레이크포인트:{' '}
          <span className="font-bold text-blue-600">{currentBreakpoint}</span>
        </p>
        <p>
          창 너비:{' '}
          <span className="font-bold text-green-600">{windowWidth}px</span>
        </p>

        <div className="mt-4 space-y-2">
          <p>
            현재 lg 브레이크포인트인가?:{' '}
            <span className={isLg ? 'text-green-600' : 'text-red-600'}>
              {isLg ? '예' : '아니오'}
            </span>
          </p>
          <p>
            lg 이상인가?:{' '}
            <span className={isLgAndUp ? 'text-green-600' : 'text-red-600'}>
              {isLgAndUp ? '예' : '아니오'}
            </span>
          </p>
          <p>
            md 이하인가?:{' '}
            <span className={isMdAndDown ? 'text-green-600' : 'text-red-600'}>
              {isMdAndDown ? '예' : '아니오'}
            </span>
          </p>
        </div>

        {/* 조건부 렌더링 예시 */}
        <div className="mt-6">
          <h3 className="mb-2 font-bold">조건부 렌더링 예시:</h3>
          {isLgAndUp && (
            <div className="rounded bg-blue-100 p-3">
              이 내용은 lg 이상에서만 보입니다
            </div>
          )}

          {isMdAndDown && (
            <div className="rounded bg-red-100 p-3">
              이 내용은 md 이하에서만 보입니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
