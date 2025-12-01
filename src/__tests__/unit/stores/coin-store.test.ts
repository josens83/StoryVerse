import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useCoinStore } from '@/store/coin-store';

describe('useCoinStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useCoinStore());
    act(() => {
      result.current.setCoins(0, 0, null);
      result.current.setLoading(false);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCoinStore());

      expect(result.current.purchasedCoins).toBe(0);
      expect(result.current.earnedCoins).toBe(0);
      expect(result.current.earnedCoinsExpireAt).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('totalCoins', () => {
    it('should return sum of purchased and earned coins', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 50);
      });

      expect(result.current.totalCoins()).toBe(150);
    });

    it('should return 0 when no coins', () => {
      const { result } = renderHook(() => useCoinStore());

      expect(result.current.totalCoins()).toBe(0);
    });
  });

  describe('setCoins', () => {
    it('should set purchased and earned coins', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(500, 200);
      });

      expect(result.current.purchasedCoins).toBe(500);
      expect(result.current.earnedCoins).toBe(200);
    });

    it('should set expiration date when provided', () => {
      const { result } = renderHook(() => useCoinStore());
      const expireDate = new Date('2025-12-31');

      act(() => {
        result.current.setCoins(100, 50, expireDate);
      });

      expect(result.current.earnedCoinsExpireAt).toEqual(expireDate);
    });

    it('should set expiration to null when not provided', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 50);
      });

      expect(result.current.earnedCoinsExpireAt).toBeNull();
    });
  });

  describe('addCoins', () => {
    it('should add purchased coins correctly', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 0);
      });

      act(() => {
        result.current.addCoins(50, 'purchased');
      });

      expect(result.current.purchasedCoins).toBe(150);
      expect(result.current.earnedCoins).toBe(0);
    });

    it('should add earned coins correctly', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(0, 100);
      });

      act(() => {
        result.current.addCoins(30, 'earned');
      });

      expect(result.current.earnedCoins).toBe(130);
      expect(result.current.purchasedCoins).toBe(0);
    });

    it('should set expiration date when adding earned coins', () => {
      const { result } = renderHook(() => useCoinStore());
      const now = Date.now();

      act(() => {
        result.current.addCoins(100, 'earned');
      });

      // Expiration should be 30 days from now
      const expectedExpire = new Date(now + 30 * 24 * 60 * 60 * 1000);
      const actualExpire = result.current.earnedCoinsExpireAt;

      // Allow 1 second tolerance for test timing
      expect(actualExpire).not.toBeNull();
      expect(Math.abs(actualExpire!.getTime() - expectedExpire.getTime())).toBeLessThan(1000);
    });
  });

  describe('spendCoins', () => {
    it('should return false when insufficient coins', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(10, 5);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(100);
      });

      expect(success).toBe(false);
      // Coins should remain unchanged
      expect(result.current.purchasedCoins).toBe(10);
      expect(result.current.earnedCoins).toBe(5);
    });

    it('should spend earned coins first', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 50);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(30);
      });

      expect(success).toBe(true);
      expect(result.current.earnedCoins).toBe(20); // 50 - 30 = 20
      expect(result.current.purchasedCoins).toBe(100); // unchanged
    });

    it('should use purchased coins after earned coins are exhausted', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 30);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(50);
      });

      expect(success).toBe(true);
      expect(result.current.earnedCoins).toBe(0); // All earned coins spent
      expect(result.current.purchasedCoins).toBe(80); // 100 - 20 = 80 (20 remaining after earned)
    });

    it('should handle spending exact total', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 50);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(150);
      });

      expect(success).toBe(true);
      expect(result.current.earnedCoins).toBe(0);
      expect(result.current.purchasedCoins).toBe(0);
    });

    it('should handle spending only from earned coins', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(0, 100);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(50);
      });

      expect(success).toBe(true);
      expect(result.current.earnedCoins).toBe(50);
      expect(result.current.purchasedCoins).toBe(0);
    });

    it('should handle spending only from purchased coins', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 0);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(30);
      });

      expect(success).toBe(true);
      expect(result.current.earnedCoins).toBe(0);
      expect(result.current.purchasedCoins).toBe(70);
    });

    it('should handle spending 0 coins', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 50);
      });

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(0);
      });

      expect(success).toBe(true);
      expect(result.current.purchasedCoins).toBe(100);
      expect(result.current.earnedCoins).toBe(50);
    });
  });

  describe('setLoading', () => {
    it('should set loading state correctly', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large coin amounts', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(1000000, 500000);
      });

      expect(result.current.totalCoins()).toBe(1500000);

      let success: boolean = false;
      act(() => {
        success = result.current.spendCoins(1000000);
      });

      expect(success).toBe(true);
      expect(result.current.totalCoins()).toBe(500000);
    });

    it('should handle multiple consecutive operations', () => {
      const { result } = renderHook(() => useCoinStore());

      act(() => {
        result.current.setCoins(100, 50);
        result.current.addCoins(20, 'purchased');
        result.current.addCoins(10, 'earned');
        result.current.spendCoins(30);
      });

      // 100 + 20 = 120 purchased, 50 + 10 = 60 earned
      // Spend 30 from earned: 60 - 30 = 30
      expect(result.current.purchasedCoins).toBe(120);
      expect(result.current.earnedCoins).toBe(30);
    });
  });
});
