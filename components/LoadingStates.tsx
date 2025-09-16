// components/LoadingStates.tsx
import React from 'react';

/**
 * 骨架載入組件 - 提升載入體驗
 */
export const SkeletonLoader = {
  /**
   * 文字骨架
   */
  Text: ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 animate-pulse rounded bg-gray-200 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  ),

  /**
   * 標題骨架
   */
  Title: ({ className = '' }: { className?: string }) => (
    <div className={`h-8 w-48 animate-pulse rounded bg-gray-200 ${className}`} />
  ),

  /**
   * 卡片骨架
   */
  Card: ({ className = '' }: { className?: string }) => (
    <div className={`rounded-lg border border-gray-200 p-6 ${className}`}>
      <SkeletonLoader.Title className="mb-4" />
      <SkeletonLoader.Text lines={3} />
    </div>
  ),

  /**
   * 個人資訊骨架
   */
  PersonalInfo: () => (
    <div className="hero-bg mx-auto w-full max-w-[1280px] px-14 pt-[70px] text-white">
      <div className="mt-[111px] flex min-h-[calc(100vh-64px)] justify-end">
        <div className="w-[413px] space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-700" />
          <div className="h-6 w-48 animate-pulse rounded bg-gray-700" />
          <div className="h-16 w-64 animate-pulse rounded bg-gray-700" />
        </div>
      </div>
    </div>
  ),

  /**
   * 經驗骨架
   */
  Experience: () => (
    <div className="relative container">
      <div className="absolute -left-1.5 h-3 w-3 animate-pulse rounded-full bg-gray-300" />
      <div className="border-l border-gray-300 py-10 pl-6">
        <div className="mb-3 flex justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <SkeletonLoader.Text lines={2} className="mt-4" />
        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  ),

  /**
   * 專案骨架
   */
  Project: () => (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="h-48 animate-pulse bg-gray-200" />
      <div className="p-6">
        <SkeletonLoader.Title className="mb-4" />
        <SkeletonLoader.Text lines={2} className="mb-4" />
        <div className="mb-4 flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  ),

  /**
   * 技能骨架
   */
  SkillGroup: () => (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <SkeletonLoader.Title className="mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * 載入狀態包裝組件
 */
export function LoadingWrapper({
  isLoading,
  skeleton,
  children,
  fallback,
}: {
  isLoading: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (isLoading) {
    return <>{skeleton || fallback || <DefaultLoader />}</>;
  }
  return <>{children}</>;
}

/**
 * 預設載入器
 */
export function DefaultLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600">載入中...</p>
      </div>
    </div>
  );
}

/**
 * 錯誤狀態組件
 */
export function ErrorState({ error, onRetry }: { error: Error | string; onRetry?: () => void }) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">載入失敗</h3>
        <p className="mb-4 text-gray-600">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            重試
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 空狀態組件
 */
export function EmptyState({
  title = '沒有資料',
  description = '目前沒有可顯示的內容',
  icon = '📭',
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-5xl">{icon}</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

/**
 * 懸浮載入提示
 */
export function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="animate-fade-in-scale fixed top-4 right-4 z-50">
      <div className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 shadow-lg">
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-700">更新中...</span>
      </div>
    </div>
  );
}
