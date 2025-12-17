import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { PAGINATION } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { Notification, NotificationType, NotificationPreferences } from '@/types';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'chapter_update',
    title: '새 화 업데이트',
    message: '"회귀자의 무한 성장" 451화가 업데이트되었습니다.',
    imageUrl: '/covers/regression-growth.jpg',
    linkUrl: '/novel/rec-1/chapter/451',
    novelId: 'rec-1',
    chapterId: 'chapter-451',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'comment_reply',
    title: '댓글 답글',
    message: '회원님의 댓글에 새로운 답글이 달렸습니다.',
    linkUrl: '/novel/rec-2/chapter/150#comment-123',
    novelId: 'rec-2',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'achievement',
    title: '업적 달성!',
    message: '"책벌레" 업적을 달성했습니다! 200 코인 지급!',
    imageUrl: '/achievements/bookworm.png',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'author_new_work',
    title: '새 작품 연재 시작',
    message: '팔로우 중인 "김작가"님이 새 작품을 연재합니다.',
    imageUrl: '/authors/author-1.jpg',
    linkUrl: '/novel/new-1',
    authorId: 'author-1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2일 전
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    type: 'event',
    title: '연말 이벤트',
    message: '연말 특별 이벤트! 모든 코인 충전 20% 보너스!',
    imageUrl: '/events/year-end.jpg',
    linkUrl: '/events/year-end-2024',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3일 전
  },
  {
    id: 'notif-6',
    userId: 'user-1',
    type: 'coin_received',
    title: '코인 지급',
    message: '출석 체크 보상으로 10 코인이 지급되었습니다.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4일 전
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    type: 'follow',
    title: '새 팔로워',
    message: '"소설매니아"님이 회원님을 팔로우합니다.',
    linkUrl: '/profile/user-999',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5일 전
  },
  {
    id: 'notif-8',
    userId: 'user-1',
    type: 'system',
    title: '시스템 공지',
    message: '서비스 이용약관이 변경되었습니다. 확인해주세요.',
    linkUrl: '/terms',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7일 전
  },
];

// Default notification preferences
const defaultPreferences: Omit<NotificationPreferences, 'userId'> = {
  chapterUpdates: true,
  authorNewWorks: true,
  commentReplies: true,
  commentLikes: true,
  follows: true,
  achievements: true,
  systemNotices: true,
  events: true,
  emailNotifications: false,
  pushNotifications: true,
};

// Validation schemas
const markReadSchema = z.object({
  notificationIds: z.array(z.string()).min(1).max(100),
});

const updatePreferencesSchema = z.object({
  chapterUpdates: z.boolean().optional(),
  authorNewWorks: z.boolean().optional(),
  commentReplies: z.boolean().optional(),
  commentLikes: z.boolean().optional(),
  follows: z.boolean().optional(),
  achievements: z.boolean().optional(),
  systemNotices: z.boolean().optional(),
  events: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
});

// GET /api/notifications - Get user notifications
async function handleGetNotifications(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type') as NotificationType | null;
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10),
    PAGINATION.MAX_LIMIT
  );

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  let filtered = mockNotifications.filter((n) => n.userId === userId);

  if (type) {
    filtered = filtered.filter((n) => n.type === type);
  }

  if (unreadOnly) {
    filtered = filtered.filter((n) => !n.isRead);
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const notifications = filtered.slice(offset, offset + limit);

  const unreadCount = mockNotifications.filter((n) => n.userId === userId && !n.isRead).length;

  return apiSuccess({
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

// POST /api/notifications/read - Mark notifications as read
async function handleMarkAsRead(request: NextRequest) {
  const body = await request.json();
  const result = markReadSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { notificationIds } = result.data;

  // In real implementation, update database
  const updatedCount = notificationIds.length;

  return apiSuccess({
    message: `${updatedCount}개의 알림을 읽음 처리했습니다.`,
    updatedCount,
  });
}

// GET /api/notifications/preferences - Get notification preferences
async function handleGetPreferences(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  // In real implementation, fetch from database
  const preferences: NotificationPreferences = {
    userId,
    ...defaultPreferences,
  };

  return apiSuccess(preferences);
}

// PUT /api/notifications/preferences - Update notification preferences
async function handleUpdatePreferences(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const body = await request.json();
  const result = updatePreferencesSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  // In real implementation, update database
  const updatedPreferences: NotificationPreferences = {
    userId,
    ...defaultPreferences,
    ...result.data,
  };

  return apiSuccess({
    message: '알림 설정이 업데이트되었습니다.',
    preferences: updatedPreferences,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'preferences') {
      return handleGetPreferences(request);
    }

    return handleGetNotifications(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    return handleMarkAsRead(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    return handleUpdatePreferences(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
