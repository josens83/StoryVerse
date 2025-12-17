import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { Bookmark, Highlight, TTSSettings, DictionaryEntry } from '@/types';

// Default TTS settings
const defaultTTSSettings: TTSSettings = {
  enabled: false,
  voice: 'ko-KR-Standard-A',
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoPlay: false,
  highlightText: true,
};

// Mock bookmarks data
const mockBookmarks: Bookmark[] = [
  {
    id: 'bm-1',
    userId: 'user-1',
    novelId: 'novel-1',
    chapterId: 'chapter-50',
    position: 1250,
    note: '중요한 복선!',
    color: '#FFD700',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'bm-2',
    userId: 'user-1',
    novelId: 'novel-1',
    chapterId: 'chapter-120',
    position: 3400,
    note: '감동적인 장면',
    color: '#FF6B6B',
    createdAt: new Date('2024-12-14'),
  },
];

// Mock highlights data
const mockHighlights: Highlight[] = [
  {
    id: 'hl-1',
    userId: 'user-1',
    novelId: 'novel-1',
    chapterId: 'chapter-50',
    startPosition: 1200,
    endPosition: 1350,
    text: '그의 눈빛이 차갑게 빛났다. 이것이 바로 그가 기다려온 순간이었다.',
    note: '주인공의 각성 순간',
    color: '#FFEB3B',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'hl-2',
    userId: 'user-1',
    novelId: 'novel-1',
    chapterId: 'chapter-75',
    startPosition: 2100,
    endPosition: 2250,
    text: '진정한 강함이란 자신을 지키는 것이 아니라 소중한 것을 지키는 것이다.',
    color: '#4CAF50',
    createdAt: new Date('2024-12-12'),
  },
];

// Mock dictionary entries
const mockDictionary: Record<string, DictionaryEntry> = {
  회귀: {
    word: '회귀',
    reading: '회귀',
    definitions: [
      {
        partOfSpeech: '명사',
        meaning: '본래의 상태나 위치로 되돌아감',
        examples: ['주인공은 과거로 회귀했다.'],
      },
      {
        partOfSpeech: '명사 (웹소설)',
        meaning: '죽거나 특정 시점에서 과거로 되돌아가는 것',
        examples: ['회귀물의 주인공은 대부분 전생의 기억을 가지고 있다.'],
      },
    ],
    synonyms: ['귀환', '복귀', '되돌아감'],
    relatedWords: ['회귀물', '타임슬립', '환생'],
  },
  먼치킨: {
    word: '먼치킨',
    reading: '먼치킨',
    definitions: [
      {
        partOfSpeech: '명사 (웹소설)',
        meaning: '압도적인 능력을 가진 캐릭터 또는 그런 캐릭터가 등장하는 작품',
        examples: ['이 작품은 전형적인 먼치킨 장르입니다.'],
      },
    ],
    synonyms: ['치트키', 'OP주인공'],
    relatedWords: ['성장물', '사이다', '고인물'],
  },
  고인물: {
    word: '고인물',
    reading: '고인물',
    definitions: [
      {
        partOfSpeech: '명사 (웹소설)',
        meaning: '특정 분야에서 오래 활동하여 매우 숙련된 사람',
        examples: ['주인공은 게임 고인물이었다.'],
      },
    ],
    synonyms: ['베테랑', '전문가', '숙련자'],
    relatedWords: ['먼치킨', '뉴비', '초보'],
  },
};

