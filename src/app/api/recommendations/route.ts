import { type NextRequest } from 'next/server';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { Novel, Recommendation, RecommendationReason, Genre } from '@/types';

// Mock novels data for recommendations
const mockNovels: Novel[] = [
  {
    id: 'rec-1',
    title: '회귀자의 무한 성장',
    authorId: 'author-1',
    genre: 'regression',
    tags: ['회귀', '성장', '먼치킨'],
    coverUrl: '/covers/regression-growth.jpg',
    synopsis: '죽음 직전, 과거로 회귀한 주인공의 무한 성장 이야기',
    totalChapters: 450,
    totalWords: 1200000,
    viewCount: 5800000,
    likeCount: 234000,
    favoriteCount: 89000,
    rating: 4.8,
    ratingCount: 45000,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 50,
    coinPrice: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-15'),
    lastChapterAt: new Date('2024-12-15'),
  },
  {
    id: 'rec-2',
    title: '마법사의 두 번째 삶',
    authorId: 'author-2',
    genre: 'fantasy',
    tags: ['마법', '회귀', '학원'],
    coverUrl: '/covers/mage-life.jpg',
    synopsis: '최강의 마법사가 어린 시절로 돌아가 다시 시작한다',
    totalChapters: 380,
    totalWords: 980000,
    viewCount: 4200000,
    likeCount: 178000,
    favoriteCount: 67000,
    rating: 4.7,
    ratingCount: 38000,
    status: 'ongoing',
    isExclusive: false,
    freeChapters: 40,
    coinPrice: 3,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-14'),
    lastChapterAt: new Date('2024-12-14'),
  },
  {
    id: 'rec-3',
    title: '천재 검사의 귀환',
    authorId: 'author-3',
    genre: 'action',
    tags: ['무협', '귀환', '복수'],
    coverUrl: '/covers/genius-sword.jpg',
    synopsis: '천하제일 검객이 현대로 환생하여 벌이는 복수극',
    totalChapters: 520,
    totalWords: 1400000,
    viewCount: 6100000,
    likeCount: 267000,
    favoriteCount: 95000,
    rating: 4.9,
    ratingCount: 52000,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 60,
    coinPrice: 3,
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2024-12-16'),
    lastChapterAt: new Date('2024-12-16'),
  },
  {
    id: 'rec-4',
    title: '대통령의 숨겨진 딸',
    authorId: 'author-4',
    genre: 'romance',
    tags: ['로맨스', '재벌', '비밀'],
    coverUrl: '/covers/secret-daughter.jpg',
    synopsis: '숨겨진 정체가 밝혀지며 시작되는 신데렐라 로맨스',
    totalChapters: 280,
    totalWords: 720000,
    viewCount: 3500000,
    likeCount: 156000,
    favoriteCount: 58000,
    rating: 4.6,
    ratingCount: 29000,
    status: 'completed',
    isExclusive: false,
    freeChapters: 30,
    coinPrice: 2,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-10-20'),
    lastChapterAt: new Date('2024-10-20'),
  },
  {
    id: 'rec-5',
    title: '던전 속 만물상',
    authorId: 'author-5',
    genre: 'game',
    tags: ['던전', '상점', '경영'],
    coverUrl: '/covers/dungeon-shop.jpg',
    synopsis: '던전 안에서 상점을 운영하며 살아남는 이야기',
    totalChapters: 340,
    totalWords: 890000,
    viewCount: 2800000,
    likeCount: 123000,
    favoriteCount: 45000,
    rating: 4.5,
    ratingCount: 22000,
    status: 'ongoing',
    isExclusive: false,
    freeChapters: 35,
    coinPrice: 3,
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-12-13'),
    lastChapterAt: new Date('2024-12-13'),
  },
  {
    id: 'rec-6',
    title: '아카데미 최강자',
    authorId: 'author-6',
    genre: 'academy',
    tags: ['학원', '능력', '히든보스'],
    coverUrl: '/covers/academy-strongest.jpg',
    synopsis: '평범한 척 숨어있던 최강자가 아카데미에 입학한다',
    totalChapters: 290,
    totalWords: 750000,
    viewCount: 3100000,
    likeCount: 134000,
    favoriteCount: 51000,
    rating: 4.6,
    ratingCount: 25000,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 25,
    coinPrice: 3,
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-12-15'),
    lastChapterAt: new Date('2024-12-15'),
  },
  {
    id: 'rec-7',
    title: '무림 제일 미식가',
    authorId: 'author-7',
    genre: 'martial_arts',
    tags: ['무협', '요리', '힐링'],
    coverUrl: '/covers/martial-food.jpg',
    synopsis: '무공과 요리를 결합한 새로운 무협의 세계',
    totalChapters: 410,
    totalWords: 1050000,
    viewCount: 2400000,
    likeCount: 98000,
    favoriteCount: 38000,
    rating: 4.4,
    ratingCount: 18000,
    status: 'ongoing',
    isExclusive: false,
    freeChapters: 45,
    coinPrice: 2,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-12-12'),
    lastChapterAt: new Date('2024-12-12'),
  },
  {
    id: 'rec-8',
    title: '버림받은 공작 영애',
    authorId: 'author-8',
    genre: 'romance',
    tags: ['로맨스판타지', '영애물', '복수'],
    coverUrl: '/covers/abandoned-lady.jpg',
    synopsis: '버림받은 영애가 새로운 삶을 개척해 나가는 이야기',
    totalChapters: 260,
    totalWords: 680000,
    viewCount: 4100000,
    likeCount: 189000,
    favoriteCount: 72000,
    rating: 4.7,
    ratingCount: 35000,
    status: 'completed',
    isExclusive: true,
    freeChapters: 20,
    coinPrice: 3,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-08-15'),
    lastChapterAt: new Date('2024-08-15'),
  },
];

