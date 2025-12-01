import { type NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';
import { type Genre } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const genre = searchParams.get('genre') as Genre | null;
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'latest';
    const search = searchParams.get('search');

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

    if (search) {
      query = query.or(`title.ilike.%${search}%,synopsis.ilike.%${search}%`);
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
      console.error('Get novels error:', error);
      return NextResponse.json(
        { success: false, error: '작품 목록을 불러오는데 실패했습니다' },
        { status: 500 }
      );
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
    console.error('Get novels error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
