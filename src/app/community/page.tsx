'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import type { ForumPost, ForumCategory } from '@/types';

const CATEGORY_LABELS: Record<ForumCategory, { label: string; icon: string }> = {
  general: { label: '자유게시판', icon: '💬' },
  recommendations: { label: '추천', icon: '⭐' },
  reviews: { label: '리뷰', icon: '📝' },
  fanart: { label: '팬아트', icon: '🎨' },
  theories: { label: '이론/고찰', icon: '🔍' },
  author_qna: { label: '작가 Q&A', icon: '✍️' },
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ForumCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'comments'>('recent');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sort', sortBy);
      if (activeCategory !== 'all') {
        params.set('category', activeCategory);
      }

      const response = await fetch(`/api/community?${params}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function formatTime(date: Date): string {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) {
      return '방금 전';
    }
    if (hours < 24) {
      return `${hours}시간 전`;
    }
    if (days < 7) {
      return `${days}일 전`;
    }
    return d.toLocaleDateString('ko-KR');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-lg font-semibold">커뮤니티</h1>
            </div>

            <Link
              href="/community/write"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              글쓰기
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {(Object.keys(CATEGORY_LABELS) as ForumCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{CATEGORY_LABELS[cat].icon}</span>
                <span>{CATEGORY_LABELS[cat].label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Sort Options */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'recent', label: '최신순' },
            { id: 'popular', label: '인기순' },
            { id: 'comments', label: '댓글순' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id as 'recent' | 'popular' | 'comments')}
              className={`text-sm ${
                sortBy === option.id ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500 mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-medium text-gray-800">게시글이 없습니다</h2>
            <p className="text-gray-500 mt-2">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} formatTime={formatTime} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PostCard({ post, formatTime }: { post: ForumPost; formatTime: (date: Date) => string }) {
  return (
    <Link href={`/community/${post.id}`}>
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
            {post.user?.username.charAt(0) || '?'}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              {post.isPinned ? (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">📌 고정</span>
              ) : null}
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                {CATEGORY_LABELS[post.category].icon} {CATEGORY_LABELS[post.category].label}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-medium mt-1 line-clamp-1">{post.title}</h3>

            {/* Preview */}
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-blue-500">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span>{post.user?.username}</span>
              <span>{formatTime(post.createdAt)}</span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {post.viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">❤️ {post.likeCount.toLocaleString()}</span>
              <span className="flex items-center gap-1">💬 {post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
