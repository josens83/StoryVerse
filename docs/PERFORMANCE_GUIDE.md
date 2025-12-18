# 성능 최적화 가이드

> Solo Developer Workflow Guide 챕터 18 기반

## 개요

성능은 기능입니다. 느린 웹사이트는 사용자를 떠나게 합니다.

**목표 지표 (Core Web Vitals):**

| 지표 | 목표    | 설명                       |
| ---- | ------- | -------------------------- |
| LCP  | ≤ 2.5초 | 가장 큰 콘텐츠 렌더링 시간 |
| INP  | ≤ 200ms | 인터랙션 응답 시간         |
| CLS  | ≤ 0.1   | 레이아웃 이동 점수         |

## Core Web Vitals 이해하기

### 1. LCP (Largest Contentful Paint)

**측정**: 뷰포트 내 가장 큰 이미지/텍스트 블록 렌더링 시간

```
✅ Good:      ≤ 2.5초
⚠️ Needs Improvement: 2.5초 ~ 4초
❌ Poor:      > 4초
```

**영향 요소**: 서버 응답 시간, 리소스 로딩, 렌더링 차단

### 2. INP (Interaction to Next Paint)

**측정**: 클릭/탭/키 입력 후 시각적 피드백까지 시간

```
✅ Good:      ≤ 200ms
⚠️ Needs Improvement: 200ms ~ 500ms
❌ Poor:      > 500ms
```

**영향 요소**: JavaScript 실행 시간, 메인 스레드 블로킹

### 3. CLS (Cumulative Layout Shift)

**측정**: 페이지 수명 동안 누적된 레이아웃 이동 점수

```
✅ Good:      ≤ 0.1
⚠️ Needs Improvement: 0.1 ~ 0.25
❌ Poor:      > 0.25
```

**영향 요소**: 크기 없는 이미지, 동적 콘텐츠 삽입, 웹폰트 FOUT

## LCP 최적화

### 이미지 최적화

```tsx
import Image from 'next/image';

// ✅ LCP 이미지에 priority 필수
<Image
  src="/hero.jpg"
  alt="메인 배너"
  fill
  priority                    // ← LCP 이미지에 필수!
  sizes="100vw"
  className="object-cover"
/>

// ✅ 스크롤 아래 이미지 (lazy loading 유지)
<Image
  src="/below-fold.jpg"
  alt="하단 이미지"
  width={800}
  height={600}
  // priority 없음 = lazy loading
/>
```

### 서버 응답 최적화

```tsx
// 1. 정적 생성 (SSG) - 가장 빠름
export const dynamic = 'force-static';

// 2. ISR (주기적 재생성)
export const revalidate = 3600; // 1시간

// 3. 스트리밍 SSR (느린 데이터 대응)
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      {/* 즉시 렌더링 */}
      <HeroSection />

      {/* 느린 데이터는 나중에 */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList />
      </Suspense>
    </>
  );
}
```

### 폰트 최적화

```tsx
// app/layout.tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap', // FOUT 방지
  preload: true,
});
```

## INP 최적화

### 코드 분할

```tsx
import dynamic from 'next/dynamic';

// ❌ 모든 코드가 초기 번들에 포함
import HeavyChart from './HeavyChart';

// ✅ 동적 임포트로 코드 분할
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

### useTransition 활용

```tsx
'use client';

import { useState, useTransition } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const value = e.target.value;

    // 긴급: 입력 필드 업데이트 (즉시)
    setQuery(value);

    // 긴급하지 않음: 검색 결과 업데이트 (나중에)
    startTransition(() => {
      const filtered = filterItems(value);
      setResults(filtered);
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <span>검색 중...</span>}
      <ResultsList results={results} />
    </>
  );
}
```

### useDeferredValue 활용

```tsx
'use client';

import { useDeferredValue, memo } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SlowResults query={deferredQuery} />
      </div>
    </>
  );
}

// 메모이제이션으로 불필요한 리렌더 방지
const SlowResults = memo(function SlowResults({ query }) {
  const results = searchItems(query);
  return <ul>{results.map(...)}</ul>;
});
```

## CLS 최적화

### 이미지 크기 예약

```tsx
// ❌ 크기 없는 이미지 (CLS 발생!)
<img src="/photo.jpg" alt="Photo" />

// ✅ 명시적 크기 지정
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>

// ✅ 비율 유지 컨테이너
<div className="relative aspect-video">
  <Image
    src="/video-thumb.jpg"
    alt="Video thumbnail"
    fill
    className="object-cover"
  />
</div>
```

### 동적 콘텐츠 공간 예약

```tsx
// ❌ 광고/배너가 로드되면서 레이아웃 밀림
<div>
  <AdBanner /> {/* 로드 후 200px 차지 */}
  <Content />
</div>

// ✅ 최소 높이로 공간 예약
<div className="min-h-[200px]">
  <AdBanner />
</div>
<Content />
```

### 폰트 CLS 방지

```css
/* font-display: swap 사용 */
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2');
  font-display: swap;
}
```

## 로딩 UX 전략

### 로딩 시간별 권장 전략

| 로딩 시간   | 권장 전략                          |
| ----------- | ---------------------------------- |
| < 100ms     | 아무것도 표시하지 않음             |
| 100ms - 1초 | 미묘한 인디케이터 (버튼 내 스피너) |
| 1초 - 3초   | Skeleton UI                        |
| 3초+        | 진행률 표시 + 예상 시간            |

### 지연 로딩 표시기

```tsx
'use client';

