'use client';

import { useCallback } from 'react';

import { useCoinStore } from '@/store/coin-store';

/**
 * Custom hook for coin operations
 * Provides convenient methods for coin management with validation
 */
export function useCoins() {
  const {
    purchasedCoins,
    earnedCoins,
    earnedCoinsExpireAt,
    isLoading,
    totalCoins,
    addCoins,
    spendCoins,
    setCoins,
    setLoading,
  } = useCoinStore();

  /**
   * Check if user has enough coins
   */
  const hasEnoughCoins = useCallback(
    (amount: number): boolean => {
      return totalCoins() >= amount;
    },
    [totalCoins]
  );

  /**
   * Try to spend coins with validation
   * Returns true if successful, false otherwise
   */
  const trySpendCoins = useCallback(
    (amount: number): { success: boolean; message?: string } => {
      if (amount <= 0) {
        return { success: true };
      }

      if (!hasEnoughCoins(amount)) {
        return {
          success: false,
          message: `코인이 부족합니다. 필요: ${amount}, 보유: ${totalCoins()}`,
        };
      }

      const spent = spendCoins(amount);
      if (!spent) {
        return {
          success: false,
          message: '코인 차감에 실패했습니다',
        };
      }

      return { success: true };
    },
    [hasEnoughCoins, spendCoins, totalCoins]
  );

  /**
   * Check if earned coins are expiring soon (within 24 hours)
   */
  const isEarnedCoinsExpiringSoon = useCallback((): boolean => {
    if (!earnedCoinsExpireAt || earnedCoins <= 0) {
      return false;
    }
    const hoursUntilExpiry =
      (new Date(earnedCoinsExpireAt).getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
  }, [earnedCoins, earnedCoinsExpireAt]);

  /**
   * Get time remaining until earned coins expire
   */
  const getEarnedCoinsExpiryTime = useCallback((): string | null => {
    if (!earnedCoinsExpireAt || earnedCoins <= 0) {
      return null;
    }

    const now = new Date();
    const expiry = new Date(earnedCoinsExpireAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      return '만료됨';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}일 ${hours}시간 후 만료`;
    }
    return `${hours}시간 후 만료`;
  }, [earnedCoins, earnedCoinsExpireAt]);

  return {
    // State
    purchasedCoins,
    earnedCoins,
    earnedCoinsExpireAt,
    isLoading,

    // Computed
    total: totalCoins(),
    hasEnoughCoins,
    isEarnedCoinsExpiringSoon: isEarnedCoinsExpiringSoon(),
    earnedCoinsExpiryTime: getEarnedCoinsExpiryTime(),

    // Actions
    addCoins,
    trySpendCoins,
    setCoins,
    setLoading,
  };
}
