import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GET } from '@/app/api/novels/route';
import { supabase } from '@/lib/supabase';

// Mock modules
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

function createMockRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/novels');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url.toString(), { method: 'GET' });
}

describe('GET /api/novels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Pagination', () => {
    it('should return paginated results with default values', async () => {
      const mockNovels = [
        {
          id: 'novel-1',
          title: 'Test Novel 1',
          author_id: 'author-1',
          author: { id: 'author-1', pen_name: 'Author One', tier: 'basic' },
          genre: 'fantasy',
          tags: ['magic', 'adventure'],
          cover_url: 'https://example.com/cover1.jpg',
          synopsis: 'A test novel synopsis',
          total_chapters: 100,
          total_words: 500000,
          view_count: 10000,
          like_count: 500,
          favorite_count: 200,
          rating: 4.5,
          rating_count: 100,
          status: 'ongoing',
          is_exclusive: false,
          free_chapters: 10,
          coin_price: 3,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-12-01T00:00:00Z',
          last_chapter_at: '2025-12-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: mockNovels,
          error: null,
          count: 1,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(20);
      expect(data.pagination.total).toBe(1);
    });

    it('should respect custom page and limit parameters', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 50,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ page: '2', limit: '10' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.totalPages).toBe(5);
      expect(mockQuery.range).toHaveBeenCalledWith(10, 19); // offset 10, limit 10
    });

    it('should return 400 for invalid page number', async () => {
      const request = createMockRequest({ page: '-1' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const request = createMockRequest({ limit: '100' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Filtering', () => {
    it('should filter by genre', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ genre: 'fantasy' });
      await GET(request);

      expect(mockQuery.eq).toHaveBeenCalledWith('genre', 'fantasy');
    });

    it('should filter by status', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ status: 'completed' });
      await GET(request);

      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'completed');
    });

    it('should return 400 for invalid genre', async () => {
      const request = createMockRequest({ genre: 'invalid_genre' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for invalid status', async () => {
      const request = createMockRequest({ status: 'invalid_status' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Sorting', () => {
    it('should sort by latest (default)', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest();
      await GET(request);

      expect(mockQuery.order).toHaveBeenCalledWith('last_chapter_at', {
        ascending: false,
        nullsFirst: false,
      });
    });

    it('should sort by popular', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ sort: 'popular' });
      await GET(request);

      expect(mockQuery.order).toHaveBeenCalledWith('view_count', { ascending: false });
    });

    it('should sort by rating', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ sort: 'rating' });
      await GET(request);

      expect(mockQuery.order).toHaveBeenCalledWith('rating', { ascending: false });
    });

    it('should return 400 for invalid sort option', async () => {
      const request = createMockRequest({ sort: 'invalid_sort' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Search', () => {
    it('should search in title and synopsis', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ search: 'dragon' });
      await GET(request);

      expect(mockQuery.or).toHaveBeenCalledWith(
        expect.stringContaining('title.ilike.%dragon%,synopsis.ilike.%dragon%')
      );
    });

    it('should escape SQL wildcards in search', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest({ search: '50%_off' });
      await GET(request);

      // SQL wildcards should be escaped
      expect(mockQuery.or).toHaveBeenCalledWith(expect.stringContaining('50\\%\\_off'));
    });

    it('should return 400 for search query exceeding max length', async () => {
      const request = createMockRequest({ search: 'a'.repeat(101) });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Response Format', () => {
    it('should transform database response to camelCase', async () => {
      const mockNovels = [
        {
          id: 'novel-1',
          title: 'Test Novel',
          author_id: 'author-1',
          author: { id: 'author-1', pen_name: 'Test Author', tier: 'basic' },
          genre: 'fantasy',
          tags: ['magic'],
          cover_url: 'https://example.com/cover.jpg',
          synopsis: 'Synopsis',
          total_chapters: 50,
          total_words: 250000,
          view_count: 5000,
          like_count: 100,
          favorite_count: 50,
          rating: 4.2,
          rating_count: 30,
          status: 'ongoing',
          is_exclusive: true,
          free_chapters: 5,
          coin_price: 5,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-11-01T00:00:00Z',
          last_chapter_at: '2025-11-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: mockNovels,
          error: null,
          count: 1,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      const novel = data.data[0];
      expect(novel.authorId).toBe('author-1');
      expect(novel.author.penName).toBe('Test Author');
      expect(novel.coverUrl).toBe('https://example.com/cover.jpg');
      expect(novel.totalChapters).toBe(50);
      expect(novel.totalWords).toBe(250000);
      expect(novel.viewCount).toBe(5000);
      expect(novel.likeCount).toBe(100);
      expect(novel.favoriteCount).toBe(50);
      expect(novel.ratingCount).toBe(30);
      expect(novel.isExclusive).toBe(true);
      expect(novel.freeChapters).toBe(5);
      expect(novel.coinPrice).toBe(5);
      expect(novel.createdAt).toBe('2025-01-01T00:00:00Z');
      expect(novel.updatedAt).toBe('2025-11-01T00:00:00Z');
      expect(novel.lastChapterAt).toBe('2025-11-01T00:00:00Z');
    });
  });

  describe('Error Handling', () => {
    it('should return 500 on database error', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: '500' },
          count: null,
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as ReturnType<typeof supabase.from>);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });
});
