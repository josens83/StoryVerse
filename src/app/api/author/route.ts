import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { Author, AuthorTier, Novel, NovelStatus, Genre } from '@/types';

// Author analytics types
interface AuthorAnalytics {
  overview: {
    totalViews: number;
    totalViewsChange: number;
    totalRevenue: number;
    totalRevenueChange: number;
    totalFollowers: number;
    totalFollowersChange: number;
    averageRating: number;
  };
  revenueByNovel: { novelId: string; title: string; revenue: number; percentage: number }[];
  viewsByDay: { date: string; views: number }[];
  readerDemographics: {
    ageGroups: { group: string; percentage: number }[];
    genderRatio: { male: number; female: number; other: number };
    topRegions: { region: string; percentage: number }[];
  };
  chapterPerformance: {
    chapterId: string;
    number: number;
    views: number;
    retention: number;
    rating: number;
  }[];
}

// Mock author data
const mockAuthor: Author = {
  id: 'author-1',
  userId: 'user-author-1',
  penName: '김환상',
  bio: '판타지와 회귀물을 주로 쓰는 작가입니다. 독자분들과 함께 성장하고 싶습니다.',
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
};

// Mock novels by author
const mockAuthorNovels: Novel[] = [
  {
    id: 'novel-a1',
    title: '회귀자의 무한 성장',
    authorId: 'author-1',
    genre: 'regression' as Genre,
    tags: ['회귀', '성장', '먼치킨'],
    coverUrl: '/covers/novel-a1.jpg',
    synopsis: '죽음 직전, 과거로 회귀한 주인공의 무한 성장 이야기',
    totalChapters: 450,
    totalWords: 1200000,
    viewCount: 12000000,
    likeCount: 456000,
    favoriteCount: 178000,
    rating: 4.8,
    ratingCount: 89000,
    status: 'ongoing' as NovelStatus,
    isExclusive: true,
    freeChapters: 50,
    coinPrice: 3,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-12-16'),
    lastChapterAt: new Date('2024-12-16'),
  },
  {
    id: 'novel-a2',
    title: '마법사의 두 번째 삶',
    authorId: 'author-1',
    genre: 'fantasy' as Genre,
    tags: ['마법', '회귀', '학원'],
    coverUrl: '/covers/novel-a2.jpg',
    synopsis: '최강의 마법사가 어린 시절로 돌아가 다시 시작한다',
    totalChapters: 380,
    totalWords: 980000,
    viewCount: 8500000,
    likeCount: 312000,
    favoriteCount: 125000,
    rating: 4.7,
    ratingCount: 65000,
    status: 'ongoing' as NovelStatus,
    isExclusive: true,
    freeChapters: 40,
    coinPrice: 3,
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-12-15'),
    lastChapterAt: new Date('2024-12-15'),
  },
  {
    id: 'novel-a3',
    title: '던전 속의 요리사',
    authorId: 'author-1',
    genre: 'fantasy' as Genre,
    tags: ['던전', '요리', '힐링'],
    coverUrl: '/covers/novel-a3.jpg',
    synopsis: '던전에서 요리로 생존하는 색다른 이야기',
    totalChapters: 120,
    totalWords: 320000,
    viewCount: 2500000,
    likeCount: 89000,
    favoriteCount: 34000,
    rating: 4.5,
    ratingCount: 21000,
    status: 'completed' as NovelStatus,
    isExclusive: false,
    freeChapters: 20,
    coinPrice: 2,
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2023-08-15'),
    lastChapterAt: new Date('2023-08-15'),
  },
];

// Generate mock analytics
function generateMockAnalytics(_authorId: string): AuthorAnalytics {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0] ?? '',
      views: Math.floor(Math.random() * 50000) + 20000,
    };
  });

  return {
    overview: {
      totalViews: 25000000,
      totalViewsChange: 12.5,
      totalRevenue: 150000000,
      totalRevenueChange: 8.3,
      totalFollowers: 45000,
      totalFollowersChange: 5.2,
      averageRating: 4.67,
    },
    revenueByNovel: [
      { novelId: 'novel-a1', title: '회귀자의 무한 성장', revenue: 85000000, percentage: 56.7 },
      { novelId: 'novel-a2', title: '마법사의 두 번째 삶', revenue: 52000000, percentage: 34.7 },
      { novelId: 'novel-a3', title: '던전 속의 요리사', revenue: 13000000, percentage: 8.6 },
    ],
    viewsByDay: last30Days,
    readerDemographics: {
      ageGroups: [
        { group: '10대', percentage: 15 },
        { group: '20대', percentage: 45 },
        { group: '30대', percentage: 28 },
        { group: '40대+', percentage: 12 },
      ],
      genderRatio: { male: 62, female: 35, other: 3 },
      topRegions: [
        { region: '서울', percentage: 32 },
        { region: '경기', percentage: 25 },
        { region: '부산', percentage: 8 },
        { region: '대구', percentage: 5 },
        { region: '기타', percentage: 30 },
      ],
    },
    chapterPerformance: Array.from({ length: 10 }, (_, i) => ({
      chapterId: `chapter-${450 - i}`,
      number: 450 - i,
      views: Math.floor(Math.random() * 30000) + 15000,
      retention: Math.random() * 20 + 75, // 75-95%
      rating: Math.random() * 0.5 + 4.5, // 4.5-5.0
    })),
  };
}

