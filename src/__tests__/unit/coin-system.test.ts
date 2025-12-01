import { describe, it, expect, beforeEach } from 'vitest';

import { useCoinStore } from '@/store/coin-store';

describe('Coin System', () => {
  beforeEach(() => {
    // Reset store before each test
    useCoinStore.setState({
      purchasedCoins: 0,
      earnedCoins: 0,
      earnedCoinsExpireAt: null,
      isLoading: false,
    });
  });

  describe('setCoins', () => {
    it('should set both purchased and earned coins', () => {
      const { setCoins } = useCoinStore.getState();

      setCoins(100, 50, new Date());

      const state = useCoinStore.getState();
      expect(state.purchasedCoins).toBe(100);
      expect(state.earnedCoins).toBe(50);
    });

    it('should handle null expiry date', () => {
      const { setCoins } = useCoinStore.getState();

      setCoins(100, 50, null);

      const state = useCoinStore.getState();
      expect(state.earnedCoinsExpireAt).toBeNull();
    });
  });

  describe('totalCoins', () => {
    it('should return sum of purchased and earned coins', () => {
      useCoinStore.setState({
        purchasedCoins: 100,
        earnedCoins: 50,
      });

      const { totalCoins } = useCoinStore.getState();
      expect(totalCoins()).toBe(150);
    });

    it('should return 0 when no coins', () => {
      const { totalCoins } = useCoinStore.getState();
      expect(totalCoins()).toBe(0);
    });
  });

  describe('addCoins', () => {
    it('should add purchased coins', () => {
      const { addCoins } = useCoinStore.getState();

      addCoins(100, 'purchased');

      const state = useCoinStore.getState();
      expect(state.purchasedCoins).toBe(100);
      expect(state.earnedCoins).toBe(0);
    });

    it('should add earned coins with expiry date', () => {
      const { addCoins } = useCoinStore.getState();

      addCoins(50, 'earned');

      const state = useCoinStore.getState();
      expect(state.earnedCoins).toBe(50);
      expect(state.earnedCoinsExpireAt).not.toBeNull();
    });

    it('should accumulate coins on multiple additions', () => {
      const { addCoins } = useCoinStore.getState();

      addCoins(100, 'purchased');
      addCoins(50, 'purchased');

      const state = useCoinStore.getState();
      expect(state.purchasedCoins).toBe(150);
    });
  });

  describe('spendCoins', () => {
    it('should spend earned coins first', () => {
      useCoinStore.setState({
        purchasedCoins: 100,
        earnedCoins: 50,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(30);

      expect(result).toBe(true);
      const state = useCoinStore.getState();
      expect(state.earnedCoins).toBe(20);
      expect(state.purchasedCoins).toBe(100);
    });

    it('should use purchased coins after earned coins are depleted', () => {
      useCoinStore.setState({
        purchasedCoins: 100,
        earnedCoins: 20,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(50);

      expect(result).toBe(true);
      const state = useCoinStore.getState();
      expect(state.earnedCoins).toBe(0);
      expect(state.purchasedCoins).toBe(70); // 100 - (50 - 20)
    });

    it('should return false when insufficient coins', () => {
      useCoinStore.setState({
        purchasedCoins: 10,
        earnedCoins: 10,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(50);

      expect(result).toBe(false);
      const state = useCoinStore.getState();
      // Coins should not be modified
      expect(state.purchasedCoins).toBe(10);
      expect(state.earnedCoins).toBe(10);
    });

    it('should spend exact amount when total equals required', () => {
      useCoinStore.setState({
        purchasedCoins: 30,
        earnedCoins: 20,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(50);

      expect(result).toBe(true);
      const state = useCoinStore.getState();
      expect(state.earnedCoins).toBe(0);
      expect(state.purchasedCoins).toBe(0);
    });

    it('should handle zero spend amount', () => {
      useCoinStore.setState({
        purchasedCoins: 100,
        earnedCoins: 50,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(0);

      expect(result).toBe(true);
      const state = useCoinStore.getState();
      expect(state.purchasedCoins).toBe(100);
      expect(state.earnedCoins).toBe(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle spending only from purchased when no earned coins', () => {
      useCoinStore.setState({
        purchasedCoins: 100,
        earnedCoins: 0,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(30);

      expect(result).toBe(true);
      const state = useCoinStore.getState();
      expect(state.purchasedCoins).toBe(70);
      expect(state.earnedCoins).toBe(0);
    });

    it('should handle spending only from earned when no purchased coins', () => {
      useCoinStore.setState({
        purchasedCoins: 0,
        earnedCoins: 100,
      });

      const { spendCoins } = useCoinStore.getState();
      const result = spendCoins(30);

      expect(result).toBe(true);
      const state = useCoinStore.getState();
      expect(state.purchasedCoins).toBe(0);
      expect(state.earnedCoins).toBe(70);
    });
  });
});
