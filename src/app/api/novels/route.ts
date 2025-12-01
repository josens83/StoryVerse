import { type NextRequest, NextResponse } from 'next/server';

import { ApiErrors } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { schemas, escapeSqlWildcards } from '@/lib/security';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/novels
 * Fetch novels with filtering, sorting, and pagination
 *
 * @description Retrieves a paginated list of novels with optional filtering and sorting
 *
 * Query Parameters:
 * - page: number (default: 1) - Page number for pagination
 * - limit: number (1-50, default: 20) - Items per page
 * - genre: string (optional) - Filter by genre (fantasy, romance, action, etc.)
 * - status: string (optional) - Filter by status (ongoing, completed, hiatus)
 * - sort: string (default: 'latest') - Sort by (latest, popular, rating)
 * - search: string (max 100 chars) - Search in title and synopsis
 *
 * @returns {Object} Paginated list of novels
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate and parse query parameters using Zod schema
    const filterResult = schemas.novelFilters.safeParse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      genre: searchParams.get('genre') || undefined,
      status: searchParams.get('status') || undefined,
      sort: searchParams.get('sort') || undefined,
      search: searchParams.get('search') || undefined,
    });

    if (!filterResult.success) {
      const errorMessage = filterResult.error.issues[0]?.message ?? '잘못된 요청 파라미터입니다';
      logger.warn('Invalid novel filter parameters', {
        errors: filterResult.error.issues,
        params: Object.fromEntries(searchParams.entries()),
      });
      return ApiErrors.badRequest(errorMessage);
    }

    const { page, limit, genre, status, sort, search } = filterResult.data;
    const offset = (page - 1) * limit;

    let query = supabase.from('novels').select(
      `
        *,
        author:authors(id, pen_name, tier)
      `,
      { count: 'exact' }
    );

    // Apply filters
    if (genre) {
      query = query.eq('genre', genre);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Apply search with SQL wildcard escaping for security
    if (search) {
      const sanitizedSearch = escapeSqlWildcards(search);
      query = query.or(`title.ilike.%${sanitizedSearch}%,synopsis.ilike.%${sanitizedSearch}%`);
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'latest':
      default:
        query = query.order('last_chapter_at', { ascending: false, nullsFirst: false });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      logger.error('Database error fetching novels', undefined, {
        errorMessage: error.message,
        errorCode: error.code,
      });
      return ApiErrors.internal();
    }

    const novels =
      data?.map((novel) => ({
        id: novel.id,
        title: novel.title,
        authorId: novel.author_id,
        author: novel.author
          ? {
              id: novel.author.id,
              penName: novel.author.pen_name,
              tier: novel.author.tier,
            }
          : null,
        genre: novel.genre,
        tags: novel.tags || [],
        coverUrl: novel.cover_url,
        synopsis: novel.synopsis,
        totalChapters: novel.total_chapters,
        totalWords: novel.total_words,
        viewCount: novel.view_count,
        likeCount: novel.like_count,
        favoriteCount: novel.favorite_count,
        rating: novel.rating,
        ratingCount: novel.rating_count,
        status: novel.status,
        isExclusive: novel.is_exclusive,
        freeChapters: novel.free_chapters,
        coinPrice: novel.coin_price,
        createdAt: novel.created_at,
        updatedAt: novel.updated_at,
        lastChapterAt: novel.last_chapter_at,
      })) || [];

    return NextResponse.json({
      success: true,
      data: novels,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error('Unexpected error in GET /api/novels', error instanceof Error ? error : undefined);
    return ApiErrors.internal();
  }
}
