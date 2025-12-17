/**
 * Ranking API Route
 *
 * Provides ranked lists of novels by various criteria.
 *
 * @module api/ranking
 */

import { type NextRequest } from 'next/server';

import { apiSuccess } from '@/lib/api-response';
import { PAGINATION } from '@/lib/constants';

import type { Novel, Genre } from '@/types';

type RankingType = 'daily' | 'weekly' | 'monthly' | 'total';
type RankingCategory = 'views' | 'rating' | 'favorites' | 'trending';

// Mock data for rankings
const mockNovels: Novel[] = [
  {
    id: '1',
    title: '회귀자의 검술 아카데미',
    authorId: 'author1',
    genre: 'fantasy',
    tags: ['회귀', '아카데미', '성장'],
    coverUrl: '/covers/novel1.jpg',
    synopsis: '평범한 검사였던 주인공이 과거로 회귀하여 최강이 되는 이야기',
    totalChapters: 342,
    totalWords: 1250000,
    viewCount: 5420000,
    likeCount: 234000,
    favoriteCount: 89000,
    rating: 4.7,
    ratingCount: 15600,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 30,
    coinPrice: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    title: '재벌집 막내아들',
    authorId: 'author2',
    genre: 'modern',
    tags: ['현대', '재벌', '회귀'],
    coverUrl: '/covers/novel2.jpg',
    synopsis: '대기업 비서로 일하다 억울하게 죽은 주인공이 재벌가 막내로 환생',
    totalChapters: 456,
    totalWords: 1890000,
    viewCount: 8920000,
    likeCount: 456000,
    favoriteCount: 178000,
    rating: 4.8,
    ratingCount: 28900,
    status: 'completed',
    isExclusive: true,
    freeChapters: 50,
    coinPrice: 3,
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-08-15'),
  },
  {
    id: '3',
    title: '천마는 평범하게 살 수 없다',
    authorId: 'author3',
    genre: 'martial_arts',
    tags: ['무협', '천마', '일상'],
    coverUrl: '/covers/novel3.jpg',
    synopsis: '무림 최강 천마가 은퇴 후 평범하게 살려 하지만 자꾸 사건이 터진다',
    totalChapters: 278,
    totalWords: 980000,
    viewCount: 3210000,
    likeCount: 145000,
    favoriteCount: 56000,
    rating: 4.5,
    ratingCount: 8900,
    status: 'ongoing',
    isExclusive: false,
    freeChapters: 20,
    coinPrice: 2,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-28'),
  },
  {
    id: '4',
    title: '흑막 여주의 생존기',
    authorId: 'author4',
    genre: 'romance',
    tags: ['로판', '빙의', '흑막'],
    coverUrl: '/covers/novel4.jpg',
    synopsis: '소설 속 악녀로 빙의한 주인공이 죽음 플래그를 피해 살아남는 이야기',
    totalChapters: 189,
    totalWords: 720000,
    viewCount: 4560000,
    likeCount: 289000,
    favoriteCount: 134000,
    rating: 4.6,
    ratingCount: 19200,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 25,
    coinPrice: 3,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-11-30'),
  },
  {
    id: '5',
    title: '헌터 세계의 공략자',
    authorId: 'author5',
    genre: 'game',
    tags: ['헌터', '게임', 'S급'],
    coverUrl: '/covers/novel5.jpg',
    synopsis: '게임 지식으로 헌터 세계를 공략하는 최약체 헌터의 성장기',
    totalChapters: 512,
    totalWords: 2100000,
    viewCount: 7890000,
    likeCount: 367000,
    favoriteCount: 156000,
    rating: 4.7,
    ratingCount: 24500,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 40,
    coinPrice: 3,
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2024-12-02'),
  },
  {
    id: '6',
    title: '망나니 공작의 재혼',
    authorId: 'author6',
    genre: 'romance',
    tags: ['로판', '재혼', '계약결혼'],
    coverUrl: '/covers/novel6.jpg',
    synopsis: '악명 높은 망나니 공작과 계약 결혼한 평범한 귀족 여성의 이야기',
    totalChapters: 234,
    totalWords: 890000,
    viewCount: 3890000,
    likeCount: 198000,
    favoriteCount: 87000,
    rating: 4.4,
    ratingCount: 12300,
    status: 'ongoing',
    isExclusive: false,
    freeChapters: 30,
    coinPrice: 3,
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-11-29'),
  },
  {
    id: '7',
    title: '버그 플레이어',
    authorId: 'author7',
    genre: 'game',
    tags: ['게임', '버그', '시스템'],
    coverUrl: '/covers/novel7.jpg',
    synopsis: '게임 속 버그를 악용해 최강이 되는 플레이어의 이야기',
    totalChapters: 387,
    totalWords: 1450000,
    viewCount: 5670000,
    likeCount: 245000,
    favoriteCount: 98000,
    rating: 4.5,
    ratingCount: 16800,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 35,
    coinPrice: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '8',
    title: '절대검의 귀환',
    authorId: 'author8',
    genre: 'martial_arts',
    tags: ['무협', '귀환', '복수'],
    coverUrl: '/covers/novel8.jpg',
    synopsis: '절대검으로 불리던 무인이 배신당하고 죽은 뒤 과거로 돌아온다',
    totalChapters: 298,
    totalWords: 1120000,
    viewCount: 4230000,
    likeCount: 187000,
    favoriteCount: 72000,
    rating: 4.6,
    ratingCount: 11200,
    status: 'ongoing',
    isExclusive: false,
    freeChapters: 25,
    coinPrice: 2,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-11-27'),
  },
  {
    id: '9',
    title: '마왕님의 힐링 라이프',
    authorId: 'author9',
    genre: 'fantasy',
    tags: ['판타지', '마왕', '일상'],
    coverUrl: '/covers/novel9.jpg',
    synopsis: '은퇴한 마왕이 시골에서 힐링하며 사는 따뜻한 이야기',
    totalChapters: 156,
    totalWords: 520000,
    viewCount: 2340000,
    likeCount: 134000,
    favoriteCount: 67000,
    rating: 4.8,
    ratingCount: 9800,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 20,
    coinPrice: 2,
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-11-25'),
  },
  {
    id: '10',
    title: '회사원 던전 생활',
    authorId: 'author10',
    genre: 'modern',
    tags: ['현대', '던전', '회사원'],
    coverUrl: '/covers/novel10.jpg',
    synopsis: '평범한 회사원이 갑자기 던전이 생긴 세상에서 살아남는 이야기',
    totalChapters: 423,
    totalWords: 1680000,
    viewCount: 6120000,
    likeCount: 278000,
    favoriteCount: 112000,
    rating: 4.5,
    ratingCount: 18700,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 40,
    coinPrice: 3,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2024-12-02'),
  },
];

