'use client';

import { useState, useEffect, useMemo } from 'react';

import type { SharePlatform } from '@/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: string;
  title: string;
  synopsis: string;
  coverUrl?: string;
}

const SHARE_PLATFORMS: { id: SharePlatform; name: string; icon: string; color: string }[] = [
  { id: 'kakao', name: '카카오톡', icon: '💬', color: 'bg-yellow-400 hover:bg-yellow-500' },
  { id: 'twitter', name: 'X (Twitter)', icon: '🐦', color: 'bg-black hover:bg-gray-800' },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'link', name: '링크 복사', icon: '🔗', color: 'bg-gray-500 hover:bg-gray-600' },
];

export function ShareModal({ isOpen, onClose, novelId, title, synopsis }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/novel/${novelId}`;
    }
    return '';
  }, [novelId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleShare(platform: SharePlatform) {
    const shareText = `${title}\n${synopsis.slice(0, 100)}...`;

    switch (platform) {
      case 'kakao': {
        // Kakao SDK would be initialized elsewhere
        const win = window as unknown as {
          Kakao?: { Share?: { sendDefault: (config: Record<string, unknown>) => void } };
        };
        if (typeof window !== 'undefined' && win.Kakao?.Share) {
          win.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title,
              description: synopsis.slice(0, 100),
              imageUrl: `${window.location.origin}/og-image/${novelId}`,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: '읽으러 가기',
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        } else {
          // Fallback: open Kakao story
          window.open(
            `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
          );
        }
        break;
      }

      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;

      case 'link':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Failed to copy:', error);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: synopsis.slice(0, 100),
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">공유하기</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Novel Preview */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-2">{title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{synopsis}</p>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              공유하기
            </button>
          )}

          {/* Platform Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {SHARE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-14 h-14 rounded-full ${platform.color} flex items-center justify-center text-white text-2xl transition-transform hover:scale-105`}
                >
                  {platform.icon}
                </div>
                <span className="text-xs text-gray-600">
                  {platform.id === 'link' && copied ? '복사됨!' : platform.name}
                </span>
              </button>
            ))}
          </div>

          {/* Share URL */}
          <div className="mt-6">
            <label htmlFor="share-url" className="text-sm text-gray-500 mb-2 block">
              공유 링크
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-url"
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600"
              />
              <button
                onClick={() => handleShare('link')}
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 whitespace-nowrap"
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
