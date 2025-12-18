# StoryVerse

![CI](https://github.com/josens83/StoryVerse/actions/workflows/ci.yml/badge.svg)

**한국형 웹소설 플랫폼** - 독자와 작가 모두를 위한 프리미엄 웹소설 서비스

## 프로젝트 비전

StoryVerse는 네이버 시리즈, 카카오페이지와 같은 웹소설 플랫폼입니다. 독자가 쉽게 웹소설을 탐색하고 읽을 수 있으며, 작가가 작품을 연재하고 수익을 창출할 수 있는 생태계를 제공합니다.

### 핵심 가치

1. **편의성** - 어디서든 쉽게 웹소설을 읽고 쓸 수 있는 플랫폼
2. **공정성** - 작가에게 정당한 수익을 보장하는 투명한 시스템
3. **커뮤니티** - 독자와 작가가 함께 성장하는 생태계

> 자세한 비전은 [VISION.md](./docs/VISION.md)를 참조하세요.

## 기술 스택

| 카테고리         | 기술                                      |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js 16 (App Router)                   |
| Language         | TypeScript (strict mode)                  |
| Database         | Supabase (PostgreSQL)                     |
| State Management | Zustand, TanStack Query                   |
| Styling          | Tailwind CSS                              |
| Payment          | Stripe                                    |
| Testing          | Vitest, React Testing Library, Playwright |
| CI/CD            | GitHub Actions                            |

## 시작하기

### 요구사항

- Node.js >= 18.0.0
- npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/StoryVerse.git
cd StoryVerse

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 환경변수 설정
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

| 명령어              | 설명                                 |
| ------------------- | ------------------------------------ |
| `npm run dev`       | 개발 서버 실행                       |
| `npm run build`     | 프로덕션 빌드                        |
| `npm run start`     | 프로덕션 서버 실행                   |
| `npm run lint`      | ESLint 검사                          |
| `npm run typecheck` | TypeScript 타입 검사                 |
| `npm run test`      | 테스트 실행 (watch mode)             |
| `npm run test:run`  | 테스트 실행 (single run)             |
| `npm run verify`    | 전체 검증 (typecheck + lint + build) |

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
├── lib/              # 유틸리티 함수
├── services/         # 비즈니스 로직
├── store/            # Zustand 스토어
├── hooks/            # 커스텀 훅
├── types/            # TypeScript 타입
└── __tests__/        # 테스트 파일
```

## 문서

- [프로젝트 비전](./docs/VISION.md)
- [경쟁 분석](./docs/COMPETITIVE_ANALYSIS.md)
- [아키텍처 결정 기록](./docs/adr/)
- [개발 워크플로우 가이드](./docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md)

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
