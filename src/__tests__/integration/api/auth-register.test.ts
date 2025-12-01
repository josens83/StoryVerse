import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { POST } from '@/app/api/auth/register/route';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Mock modules
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  hashPassword: vi.fn(),
  generateToken: vi.fn(),
  setAuthCookie: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'generated-uuid-123'),
}));

function createMockRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Validation', () => {
    it('should return 400 for invalid email format', async () => {
      const request = createMockRequest({
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('이메일');
    });

    it('should return 400 for username too short', async () => {
      const request = createMockRequest({
        email: 'test@example.com',
        username: 'a',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('2자');
    });

    it('should return 400 for username too long', async () => {
      const request = createMockRequest({
        email: 'test@example.com',
        username: 'a'.repeat(21),
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('20자');
    });

    it('should return 400 for password too short', async () => {
      const request = createMockRequest({
        email: 'test@example.com',
        username: 'testuser',
        password: 'short',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('8자');
    });

    it('should return 400 for missing required fields', async () => {
      const request = createMockRequest({
        email: 'test@example.com',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Duplicate Checks', () => {
    it('should return 400 when email already exists', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'existing-user' }, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const request = createMockRequest({
        email: 'existing@example.com',
        username: 'newuser',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('이미 사용 중인 이메일입니다');
    });

    it('should return 400 when username already exists', async () => {
      let callCount = 0;
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => {
          callCount++;
          // First call (email check) returns no match
          // Second call (username check) returns existing user
          if (callCount === 1) {
            return Promise.resolve({ data: null, error: { code: 'PGRST116' } });
          }
          return Promise.resolve({ data: { id: 'existing-user' }, error: null });
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const request = createMockRequest({
        email: 'new@example.com',
        username: 'existinguser',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('이미 사용 중인 닉네임입니다');
    });
  });

  describe('Successful Registration', () => {
    it('should create user and return 200 on success', async () => {
      const mockCreatedUser = {
        id: 'generated-uuid-123',
        email: 'newuser@example.com',
        username: 'newuser',
        tier: 'free',
        purchased_coins: 0,
        earned_coins: 100,
        earned_coins_expire_at: '2025-12-31T00:00:00Z',
        total_read_time: 0,
        consecutive_checkins: 0,
        created_at: '2025-12-01T00:00:00Z',
      };

      // Mock for duplicate checks (both return no match)
      let callCount = 0;
      const mockSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => {
          callCount++;
          return Promise.resolve({ data: null, error: { code: 'PGRST116' } });
        }),
      };

      // Mock for insert
      const mockInsertChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockCreatedUser, error: null }),
      };

      vi.mocked(supabase.from).mockImplementation((_table) => {
        if (callCount < 2) {
          return mockSelectChain as ReturnType<typeof supabase.from>;
        }
        return mockInsertChain as ReturnType<typeof supabase.from>;
      });

      vi.mocked(hashPassword).mockResolvedValue('hashed_password');
      vi.mocked(generateToken).mockReturnValue('mock-jwt-token');
      vi.mocked(setAuthCookie).mockImplementation(() => {});

      const request = createMockRequest({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.id).toBe('generated-uuid-123');
      expect(data.data.user.email).toBe('newuser@example.com');
      expect(data.data.user.earnedCoins).toBe(100); // Welcome bonus
      expect(data.data.token).toBe('mock-jwt-token');
      expect(data.message).toContain('100코인');
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(setAuthCookie).toHaveBeenCalled();
    });
  });

  describe('Database Errors', () => {
    it('should return 500 when database insert fails', async () => {
      // Mock for duplicate checks (both return no match)
      let callCount = 0;
      const mockSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => {
          callCount++;
          return Promise.resolve({ data: null, error: { code: 'PGRST116' } });
        }),
      };

      // Mock for insert with error
      const mockInsertChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: '500' },
        }),
      };

      vi.mocked(supabase.from).mockImplementation(() => {
        if (callCount < 2) {
          return mockSelectChain as ReturnType<typeof supabase.from>;
        }
        return mockInsertChain as ReturnType<typeof supabase.from>;
      });

      vi.mocked(hashPassword).mockResolvedValue('hashed_password');

      const request = createMockRequest({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('회원가입에 실패했습니다');
    });
  });
});