import { useState, useEffect } from 'react';

function DelayedSpinner({ delay = 100, children }) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSpinner) return null;
  return children;
}
```

### Optimistic UI

```tsx
'use client';

import { useOptimistic, useTransition } from 'react';

function LikeButton({ postId, initialLiked, initialCount }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (state, newLiked) => ({
      liked: newLiked,
      count: newLiked ? state.count + 1 : state.count - 1,
    })
  );

  const handleLike = async () => {
    const newLiked = !optimisticState.liked;

    startTransition(async () => {
      // 1. 즉시 UI 업데이트
      setOptimisticState(newLiked);

      // 2. 서버에 요청
      try {
        await toggleLike(postId, newLiked);
      } catch {
        // 실패 시 자동 롤백
      }
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      <Heart filled={optimisticState.liked} />
      <span>{optimisticState.count}</span>
    </button>
  );
}
```

## 프리페칭과 프리로딩

### Next.js Link 프리페칭

```tsx
import Link from 'next/link';

// 기본: 뷰포트에 들어오면 자동 프리페치
<Link href="/about">About</Link>

// 프리페치 비활성화 (드물게 사용되는 페이지)
<Link href="/terms" prefetch={false}>
  이용약관
</Link>
```

### React Query 프리페칭

```tsx
import { useQueryClient } from '@tanstack/react-query';

function CategoryList({ categories }) {
  const queryClient = useQueryClient();

  const prefetchCategory = (categoryId) => {
    queryClient.prefetchQuery({
      queryKey: ['products', categoryId],
      queryFn: () => fetchProducts(categoryId),
      staleTime: 5 * 60 * 1000, // 5분간 유효
    });
  };

  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id} onMouseEnter={() => prefetchCategory(category.id)}>
          <Link href={`/category/${category.id}`}>{category.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```

### 리소스 프리로드

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* 중요 이미지 프리로드 */}
        <link rel="preload" href="/hero.jpg" as="image" type="image/jpeg" />

        {/* API 도메인 프리커넥트 */}
        <link rel="preconnect" href="https://api.example.com" />
        <link rel="dns-prefetch" href="https://api.example.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 번들 크기 최적화

### 번들 분석

```bash
# 설치
npm install --save-dev @next/bundle-analyzer

# 분석 실행
ANALYZE=true npm run build
```

### Tree Shaking 확인

```tsx
// ❌ 전체 임포트
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ 개별 함수 임포트
import debounce from 'lodash/debounce';
debounce(fn, 300);

// ❌ 모든 아이콘 임포트
import * as Icons from 'lucide-react';

// ✅ 필요한 아이콘만 임포트
import { Home, Settings, User } from 'lucide-react';
```

## 캐싱 전략

### Next.js 캐싱

```tsx
// 정적 페이지 (무한 캐시)
export const dynamic = 'force-static';

// ISR (주기적 재검증)
export const revalidate = 3600; // 1시간

// fetch 캐싱
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600, tags: ['products'] },
});
```

### React Query 캐싱

```tsx
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5분간 fresh
  gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
  refetchOnWindowFocus: false,
});
```

## 성능 측정

### 프로젝트에 구현된 측정 도구

- `WebVitalsReporter`: Core Web Vitals 자동 수집 (`src/components/analytics/web-vitals-reporter.tsx`)
- Lighthouse CI: 자동화 테스트 (`lighthouserc.js`)

### 측정 도구

| 도구                  | 용도               | 단계     |
| --------------------- | ------------------ | -------- |
| Chrome DevTools       | 상세 프로파일링    | 개발     |
| Lighthouse            | 종합 점수          | 개발     |
| Web Vitals Extension  | 실시간 측정        | 개발     |
| PageSpeed Insights    | Lab + Field 데이터 | 프로덕션 |
| Google Search Console | 실사용자 데이터    | 프로덕션 |

## 체크리스트

### LCP 최적화

- [ ] LCP 이미지에 priority 속성
- [ ] 이미지 포맷 최적화 (WebP/AVIF)
- [ ] 서버 응답 시간 < 200ms
- [ ] 폰트 프리로드

### INP 최적화

- [ ] 무거운 라이브러리 동적 임포트
- [ ] useTransition으로 긴급하지 않은 업데이트 분리
- [ ] 이벤트 핸들러 최적화
- [ ] 메인 스레드 블로킹 최소화

### CLS 최적화

- [ ] 모든 이미지/비디오에 크기 지정
- [ ] 폰트 font-display 설정
- [ ] 동적 콘텐츠 공간 예약
- [ ] 상단에 콘텐츠 삽입 금지

### 로딩 UX

- [ ] Suspense로 점진적 로딩
- [ ] Skeleton UI 적용
- [ ] 100ms 지연 로딩 표시기
- [ ] Optimistic UI 적용

### 번들 최적화

- [ ] 동적 임포트 활용
- [ ] Tree shaking 확인
- [ ] 불필요한 폴리필 제거

## 관련 파일

- `src/components/analytics/web-vitals-reporter.tsx` - Web Vitals 측정
- `next.config.ts` - 이미지 최적화 설정
- `lighthouserc.js` - Lighthouse CI 설정
- `.cursorrules` - 성능 코딩 규칙
