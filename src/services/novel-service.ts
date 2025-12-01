/**
 * Novel Service
 * Domain logic for novel-related operations
 */

import { WAIT_FREE } from '@/lib/constants';

import type { Novel, AccessType, UnlockMethod } from '@/types';

// Service result types
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NovelWithAuthor extends Novel {
  authorName: string;
  authorAvatar?: string;
}

export interface ChapterUnlockStatus {
  isUnlocked: boolean;
  method?: UnlockMethod;
  waitFreeUnlocksAt?: Date;
  canWaitFree: boolean;
  canUnlockWithAd: boolean;
  canUnlockWithCoins: boolean;
  coinPrice: number;
}

// Access type configuration (reduces cyclomatic complexity)
type AccessConfig = Pick<
  ChapterUnlockStatus,
  'canWaitFree' | 'canUnlockWithAd' | 'canUnlockWithCoins'
>;

const ACCESS_TYPE_CONFIG: Record<AccessType, AccessConfig> = {
  free: { canWaitFree: false, canUnlockWithAd: false, canUnlockWithCoins: false },
  ad_unlock: { canWaitFree: true, canUnlockWithAd: true, canUnlockWithCoins: true },
  wait_free: { canWaitFree: true, canUnlockWithAd: false, canUnlockWithCoins: true },
  coin: { canWaitFree: false, canUnlockWithAd: false, canUnlockWithCoins: true },
  vip: { canWaitFree: false, canUnlockWithAd: false, canUnlockWithCoins: true },
};

const UNLOCKED_STATUS: Omit<ChapterUnlockStatus, 'method' | 'waitFreeUnlocksAt'> = {
  isUnlocked: true,
  canWaitFree: false,
  canUnlockWithAd: false,
  canUnlockWithCoins: false,
  coinPrice: 0,
};

/**
 * Get chapter access requirements based on access type and user tier
 */
export function getChapterAccessRequirements(
  accessType: AccessType,
  userTier: 'free' | 'vip' | 'svip',
  coinPrice: number
): ChapterUnlockStatus {
  // SVIP gets everything free except coin-only content
  if (userTier === 'svip' && accessType !== 'coin') {
    return { ...UNLOCKED_STATUS };
  }

  // VIP gets VIP content free
  if (userTier === 'vip' && accessType === 'vip') {
    return { ...UNLOCKED_STATUS };
  }

  // Free content is always unlocked
  if (accessType === 'free') {
    return { ...UNLOCKED_STATUS };
  }

  // Use config lookup for locked content
  const config = ACCESS_TYPE_CONFIG[accessType] ?? ACCESS_TYPE_CONFIG.coin;
  return {
    isUnlocked: false,
    ...config,
    coinPrice,
  };
}

// Wait-free hours by tier (uses centralized constants)
const WAIT_FREE_HOURS: Record<'free' | 'vip' | 'svip', number> = {
  free: WAIT_FREE.FREE_TIER_HOURS,
  vip: WAIT_FREE.VIP_TIER_HOURS,
  svip: WAIT_FREE.SVIP_TIER_HOURS,
};

/**
 * Calculate wait-free unlock time based on user tier
 */
export function getWaitFreeUnlockTime(startTime: Date, userTier: 'free' | 'vip' | 'svip'): Date {
  const unlockTime = new Date(startTime);
  unlockTime.setHours(unlockTime.getHours() + WAIT_FREE_HOURS[userTier]);
  return unlockTime;
}

/**
 * Calculate reading time from word count
 * Assumes average reading speed of 500 words per minute for Korean
 */
export function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 500;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Calculate novel completion percentage
 */
export function calculateProgress(currentChapter: number, totalChapters: number): number {
  if (totalChapters === 0) {
    return 0;
  }
  return Math.round((currentChapter / totalChapters) * 100);
}

/**
 * Sort novels by various criteria
 */
export function sortNovels(
  novels: Novel[],
  sortBy: 'latest' | 'popular' | 'rating' | 'views' = 'latest'
): Novel[] {
  const sorted = [...novels];

  switch (sortBy) {
    case 'latest':
      return sorted.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.favoriteCount - a.favoriteCount);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'views':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    default:
      return sorted;
  }
}

/**
 * Filter novels by genre
 */
export function filterByGenre(novels: Novel[], genre: string): Novel[] {
  if (!genre || genre === 'all') {
    return novels;
  }
  return novels.filter((novel) => novel.genre === genre);
}

/**
 * Filter novels by status
 */
export function filterByStatus(
  novels: Novel[],
  status: 'ongoing' | 'completed' | 'hiatus' | 'all'
): Novel[] {
  if (status === 'all') {
    return novels;
  }
  return novels.filter((novel) => novel.status === status);
}

/**
 * Search novels by title or author
 */
export function searchNovels(novels: NovelWithAuthor[], query: string): NovelWithAuthor[] {
  if (!query.trim()) {
    return novels;
  }
  const lowerQuery = query.toLowerCase();
  return novels.filter(
    (novel) =>
      novel.title.toLowerCase().includes(lowerQuery) ||
      novel.authorName.toLowerCase().includes(lowerQuery) ||
      novel.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get chapters that are free based on free chapter count
 */
export function getFreeChapterNumbers(freeChapters: number, totalChapters: number): number[] {
  const count = Math.min(freeChapters, totalChapters);
  return Array.from({ length: count }, (_, i) => i + 1);
}

/**
 * Check if a chapter is within free range
 */
export function isChapterFree(chapterNumber: number, freeChapters: number): boolean {
  return chapterNumber <= freeChapters;
}
