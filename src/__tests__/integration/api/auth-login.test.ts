import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { POST } from '@/app/api/auth/login/route';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { rateLimit, getClientIp, validateContentType } from '@/lib/security';
import { supabase } from '@/lib/supabase';

// Mock modules
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyPassword: vi.fn(),
  generateToken: vi.fn(),
  setAuthCookie: vi.fn(),
}));

vi.mock('@/lib/security', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@/lib/security')>();
  return {
    ...actual,
    rateLimit: vi.fn(),
    getClientIp: vi.fn(),
    validateContentType: vi.fn(),
  };
});

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

function createMockRequest(body: unknown, contentType = 'application/json'): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientIp).mockReturnValue('127.0.0.1');
    vi.mocked(rateLimit).mockReturnValue({
      success: true,
      remaining: 4,
      resetTime: Date.now() + 60000,
    });
    vi.mocked(validateContentType).mockReturnValue(true);
  });

  it('should return 429 when rate limited', async () => {
    vi.mocked(rateLimit).mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 30000,
    });

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.error).toContain('너무 많은 로그인 시도');
  });

  it('should return 400 when Content-Type is not application/json', async () => {
    vi.mocked(validateContentType).mockReturnValue(false);

    const request = createMockRequest(
      { email: 'test@example.com', password: 'password123' },
      'text/plain'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Content-Type');
  });

  it('should return 400 for invalid email format', async () => {
    const request = createMockRequest({
      email: 'invalid-email',
      password: 'password123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should return 400 for missing password', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      password: '',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should return 401 when user not found', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    });
    vi.mocked(supabase.from).mockImplementation(mockFrom);

    const request = createMockRequest({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('이메일 또는 비밀번호가 올바르지 않습니다');
  });

  it('should return 401 when password is incorrect', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      password_hash: 'hashed_password',
      tier: 'free',
    };

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
    });
    vi.mocked(supabase.from).mockImplementation(mockFrom);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('이메일 또는 비밀번호가 올바르지 않습니다');
  });

  it('should return 401 for social login account without password', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      password_hash: null, // Social login account
      tier: 'free',
    };

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
    });
    vi.mocked(supabase.from).mockImplementation(mockFrom);

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toContain('소셜 로그인');
  });

  it('should return 200 and user data on successful login', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      password_hash: 'hashed_password',
      tier: 'free',
      avatar_url: 'https://example.com/avatar.jpg',
      vip_expires_at: null,
      purchased_coins: 100,
      earned_coins: 50,
      earned_coins_expire_at: '2025-12-31T00:00:00Z',
      total_read_time: 3600,
      consecutive_checkins: 5,
      last_checkin_at: '2025-12-01T00:00:00Z',
      created_at: '2025-01-01T00:00:00Z',
    };

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
    });
    vi.mocked(supabase.from).mockImplementation(mockFrom);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(generateToken).mockReturnValue('mock-jwt-token');
    vi.mocked(setAuthCookie).mockImplementation(() => {});

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'correctpassword123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user.id).toBe('user-123');
    expect(data.data.user.email).toBe('test@example.com');
    expect(data.data.user.username).toBe('testuser');
    expect(data.data.token).toBe('mock-jwt-token');
    expect(setAuthCookie).toHaveBeenCalled();
  });

  it('should normalize email to lowercase', async () => {
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: mockEq,
      single: mockSingle,
    } as ReturnType<typeof supabase.from>);

    const request = createMockRequest({
      email: 'TEST@EXAMPLE.COM', // Valid email with uppercase letters
      password: 'password123',
    });

    await POST(request);

    // Verify that supabase.from was called with 'users' table
    expect(supabase.from).toHaveBeenCalledWith('users');
    // Verify the email was normalized (lowercased) before query
    expect(mockEq).toHaveBeenCalledWith('email', 'test@example.com');
  });
});
