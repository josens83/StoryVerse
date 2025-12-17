'use client';

/**
 * DataContainer Component
 *
 * A unified state management component that handles all UI states:
 * - Loading: Shows skeleton or custom loading UI
 * - Error: Shows error message with retry button
 * - Empty: Shows empty state message with optional CTA
 * - Success: Shows the children content
 *
 * @module components/ui/data-container
 *
 * @example
 * <DataContainer
 *   isLoading={isLoading}
 *   error={error}
 *   isEmpty={data.length === 0}
 *   emptyMessage="소설이 없습니다"
 *   onRetry={refetch}
 * >
 *   <NovelList novels={data} />
 * </DataContainer>
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

interface DataContainerProps {
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error object or message */
  error?: Error | string | null;
  /** Whether data is empty */
  isEmpty?: boolean;
  /** Content to render when data is available */
  children: React.ReactNode;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Custom empty component */
  emptyComponent?: React.ReactNode;
  /** Message to show when empty */
  emptyMessage?: string;
  /** Description for empty state */
  emptyDescription?: string;
  /** Icon for empty state */
  emptyIcon?: React.ReactNode;
  /** CTA button text for empty state */
  emptyActionLabel?: string;
  /** CTA button action for empty state */
  emptyAction?: () => void;
  /** Retry function for error state */
  onRetry?: () => void;
  /** Number of skeleton items to show (for lists) */
  skeletonCount?: number;
  /** Skeleton variant */
  skeletonVariant?: 'card' | 'list' | 'text' | 'custom';
  /** Custom skeleton component */
  skeletonComponent?: React.ReactNode;
  /** Additional className for the container */
  className?: string;
}

/**
 * Default skeleton for loading states
 */
function DefaultSkeleton({
  variant = 'card',
  count = 3,
}: {
  variant?: 'card' | 'list' | 'text' | 'custom';
  count?: number;
}) {
  if (variant === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: card
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="mb-3 h-32 w-full rounded-md" />
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

/**
 * Default error state component
 */
function DefaultErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950"
      role="alert"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" aria-hidden="true" />
      <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
        오류가 발생했습니다
      </h3>
      <p className="mb-4 text-sm text-red-600 dark:text-red-300">{message}</p>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-700 dark:text-red-400"
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          다시 시도
        </Button>
      ) : null}
    </div>
  );
}

/**
 * DataContainer - Unified state management for data fetching UI
 *
 * Handles loading, error, empty, and success states in a consistent way.
 * Follows the pattern from Chapter 14 of the Solo Developer Workflow Guide.
 */
export function DataContainer({
  isLoading = false,
  error = null,
  isEmpty = false,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyMessage = '데이터가 없습니다',
  emptyDescription,
  emptyIcon,
  emptyActionLabel,
  emptyAction,
  onRetry,
  skeletonCount = 3,
  skeletonVariant = 'card',
  skeletonComponent,
  className,
}: DataContainerProps) {
  // Loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    if (skeletonComponent) {
      return <>{skeletonComponent}</>;
    }
    return <DefaultSkeleton variant={skeletonVariant} count={skeletonCount} />;
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return <DefaultErrorState message={errorMessage} onRetry={onRetry} />;
  }

  // Empty state
  if (isEmpty) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        action={emptyAction}
      />
    );
  }

  // Success state - render children
  return <div className={className}>{children}</div>;
}

/**
 * Hook for managing data container state with TanStack Query
 *
 * @example
 * const { data, ...queryState } = useQuery({ queryKey: ['novels'], queryFn: fetchNovels });
 * const containerProps = useDataContainerProps(queryState, data);
 *
 * <DataContainer {...containerProps}>
 *   <NovelList novels={data} />
 * </DataContainer>
 */
export function useDataContainerProps<T>(
  queryState: {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
  },
  data: T[] | undefined | null
) {
  return {
    isLoading: queryState.isLoading,
    error: queryState.isError ? queryState.error : null,
    isEmpty: !queryState.isLoading && !queryState.isError && (!data || data.length === 0),
    onRetry: queryState.refetch,
  };
}
