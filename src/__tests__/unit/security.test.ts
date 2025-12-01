import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  rateLimit,
  sanitizeString,
  validateEmail,
  validateUsername,
  validatePassword,
  generateSecureToken,
  escapeSqlWildcards,
} from '@/lib/security';

describe('Security Utils', () => {
  describe('rateLimit', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should allow requests within limit', () => {
      const key = 'test-user-1';
      const result1 = rateLimit(key, 5, 60000);
      const result2 = rateLimit(key, 5, 60000);
      const result3 = rateLimit(key, 5, 60000);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);
      expect(result1.remaining).toBe(4);
      expect(result3.remaining).toBe(2);
    });

    it('should block requests exceeding limit', () => {
      const key = 'test-user-2';

      // Use up all requests
      for (let i = 0; i < 5; i++) {
        rateLimit(key, 5, 60000);
      }

      const result = rateLimit(key, 5, 60000);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', () => {
      const key = 'test-user-3';

      // Use up all requests
      for (let i = 0; i < 5; i++) {
        rateLimit(key, 5, 60000);
      }

      // Advance time past the window
      vi.advanceTimersByTime(60001);

      const result = rateLimit(key, 5, 60000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    vi.useRealTimers();
  });

  describe('sanitizeString', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape ampersands', () => {
      expect(sanitizeString('foo & bar')).toBe('foo &amp; bar');
    });

    it('should escape quotes', () => {
      expect(sanitizeString('Say "hello"')).toBe('Say &quot;hello&quot;');
      expect(sanitizeString("It's fine")).toBe('It&#x27;s fine');
    });

    it('should handle empty string', () => {
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com').valid).toBe(true);
      expect(validateEmail('user.name@domain.co.kr').valid).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('notanemail').valid).toBe(false);
      expect(validateEmail('missing@').valid).toBe(false);
      expect(validateEmail('@domain.com').valid).toBe(false);
    });

    it('should lowercase and trim emails', () => {
      const result = validateEmail('  TEST@EXAMPLE.COM  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      expect(validateUsername('testuser').valid).toBe(true);
      expect(validateUsername('테스트유저').valid).toBe(true);
      expect(validateUsername('user_123').valid).toBe(true);
    });

    it('should reject usernames that are too short', () => {
      expect(validateUsername('a').valid).toBe(false);
    });

    it('should reject usernames that are too long', () => {
      expect(validateUsername('a'.repeat(21)).valid).toBe(false);
    });

    it('should reject usernames with special characters', () => {
      expect(validateUsername('user@name').valid).toBe(false);
      expect(validateUsername('user name').valid).toBe(false);
      expect(validateUsername('user-name').valid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short passwords', () => {
      const result = validatePassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('비밀번호는 8자 이상이어야 합니다');
    });

    it('should require letters', () => {
      const result = validatePassword('12345678');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('영문자를 포함해야 합니다');
    });

    it('should require numbers', () => {
      const result = validatePassword('PasswordOnly');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('숫자를 포함해야 합니다');
    });

    it('should reject too long passwords', () => {
      const result = validatePassword('Password1' + 'a'.repeat(100));
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('비밀번호는 100자 이하여야 합니다');
    });
  });

  describe('generateSecureToken', () => {
    it('should generate token of specified length', () => {
      const token32 = generateSecureToken(32);
      expect(token32).toHaveLength(64); // 32 bytes = 64 hex chars

      const token16 = generateSecureToken(16);
      expect(token16).toHaveLength(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });

    it('should only contain hex characters', () => {
      const token = generateSecureToken();
      expect(token).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('escapeSqlWildcards', () => {
    it('should escape percent signs', () => {
      expect(escapeSqlWildcards('50%')).toBe('50\\%');
    });

    it('should escape underscores', () => {
      expect(escapeSqlWildcards('user_name')).toBe('user\\_name');
    });

    it('should handle multiple wildcards', () => {
      expect(escapeSqlWildcards('%_test_%')).toBe('\\%\\_test\\_\\%');
    });

    it('should handle strings without wildcards', () => {
      expect(escapeSqlWildcards('normalstring')).toBe('normalstring');
    });
  });
});