function getRankedNovels(
  category: RankingCategory,
  _type: RankingType,
  genre: Genre | null,
  limit: number
): Novel[] {
  let novels = [...mockNovels];

  // Filter by genre if specified
  if (genre) {
    novels = novels.filter((novel) => novel.genre === genre);
  }

  // Sort by category
  switch (category) {
    case 'views':
      novels.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'rating':
      novels.sort((a, b) => b.rating - a.rating);
      break;
    case 'favorites':
      novels.sort((a, b) => b.favoriteCount - a.favoriteCount);
      break;
    case 'trending':
      // Trending: combination of recent views and growth
      novels.sort((a, b) => {
        const aScore = a.viewCount * 0.5 + a.likeCount * 2 + a.favoriteCount * 3;
        const bScore = b.viewCount * 0.5 + b.likeCount * 2 + b.favoriteCount * 3;
        return bScore - aScore;
      });
      break;
  }

  return novels.slice(0, limit);
}

async function handleRanking(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = (searchParams.get('type') as RankingType) || 'daily';
  const category = (searchParams.get('category') as RankingCategory) || 'views';
  const genre = searchParams.get('genre') as Genre | null;
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10),
    PAGINATION.MAX_LIMIT
  );

  const novels = getRankedNovels(category, type, genre, limit);

  return apiSuccess({
    rankings: novels.map((novel, index) => ({
      rank: index + 1,
      novel,
      change: Math.floor(Math.random() * 5) - 2, // Mock rank change
    })),
    type,
    category,
    genre,
    updatedAt: new Date().toISOString(),
  });
}

export const GET = handleRanking;
