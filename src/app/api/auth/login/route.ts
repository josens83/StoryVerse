import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ApiErrors } from '@/lib/api-response';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { rateLimit, getClientIp, validateContentType } from '@/lib/security';
import { supabase } from '@/lib/supabase';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 *
 * @description Rate limited to 5 attempts per minute per IP
 * @body {email: string, password: string}
 * @returns {Object} User data and auth token
 */
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  try {
    // Rate limiting for brute force protection (5 attempts per minute)
    const rateLimitResult = rateLimit(`login:${clientIp}`, 5, 60000);
    if (!rateLimitResult.success) {
      logger.warn('Login rate limit exceeded', { ip: clientIp });
      return NextResponse.json(
        {
          success: false,
          error: '너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          },
        }
      );
    }

    // Content-Type validation
    if (!validateContentType(request)) {
      return ApiErrors.badRequest('Content-Type must be application/json');
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      // Use generic message to prevent email enumeration
      logger.info('Login failed: user not found', { email: email.slice(0, 3) + '***' });
      return ApiErrors.unauthorized('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // Verify password
    if (!user.password_hash) {
      logger.info('Login failed: social account', { userId: user.id });
      return ApiErrors.unauthorized('소셜 로그인으로 가입된 계정입니다');
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      logger.info('Login failed: invalid password', { userId: user.id });
      return ApiErrors.unauthorized('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      tier: user.tier,
    });

    logger.info('User logged in successfully', { userId: user.id });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar_url,
          tier: user.tier,
          vipExpiresAt: user.vip_expires_at,
          purchasedCoins: user.purchased_coins,
          earnedCoins: user.earned_coins,
          earnedCoinsExpireAt: user.earned_coins_expire_at,
          totalReadTime: user.total_read_time,
          consecutiveCheckIns: user.consecutive_checkins,
          lastCheckInAt: user.last_checkin_at,
          createdAt: user.created_at,
        },
        token,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return ApiErrors.badRequest(firstIssue?.message ?? '유효성 검사 오류');
    }

    logger.error('Login error', error instanceof Error ? error : undefined, { ip: clientIp });
    return ApiErrors.internal();
  }
}
