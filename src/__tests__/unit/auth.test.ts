import { describe, it, expect } from 'vitest';

import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const result = await verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const result = await verifyPassword('wrongPassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        tier: 'free' as const,
      };

      const token = generateToken(payload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token and return payload', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        tier: 'free' as const,
      };

      const token = generateToken(payload);
      const verified = verifyToken(token);

      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe(payload.userId);
      expect(verified?.email).toBe(payload.email);
      expect(verified?.username).toBe(payload.username);
      expect(verified?.tier).toBe(payload.tier);
    });

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return null for tampered token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        tier: 'free' as const,
      };

      const token = generateToken(payload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      const result = verifyToken(tamperedToken);
      expect(result).toBeNull();
    });
  });

  describe('Token Round Trip', () => {
    it('should maintain data integrity through token cycle', () => {
      const originalPayload = {
        userId: 'user-abc-123',
        email: 'roundtrip@test.com',
        username: 'roundtripuser',
        tier: 'vip' as const,
      };

      const token = generateToken(originalPayload);
      const decodedPayload = verifyToken(token);

      expect(decodedPayload?.userId).toBe(originalPayload.userId);
      expect(decodedPayload?.email).toBe(originalPayload.email);
      expect(decodedPayload?.username).toBe(originalPayload.username);
      expect(decodedPayload?.tier).toBe(originalPayload.tier);
    });
  });
});
