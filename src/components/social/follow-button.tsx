'use client';

import { useState, useEffect } from 'react';

interface FollowButtonProps {
  followerId: string;
  followingId: string;
  followType: 'user' | 'author';
  initialFollowing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  followerId,
  followingId,
  followType,
  initialFollowing = false,
  size = 'md',
  variant = 'default',
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Check initial follow status
    async function checkFollowStatus() {
      try {
        const response = await fetch(
          `/api/follow?action=check&followerId=${followerId}&followingId=${followingId}`
        );
        const data = await response.json();

        if (data.success) {
          setIsFollowing(data.data.isFollowing);
        }
      } catch (error) {
        console.error('Failed to check follow status:', error);
      }
    }

    if (!initialFollowing) {
      checkFollowStatus();
    }
  }, [followerId, followingId, initialFollowing]);

  async function handleFollow() {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId, followingId, followType }),
      });

      const data = await response.json();

      if (data.success) {
        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (error) {
      console.error('Failed to follow:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnfollow() {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId, followingId }),
      });

      const data = await response.json();

      if (data.success) {
        setIsFollowing(false);
        setShowConfirm(false);
        onFollowChange?.(false);
      }
    } catch (error) {
      console.error('Failed to unfollow:', error);
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  const baseClasses = `font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${sizeClasses[size]}`;

  if (isFollowing) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConfirm(true)}
          onMouseLeave={() => setShowConfirm(false)}
          disabled={loading}
          className={`${baseClasses} ${
            variant === 'outline'
              ? 'border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <Spinner />
          ) : showConfirm ? (
            <>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              언팔로우
            </>
          ) : (
            <>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              팔로잉
            </>
          )}
        </button>

        {showConfirm ? (
          <div className="absolute top-full left-0 mt-1 z-10">
            <button
              onClick={handleUnfollow}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg hover:bg-red-600 whitespace-nowrap"
            >
              언팔로우 확인
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`${baseClasses} ${
        variant === 'outline'
          ? 'border border-blue-500 text-blue-500 hover:bg-blue-50'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          팔로우
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
