import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  cn,
  formatNumber,
  formatPrice,
  formatDate,
  formatCountdown,
  formatReadingTime,
  formatWordCount,
  getInitials,
  isVipExpired,
  debounce,
  throttle,
} from '@/lib/utils';

describe('Utils', () => {
  describe('cn (classNames)', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should merge tailwind classes correctly', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('should handle objects', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers under 1000', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(0)).toBe('0');
    });

    it('should format thousands', () => {
      expect(formatNumber(1000)).toBe('1천');
      expect(formatNumber(5500)).toBe('5.5천');
    });

    it('should format ten-thousands (만)', () => {
      expect(formatNumber(10000)).toBe('1만');
      expect(formatNumber(15000)).toBe('1.5만');
      expect(formatNumber(99999)).toBe('10만');
    });

    it('should format hundred-millions (억)', () => {
      expect(formatNumber(100000000)).toBe('1억');
      expect(formatNumber(150000000)).toBe('1.5억');
    });
  });

  describe('formatPrice', () => {
    it('should format Korean Won', () => {
      expect(formatPrice(1000)).toContain('1,000');
      expect(formatPrice(5900)).toContain('5,900');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toContain('0');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-06-15T10:30:00');

    it('should format short date', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toContain('2024');
    });

    it('should format long date', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toContain('2024');
    });

    it('should format relative date - 방금 전', () => {
      const now = new Date();
      const result = formatDate(now, 'relative');
      expect(result).toBe('방금 전');
    });

    it('should format relative date - minutes', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatDate(date, 'relative');
      expect(result).toBe('5분 전');
    });

    it('should format relative date - hours', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      const result = formatDate(date, 'relative');
      expect(result).toBe('3시간 전');
    });

    it('should format relative date - days', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const result = formatDate(date, 'relative');
      expect(result).toBe('2일 전');
    });

    it('should accept string dates', () => {
      const result = formatDate('2024-06-15T10:30:00', 'short');
      expect(result).toContain('2024');
    });
  });

  describe('formatCountdown', () => {
    it('should show 해금됨 for past dates', () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(formatCountdown(pastDate)).toBe('해금됨');
    });

    it('should format countdown with hours', () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000);
      const result = formatCountdown(futureDate);
      expect(result).toMatch(/^\d+:\d{2}:\d{2}$/);
    });

    it('should format countdown without hours', () => {
      const futureDate = new Date(Date.now() + 5 * 60 * 1000);
      const result = formatCountdown(futureDate);
      expect(result).toMatch(/^\d+:\d{2}$/);
    });
  });

  describe('formatReadingTime', () => {
    it('should format minutes only', () => {
      expect(formatReadingTime(30)).toBe('30분');
      expect(formatReadingTime(59)).toBe('59분');
    });

    it('should format hours only', () => {
      expect(formatReadingTime(60)).toBe('1시간');
      expect(formatReadingTime(120)).toBe('2시간');
    });

    it('should format hours and minutes', () => {
      expect(formatReadingTime(90)).toBe('1시간 30분');
      expect(formatReadingTime(150)).toBe('2시간 30분');
    });
  });

  describe('formatWordCount', () => {
    it('should format small word counts', () => {
      expect(formatWordCount(500)).toBe('500자');
      expect(formatWordCount(9999)).toBe('9,999자');
    });

    it('should format large word counts with 만', () => {
      expect(formatWordCount(10000)).toBe('1만자');
      expect(formatWordCount(15000)).toBe('1.5만자');
      expect(formatWordCount(100000)).toBe('10만자');
    });
  });

  describe('getInitials', () => {
    it('should get initials from single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should handle multiple words', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('should uppercase initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('isVipExpired', () => {
    it('should return true for null expiry', () => {
      expect(isVipExpired(null)).toBe(true);
    });

    it('should return true for undefined expiry', () => {
      expect(isVipExpired(undefined)).toBe(true);
    });

    it('should return true for past date', () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(isVipExpired(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      expect(isVipExpired(futureDate)).toBe(false);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      throttledFn();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
