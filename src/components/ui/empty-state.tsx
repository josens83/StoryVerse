'use client';

/**
 * EmptyState Component
 *
 * A reusable empty state component for when there's no data to display.
 * Follows the Empty State pattern from Chapter 14.
 *
 * Pattern: Icon + Title + Description + CTA (optional)
 *
 * @module components/ui/empty-state
 *
 * @example
 * <EmptyState
 *   icon={<BookOpen className="h-12 w-12" />}
 *   title="소설이 없습니다"
 *   description="아직 등록된 소설이 없습니다. 첫 번째 소설을 작성해보세요!"
 *   actionLabel="소설 작성하기"
 *   action={() => router.push('/author/write')}
 * />
 */

import { FileQuestion } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** Icon to display (default: FileQuestion) */
  icon?: React.ReactNode;
  /** Main title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA button action */
  action?: () => void;
  /** Additional className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * EmptyState - Display when no data is available
 *
 * Use this component when:
 * - A list/grid has no items
 * - A search returns no results
 * - A filter yields no matches
 * - A user hasn't created any content yet
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'h-8 w-8',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      container: 'p-8',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'p-12',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 text-gray-400 dark:text-gray-500" aria-hidden="true">
        {icon ?? <FileQuestion className={sizes.icon} />}
      </div>

      {/* Title */}
      <h3 className={cn('font-semibold text-gray-900 dark:text-gray-100', sizes.title)}>{title}</h3>

      {/* Description */}
      {description ? (
        <p className={cn('mt-2 text-gray-500 dark:text-gray-400', sizes.description)}>
          {description}
        </p>
      ) : null}

      {/* CTA Button */}
      {actionLabel && action ? (
        <Button onClick={action} className="mt-6" size={size === 'sm' ? 'sm' : 'default'}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

/**
 * SearchEmptyState - Specialized empty state for search results
 */
export function SearchEmptyState({
  query,
  onClearSearch,
}: {
  query: string;
  onClearSearch?: () => void;
}) {
  return (
    <EmptyState
      title={`"${query}"에 대한 검색 결과가 없습니다`}
      description="다른 검색어로 다시 시도해보세요"
      actionLabel={onClearSearch ? '검색어 지우기' : undefined}
      action={onClearSearch}
    />
  );
}

/**
 * BookshelfEmptyState - Empty state for user's bookshelf
 */
export function BookshelfEmptyState({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      title="책장이 비어있습니다"
      description="관심있는 소설을 추가하고 독서 기록을 관리해보세요"
      actionLabel={onBrowse ? '소설 둘러보기' : undefined}
      action={onBrowse}
    />
  );
}

/**
 * NovelEmptyState - Empty state for novel lists
 */
export function NovelEmptyState({ onWrite }: { onWrite?: () => void }) {
  return (
    <EmptyState
      title="등록된 소설이 없습니다"
      description="첫 번째 소설을 작성하고 독자들과 만나보세요"
      actionLabel={onWrite ? '소설 작성하기' : undefined}
      action={onWrite}
    />
  );
}

/**
 * CommentEmptyState - Empty state for comments
 */
export function CommentEmptyState() {
  return (
    <EmptyState size="sm" title="아직 댓글이 없습니다" description="첫 번째 댓글을 남겨보세요!" />
  );
}
