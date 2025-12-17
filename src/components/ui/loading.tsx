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
 * - DelayedSpinner: Shows spinner after delay to prevent flash (Chapter 18 UX)
 * - DelayedContentLoader: Content loader with delay (Chapter 18 UX)
 *
 * @module components/ui/loading
 */

'use client';

import { useState, useEffect } from 'react';

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

/**
 * DelayedSpinner - Shows a spinner only after a delay (Chapter 18 UX Pattern)
 *
 * Prevents spinner flash for fast-loading content. If loading completes
 * within the delay period, no spinner is shown at all.
 *
 * @param delay - Milliseconds to wait before showing spinner (default: 100ms)
 * @param size - Spinner size variant
 * @param className - Additional CSS classes
 *
 * @example
 * // Show spinner only if loading takes > 100ms
 * {isLoading && <DelayedSpinner />}
 *
 * @example
 * // Custom delay of 200ms
 * {isLoading && <DelayedSpinner delay={200} size="lg" />}
 */
export function DelayedSpinner({
  delay = 100,
  size = 'md',
  className,
}: {
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSpinner) {
    return null;
  }

  return <Spinner size={size} className={className} />;
}

/**
 * DelayedContentLoader - Content area loader with delay (Chapter 18 UX Pattern)
 *
 * Combines DelayedSpinner with centered layout for content areas.
 * Prevents layout shift by maintaining minimum height.
 *
 * @param delay - Milliseconds to wait before showing spinner (default: 100ms)
 * @param text - Loading text to display
 * @param className - Additional CSS classes
 *
 * @example
 * {isLoading && <DelayedContentLoader text="소설 로딩 중..." />}
 */
export function DelayedContentLoader({
  delay = 100,
  text,
  className,
}: {
  delay?: number;
  text?: string;
  className?: string;
}) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!showLoader) {
    // Return invisible placeholder to prevent layout shift
    return <div className={cn('min-h-[200px]', className)} />;
  }

  return (
    <div className={cn('flex min-h-[200px] flex-col items-center justify-center gap-3', className)}>
      <Spinner size="md" />
      {text ? <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p> : null}
    </div>
  );
}
