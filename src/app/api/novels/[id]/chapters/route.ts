import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const order = searchParams.get('order') || 'asc';

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('chapters')
      .select('id, novel_id, number, title, word_count, access_type, coin_price, free_at, view_count, like_count, comment_count, published_at, created_at', { count: 'exact' })
      .eq('novel_id', id)
      .order('number', { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get chapters error:', error);
      return NextResponse.json(
        { success: false, error: '챕터 목록을 불러오는데 실패했습니다' },
        { status: 500 }
      );
    }

    const chapters = data?.map((chapter) => ({
      id: chapter.id,
      novelId: chapter.novel_id,
      number: chapter.number,
      title: chapter.title,
      wordCount: chapter.word_count,
      accessType: chapter.access_type,
      coinPrice: chapter.coin_price,
      freeAt: chapter.free_at,
      viewCount: chapter.view_count,
      likeCount: chapter.like_count,
      commentCount: chapter.comment_count,
      publishedAt: chapter.published_at,
      createdAt: chapter.created_at,
    })) || [];

    return NextResponse.json({
      success: true,
      data: chapters,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get chapters error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
