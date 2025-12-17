/**
 * Feedback API Route
 *
 * 사용자 피드백을 수집하는 API 엔드포인트
 * 챕터 20.6에서 권장하는 저비용 피드백 수집 시스템의 일부
 *
 * @module api/feedback
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 20.6
 */

import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { sanitizeString } from '@/lib/security';

// 피드백 유형 정의
const FeedbackType = z.enum(['bug', 'feature', 'improvement', 'other']);
type FeedbackType = z.infer<typeof FeedbackType>;

// 피드백 스키마
const feedbackSchema = z.object({
  type: FeedbackType,
  message: z
    .string()
    .min(1, '피드백 내용을 입력해주세요')
    .max(2000, '피드백은 2000자까지 입력 가능합니다'),
  page: z.string().optional(),
  url: z.string().url().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string().datetime().optional(),
  screenSize: z.string().optional(),
});

// 피드백 타입 인터페이스
interface Feedback {
  id: string;
  type: FeedbackType;
  message: string;
  page?: string;
  url?: string;
  userAgent?: string;
  screenSize?: string;
  createdAt: Date;
  status: 'new' | 'reviewed' | 'resolved' | 'dismissed';
}

// 메모리 저장소 (프로덕션에서는 DB 사용)
const feedbackStore: Feedback[] = [];

/**
 * POST /api/feedback
 * 새로운 피드백을 제출합니다
 */
async function handleCreateFeedback(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);

    // 콘텐츠 새니타이즈
    const sanitizedMessage = sanitizeString(validatedData.message);

    // 새 피드백 생성
    const newFeedback: Feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: validatedData.type,
      message: sanitizedMessage,
      page: validatedData.page,
      url: validatedData.url,
      userAgent: validatedData.userAgent,
      screenSize: validatedData.screenSize,
      createdAt: new Date(),
      status: 'new',
    };

    // 저장 (프로덕션에서는 DB에 저장)
    feedbackStore.push(newFeedback);

    // 로깅 (프로덕션에서는 Slack/Discord 알림 등으로 대체)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[Feedback Received]', {
        id: newFeedback.id,
        type: newFeedback.type,
        page: newFeedback.page,
        messagePreview: sanitizedMessage.substring(0, 100),
      });
    }

    return apiSuccess(
      {
        id: newFeedback.id,
        received: true,
      },
      '피드백이 성공적으로 전송되었습니다',
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? '입력값이 올바르지 않습니다', 400);
    }
    console.error('Feedback submission error:', error);
    return apiError('피드백 전송 중 오류가 발생했습니다', 500);
  }
}

/**
 * GET /api/feedback
 * 피드백 목록을 조회합니다 (관리자용)
 * 프로덕션에서는 인증/권한 체크 필요
 */
async function handleGetFeedback(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type') as FeedbackType | null;
  const status = searchParams.get('status') as Feedback['status'] | null;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);

  let feedbacks = [...feedbackStore];

  // 타입 필터링
  if (type) {
    feedbacks = feedbacks.filter((f) => f.type === type);
  }

  // 상태 필터링
  if (status) {
    feedbacks = feedbacks.filter((f) => f.status === status);
  }

  // 최신순 정렬
  feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 페이지네이션
  const total = feedbacks.length;
  const startIndex = (page - 1) * limit;
  const paginatedFeedbacks = feedbacks.slice(startIndex, startIndex + limit);

  return apiSuccess({
    feedbacks: paginatedFeedbacks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      total: feedbackStore.length,
      new: feedbackStore.filter((f) => f.status === 'new').length,
      byType: {
        bug: feedbackStore.filter((f) => f.type === 'bug').length,
        feature: feedbackStore.filter((f) => f.type === 'feature').length,
        improvement: feedbackStore.filter((f) => f.type === 'improvement').length,
        other: feedbackStore.filter((f) => f.type === 'other').length,
      },
    },
  });
}

export const POST = handleCreateFeedback;
export const GET = handleGetFeedback;
