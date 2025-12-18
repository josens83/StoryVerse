# 프로젝트 컨텍스트

> 이 문서는 AI 도구와 새로운 기여자가 프로젝트 전체 맥락을 빠르게 파악할 수 있도록 작성되었습니다.

## 프로젝트 개요

**StoryVerse**는 한국형 웹소설 플랫폼입니다. 네이버 시리즈, 카카오페이지와 유사한 서비스로, 독자가 웹소설을 읽고 작가가 작품을 연재할 수 있는 생태계를 제공합니다.

### 핵심 가치

1. **편의성** - 어디서든 쉽게 웹소설을 읽고 쓸 수 있는 플랫폼
2. **공정성** - 작가에게 정당한 수익을 보장하는 투명한 시스템
3. **커뮤니티** - 독자와 작가가 함께 성장하는 생태계

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                    StoryVerse 아키텍처                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Next.js   │────▶│  API Routes │────▶│  Supabase   │       │
│  │  Frontend   │     │   Backend   │     │ PostgreSQL  │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                   │                   │               │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Zustand    │     │   Stripe    │     │  Supabase   │       │
│  │   State     │     │  Payments   │     │    Auth     │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 기술 스택

| 카테고리  | 기술                     | 선택 이유 (ADR 참조)         |
| --------- | ------------------------ | ---------------------------- |
| Framework | Next.js 16 (App Router)  | SSR/SSG, React 서버 컴포넌트 |
| Language  | TypeScript (strict)      | 타입 안전성, 개발 생산성     |
| Database  | Supabase (PostgreSQL)    | 무료 티어, RLS, 실시간 기능  |
| Auth      | Supabase Auth            | DB와 통합, JWT 기반          |
| State     | Zustand + TanStack Query | 간결함, 서버 상태 캐싱       |
| Styling   | Tailwind CSS             | 유틸리티 퍼스트, 빠른 개발   |
| Payment   | Stripe                   | 글로벌 결제, 한국 카드 지원  |
| Testing   | Vitest, RTL, Playwright  | 빠른 테스트, 타입 지원       |

## 주요 설계 결정 (ADR 요약)

1. **ADR-001: 기술 스택** - Next.js + Supabase + TypeScript 조합 선택
2. **ADR-002: 수익화 모델** - 코인 시스템 + VIP 구독 하이브리드

> 상세 내용은 `docs/adr/` 폴더 참조

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/             # 인증 관련 페이지
│   ├── api/                # API Routes
│   ├── author/             # 작가 대시보드
│   └── novel/[id]/         # 소설 상세/뷰어
├── components/             # React 컴포넌트
│   ├── ui/                 # 재사용 UI (Button, Card, Modal 등)
│   ├── layout/             # Header, Footer, BottomNav
│   └── social/             # 소셜 기능 컴포넌트
├── lib/                    # 유틸리티
│   ├── supabase.ts         # DB 클라이언트 (싱글톤)
│   ├── auth.ts             # 인증 유틸리티
│   └── constants/          # 상수, 디자인 토큰
├── services/               # 비즈니스 로직
├── store/                  # Zustand 스토어
├── hooks/                  # 커스텀 훅
└── types/                  # TypeScript 타입
```

## 현재 상태

### 완료된 기능

- ✅ 프로젝트 셋업 (Next.js, TypeScript, Tailwind)
- ✅ 인증 시스템 (로그인, 회원가입, 세션)
- ✅ 소설 목록/상세/뷰어
- ✅ 코인 시스템 (충전, 소비)
- ✅ VIP 구독 시스템
- ✅ 작가 대시보드
- ✅ 댓글, 별점, 팔로우
- ✅ 검색, 랭킹, 장르별 탐색
- ✅ 테스트 (266개 통과)

### 진행 중

- 🔄 문서화 및 워크플로우 가이드 작성

### 다음 마일스톤

- 실제 Supabase 연동
- Stripe 결제 연동
- E2E 테스트 확장

## 제약사항 (목표 NOT)

- ❌ 네이티브 모바일 앱 (웹 반응형만)
- ❌ 실시간 채팅 (댓글로 대체)
- ❌ AI 글쓰기 도구
- ❌ 오디오북/TTS
- ❌ 다국어 지원 (한국어 집중)

## 코드 위치 빠른 참조

| 기능          | 파일 위치                     |
| ------------- | ----------------------------- |
| 메인 페이지   | `src/app/page.tsx`            |
| 소설 상세     | `src/app/novel/[id]/page.tsx` |
| API 라우트    | `src/app/api/`                |
| UI 컴포넌트   | `src/components/ui/`          |
| DB 클라이언트 | `src/lib/supabase.ts`         |
| 타입 정의     | `src/types/`                  |
| 테스트        | `src/__tests__/`              |

## 관련 문서

- [비전 문서](docs/VISION.md)
- [CLAUDE.md](CLAUDE.md) - AI 도구용 기술 컨텍스트
- [배포 체크리스트](docs/DEPLOYMENT_CHECKLIST.md)
- [워크플로우 가이드](docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md)
- [ADR 목록](docs/adr/)
