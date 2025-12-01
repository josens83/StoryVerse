import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import React, { type ReactElement } from 'react';

import { ToastProvider } from '@/components/ui/toast';

// Create a wrapper with all providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  avatar: null,
  tier: 'free' as const,
  vipExpiresAt: null,
  purchasedCoins: 0,
  earnedCoins: 100,
  earnedCoinsExpireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  totalReadTime: 0,
  consecutiveCheckIns: 0,
  lastCheckInAt: null,
  createdAt: new Date(),
  ...overrides,
});

export const createMockAuthor = (overrides = {}) => ({
  id: 'author-1',
  userId: 'user-1',
  penName: 'Test Author',
  bio: 'A test author',
  tier: 'newcomer' as const,
  totalNovels: 1,
  totalWords: 50000,
  totalViews: 1000,
  totalFollowers: 100,
  totalRevenue: 0,
  revenueShareRate: 0.5,
  pendingRevenue: 0,
  withdrawableRevenue: 0,
  isExclusive: false,
  createdAt: new Date(),
  ...overrides,
});

export const createMockNovel = (overrides = {}) => ({
  id: 'novel-1',
  title: 'Test Novel',
  authorId: 'author-1',
  author: createMockAuthor(),
  genre: 'fantasy' as const,
  tags: ['fantasy', 'adventure'],
  coverUrl: 'https://example.com/cover.jpg',
  synopsis: 'A test novel synopsis',
  totalChapters: 100,
  totalWords: 500000,
  viewCount: 10000,
  likeCount: 500,
  favoriteCount: 200,
  rating: 4.5,
  ratingCount: 100,
  status: 'ongoing' as const,
  isExclusive: false,
  freeChapters: 10,
  coinPrice: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastChapterAt: new Date(),
  ...overrides,
});

export const createMockChapter = (overrides = {}) => ({
  id: 'chapter-1',
  novelId: 'novel-1',
  number: 1,
  title: 'Chapter 1: The Beginning',
  content: 'This is the content of chapter 1...',
  wordCount: 3000,
  accessType: 'free' as const,
  coinPrice: 5,
  freeAt: null,
  viewCount: 100,
  likeCount: 10,
  commentCount: 5,
  publishedAt: new Date(),
  createdAt: new Date(),
  ...overrides,
});

export const createMockChapterUnlock = (overrides = {}) => ({
  id: 'unlock-1',
  userId: 'user-1',
  chapterId: 'chapter-1',
  novelId: 'novel-1',
  unlockMethod: 'free' as const,
  coinSpent: 0,
  waitFreeStartedAt: null,
  waitFreeUnlocksAt: null,
  unlockedAt: new Date(),
  expiresAt: null,
  ...overrides,
});

// API response helpers
export const createApiSuccess = <T,>(data: T) => ({
  success: true,
  data,
});

export const createApiError = (error: string, _status = 400) => ({
  success: false,
  error,
});

export const createPaginatedResponse = <T,>(
  data: T[],
  page = 1,
  limit = 20,
  total = data.length
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
