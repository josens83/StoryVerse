'use client';

import { create } from 'zustand';

interface CoinState {
  purchasedCoins: number;
  earnedCoins: number;
  earnedCoinsExpireAt: Date | null;
  isLoading: boolean;

  // Computed
  totalCoins: () => number;

  // Actions
  setCoins: (purchased: number, earned: number, expireAt?: Date | null) => void;
  addCoins: (amount: number, type: 'purchased' | 'earned') => void;
  spendCoins: (amount: number) => boolean;
  setLoading: (loading: boolean) => void;
}

export const useCoinStore = create<CoinState>((set, get) => ({
  purchasedCoins: 0,
  earnedCoins: 0,
  earnedCoinsExpireAt: null,
  isLoading: false,

  totalCoins: () => {
    const state = get();
    return state.purchasedCoins + state.earnedCoins;
  },

  setCoins: (purchased, earned, expireAt) =>
    set({
      purchasedCoins: purchased,
      earnedCoins: earned,
      earnedCoinsExpireAt: expireAt || null,
    }),

  addCoins: (amount, type) =>
    set((state) => {
      if (type === 'purchased') {
        return { purchasedCoins: state.purchasedCoins + amount };
      }
      return {
        earnedCoins: state.earnedCoins + amount,
        earnedCoinsExpireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };
    }),

  spendCoins: (amount) => {
    const state = get();
    const total = state.purchasedCoins + state.earnedCoins;

    if (total < amount) {
      return false;
    }

    // Spend earned coins first, then purchased
    let remaining = amount;
    let newEarned = state.earnedCoins;
    let newPurchased = state.purchasedCoins;

    if (state.earnedCoins >= remaining) {
      newEarned = state.earnedCoins - remaining;
      remaining = 0;
    } else {
      remaining -= state.earnedCoins;
      newEarned = 0;
      newPurchased = state.purchasedCoins - remaining;
    }

    set({
      purchasedCoins: newPurchased,
      earnedCoins: newEarned,
    });

    return true;
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
