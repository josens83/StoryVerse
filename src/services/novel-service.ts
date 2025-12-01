/**
 * Novel Service
 * Domain logic for novel-related operations
 */

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

/**
 * Get chapter access requirements based on access type and user tier
 */
export function getChapterAccessRequirements(
  accessType: AccessType,
  userTier: 'free' | 'vip' | 'svip',
  coinPrice: number
): ChapterUnlockStatus {
  // SVIP gets everything free
  if (userTier === 'svip' && accessType !== 'coin') {
    return {
      isUnlocked: true,
      canWaitFree: false,
      canUnlockWithAd: false,
      canUnlockWithCoins: false,
      coinPrice: 0,
    };
  }

  // VIP benefits
  if (userTier === 'vip' && accessType === 'vip') {
    return {
      isUnlocked: true,
      canWaitFree: false,
      canUnlockWithAd: false,
      canUnlockWithCoins: false,
      coinPrice: 0,
    };
  }

  // Check by access type
  switch (accessType) {
    case 'free':
      return {
        isUnlocked: true,
        canWaitFree: false,
        canUnlockWithAd: false,
        canUnlockWithCoins: false,
        coinPrice: 0,
      };

    case 'ad_unlock':
      return {
        isUnlocked: false,
        canWaitFree: true,
        canUnlockWithAd: true,
        canUnlockWithCoins: true,
        coinPrice,
      };

    case 'wait_free':
      return {
        isUnlocked: false,
        canWaitFree: true,
        canUnlockWithAd: false,
        canUnlockWithCoins: true,
        coinPrice,
      };

    case 'coin':
      return {
        isUnlocked: false,
        canWaitFree: false,
        canUnlockWithAd: false,
        canUnlockWithCoins: true,
        coinPrice,
      };

    case 'vip':
      return {
        isUnlocked: false,
        canWaitFree: false,
        canUnlockWithAd: false,
        canUnlockWithCoins: true,
        coinPrice,
      };

    default:
      return {
        isUnlocked: false,
        canWaitFree: false,
        canUnlockWithAd: false,
        canUnlockWithCoins: true,
        coinPrice,
      };
  }
}

/**
 * Calculate wait-free unlock time based on user tier
 */
export function getWaitFreeUnlockTime(startTime: Date, userTier: 'free' | 'vip' | 'svip'): Date {
  const hours = {
    free: 24,
    vip: 12,
    svip: 6,
  };

  const unlockTime = new Date(startTime);
  unlockTime.setHours(unlockTime.getHours() + hours[userTier]);
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
