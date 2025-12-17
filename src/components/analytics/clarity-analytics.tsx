'use client';

/**
 * Microsoft Clarity Analytics Integration
 *
 * 챕터 20.6에서 권장하는 무료 사용자 행동 분석 도구
 * 세션 녹화, 히트맵, 분노 클릭 감지 기능 제공
 *
 * 사용법:
 * 1. https://clarity.microsoft.com 에서 프로젝트 생성
 * 2. 환경 변수 NEXT_PUBLIC_CLARITY_ID에 프로젝트 ID 설정
 * 3. RootLayout에 <ClarityAnalytics /> 추가
 *
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 20.6
 * @see https://clarity.microsoft.com
 */

import Script from 'next/script';

interface ClarityAnalyticsProps {
  /** Clarity 프로젝트 ID (환경 변수로 설정 권장) */
  projectId?: string;
  /** 개발 환경에서 비활성화 (기본: true) */
  disableInDev?: boolean;
}

/**
 * Microsoft Clarity 분석 스크립트 컴포넌트
 *
 * @example
 * // app/layout.tsx
 * import { ClarityAnalytics } from '@/components/analytics/clarity-analytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ClarityAnalytics />
 *       </body>
 *     </html>
 *   );
 * }
 */
export function ClarityAnalytics({
  projectId = process.env.NEXT_PUBLIC_CLARITY_ID,
  disableInDev = true,
}: ClarityAnalyticsProps) {
  // 개발 환경에서 비활성화
  if (disableInDev && process.env.NODE_ENV === 'development') {
    return null;
  }

  // 프로젝트 ID가 없으면 렌더링하지 않음
  if (!projectId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[ClarityAnalytics] NEXT_PUBLIC_CLARITY_ID가 설정되지 않았습니다. ' +
          'Microsoft Clarity 대시보드에서 프로젝트 ID를 확인하세요.'
      );
    }
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}

/**
 * Clarity 이벤트 추적 유틸리티
 *
 * @example
 * // 커스텀 이벤트 추적
 * import { clarityEvent } from '@/components/analytics/clarity-analytics';
 *
 * clarityEvent('purchase', 'completed');
 * clarityEvent('button_click', 'subscribe_cta');
 */
export function clarityEvent(eventName: string, eventValue?: string): void {
  if (typeof window !== 'undefined' && 'clarity' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity('event', eventName, eventValue);
  }
}

/**
 * Clarity 사용자 식별 유틸리티
 * 로그인한 사용자를 식별하여 세션을 연결
 *
 * @example
 * // 로그인 후 사용자 식별
 * import { clarityIdentify } from '@/components/analytics/clarity-analytics';
 *
 * clarityIdentify('user_123', 'premium');
 */
export function clarityIdentify(userId: string, sessionId?: string, pageName?: string): void {
  if (typeof window !== 'undefined' && 'clarity' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity('identify', userId, sessionId, pageName);
  }
}

/**
 * Clarity 커스텀 태그 설정 유틸리티
 * 세션에 추가 메타데이터를 첨부
 *
 * @example
 * // 사용자 구독 상태 태그
 * import { clarityTag } from '@/components/analytics/clarity-analytics';
 *
 * clarityTag('subscription', 'vip');
 * clarityTag('referrer', 'google');
 */
export function clarityTag(key: string, value: string): void {
  if (typeof window !== 'undefined' && 'clarity' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity('set', key, value);
  }
}

/**
 * Clarity 동의 관리 유틸리티
 * GDPR/개인정보 보호를 위한 동의 상태 설정
 *
 * @example
 * // 쿠키 동의 후 Clarity 활성화
 * import { clarityConsent } from '@/components/analytics/clarity-analytics';
 *
 * clarityConsent(true); // 동의
 * clarityConsent(false); // 거부
 */
export function clarityConsent(hasConsent: boolean): void {
  if (typeof window !== 'undefined' && 'clarity' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity('consent', hasConsent);
  }
}

export default ClarityAnalytics;
