/**
 * Comments API Route
 *
 * CRUD operations for comments on novels and chapters.
 *
 * @module api/comments
 */

import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES, PAGINATION } from '@/lib/constants';
import { sanitizeString } from '@/lib/security';

import type { Comment } from '@/types';

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'user1',
    user: { id: 'user1', username: '독서광123', tier: 'vip' },
    novelId: '1',
    content: '정말 재미있는 소설이에요! 매일 기다리면서 읽고 있습니다.',
    likeCount: 234,
    replyCount: 12,
    isSpoiler: false,
    isDeleted: false,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28'),
  },
  {
    id: 'c2',
    userId: 'user2',
    user: { id: 'user2', username: '소설덕후', tier: 'svip' },
    novelId: '1',
    content: '주인공 성장 과정이 너무 좋아요. 작가님 최고!',
    likeCount: 156,
    replyCount: 5,
    isSpoiler: false,
    isDeleted: false,
    createdAt: new Date('2024-11-27'),
    updatedAt: new Date('2024-11-27'),
  },
  {
    id: 'c3',
    userId: 'user3',
    user: { id: 'user3', username: '판타지매니아', tier: 'free' },
    novelId: '1',
    chapterId: 'ch1',
    content: '이번 화 반전 소름돋았어요...',
    likeCount: 89,
    replyCount: 3,
    isSpoiler: true,
    isDeleted: false,
    createdAt: new Date('2024-11-26'),
    updatedAt: new Date('2024-11-26'),
  },
  {
    id: 'c4',
    userId: 'user4',
    user: { id: 'user4', username: '웹소설러버', tier: 'vip' },
    novelId: '1',
    parentId: 'c1',
    content: '저도요! 업데이트 날만 기다려요 ㅎㅎ',
    likeCount: 45,
    replyCount: 0,
    isSpoiler: false,
    isDeleted: false,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28'),
  },
  {
    id: 'c5',
    userId: 'user5',
    user: { id: 'user5', username: '밤새독서', tier: 'free' },
    novelId: '1',
    content: '완결까지 달려봅시다! 응원해요 작가님!',
    likeCount: 78,
    replyCount: 2,
    isSpoiler: false,
    isDeleted: false,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25'),
  },
];

const createCommentSchema = z.object({
  novelId: z.string().optional(),
  chapterId: z.string().optional(),
  parentId: z.string().optional(),
  content: z
    .string()
    .min(1, '댓글 내용을 입력해주세요')
    .max(1000, '댓글은 1000자까지 입력 가능합니다'),
  isSpoiler: z.boolean().default(false),
});

async function handleGetComments(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const novelId = searchParams.get('novelId');
  const chapterId = searchParams.get('chapterId');
  const parentId = searchParams.get('parentId');
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10),
    PAGINATION.MAX_LIMIT
  );

  let comments = [...mockComments];

  // Filter by novelId
  if (novelId) {
    comments = comments.filter((c) => c.novelId === novelId);
  }

  // Filter by chapterId
  if (chapterId) {
    comments = comments.filter((c) => c.chapterId === chapterId);
  }

  // Filter by parentId (for replies)
  if (parentId) {
    comments = comments.filter((c) => c.parentId === parentId);
  } else {
    // Only show top-level comments by default
    comments = comments.filter((c) => !c.parentId);
  }

  // Filter out deleted comments
  comments = comments.filter((c) => !c.isDeleted);

  // Sort
  switch (sort) {
    case 'popular':
      comments.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case 'latest':
    default:
      comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  const total = comments.length;
  const startIndex = (page - 1) * limit;
  const paginatedComments = comments.slice(startIndex, startIndex + limit);

  return apiSuccess({
    comments: paginatedComments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

async function handleCreateComment(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    // Sanitize content
    const sanitizedContent = sanitizeString(validatedData.content);

    // In production, this would create a record in the database
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: 'currentUser', // Would come from auth
      user: { id: 'currentUser', username: '테스트유저', tier: 'free' },
      novelId: validatedData.novelId,
      chapterId: validatedData.chapterId,
      parentId: validatedData.parentId,
      content: sanitizedContent,
      likeCount: 0,
      replyCount: 0,
      isSpoiler: validatedData.isSpoiler,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return apiSuccess(newComment, undefined, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? '입력값이 올바르지 않습니다', 400);
    }
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export const GET = handleGetComments;
export const POST = handleCreateComment;
