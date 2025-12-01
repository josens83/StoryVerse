import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  username: z.string().min(2, '닉네임은 2자 이상이어야 합니다').max(20, '닉네임은 20자 이하여야 합니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = registerSchema.parse(body);

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 이메일입니다' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 닉네임입니다' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = uuid();
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        username,
        password_hash: passwordHash,
        tier: 'free',
        purchased_coins: 0,
        earned_coins: 100, // Welcome bonus
        earned_coins_expire_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        total_read_time: 0,
        consecutive_checkins: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Register error:', error);
      return NextResponse.json(
        { success: false, error: '회원가입에 실패했습니다' },
        { status: 500 }
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
          tier: user.tier,
          purchasedCoins: user.purchased_coins,
          earnedCoins: user.earned_coins,
          earnedCoinsExpireAt: user.earned_coins_expire_at,
          totalReadTime: user.total_read_time,
          consecutiveCheckIns: user.consecutive_checkins,
          createdAt: user.created_at,
        },
        token,
      },
      message: '회원가입이 완료되었습니다! 100코인이 지급되었습니다.',
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
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