// Recommendation algorithm simulation
function generateRecommendations(
  userId: string | null,
  genre?: Genre,
  limit: number = 10
): Recommendation[] {
  const reasons: RecommendationReason[] = [
    'similar_genre',
    'readers_also_liked',
    'trending',
    'personalized',
    'new_release',
    'editorial_pick',
  ];

  let filteredNovels = [...mockNovels];

  if (genre) {
    filteredNovels = filteredNovels.filter((n) => n.genre === genre);
  }

  // Shuffle and score
  const shuffled = filteredNovels.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit).map(
    (novel, index): Recommendation => ({
      id: `rec-${Date.now()}-${index}`,
      novelId: novel.id,
      novel,
      reason: userId ? (reasons[index % reasons.length] ?? 'trending') : 'trending',
      score: Math.random() * 0.5 + 0.5, // 0.5 ~ 1.0
      createdAt: new Date(),
    })
  );
}

// GET /api/recommendations - Get personalized recommendations
async function handleGetRecommendations(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const genre = searchParams.get('genre') as Genre | null;
  const type = searchParams.get('type') || 'forYou'; // forYou, trending, newReleases, genre
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 20);

  const recommendations = generateRecommendations(userId, genre || undefined, limit);

  // Group by type
  const response = {
    type,
    recommendations,
    meta: {
      algorithm: userId ? 'personalized' : 'popular',
      generatedAt: new Date().toISOString(),
    },
  };

  return apiSuccess(response);
}

// GET /api/recommendations/related/[novelId] - Get related novels
async function handleGetRelated(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const novelId = searchParams.get('novelId');

  if (!novelId) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  // Find the source novel
  const sourceNovel = mockNovels.find((n) => n.id === novelId);

  if (!sourceNovel) {
    // If not found in mock, create a default response
    const relatedNovels = mockNovels.slice(0, 5).map((novel, index) => ({
      id: `related-${Date.now()}-${index}`,
      novelId: novel.id,
      novel,
      reason: 'readers_also_liked' as RecommendationReason,
      score: Math.random() * 0.3 + 0.7,
      createdAt: new Date(),
    }));

    return apiSuccess({ related: relatedNovels });
  }

  // Find novels with same genre or tags
  const related = mockNovels
    .filter((n) => n.id !== novelId)
    .map((novel) => {
      let score = 0;

      // Same genre bonus
      if (novel.genre === sourceNovel.genre) {
        score += 0.4;
      }

      // Shared tags bonus
      const sharedTags = novel.tags.filter((t) => sourceNovel.tags.includes(t));
      score += sharedTags.length * 0.15;

      // Popularity factor
      score += (novel.rating / 5) * 0.2;

      return {
        id: `related-${novel.id}`,
        novelId: novel.id,
        novel,
        reason: (novel.genre === sourceNovel.genre
          ? 'similar_genre'
          : 'readers_also_liked') as RecommendationReason,
        score: Math.min(score, 1),
        createdAt: new Date(),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return apiSuccess({ related });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novelId');

    if (novelId) {
      return handleGetRelated(request);
    }

    return handleGetRecommendations(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
