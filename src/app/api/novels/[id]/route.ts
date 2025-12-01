import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: novel, error } = await supabase
      .from('novels')
      .select(`
        *,
        author:authors(*)
      `)
      .eq('id', id)
      .single();

    if (error || !novel) {
      return NextResponse.json(
        { success: false, error: '작품을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from('novels')
      .update({ view_count: novel.view_count + 1 })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      data: {
        id: novel.id,
        title: novel.title,
        authorId: novel.author_id,
        author: novel.author ? {
          id: novel.author.id,
          userId: novel.author.user_id,
          penName: novel.author.pen_name,
          bio: novel.author.bio,
          tier: novel.author.tier,
          totalNovels: novel.author.total_novels,
          totalWords: novel.author.total_words,
          totalViews: novel.author.total_views,
          totalFollowers: novel.author.total_followers,
          isExclusive: novel.author.is_exclusive,
          createdAt: novel.author.created_at,
          verifiedAt: novel.author.verified_at,
        } : null,
        genre: novel.genre,
        tags: novel.tags || [],
        coverUrl: novel.cover_url,
        synopsis: novel.synopsis,
        totalChapters: novel.total_chapters,
        totalWords: novel.total_words,
        viewCount: novel.view_count + 1,
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
      },
    });
  } catch (error) {
    console.error('Get novel error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
