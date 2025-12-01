import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { AUTH, COINS, TIME, ERROR_MESSAGES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

const registerSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  username: z
    .string()
    .min(AUTH.USERNAME_MIN_LENGTH, ERROR_MESSAGES.VALIDATION.USERNAME_MIN_LENGTH)
    .max(AUTH.USERNAME_MAX_LENGTH, ERROR_MESSAGES.VALIDATION.USERNAME_MAX_LENGTH),
  password: z.string().min(AUTH.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
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
        { success: false, error: ERROR_MESSAGES.REGISTER.EMAIL_EXISTS },
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
        { success: false, error: ERROR_MESSAGES.REGISTER.USERNAME_EXISTS },
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
        earned_coins: COINS.WELCOME_BONUS,
        earned_coins_expire_at: new Date(
          Date.now() + COINS.EARNED_EXPIRY_DAYS * TIME.DAY
        ).toISOString(),
        total_read_time: 0,
        consecutive_checkins: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Register error:', error);
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.REGISTER.FAILED },
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
      message: `회원가입이 완료되었습니다! ${COINS.WELCOME_BONUS}코인이 지급되었습니다.`,
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstIssue?.message ?? ERROR_MESSAGES.VALIDATION.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