// Validation schemas
const bookmarkSchema = z.object({
  userId: z.string().min(1),
  novelId: z.string().min(1),
  chapterId: z.string().min(1),
  position: z.number().min(0),
  note: z.string().max(200).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

const highlightSchema = z.object({
  userId: z.string().min(1),
  novelId: z.string().min(1),
  chapterId: z.string().min(1),
  startPosition: z.number().min(0),
  endPosition: z.number().min(0),
  text: z.string().min(1).max(500),
  note: z.string().max(200).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

const ttsSettingsSchema = z.object({
  userId: z.string().min(1),
  enabled: z.boolean().optional(),
  voice: z.string().optional(),
  speed: z.number().min(0.5).max(2.0).optional(),
  pitch: z.number().min(0.5).max(2.0).optional(),
  volume: z.number().min(0).max(1).optional(),
  autoPlay: z.boolean().optional(),
  highlightText: z.boolean().optional(),
});

// GET /api/reader - Get reader data (bookmarks, highlights, settings)
async function handleGetReaderData(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const novelId = searchParams.get('novelId');
  const chapterId = searchParams.get('chapterId');
  const type = searchParams.get('type'); // bookmarks, highlights, tts, dictionary, all

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  if (type === 'dictionary') {
    const word = searchParams.get('word');
    if (!word) {
      return apiError('검색어를 입력해주세요.', 400);
    }
    const entry = mockDictionary[word];
    if (!entry) {
      return apiSuccess({ found: false, word });
    }
    return apiSuccess({ found: true, entry });
  }

  if (type === 'tts') {
    // Return TTS settings
    return apiSuccess({ settings: defaultTTSSettings });
  }

  let bookmarks = mockBookmarks.filter((b) => b.userId === userId);
  let highlights = mockHighlights.filter((h) => h.userId === userId);

  if (novelId) {
    bookmarks = bookmarks.filter((b) => b.novelId === novelId);
    highlights = highlights.filter((h) => h.novelId === novelId);
  }

  if (chapterId) {
    bookmarks = bookmarks.filter((b) => b.chapterId === chapterId);
    highlights = highlights.filter((h) => h.chapterId === chapterId);
  }

  if (type === 'bookmarks') {
    return apiSuccess({ bookmarks });
  }

  if (type === 'highlights') {
    return apiSuccess({ highlights });
  }

  return apiSuccess({
    bookmarks,
    highlights,
    ttsSettings: defaultTTSSettings,
  });
}

// POST /api/reader/bookmark - Create a bookmark
async function handleCreateBookmark(request: NextRequest) {
  const body = await request.json();
  const result = bookmarkSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const newBookmark: Bookmark = {
    id: `bm-${Date.now()}`,
    ...result.data,
    color: result.data.color || '#FFD700',
    createdAt: new Date(),
  };

  mockBookmarks.push(newBookmark);

  return apiSuccess(
    {
      message: '북마크가 추가되었습니다.',
      bookmark: newBookmark,
    },
    undefined,
    201
  );
}

// POST /api/reader/highlight - Create a highlight
async function handleCreateHighlight(request: NextRequest) {
  const body = await request.json();
  const result = highlightSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const newHighlight: Highlight = {
    id: `hl-${Date.now()}`,
    ...result.data,
    color: result.data.color || '#FFEB3B',
    createdAt: new Date(),
  };

  mockHighlights.push(newHighlight);

  return apiSuccess(
    {
      message: '하이라이트가 추가되었습니다.',
      highlight: newHighlight,
    },
    undefined,
    201
  );
}

// PUT /api/reader/tts - Update TTS settings
async function handleUpdateTTSSettings(request: NextRequest) {
  const body = await request.json();
  const result = ttsSettingsSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { userId: _userId, ...settings } = result.data;
  const updatedSettings: TTSSettings = {
    ...defaultTTSSettings,
    ...settings,
  };

  return apiSuccess({
    message: 'TTS 설정이 저장되었습니다.',
    settings: updatedSettings,
  });
}

// DELETE /api/reader/bookmark - Delete a bookmark
async function handleDeleteBookmark(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookmarkId = searchParams.get('bookmarkId');

  if (!bookmarkId) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  const index = mockBookmarks.findIndex((b) => b.id === bookmarkId);
  if (index === -1) {
    return apiError('북마크를 찾을 수 없습니다.', 404);
  }

  mockBookmarks.splice(index, 1);

  return apiSuccess({ message: '북마크가 삭제되었습니다.' });
}

export async function GET(request: NextRequest) {
  try {
    return handleGetReaderData(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'highlight') {
      return handleCreateHighlight(request);
    }

    return handleCreateBookmark(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    return handleUpdateTTSSettings(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    return handleDeleteBookmark(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
