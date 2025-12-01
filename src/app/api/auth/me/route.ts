import { type NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const payload = getCurrentUser(request);

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
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
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
