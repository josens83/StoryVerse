/**
 * Comment Section Component
 *
 * Displays comments with reply support, likes, and spoiler warnings.
 *
 * @module components/comments/comment-section
 */

'use client';

import { MessageSquare, ThumbsUp, AlertTriangle, ChevronDown, Send, Crown } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import type { Comment } from '@/types';

interface CommentSectionProps {
  novelId?: string;
  chapterId?: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

function UserBadge({ tier }: { tier: string }) {
  if (tier === 'svip') {
    return (
      <Badge variant="svip" size="sm" className="ml-1">
        <Crown className="mr-0.5 h-3 w-3" />
        SVIP
      </Badge>
    );
  }
  if (tier === 'vip') {
    return (
      <Badge variant="vip" size="sm" className="ml-1">
        VIP
      </Badge>
    );
  }
  return null;
}

function CommentItem({ comment, onReply, onLike }: CommentItemProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const loadReplies = async () => {
    if (comment.replyCount === 0) {
      return;
    }

    setIsLoadingReplies(true);
    try {
      const response = await fetch(`/api/comments?parentId=${comment.id}`);
      const data = await response.json();
      if (data.success) {
        setReplies(data.data.comments);
      }
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleShowReplies = () => {
    if (!showReplies && replies.length === 0) {
      loadReplies();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="border-b border-gray-100 py-4 last:border-0 dark:border-gray-800">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {comment.user?.username?.charAt(0) || '?'}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.user?.username || '익명'}
            </span>
            {comment.user?.tier ? <UserBadge tier={comment.user.tier} /> : null}
            <span className="text-xs text-gray-400">
              {formatDate(comment.createdAt, 'relative')}
            </span>
          </div>

          {/* Content */}
          {comment.isSpoiler && !showSpoiler ? (
            <button
              onClick={() => setShowSpoiler(true)}
              className="mt-2 flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
            >
              <AlertTriangle className="h-4 w-4" />
              스포일러 포함 - 클릭하여 보기
            </button>
          ) : (
            <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-sm ${
                comment.isLiked
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              {comment.likeCount > 0 && comment.likeCount}
            </button>

            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <MessageSquare className="h-4 w-4" />
              답글
            </button>

            {comment.replyCount > 0 && (
              <button
                onClick={handleShowReplies}
                className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showReplies ? 'rotate-180' : ''}`}
                />
                답글 {comment.replyCount}개
              </button>
            )}
          </div>

          {/* Replies */}
          {showReplies ? (
            <div className="mt-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
              {isLoadingReplies ? (
                <div className="py-4">
                  <Spinner size="sm" />
                </div>
              ) : (
                replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} onReply={onReply} onLike={onLike} />
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ novelId, chapterId }: CommentSectionProps) {
  const { isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [newComment, setNewComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    if (novelId) {
      params.set('novelId', novelId);
    }
    if (chapterId) {
      params.set('chapterId', chapterId);
    }
    params.set('sort', sort);

    try {
      const response = await fetch(`/api/comments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data.comments);
        setTotalCount(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [novelId, chapterId, sort]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId,
          chapterId,
          parentId: replyTo,
          content: newComment,
          isSpoiler,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment('');
        setIsSpoiler(false);
        setReplyTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    // In production, this would call an API
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1, isLiked: !c.isLiked }
          : c
      )
    );
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
    // Focus on input
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <MessageSquare className="h-5 w-5" />
          댓글 {totalCount > 0 && <span className="text-orange-500">{totalCount}</span>}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setSort('latest')}
            className={`text-sm ${
              sort === 'latest' ? 'font-medium text-orange-500' : 'text-gray-400'
            }`}
          >
            최신순
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setSort('popular')}
            className={`text-sm ${
              sort === 'popular' ? 'font-medium text-orange-500' : 'text-gray-400'
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      {/* Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          {replyTo ? (
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <span>답글 작성 중</span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-orange-500 hover:text-orange-600"
              >
                취소
              </button>
            </div>
          ) : null}

          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-orange-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              maxLength={1000}
            />
            <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              className="rounded border-gray-300"
            />
            스포일러 포함
          </label>
        </form>
      ) : (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            댓글을 작성하려면 로그인이 필요합니다
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            로그인하기
          </Button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <MessageSquare className="mx-auto mb-2 h-8 w-8" />
          <p>첫 번째 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
