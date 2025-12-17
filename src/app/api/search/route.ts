/**
 * Search API Route
 *
 * Provides full-text search across novels, authors, and tags.
 * Supports filtering by genre and sorting options.
 *
 * @module api/search
 */

import { type NextRequest } from 'next/server';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES, SEARCH, PAGINATION } from '@/lib/constants';

import type { Novel, Genre } from '@/types';

// Mock data for search (in production, this would query a database)
const mockNovels: Novel[] = [
  {
    id: '1',
    title: '회귀자의 검술 아카데미',
    authorId: 'author1',
    genre: 'fantasy',
    tags: ['회귀', '아카데미', '성장', '검술'],
    coverUrl: '/covers/novel1.jpg',
    synopsis: '평범한 검사였던 주인공이 과거로 회귀하여 아카데미에서 최강이 되는 이야기',
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
    tags: ['현대', '재벌', '회귀', '복수'],
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
    tags: ['무협', '천마', '먼치킨', '일상'],
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
    tags: ['로판', '빙의', '흑막', '회귀'],
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
    tags: ['헌터', '게임', '시스템', 'S급'],
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
];

interface SearchParams {
  query: string;
  genre?: Genre;
  sort?: 'relevance' | 'latest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

function searchNovels(params: SearchParams): { novels: Novel[]; total: number } {
  const { query, genre, sort = 'relevance', page = 1, limit = PAGINATION.DEFAULT_LIMIT } = params;

  let results = [...mockNovels];

  // Filter by search query
  if (query && query.length >= SEARCH.MIN_QUERY_LENGTH) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (novel) =>
        novel.title.toLowerCase().includes(lowerQuery) ||
        novel.synopsis.toLowerCase().includes(lowerQuery) ||
        novel.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Filter by genre
  if (genre) {
    results = results.filter((novel) => novel.genre === genre);
  }

  // Sort results
  switch (sort) {
    case 'latest':
      results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'popular':
      results.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'relevance':
    default:
      // Keep original order for relevance (in production, this would be weighted)
      break;
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return { novels: paginatedResults, total };
}

async function handleSearch(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') as Genre | undefined;
  const sort = (searchParams.get('sort') as SearchParams['sort']) || 'relevance';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10),
    PAGINATION.MAX_LIMIT
  );

  // Validate query length
  if (query && query.length > SEARCH.MAX_QUERY_LENGTH) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  const { novels, total } = searchNovels({ query, genre, sort, page, limit });

  return apiSuccess({
    novels,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    query,
    filters: {
      genre: genre || null,
      sort,
    },
  });
}

export const GET = handleSearch;
