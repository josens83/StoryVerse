import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { PAGINATION } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';

import type { ForumPost, ForumComment, FanArt, ForumCategory, UserTier } from '@/types';

// Mock forum posts data
const mockPosts: ForumPost[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    user: {
      id: 'user-1',
      email: 'user1@example.com',
      username: '소설마니아',
      tier: 'vip' as UserTier,
      purchasedCoins: 1000,
      earnedCoins: 100,
      totalReadTime: 5000,
      consecutiveCheckIns: 10,
      createdAt: new Date(),
    },
    category: 'recommendations',
    title: '회귀물 입문자를 위한 필독 작품 10선',
    content:
      '회귀물을 처음 접하시는 분들을 위해 제가 직접 읽고 추천하는 작품들을 정리해봤습니다...',
    viewCount: 15420,
    likeCount: 892,
    commentCount: 156,
    isPinned: true,
    isLocked: false,
    tags: ['회귀물', '추천', '입문'],
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'post-2',
    userId: 'user-2',
    user: {
      id: 'user-2',
      email: 'user2@example.com',
      username: '책벌레',
      tier: 'svip' as UserTier,
      purchasedCoins: 5000,
      earnedCoins: 500,
      totalReadTime: 15000,
      consecutiveCheckIns: 30,
      createdAt: new Date(),
    },
    category: 'reviews',
    novelId: 'novel-1',
    title: '[리뷰] 천재 검사의 귀환 - 450화까지 읽은 솔직 후기',
    content: '드디어 450화까지 정주행을 완료했습니다. 결론부터 말씀드리면 강력 추천입니다...',
    viewCount: 8930,
    likeCount: 456,
    commentCount: 89,
    isPinned: false,
    isLocked: false,
    tags: ['리뷰', '천재검사', '추천'],
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
  },
  {
    id: 'post-3',
    userId: 'user-3',
    user: {
      id: 'user-3',
      email: 'user3@example.com',
      username: '이론가',
      tier: 'vip' as UserTier,
      purchasedCoins: 2000,
      earnedCoins: 200,
      totalReadTime: 8000,
      consecutiveCheckIns: 15,
      createdAt: new Date(),
    },
    category: 'theories',
    novelId: 'novel-2',
    title: '[스포주의] 마법사의 두 번째 삶 - 엔딩 예상 이론',
    content: '최근 복선들을 분석해본 결과, 제가 생각하는 엔딩 전개는...',
    viewCount: 5670,
    likeCount: 234,
    commentCount: 178,
    isPinned: false,
    isLocked: false,
    tags: ['스포일러', '이론', '엔딩예상'],
    createdAt: new Date('2024-12-13'),
    updatedAt: new Date('2024-12-13'),
  },
  {
    id: 'post-4',
    userId: 'user-4',
    user: {
      id: 'user-4',
      email: 'user4@example.com',
      username: '작가지망생',
      tier: 'free' as UserTier,
      purchasedCoins: 0,
      earnedCoins: 50,
      totalReadTime: 3000,
      consecutiveCheckIns: 5,
      createdAt: new Date(),
    },
    category: 'general',
    title: '웹소설 입문 6개월차 독자의 소감',
    content: '처음에는 그냥 심심해서 시작했는데 이제는 완전히 빠져버렸네요...',
    viewCount: 2340,
    likeCount: 167,
    commentCount: 45,
    isPinned: false,
    isLocked: false,
    tags: ['일상', '소감', '입문'],
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
  },
];

// Mock forum comments
const mockComments: ForumComment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    userId: 'user-5',
    user: {
      id: 'user-5',
      email: 'user5@example.com',
      username: '회귀덕후',
      tier: 'vip' as UserTier,
      purchasedCoins: 1500,
      earnedCoins: 150,
      totalReadTime: 6000,
      consecutiveCheckIns: 12,
      createdAt: new Date(),
    },
    content: '저도 이 목록으로 입문했는데 정말 좋았어요! 특히 3번 작품 강추합니다.',
    likeCount: 45,
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-11'),
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    userId: 'user-6',
    user: {
      id: 'user-6',
      email: 'user6@example.com',
      username: '독서광',
      tier: 'free' as UserTier,
      purchasedCoins: 0,
      earnedCoins: 30,
      totalReadTime: 2000,
      consecutiveCheckIns: 3,
      createdAt: new Date(),
    },
    content: '5번은 개인적으로 비추천입니다. 중반부터 늘어지더라고요.',
    likeCount: 12,
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
  },
];

