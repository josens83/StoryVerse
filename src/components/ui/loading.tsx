/**
 * Loading Components
 *
 * A collection of loading indicators for various use cases:
 * - Spinner: Basic spinning loader
 * - PageLoader: Full-page loading overlay
 * - InlineLoader: Inline loading with text
 * - ButtonLoader: Small loader for buttons
 * - ContentLoader: Centered loader for content areas
 * - LoadingDots: Animated dots indicator
 * - TextPulse: Skeleton pulse for text placeholders
 *
 * @module components/ui/loading
 */

'use client';

import { cn } from '@/lib/utils';

/** Props for the Spinner component */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Spinner component for loading states
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-gray-300 border-t-orange-500',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

/**
 * Full page loading overlay
 */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
      </div>
    </div>
  );
}

/**
 * Inline loading indicator
 */
export function InlineLoader({ text = '로딩 중...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Spinner size="sm" />
      <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  );
}

/**
 * Button loading state
 */
export function ButtonLoader() {
  return <Spinner size="sm" className="border-current border-t-transparent" />;
}

/**
 * Content area loading placeholder
 */
export function ContentLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[200px] items-center justify-center', className)}>
      <Spinner size="md" />
    </div>
  );
}

/**
 * Loading dots animation
 */
export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}

/**
 * Pulse loading for text placeholders
 */
export function TextPulse({ width = 'w-24' }: { width?: string }) {
  return (
    <span
      className={cn('inline-block h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700', width)}
    />
  );
}
