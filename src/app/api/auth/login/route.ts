import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, error: '소셜 로그인으로 가입된 계정입니다' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      tier: user.tier,
    });

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
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
