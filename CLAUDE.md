# Project: StoryVerse

## 개요

StoryVerse는 한국형 웹소설 플랫폼입니다. 네이버 시리즈, 카카오페이지와 유사한 서비스로, 독자가 웹소설을 읽고 작가가 작품을 연재할 수 있는 플랫폼입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State Management**: Zustand, TanStack Query
- **Styling**: Tailwind CSS
- **Payment**: Stripe
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Vercel

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/             # 인증 관련 페이지 (login, register)
│   ├── api/                # API Routes
│   ├── author/             # 작가 대시보드
│   ├── novel/[id]/         # 소설 상세 및 챕터 뷰어
│   └── ...                 # 기타 페이지
├── components/             # React 컴포넌트
│   ├── ui/                 # 재사용 가능한 UI 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   ├── social/             # 소셜 기능 컴포넌트
│   └── ...
├── lib/                    # 유틸리티 함수
│   ├── auth.ts             # 인증 유틸리티
│   ├── security.ts         # 보안 유틸리티
│   ├── api-response.ts     # API 응답 헬퍼
│   └── constants/          # 상수 정의
├── services/               # 비즈니스 로직
├── store/                  # Zustand 스토어
├── hooks/                  # 커스텀 훅
├── types/                  # TypeScript 타입 정의
└── __tests__/              # 테스트 파일
    ├── unit/               # 단위 테스트
    ├── integration/        # 통합 테스트
    └── components/         # 컴포넌트 테스트
```

## 명령어

- `npm run dev` - 개발 서버 (http://localhost:3000)
- `npm run build` - 프로덕션 빌드
- `npm run typecheck` - TypeScript 타입 검사
- `npm run lint` - ESLint 검사
- `npm run test` - 테스트 실행 (watch mode)
- `npm run test:run` - 테스트 실행 (single run)
- `npm run verify` - 전체 검증 (typecheck + lint + build)

## 코딩 컨벤션

- 함수형 컴포넌트 + React Hooks 사용
- 절대 경로 import 사용 (@/로 시작)
- API 응답은 `ApiResponse<T>` 타입 사용
- 에러 처리는 try-catch와 적절한 HTTP 상태 코드 사용
- 한국어 주석 OK, 변수명/함수명은 영어
- Tailwind CSS 유틸리티 클래스 사용

## 디자인 시스템

### UI 컴포넌트 사용 규칙

새로운 UI를 만들 때 반드시 기존 컴포넌트를 먼저 확인하세요:

1. **먼저 기존 컴포넌트 확인**: `src/components/ui/` 디렉토리
2. **커스텀 컴포넌트는 최후의 수단**

### 설치된 UI 컴포넌트

| 컴포넌트       | 경로                              | 용도                                                                 |
| -------------- | --------------------------------- | -------------------------------------------------------------------- |
| Button         | `@/components/ui/button`          | 모든 버튼 액션 (variants: default, outline, ghost, destructive)      |
| Card           | `@/components/ui/card`            | 컨텐츠 그룹핑 (CardHeader, CardTitle, CardContent, CardFooter)       |
| Input          | `@/components/ui/input`           | 텍스트 입력 필드                                                     |
| Badge          | `@/components/ui/badge`           | 상태 표시, 태그 (variants: default, secondary, destructive, outline) |
| Modal          | `@/components/ui/modal`           | 다이얼로그, 확인창                                                   |
| Tabs           | `@/components/ui/tabs`            | 탭 네비게이션                                                        |
| Skeleton       | `@/components/ui/skeleton`        | 로딩 상태 표시                                                       |
| Toast          | `@/components/ui/toast`           | 알림 메시지                                                          |
| Loading        | `@/components/ui/loading`         | 로딩 스피너                                                          |
| OptimizedImage | `@/components/ui/optimized-image` | 최적화된 이미지                                                      |
| DataContainer  | `@/components/ui/data-container`  | 통합 상태 관리 (로딩/에러/빈/성공)                                   |
| EmptyState     | `@/components/ui/empty-state`     | 빈 상태 UI (아이콘+제목+설명+CTA)                                    |

### 레이아웃 컴포넌트

| 컴포넌트  | 경로                             | 용도                   |
| --------- | -------------------------------- | ---------------------- |
| Header    | `@/components/layout/header`     | 페이지 상단 네비게이션 |
| Footer    | `@/components/layout/footer`     | 페이지 하단 정보       |
| BottomNav | `@/components/layout/bottom-nav` | 모바일 하단 네비게이션 |

### 스타일링 규칙

```tsx
// ✅ 올바른 방법 - 기존 컴포넌트 사용
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Button variant="outline" size="sm">클릭</Button>
<Card><CardContent>내용</CardContent></Card>

