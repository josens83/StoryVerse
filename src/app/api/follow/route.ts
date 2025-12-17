import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { PAGINATION } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { Follow, User, Author, UserTier, AuthorTier } from '@/types';

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'reader1@example.com',
    username: '소설마니아',
    avatar: '/avatars/user-1.jpg',
    tier: 'vip' as UserTier,
    purchasedCoins: 5000,
    earnedCoins: 230,
    totalReadTime: 50000,
    consecutiveCheckIns: 15,
    createdAt: new Date('2023-06-15'),
  },
  {
    id: 'user-2',
    email: 'reader2@example.com',
    username: '책벌레',
    avatar: '/avatars/user-2.jpg',
    tier: 'svip' as UserTier,
    purchasedCoins: 15000,
    earnedCoins: 890,
    totalReadTime: 120000,
    consecutiveCheckIns: 45,
    createdAt: new Date('2022-12-01'),
  },
  {
    id: 'user-3',
    email: 'reader3@example.com',
    username: '판타지러버',
    tier: 'free' as UserTier,
    purchasedCoins: 0,
    earnedCoins: 50,
    totalReadTime: 8000,
    consecutiveCheckIns: 3,
    createdAt: new Date('2024-08-20'),
  },
];

// Mock authors data
const mockAuthors: Author[] = [
  {
    id: 'author-1',
    userId: 'user-author-1',
    penName: '김환상',
    bio: '판타지와 회귀물을 주로 쓰는 작가입니다.',
    avatar: '/avatars/author-1.jpg',
    tier: 'gold' as AuthorTier,
    totalNovels: 5,
    totalWords: 4500000,
    totalViews: 25000000,
    totalFollowers: 45000,
    totalRevenue: 150000000,
    revenueShareRate: 0.65,
    pendingRevenue: 5000000,
    withdrawableRevenue: 8000000,
    isExclusive: true,
    createdAt: new Date('2021-03-10'),
    verifiedAt: new Date('2021-03-15'),
  },
  {
    id: 'author-2',
    userId: 'user-author-2',
    penName: '이로맨스',
    bio: '로맨스 소설 전문 작가입니다.',
    avatar: '/avatars/author-2.jpg',
    tier: 'platinum' as AuthorTier,
    totalNovels: 8,
    totalWords: 7200000,
    totalViews: 42000000,
    totalFollowers: 78000,
    totalRevenue: 280000000,
    revenueShareRate: 0.68,
    pendingRevenue: 12000000,
    withdrawableRevenue: 25000000,
    isExclusive: true,
    createdAt: new Date('2020-01-20'),
    verifiedAt: new Date('2020-01-25'),
  },
  {
    id: 'author-3',
    userId: 'user-author-3',
    penName: '박액션',
    bio: '액션과 무협 장르를 다루는 작가입니다.',
    avatar: '/avatars/author-3.jpg',
    tier: 'established' as AuthorTier,
    totalNovels: 3,
    totalWords: 1800000,
    totalViews: 8500000,
    totalFollowers: 12000,
    totalRevenue: 35000000,
    revenueShareRate: 0.6,
    pendingRevenue: 1500000,
    withdrawableRevenue: 3000000,
    isExclusive: false,
    createdAt: new Date('2023-02-14'),
    verifiedAt: new Date('2023-02-20'),
  },
];

// Mock follows data
const mockFollows: Follow[] = [
  {
    id: 'follow-1',
    followerId: 'user-1',
    followingId: 'author-1',
    followType: 'author',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'follow-2',
    followerId: 'user-1',
    followingId: 'author-2',
    followType: 'author',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'follow-3',
    followerId: 'user-1',
    followingId: 'user-2',
    followType: 'user',
    createdAt: new Date('2024-03-10'),
  },
];

// Validation schemas
const followSchema = z.object({
  followerId: z.string().min(1),
  followingId: z.string().min(1),
  followType: z.enum(['user', 'author']),
});

const unfollowSchema = z.object({
  followerId: z.string().min(1),
  followingId: z.string().min(1),
});

// GET /api/follow - Get followers or following list
async function handleGetFollows(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type') || 'following'; // 'followers' | 'following'
  const followType = searchParams.get('followType') as 'user' | 'author' | null;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10),
    PAGINATION.MAX_LIMIT
  );

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  let filtered: Follow[];

  if (type === 'followers') {
    filtered = mockFollows.filter((f) => f.followingId === userId);
  } else {
    filtered = mockFollows.filter((f) => f.followerId === userId);
  }

  if (followType) {
    filtered = filtered.filter((f) => f.followType === followType);
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  // Populate user/author data
  const follows = filtered.slice(offset, offset + limit).map((follow) => {
    if (type === 'followers') {
      const follower = mockUsers.find((u) => u.id === follow.followerId);
      return { ...follow, follower };
    } else {
      if (follow.followType === 'author') {
        const following = mockAuthors.find((a) => a.id === follow.followingId);
        return { ...follow, following };
      } else {
        const following = mockUsers.find((u) => u.id === follow.followingId);
        return { ...follow, following };
      }
    }
  });

  return apiSuccess({
    follows,
    counts: {
      followers: mockFollows.filter((f) => f.followingId === userId).length,
      following: mockFollows.filter((f) => f.followerId === userId).length,
      followingAuthors: mockFollows.filter(
        (f) => f.followerId === userId && f.followType === 'author'
      ).length,
      followingUsers: mockFollows.filter((f) => f.followerId === userId && f.followType === 'user')
        .length,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

// GET /api/follow/check - Check if following
async function handleCheckFollow(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const followerId = searchParams.get('followerId');
  const followingId = searchParams.get('followingId');

  if (!followerId || !followingId) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  const isFollowing = mockFollows.some(
    (f) => f.followerId === followerId && f.followingId === followingId
  );

  return apiSuccess({ isFollowing });
}

// POST /api/follow - Follow a user or author
async function handleFollow(request: NextRequest) {
  const body = await request.json();
  const result = followSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { followerId, followingId, followType } = result.data;

  // Check if already following
  const existing = mockFollows.find(
    (f) => f.followerId === followerId && f.followingId === followingId
  );

  if (existing) {
    return apiError('이미 팔로우 중입니다.', 400);
  }

  // Verify target exists
  if (followType === 'author') {
    const author = mockAuthors.find((a) => a.id === followingId);
    if (!author) {
      return apiError('작가를 찾을 수 없습니다.', 404);
    }
  } else {
    const user = mockUsers.find((u) => u.id === followingId);
    if (!user) {
      return apiError('사용자를 찾을 수 없습니다.', 404);
    }
  }

  const newFollow: Follow = {
    id: `follow-${Date.now()}`,
    followerId,
    followingId,
    followType,
    createdAt: new Date(),
  };

  mockFollows.push(newFollow);

  return apiSuccess(
    {
      message: '팔로우했습니다.',
      follow: newFollow,
    },
    undefined,
    201
  );
}

// DELETE /api/follow - Unfollow
async function handleUnfollow(request: NextRequest) {
  const body = await request.json();
  const result = unfollowSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { followerId, followingId } = result.data;

  const index = mockFollows.findIndex(
    (f) => f.followerId === followerId && f.followingId === followingId
  );

  if (index === -1) {
    return apiError('팔로우 관계를 찾을 수 없습니다.', 404);
  }

  mockFollows.splice(index, 1);

  return apiSuccess({ message: '언팔로우했습니다.' });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'check') {
      return handleCheckFollow(request);
    }

    return handleGetFollows(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    return handleFollow(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    return handleUnfollow(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
