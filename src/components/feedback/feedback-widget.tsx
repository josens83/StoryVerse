'use client';

/**
 * FeedbackWidget - 인앱 피드백 수집 위젯
 *
 * 챕터 20.6에서 권장하는 저비용 사용자 피드백 수집 도구
 * 화면 우하단에 플로팅 버튼으로 표시되며, 클릭 시 피드백 폼을 표시
 *
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 20.6
 */

import { MessageSquare, X, Send, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 피드백 유형
type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

interface FeedbackWidgetProps {
  /** 위젯 위치 (기본: 우하단) */
  position?: 'bottom-right' | 'bottom-left';
  /** 버튼 표시 지연 시간 (ms) - 페이지 로드 후 표시 */
  showDelay?: number;
  /** 피드백 API 엔드포인트 */
  apiEndpoint?: string;
  /** 버튼 색상 테마 */
  theme?: 'primary' | 'secondary';
}

export function FeedbackWidget({
  position = 'bottom-right',
  showDelay = 3000,
  apiEndpoint = '/api/feedback',
  theme = 'primary',
}: FeedbackWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('improvement');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 지연 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  // 폼 열릴 때 textarea에 포커스
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Escape 키로 닫기
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSubmit = useCallback(async () => {
    if (!feedback.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          message: feedback.trim(),
          page: window.location.pathname,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
        }),
      });

      if (!response.ok) {
        throw new Error('피드백 전송에 실패했습니다');
      }

      setIsSubmitted(true);

      // 2초 후 폼 닫기 및 초기화
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setFeedback('');
        setFeedbackType('improvement');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  }, [feedback, feedbackType, apiEndpoint]);

  const feedbackTypes: { value: FeedbackType; label: string; emoji: string }[] = [
    { value: 'bug', label: '버그', emoji: '🐛' },
    { value: 'feature', label: '기능 요청', emoji: '💡' },
    { value: 'improvement', label: '개선 제안', emoji: '✨' },
    { value: 'other', label: '기타', emoji: '💬' },
  ];

  if (!isVisible) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'right-4',
    'bottom-left': 'left-4',
  };

  const buttonThemeClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 z-50 h-12 w-12 rounded-full shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-200 hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
          positionClasses[position],
          buttonThemeClasses[theme],
          isOpen && 'scale-0 opacity-0'
        )}
        aria-label="피드백 보내기"
        aria-expanded={isOpen}
        aria-controls="feedback-form"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {/* 피드백 폼 */}
      {isOpen ? (
        <div
          ref={formRef}
          id="feedback-form"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className={cn(
            'fixed bottom-20 z-50 w-80',
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-xl',
            'animate-in slide-in-from-bottom-4 fade-in duration-200',
            positionClasses[position]
          )}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 id="feedback-title" className="font-semibold text-gray-900 dark:text-gray-100">
              피드백 보내기
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="닫기"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="p-4">
            {isSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-3 font-medium text-gray-900 dark:text-gray-100">감사합니다!</p>
                <p className="mt-1 text-sm text-gray-500">소중한 피드백이 전송되었습니다.</p>
              </div>
            ) : (
              <>
                {/* 피드백 유형 선택 */}
                <fieldset className="mb-4">
                  <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    유형
                  </legend>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="피드백 유형 선택">
                    {feedbackTypes.map(({ value, label, emoji }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFeedbackType(value)}
                        className={cn(
                          'px-3 py-1.5 text-sm rounded-full border transition-colors',
                          feedbackType === value
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                        )}
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* 피드백 입력 */}
                <div className="mb-4">
                  <label
                    htmlFor="feedback-message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    내용
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="feedback-message"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="개선 아이디어, 버그, 불편한 점 등을 알려주세요..."
                    rows={4}
                    className={cn(
                      'w-full px-3 py-2 text-sm rounded-lg border resize-none',
                      'bg-white dark:bg-gray-800',
                      'border-gray-300 dark:border-gray-600',
                      'placeholder:text-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                      'transition-colors'
                    )}
                    aria-describedby={error ? 'feedback-error' : undefined}
                  />
                </div>

                {/* 에러 메시지 */}
                {error ? (
                  <p id="feedback-error" className="mb-4 text-sm text-red-500">
                    {error}
                  </p>
                ) : null}

                {/* 전송 버튼 */}
                <Button
                  onClick={handleSubmit}
                  disabled={!feedback.trim() || isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  {!isSubmitting && <Send className="mr-2 h-4 w-4" />}
                  {isSubmitting ? '전송 중...' : '보내기'}
                </Button>

                {/* 안내 문구 */}
                <p className="mt-3 text-xs text-center text-gray-400">
                  현재 페이지 정보가 함께 전송됩니다
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default FeedbackWidget;
