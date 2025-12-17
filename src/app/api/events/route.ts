import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { Event, EventParticipation, EventStatus } from '@/types';

// Mock events data
const mockEvents: Event[] = [
  {
    id: 'event-1',
    type: 'seasonal',
    title: '연말 대감사제',
    description:
      '2024년 한 해 동안 스토리버스와 함께해주신 독자분들께 감사드립니다. 특별한 보상을 받아가세요!',
    bannerUrl: '/events/year-end-2024.jpg',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    rewards: [
      { id: 'r1', type: 'coins', name: '감사 코인', description: '200 코인 지급', value: 200 },
      { id: 'r2', type: 'badge', name: '2024 독서왕', description: '특별 뱃지 획득', value: 1 },
      { id: 'r3', type: 'vip_days', name: 'VIP 체험', description: '3일 VIP 이용권', value: 3 },
    ],
    requirements: [
      { type: 'read_chapters', target: 30, current: 0 },
      { type: 'daily_login', target: 7, current: 0 },
    ],
    participants: 15420,
  },
  {
    id: 'event-2',
    type: 'limited',
    title: '신작 론칭 기념',
    description: '"천재 검사의 귀환" 독점 연재 시작! 첫 50화 무료 + 특별 보상!',
    bannerUrl: '/events/new-novel-launch.jpg',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-25'),
    status: 'active',
    rewards: [
      {
        id: 'r4',
        type: 'chapter_unlock',
        name: '무료 해금',
        description: '50화 무료 해금',
        value: 50,
      },
      { id: 'r5', type: 'coins', name: '보너스 코인', description: '50 코인 지급', value: 50 },
    ],
    requirements: [{ type: 'read_chapters', target: 10, current: 0 }],
    participants: 8930,
    maxParticipants: 10000,
  },
  {
    id: 'event-3',
    type: 'milestone',
    title: '100만 회원 돌파!',
    description:
      '스토리버스가 100만 회원을 돌파했습니다! 감사의 마음을 담아 전원에게 선물을 드립니다.',
    bannerUrl: '/events/1m-users.jpg',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    status: 'active',
    rewards: [
      { id: 'r6', type: 'coins', name: '축하 코인', description: '100 코인 지급', value: 100 },
      { id: 'r7', type: 'badge', name: '100만 달성 기념', description: '한정 뱃지', value: 1 },
    ],
    participants: 89500,
  },
  {
    id: 'event-4',
    type: 'collaboration',
    title: '웹툰 X 웹소설 콜라보',
    description: '인기 웹툰 "용사의 귀환"과 함께하는 특별 이벤트! 원작 소설 할인 + 특별 일러스트!',
    bannerUrl: '/events/webtoon-collab.jpg',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-15'),
    status: 'upcoming',
    rewards: [
      {
        id: 'r8',
        type: 'exclusive_content',
        name: '특별 일러스트',
        description: '콜라보 일러스트 5장',
        value: 5,
      },
      { id: 'r9', type: 'coins', name: '할인 쿠폰', description: '30% 할인 쿠폰', value: 30 },
    ],
    participants: 0,
  },
  {
    id: 'event-5',
    type: 'seasonal',
    title: '가을 독서 마라톤',
    description: '선선한 가을, 독서의 계절! 목표 달성하고 푸짐한 보상 받으세요.',
    bannerUrl: '/events/autumn-marathon.jpg',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    status: 'ended',
    rewards: [
      { id: 'r10', type: 'coins', name: '마라톤 보상', description: '최대 500 코인', value: 500 },
    ],
    requirements: [{ type: 'read_chapters', target: 100, current: 100 }],
    participants: 42300,
  },
];

// Mock participation data
const mockParticipations: EventParticipation[] = [
  {
    id: 'part-1',
    userId: 'user-1',
    eventId: 'event-1',
    progress: [
      { type: 'read_chapters', target: 30, current: 18 },
      { type: 'daily_login', target: 7, current: 5 },
    ],
    rewardsEarned: [],
    joinedAt: new Date('2024-12-20'),
  },
  {
    id: 'part-2',
    userId: 'user-1',
    eventId: 'event-3',
    progress: [],
    rewardsEarned: ['r6', 'r7'],
    joinedAt: new Date('2024-12-10'),
    completedAt: new Date('2024-12-10'),
  },
];

// Validation schema
const joinEventSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().min(1),
});

// GET /api/events - Get events list
async function handleGetEvents(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as EventStatus | null;
  const type = searchParams.get('type');

  let filtered = [...mockEvents];

  if (status) {
    filtered = filtered.filter((e) => e.status === status);
  }

  if (type) {
    filtered = filtered.filter((e) => e.type === type);
  }

  // Sort: active first, then upcoming, then ended
  const statusOrder: Record<EventStatus, number> = { active: 0, upcoming: 1, ended: 2 };
  filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return apiSuccess({
    events: filtered,
    counts: {
      active: mockEvents.filter((e) => e.status === 'active').length,
      upcoming: mockEvents.filter((e) => e.status === 'upcoming').length,
      ended: mockEvents.filter((e) => e.status === 'ended').length,
    },
  });
}

// GET /api/events/[id] - Get event details
async function handleGetEventDetails(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');

  if (!eventId) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    return apiError('이벤트를 찾을 수 없습니다.', 404);
  }

  let participation: EventParticipation | undefined;
  if (userId) {
    participation = mockParticipations.find((p) => p.userId === userId && p.eventId === eventId);
  }

  return apiSuccess({
    event,
    participation,
    isParticipating: !!participation,
  });
}

// GET /api/events/my - Get user's participated events
async function handleGetMyEvents(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const participations = mockParticipations.filter((p) => p.userId === userId);
  const eventsWithProgress = participations.map((p) => {
    const event = mockEvents.find((e) => e.id === p.eventId);
    return {
      ...p,
      event,
    };
  });

  return apiSuccess({
    participations: eventsWithProgress,
    stats: {
      total: participations.length,
      completed: participations.filter((p) => p.completedAt).length,
      inProgress: participations.filter((p) => !p.completedAt).length,
    },
  });
}

// POST /api/events/join - Join an event
async function handleJoinEvent(request: NextRequest) {
  const body = await request.json();
  const result = joinEventSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { userId, eventId } = result.data;

  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    return apiError('이벤트를 찾을 수 없습니다.', 404);
  }

  if (event.status !== 'active') {
    return apiError('참여할 수 없는 이벤트입니다.', 400);
  }

  if (event.maxParticipants && event.participants && event.participants >= event.maxParticipants) {
    return apiError('참여 인원이 마감되었습니다.', 400);
  }

  const existing = mockParticipations.find((p) => p.userId === userId && p.eventId === eventId);

  if (existing) {
    return apiError('이미 참여 중인 이벤트입니다.', 400);
  }

  const newParticipation: EventParticipation = {
    id: `part-${Date.now()}`,
    userId,
    eventId,
    progress: event.requirements?.map((r) => ({ ...r, current: 0 })) ?? [],
    rewardsEarned: [],
    joinedAt: new Date(),
  };

  mockParticipations.push(newParticipation);

  return apiSuccess(
    {
      message: '이벤트에 참여했습니다!',
      participation: newParticipation,
    },
    undefined,
    201
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'detail') {
      return handleGetEventDetails(request);
    }

    if (action === 'my') {
      return handleGetMyEvents(request);
    }

    return handleGetEvents(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    return handleJoinEvent(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
