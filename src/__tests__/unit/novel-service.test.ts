import { describe, it, expect } from 'vitest';

import {
  getChapterAccessRequirements,
  getWaitFreeUnlockTime,
  calculateReadingTime,
  calculateProgress,
  sortNovels,
  filterByGenre,
  filterByStatus,
  searchNovels,
  getFreeChapterNumbers,
  isChapterFree,
  type NovelWithAuthor,
} from '@/services/novel-service';

import type { Novel } from '@/types';

describe('Novel Service', () => {
  describe('getChapterAccessRequirements', () => {
    it('should allow SVIP access to non-coin chapters', () => {
      const result = getChapterAccessRequirements('wait_free', 'svip', 10);
      expect(result.isUnlocked).toBe(true);
      expect(result.coinPrice).toBe(0);
    });

    it('should not unlock coin chapters for SVIP automatically', () => {
      const result = getChapterAccessRequirements('coin', 'svip', 10);
      expect(result.isUnlocked).toBe(false);
      expect(result.canUnlockWithCoins).toBe(true);
      expect(result.coinPrice).toBe(10);
    });

    it('should allow VIP access to VIP chapters', () => {
      const result = getChapterAccessRequirements('vip', 'vip', 10);
      expect(result.isUnlocked).toBe(true);
    });

    it('should require unlock for VIP chapters for free users', () => {
      const result = getChapterAccessRequirements('vip', 'free', 10);
      expect(result.isUnlocked).toBe(false);
      expect(result.canUnlockWithCoins).toBe(true);
    });

    it('should allow free chapters for all users', () => {
      const result = getChapterAccessRequirements('free', 'free', 0);
      expect(result.isUnlocked).toBe(true);
    });

    it('should allow ad unlock for ad_unlock chapters', () => {
      const result = getChapterAccessRequirements('ad_unlock', 'free', 5);
      expect(result.isUnlocked).toBe(false);
      expect(result.canUnlockWithAd).toBe(true);
      expect(result.canWaitFree).toBe(true);
      expect(result.canUnlockWithCoins).toBe(true);
    });

    it('should only allow wait_free or coin for wait_free chapters', () => {
      const result = getChapterAccessRequirements('wait_free', 'free', 10);
      expect(result.canWaitFree).toBe(true);
      expect(result.canUnlockWithAd).toBe(false);
      expect(result.canUnlockWithCoins).toBe(true);
    });
  });

  describe('getWaitFreeUnlockTime', () => {
    it('should return 24 hours for free users', () => {
      const start = new Date('2024-01-01T12:00:00');
      const unlock = getWaitFreeUnlockTime(start, 'free');
      expect(unlock.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
    });

    it('should return 12 hours for VIP users', () => {
      const start = new Date('2024-01-01T12:00:00');
      const unlock = getWaitFreeUnlockTime(start, 'vip');
      expect(unlock.getTime() - start.getTime()).toBe(12 * 60 * 60 * 1000);
    });

    it('should return 6 hours for SVIP users', () => {
      const start = new Date('2024-01-01T12:00:00');
      const unlock = getWaitFreeUnlockTime(start, 'svip');
      expect(unlock.getTime() - start.getTime()).toBe(6 * 60 * 60 * 1000);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time based on word count', () => {
      expect(calculateReadingTime(500)).toBe(1);
      expect(calculateReadingTime(1000)).toBe(2);
      expect(calculateReadingTime(1500)).toBe(3);
    });

    it('should round up to nearest minute', () => {
      expect(calculateReadingTime(600)).toBe(2);
      expect(calculateReadingTime(501)).toBe(2);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate percentage correctly', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(1, 4)).toBe(25);
    });

    it('should handle zero total chapters', () => {
      expect(calculateProgress(0, 0)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculateProgress(1, 3)).toBe(33);
    });
  });

  describe('sortNovels', () => {
    const novels = [
      {
        id: '1',
        title: 'A',
        viewCount: 100,
        rating: 4.0,
        favoriteCount: 10,
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        title: 'B',
        viewCount: 200,
        rating: 4.5,
        favoriteCount: 20,
        updatedAt: '2024-01-03',
      },
      {
        id: '3',
        title: 'C',
        viewCount: 50,
        rating: 5.0,
        favoriteCount: 5,
        updatedAt: '2024-01-02',
      },
    ] as unknown as Novel[];

    it('should sort by latest', () => {
      const sorted = sortNovels(novels, 'latest');
      expect(sorted[0]?.id).toBe('2');
      expect(sorted[1]?.id).toBe('3');
      expect(sorted[2]?.id).toBe('1');
    });

    it('should sort by views', () => {
      const sorted = sortNovels(novels, 'views');
      expect(sorted[0]?.id).toBe('2');
    });

    it('should sort by rating', () => {
      const sorted = sortNovels(novels, 'rating');
      expect(sorted[0]?.id).toBe('3');
    });

    it('should sort by popular (favorite count)', () => {
      const sorted = sortNovels(novels, 'popular');
      expect(sorted[0]?.id).toBe('2');
    });
  });

  describe('filterByGenre', () => {
    const novels = [
      { id: '1', genre: 'fantasy' },
      { id: '2', genre: 'romance' },
      { id: '3', genre: 'fantasy' },
    ] as unknown as Novel[];

    it('should filter by specific genre', () => {
      const filtered = filterByGenre(novels, 'fantasy');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((n) => n.genre === 'fantasy')).toBe(true);
    });

    it('should return all for "all" genre', () => {
      expect(filterByGenre(novels, 'all')).toHaveLength(3);
    });

    it('should return all for empty genre', () => {
      expect(filterByGenre(novels, '')).toHaveLength(3);
    });
  });

  describe('filterByStatus', () => {
    const novels = [
      { id: '1', status: 'ongoing' },
      { id: '2', status: 'completed' },
      { id: '3', status: 'ongoing' },
    ] as unknown as Novel[];

    it('should filter by status', () => {
      const filtered = filterByStatus(novels, 'ongoing');
      expect(filtered).toHaveLength(2);
    });

    it('should return all for "all" status', () => {
      expect(filterByStatus(novels, 'all')).toHaveLength(3);
    });
  });

  describe('searchNovels', () => {
    const novels: NovelWithAuthor[] = [
      {
        id: '1',
        title: 'Magic World',
        authorName: 'Author1',
        tags: ['fantasy', 'magic'],
      } as NovelWithAuthor,
      {
        id: '2',
        title: 'Love Story',
        authorName: 'Romantic',
        tags: ['romance'],
      } as NovelWithAuthor,
      {
        id: '3',
        title: 'Dark Fantasy',
        authorName: 'Author2',
        tags: ['fantasy', 'dark'],
      } as NovelWithAuthor,
    ];

    it('should search by title', () => {
      const results = searchNovels(novels, 'Magic');
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('1');
    });

    it('should search by author name', () => {
      const results = searchNovels(novels, 'Romantic');
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('2');
    });

    it('should search by tag', () => {
      const results = searchNovels(novels, 'fantasy');
      expect(results).toHaveLength(2);
    });

    it('should be case insensitive', () => {
      const results = searchNovels(novels, 'MAGIC');
      expect(results).toHaveLength(1);
    });

    it('should return all for empty query', () => {
      expect(searchNovels(novels, '')).toHaveLength(3);
      expect(searchNovels(novels, '   ')).toHaveLength(3);
    });
  });

  describe('getFreeChapterNumbers', () => {
    it('should return array of free chapter numbers', () => {
      const result = getFreeChapterNumbers(3, 10);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should not exceed total chapters', () => {
      const result = getFreeChapterNumbers(10, 3);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle zero free chapters', () => {
      expect(getFreeChapterNumbers(0, 10)).toEqual([]);
    });
  });

  describe('isChapterFree', () => {
    it('should return true for chapters within free range', () => {
      expect(isChapterFree(1, 5)).toBe(true);
      expect(isChapterFree(5, 5)).toBe(true);
    });

    it('should return false for chapters outside free range', () => {
      expect(isChapterFree(6, 5)).toBe(false);
      expect(isChapterFree(10, 5)).toBe(false);
    });
  });
});
