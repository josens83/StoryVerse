# Contributing to StoryVerse

StoryVerse 프로젝트에 기여해주셔서 감사합니다!

## 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- npm 또는 pnpm
- Git

### 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/StoryVerse.git
cd StoryVerse

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 Supabase 및 Stripe 키 설정

# 개발 서버 실행
npm run dev
```

## 코드 스타일

### TypeScript

- strict mode 활성화
- 명시적 타입 선호 (any 지양)
- 타입 전용 import 시 `type` 키워드 사용

```typescript
// Good
import type { User } from '@/types';
import { formatDate } from '@/lib/utils';

// Bad
import { User } from '@/types';
```

### React

- 함수형 컴포넌트 사용
- 커스텀 훅은 `use` 접두사
- Server Components 우선 (클라이언트 필요 시 `'use client'`)

### CSS

- Tailwind CSS 유틸리티 클래스 사용
- 복잡한 스타일링은 `cn()` 함수로 조합

## 커밋 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>: <description>

[optional body]
```

### 타입

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 기타 변경

### 예시

```
feat: add chapter unlock with coins

- Implement coin deduction logic
- Add unlock confirmation modal
- Update chapter access service
```

## 테스트

```bash
# 단위 테스트 실행
npm run test

# 테스트 감시 모드
npm run test:watch

# 커버리지 확인
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

### 테스트 작성 가이드

- 새 기능에는 테스트 필수
- 테스트 파일: `__tests__/` 디렉토리
- 네이밍: `*.test.ts` 또는 `*.test.tsx`

## PR 가이드라인

1. `main` 브랜치에서 feature 브랜치 생성
2. 의미 있는 커밋으로 분리
3. PR 템플릿 작성
4. 모든 CI 체크 통과 확인
5. 리뷰어 지정

### PR 체크리스트

- [ ] 테스트 추가/수정
- [ ] 린트 통과 (`npm run lint`)
- [ ] 타입체크 통과 (`npm run typecheck`)
- [ ] 빌드 성공 (`npm run build`)

## 디렉토리 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
│   ├── ui/          # 공통 UI 컴포넌트
│   └── layout/      # 레이아웃 컴포넌트
├── hooks/           # 커스텀 React 훅
├── lib/             # 유틸리티 함수
├── services/        # 비즈니스 로직
├── store/           # Zustand 스토어
├── types/           # TypeScript 타입 정의
└── __tests__/       # 테스트 파일
```

## 질문이 있으신가요?

이슈를 통해 질문해주세요!
