import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useAuthStore } from '@/store/auth-store';
import { type User } from '@/types';

const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  username: 'testuser',
  tier: 'free',
  purchasedCoins: 100,
  earnedCoins: 50,
  totalReadTime: 3600,
  consecutiveCheckIns: 5,
  createdAt: new Date('2025-01-01'),
  ...overrides,
});

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
      result.current.setLoading(true);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user and isAuthenticated to true when user is provided', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = createMockUser();

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set user to null and isAuthenticated to false when null is provided', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = createMockUser();

      // First set a user
      act(() => {
        result.current.setUser(mockUser);
      });

      // Then clear it
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setToken', () => {
    it('should set token correctly', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setToken('test-jwt-token');
      });

      expect(result.current.token).toBe('test-jwt-token');
    });

    it('should allow setting token to null', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setToken('test-token');
      });

      act(() => {
        result.current.setToken(null);
      });

      expect(result.current.token).toBeNull();
    });
  });

  describe('login', () => {
    it('should set user, token, isAuthenticated, and isLoading correctly', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = createMockUser();

      act(() => {
        result.current.login(mockUser, 'jwt-token-123');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('jwt-token-123');
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user, token, and set isAuthenticated to false', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = createMockUser();

      // First login
      act(() => {
        result.current.login(mockUser, 'jwt-token-123');
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update specific user properties while keeping others', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = createMockUser();

      act(() => {
        result.current.login(mockUser, 'jwt-token-123');
      });

      act(() => {
        result.current.updateUser({
          username: 'newusername',
          tier: 'vip',
        });
      });

      expect(result.current.user?.username).toBe('newusername');
      expect(result.current.user?.tier).toBe('vip');
      expect(result.current.user?.email).toBe('test@example.com'); // unchanged
      expect(result.current.user?.id).toBe('user-123'); // unchanged
    });

    it('should do nothing when user is null', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateUser({ username: 'newname' });
      });

      expect(result.current.user).toBeNull();
    });

    it('should update coins correctly', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = createMockUser();

      act(() => {
        result.current.login(mockUser, 'jwt-token-123');
      });

      act(() => {
        result.current.updateUser({
          purchasedCoins: 500,
          earnedCoins: 100,
        });
      });

      expect(result.current.user?.purchasedCoins).toBe(500);
      expect(result.current.user?.earnedCoins).toBe(100);
    });
  });

  describe('setLoading', () => {
    it('should set loading state correctly', () => {
      const { result } = renderHook(() => useAuthStore());

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

  describe('User Tiers', () => {
    it('should handle VIP user correctly', () => {
      const { result } = renderHook(() => useAuthStore());
      const vipUser = createMockUser({
        tier: 'vip',
        vipExpiresAt: new Date('2026-01-01'),
      });

      act(() => {
        result.current.login(vipUser, 'token');
      });

      expect(result.current.user?.tier).toBe('vip');
      expect(result.current.user?.vipExpiresAt).toEqual(new Date('2026-01-01'));
    });

    it('should handle SVIP user correctly', () => {
      const { result } = renderHook(() => useAuthStore());
      const svipUser = createMockUser({
        tier: 'svip',
        vipExpiresAt: new Date('2026-12-31'),
      });

      act(() => {
        result.current.login(svipUser, 'token');
      });

      expect(result.current.user?.tier).toBe('svip');
    });
  });
});