// ❌ 잘못된 방법 - 인라인 스타일, 커스텀 버튼
<button style={{ backgroundColor: '#007bff' }}>클릭</button>
<div className="border rounded p-4">내용</div>  // Card 대신 직접 작성
```

### 반응형 디자인 (Mobile-First)

모든 스타일은 **모바일 기준**으로 먼저 작성하고, 큰 화면으로 확장합니다:

```tsx
// ✅ 올바른 순서 (Mobile-First)
className="
  w-full          // 모바일: 전체 너비
  md:w-1/2        // 태블릿: 절반
  lg:w-1/3        // 데스크톱: 1/3
"

// ❌ 잘못된 순서 (Desktop-First)
className="w-1/3 md:w-1/2 sm:w-full"
```

**브레이크포인트:**

- 기본: 모바일 (< 768px)
- `md:` 태블릿 (768px+)
- `lg:` 데스크톱 (1024px+)

### 터치 타겟 크기

모바일 버튼/링크는 최소 44x44px 크기를 유지하세요:

```tsx
// 아이콘 버튼
<button className="min-h-11 min-w-11 flex items-center justify-center">
  <Icon className="h-5 w-5" />
</button>

// 네비게이션 링크
<Link className="block px-4 py-3 min-h-11">메뉴</Link>
```

### 상태별 UI 패턴

모든 데이터 페칭 UI는 4가지 상태를 처리해야 합니다:

1. **로딩**: `<Skeleton />` 사용
2. **에러**: 에러 메시지 + 재시도 버튼
3. **빈 상태**: 안내 메시지 + 행동 유도
4. **성공**: 데이터 표시

```tsx
// ✅ DataContainer 사용 (권장)
import { DataContainer } from '@/components/ui/data-container';

<DataContainer
  isLoading={isLoading}
  error={error}
  isEmpty={!data?.length}
  emptyMessage="소설이 없습니다"
  emptyDescription="첫 번째 소설을 작성해보세요"
  onRetry={refetch}
>
  <NovelList novels={data} />
</DataContainer>;

// 또는 수동 패턴
if (isLoading) return <Skeleton className="h-32 w-full" />;
if (error) return <ErrorState message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyState title="소설이 없습니다" />;
return <NovelList novels={data} />;
```

### 하지 말아야 할 것

- ❌ 인라인 스타일 (`style={{}}`)
- ❌ 하드코딩된 색상값 (`#007bff`, `rgb()`)
- ❌ 기존 컴포넌트 무시하고 새로 만들기
- ❌ Desktop-First 스타일 작성
- ❌ 44px 미만의 터치 타겟
- ❌ 로딩/에러/빈 상태 누락

## 주요 기능

### 독자 기능

- 소설 탐색 (장르별, 랭킹, 검색)
- 챕터 구매 (코인 시스템)
- 책장 (읽은 소설 관리)
- 댓글 및 별점
- 팔로우/알림

### 작가 기능

- 작품 연재 및 관리
- 수익 대시보드
- 독자 통계

### 결제 시스템

- 코인 충전 (Stripe)
- VIP 구독
- 챕터 구매/대여

## 주의사항

- API 키는 환경변수로만 관리 (.env.local)
- Supabase 연동 시 RLS 정책 확인
- 배포 전 `npm run verify` 필수 실행
- 테스트 커버리지 유지 (현재 266개 테스트)

## 현재 작업 중

- 프로젝트 문서화 및 워크플로우 가이드 작성

## 관련 문서

### 핵심 문서

- `docs/VISION.md` - 프로젝트 비전 문서
- `docs/COMPETITIVE_ANALYSIS.md` - 경쟁 분석
- `docs/adr/` - 아키텍처 결정 기록
- `docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md` - 개발 워크플로우 가이드 (전체)

### UI/UX 가이드 (챕터 11-20)

- `docs/AI_UI_REVIEW_CHECKLIST.md` - AI UI 리뷰 체크리스트, Intent Prototyping
- `docs/RESPONSIVE_PATTERNS.md` - Mobile-First 반응형 패턴
- `docs/UI_QUALITY_AUTOMATION.md` - Lighthouse CI, 접근성 테스트 자동화
- `docs/ANIMATION_GUIDELINES.md` - 애니메이션 duration, easing, Framer Motion
- `docs/ACCESSIBILITY_GUIDE.md` - WCAG 2.1 AA 체크리스트, ARIA 가이드
- `docs/PERFORMANCE_GUIDE.md` - Core Web Vitals 최적화 가이드
- `docs/SOLO_DESIGNER_WORKFLOW.md` - 디자이너 없이 작업하는 워크플로우

### 템플릿

- `docs/templates/accessibility.spec.ts.template` - Playwright 접근성 테스트
- `docs/templates/FeedbackWidget.tsx.template` - 인앱 피드백 위젯
- `docs/adr/ui-template.md` - UI/UX 결정 ADR 템플릿
- `docs/adr/ui-decision-log.md` - 간단한 UI 결정 로그

### 빠른 참조

- `docs/QUICK_REFERENCE.md` - 일일 워크플로우, 명령어, 체크리스트
- `.cursorrules` - AI 컨텍스트 규칙 (디자인 시스템, 성능, 접근성)
