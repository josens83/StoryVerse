# ADR 001: Technology Stack Selection

## Status

Accepted

## Context

StoryVerse는 웹소설 플랫폼으로, 다음 요구사항을 충족해야 합니다:

- 모바일/웹 크로스플랫폼 지원
- 빠른 로딩 속도와 SEO
- 실시간 데이터 동기화
- 확장 가능한 아키텍처
- 결제 시스템 통합

## Decision

### Frontend

- **Next.js 14+** (App Router): React 기반 풀스택 프레임워크
  - Server Components로 초기 로딩 최적화
  - App Router로 더 나은 라우팅 경험
  - 내장 이미지/폰트 최적화

- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Zustand**: 가벼운 상태 관리
- **TanStack Query**: 서버 상태 관리 및 캐싱

### Backend

- **Supabase**: PostgreSQL 기반 BaaS
  - Row Level Security로 데이터 보안
  - 실시간 구독 기능
  - 내장 인증 시스템

- **Stripe**: 결제 처리

### Testing

- **Vitest**: 단위/통합 테스트
- **React Testing Library**: 컴포넌트 테스트
- **Playwright**: E2E 테스트

## Consequences

### Positive

- SSR/SSG로 빠른 초기 로딩 및 SEO
- TypeScript로 런타임 에러 감소
- Supabase로 백엔드 개발 시간 단축
- 풍부한 React 생태계 활용

### Negative

- Next.js 학습 곡선
- Supabase 종속성
- 복잡한 쿼리는 Supabase 제한 존재
