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

- `docs/VISION.md` - 프로젝트 비전 문서
- `docs/COMPETITIVE_ANALYSIS.md` - 경쟁 분석
- `docs/adr/` - 아키텍처 결정 기록
- `docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md` - 개발 워크플로우 가이드
