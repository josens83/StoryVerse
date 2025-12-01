import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GET } from '@/app/api/novels/[id]/route';
import { supabase } from '@/lib/supabase';

// Mock modules
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

function createMockRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/novels/${id}`, {
    method: 'GET',
  });
}

describe('GET /api/novels/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 when novel not found', async () => {
    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      }),
    };
    vi.mocked(supabase.from).mockReturnValue(mockSelectChain as ReturnType<typeof supabase.from>);

    const request = createMockRequest('non-existent-id');
    const response = await GET(request, { params: Promise.resolve({ id: 'non-existent-id' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('작품을 찾을 수 없습니다');
  });

  it('should return novel details and increment view count', async () => {
    const mockNovel = {
      id: 'novel-123',
      title: 'Epic Fantasy Adventure',
      author_id: 'author-456',
      author: {
        id: 'author-456',
        user_id: 'user-789',
        pen_name: 'Fantasy Writer',
        bio: 'A great author',
        tier: 'premium',
        total_novels: 10,
        total_words: 2000000,
        total_views: 500000,
        total_followers: 10000,
        is_exclusive: true,
        created_at: '2024-01-01T00:00:00Z',
        verified_at: '2024-06-01T00:00:00Z',
      },
      genre: 'fantasy',
      tags: ['magic', 'adventure', 'dragons'],
      cover_url: 'https://example.com/cover.jpg',
      synopsis: 'An epic tale of magic and adventure.',
      total_chapters: 150,
      total_words: 750000,
      view_count: 99999,
      like_count: 5000,
      favorite_count: 2000,
      rating: 4.8,
      rating_count: 500,
      status: 'ongoing',
      is_exclusive: true,
      free_chapters: 20,
      coin_price: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2025-12-01T00:00:00Z',
      last_chapter_at: '2025-12-01T00:00:00Z',
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockNovel,
        error: null,
      }),
    };

    const mockUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };

    let callCount = 0;
    vi.mocked(supabase.from).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return mockSelectChain as ReturnType<typeof supabase.from>;
      }
      return mockUpdateChain as ReturnType<typeof supabase.from>;
    });

    const request = createMockRequest('novel-123');
    const response = await GET(request, { params: Promise.resolve({ id: 'novel-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify novel data
    expect(data.data.id).toBe('novel-123');
    expect(data.data.title).toBe('Epic Fantasy Adventure');
    expect(data.data.viewCount).toBe(100000); // Incremented from 99999

    // Verify author data transformation
    expect(data.data.author.penName).toBe('Fantasy Writer');
    expect(data.data.author.totalNovels).toBe(10);
    expect(data.data.author.totalWords).toBe(2000000);
    expect(data.data.author.totalViews).toBe(500000);
    expect(data.data.author.totalFollowers).toBe(10000);
    expect(data.data.author.isExclusive).toBe(true);

    // Verify novel fields transformation
    expect(data.data.authorId).toBe('author-456');
    expect(data.data.coverUrl).toBe('https://example.com/cover.jpg');
    expect(data.data.totalChapters).toBe(150);
    expect(data.data.totalWords).toBe(750000);
    expect(data.data.likeCount).toBe(5000);
    expect(data.data.favoriteCount).toBe(2000);
    expect(data.data.ratingCount).toBe(500);
    expect(data.data.isExclusive).toBe(true);
    expect(data.data.freeChapters).toBe(20);
    expect(data.data.coinPrice).toBe(5);

    // Verify view count was incremented
    expect(mockUpdateChain.update).toHaveBeenCalledWith({ view_count: 100000 });
  });

  it('should handle novel without author', async () => {
    const mockNovel = {
      id: 'novel-123',
      title: 'Orphaned Novel',
      author_id: 'author-456',
      author: null,
      genre: 'fantasy',
      tags: [],
      cover_url: null,
      synopsis: 'A novel without author info.',
      total_chapters: 10,
      total_words: 50000,
      view_count: 100,
      like_count: 5,
      favorite_count: 2,
      rating: 3.5,
      rating_count: 5,
      status: 'hiatus',
      is_exclusive: false,
      free_chapters: 5,
      coin_price: 3,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-06-01T00:00:00Z',
      last_chapter_at: null,
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockNovel,
        error: null,
      }),
    };

    const mockUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };

    let callCount = 0;
    vi.mocked(supabase.from).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return mockSelectChain as ReturnType<typeof supabase.from>;
      }
      return mockUpdateChain as ReturnType<typeof supabase.from>;
    });

    const request = createMockRequest('novel-123');
    const response = await GET(request, { params: Promise.resolve({ id: 'novel-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.author).toBeNull();
    expect(data.data.tags).toEqual([]);
  });

  it('should return 500 on database error', async () => {
    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockRejectedValue(new Error('Database connection failed')),
    };
    vi.mocked(supabase.from).mockReturnValue(mockSelectChain as ReturnType<typeof supabase.from>);

    const request = createMockRequest('novel-123');
    const response = await GET(request, { params: Promise.resolve({ id: 'novel-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('서버 오류가 발생했습니다');
  });
});