// Mock fan arts
const mockFanArts: FanArt[] = [
  {
    id: 'fanart-1',
    userId: 'user-7',
    user: {
      id: 'user-7',
      email: 'user7@example.com',
      username: '그림쟁이',
      tier: 'vip' as UserTier,
      purchasedCoins: 800,
      earnedCoins: 80,
      totalReadTime: 4000,
      consecutiveCheckIns: 8,
      createdAt: new Date(),
    },
    novelId: 'novel-1',
    title: '천재 검사 주인공 팬아트',
    description: '450화 보고 감동받아서 그려봤습니다!',
    imageUrl: '/fanarts/sword-master-1.jpg',
    thumbnailUrl: '/fanarts/thumb/sword-master-1.jpg',
    likeCount: 1234,
    viewCount: 8900,
    tags: ['천재검사', '주인공', '일러스트'],
    createdAt: new Date('2024-12-14'),
  },
  {
    id: 'fanart-2',
    userId: 'user-8',
    user: {
      id: 'user-8',
      email: 'user8@example.com',
      username: '아티스트',
      tier: 'svip' as UserTier,
      purchasedCoins: 3000,
      earnedCoins: 300,
      totalReadTime: 10000,
      consecutiveCheckIns: 20,
      createdAt: new Date(),
    },
    novelId: 'novel-2',
    title: '마법사의 두 번째 삶 - 마법 시전 장면',
    description: '가장 인상깊었던 마법 시전 장면을 그려봤어요',
    imageUrl: '/fanarts/mage-life-1.jpg',
    thumbnailUrl: '/fanarts/thumb/mage-life-1.jpg',
    likeCount: 2156,
    viewCount: 12400,
    tags: ['마법사', '마법', '일러스트'],
    createdAt: new Date('2024-12-13'),
  },
];

// Validation schemas
const createPostSchema = z.object({
  userId: z.string().min(1),
  category: z.enum(['general', 'recommendations', 'reviews', 'fanart', 'theories', 'author_qna']),
  novelId: z.string().optional(),
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(10000),
  tags: z.array(z.string()).max(5).optional(),
});

const createCommentSchema = z.object({
  userId: z.string().min(1),
  postId: z.string().min(1),
  parentId: z.string().optional(),
  content: z.string().min(1).max(1000),
});

// GET /api/community - Get forum posts
async function handleGetPosts(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as ForumCategory | null;
  const novelId = searchParams.get('novelId');
  const sort = searchParams.get('sort') || 'recent'; // recent, popular, comments
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10),
    PAGINATION.MAX_LIMIT
  );

  let filtered = [...mockPosts];

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (novelId) {
    filtered = filtered.filter((p) => p.novelId === novelId);
  }

  // Sort
  switch (sort) {
    case 'popular':
      filtered.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case 'comments':
      filtered.sort((a, b) => b.commentCount - a.commentCount);
      break;
    default:
      // Pinned first, then by date
      filtered.sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const posts = filtered.slice(offset, offset + limit);

  return apiSuccess({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

// GET /api/community/post/[id] - Get post details with comments
async function handleGetPostDetails(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return apiError(ERROR_MESSAGES.VALIDATION.INVALID_PARAMS, 400);
  }

  const post = mockPosts.find((p) => p.id === postId);

  if (!post) {
    return apiError('게시글을 찾을 수 없습니다.', 404);
  }

  const comments = mockComments.filter((c) => c.postId === postId);

  return apiSuccess({
    post,
    comments,
  });
}

// GET /api/community/fanart - Get fan arts
async function handleGetFanArts(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const novelId = searchParams.get('novelId');
  const sort = searchParams.get('sort') || 'recent';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

  let filtered = [...mockFanArts];

  if (novelId) {
    filtered = filtered.filter((f) => f.novelId === novelId);
  }

  switch (sort) {
    case 'popular':
      filtered.sort((a, b) => b.likeCount - a.likeCount);
      break;
    default:
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const fanArts = filtered.slice(offset, offset + limit);

  return apiSuccess({
    fanArts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

// POST /api/community - Create a new post
async function handleCreatePost(request: NextRequest) {
  const body = await request.json();
  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { userId, category, novelId, title, content, tags } = result.data;

  const newPost: ForumPost = {
    id: `post-${Date.now()}`,
    userId,
    category,
    novelId,
    title,
    content,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    isPinned: false,
    isLocked: false,
    tags: tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockPosts.unshift(newPost);

  return apiSuccess(
    {
      message: '게시글이 작성되었습니다.',
      post: newPost,
    },
    undefined,
    201
  );
}

// POST /api/community/comment - Create a comment
async function handleCreateComment(request: NextRequest) {
  const body = await request.json();
  const result = createCommentSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { userId, postId, parentId, content } = result.data;

  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    return apiError('게시글을 찾을 수 없습니다.', 404);
  }

  const newComment: ForumComment = {
    id: `comment-${Date.now()}`,
    postId,
    userId,
    parentId,
    content,
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockComments.push(newComment);
  post.commentCount += 1;

  return apiSuccess(
    {
      message: '댓글이 작성되었습니다.',
      comment: newComment,
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
      return handleGetPostDetails(request);
    }

    if (action === 'fanart') {
      return handleGetFanArts(request);
    }

    return handleGetPosts(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'comment') {
      return handleCreateComment(request);
    }

    return handleCreatePost(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