// Settlement/Payment types
interface SettlementRecord {
  id: string;
  authorId: string;
  period: string;
  grossRevenue: number;
  platformFee: number;
  netRevenue: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt?: Date;
  completedAt?: Date;
  bankAccount?: string;
}

const mockSettlements: SettlementRecord[] = [
  {
    id: 'settle-1',
    authorId: 'author-1',
    period: '2024-11',
    grossRevenue: 12500000,
    platformFee: 4375000,
    netRevenue: 8125000,
    status: 'completed',
    requestedAt: new Date('2024-12-05'),
    completedAt: new Date('2024-12-10'),
    bankAccount: '***-****-1234',
  },
  {
    id: 'settle-2',
    authorId: 'author-1',
    period: '2024-12',
    grossRevenue: 7700000,
    platformFee: 2695000,
    netRevenue: 5005000,
    status: 'pending',
  },
];

// Validation schemas
const chapterDraftSchema = z.object({
  authorId: z.string().min(1),
  novelId: z.string().min(1),
  title: z.string().min(1).max(100),
  content: z.string().min(100),
  authorNote: z.string().max(1000).optional(),
  isScheduled: z.boolean().optional(),
  scheduledAt: z.string().datetime().optional(),
});

const withdrawalSchema = z.object({
  authorId: z.string().min(1),
  amount: z.number().min(10000),
  bankCode: z.string().min(3),
  accountNumber: z.string().min(10),
  accountHolder: z.string().min(2),
});

// GET /api/author - Get author data
async function handleGetAuthorData(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get('authorId');
  const type = searchParams.get('type'); // profile, novels, analytics, settlements

  if (!authorId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  if (type === 'analytics') {
    const analytics = generateMockAnalytics(authorId);
    return apiSuccess({ analytics });
  }

  if (type === 'novels') {
    return apiSuccess({ novels: mockAuthorNovels });
  }

  if (type === 'settlements') {
    const settlements = mockSettlements.filter((s) => s.authorId === authorId);
    const summary = {
      pendingAmount: mockAuthor.pendingRevenue,
      withdrawableAmount: mockAuthor.withdrawableRevenue,
      totalEarned: mockAuthor.totalRevenue,
      revenueShareRate: mockAuthor.revenueShareRate,
    };
    return apiSuccess({ settlements, summary });
  }

  // Default: return profile
  return apiSuccess({ author: mockAuthor, novels: mockAuthorNovels });
}

// POST /api/author/chapter - Save chapter draft
async function handleSaveChapter(request: NextRequest) {
  const body = await request.json();
  const result = chapterDraftSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { content, isScheduled, scheduledAt } = result.data;

  // Calculate word count
  const wordCount = content.replace(/\s/g, '').length;

  const savedChapter = {
    id: `draft-${Date.now()}`,
    ...result.data,
    wordCount,
    status: isScheduled ? 'scheduled' : 'draft',
    scheduledAt: isScheduled ? scheduledAt : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return apiSuccess(
    {
      message: isScheduled ? '예약 발행이 설정되었습니다.' : '임시저장되었습니다.',
      chapter: savedChapter,
      stats: {
        wordCount,
        estimatedReadTime: Math.ceil(wordCount / 500), // ~500 words per minute
      },
    },
    undefined,
    201
  );
}

// POST /api/author/publish - Publish chapter
async function handlePublishChapter(request: NextRequest) {
  const body = await request.json();

  const { authorId, novelId, chapterId } = body;

  if (!authorId || !novelId || !chapterId) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  return apiSuccess({
    message: '챕터가 발행되었습니다!',
    chapter: {
      id: chapterId,
      novelId,
      status: 'published',
      publishedAt: new Date(),
    },
  });
}

// POST /api/author/withdraw - Request withdrawal
async function handleWithdrawal(request: NextRequest) {
  const body = await request.json();
  const result = withdrawalSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { amount, accountNumber } = result.data;

  if (amount > mockAuthor.withdrawableRevenue) {
    return apiError('출금 가능 금액을 초과했습니다.', 400);
  }

  const withdrawal = {
    id: `withdraw-${Date.now()}`,
    amount,
    fee: Math.floor(amount * 0.01), // 1% fee
    netAmount: amount - Math.floor(amount * 0.01),
    bankAccount: `***-****-${accountNumber.slice(-4)}`,
    status: 'processing',
    requestedAt: new Date(),
    estimatedCompletionAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
  };

  return apiSuccess(
    {
      message: '출금 신청이 완료되었습니다. 영업일 기준 3일 내 입금됩니다.',
      withdrawal,
    },
    undefined,
    201
  );
}

export async function GET(request: NextRequest) {
  try {
    return handleGetAuthorData(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'publish') {
      return handlePublishChapter(request);
    }

    if (action === 'withdraw') {
      return handleWithdrawal(request);
    }

    return handleSaveChapter(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
