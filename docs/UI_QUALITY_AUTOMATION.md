# UI 품질 자동화 가이드

> Solo Developer Workflow Guide 챕터 14-15 기반

## 개요

이 문서는 StoryVerse 프로젝트의 UI 품질을 자동으로 검증하는 방법을 설명합니다.

## 구현된 상태 관리 패턴

### DataContainer 컴포넌트

모든 데이터 페칭 UI는 4가지 상태를 처리합니다:

```tsx
import { DataContainer } from '@/components/ui/data-container';

<DataContainer
  isLoading={isLoading}
  error={error}
  isEmpty={!data?.length}
  emptyMessage="소설이 없습니다"
  emptyDescription="첫 번째 소설을 작성해보세요"
  onRetry={refetch}
  skeletonVariant="card"
  skeletonCount={6}
>
  <NovelList novels={data} />
</DataContainer>;
```

### 상태별 UI

| 상태 | 컴포넌트     | 파일 위치                              |
| ---- | ------------ | -------------------------------------- |
| 로딩 | Skeleton     | `src/components/ui/skeleton.tsx`       |
| 빈   | EmptyState   | `src/components/ui/empty-state.tsx`    |
| 에러 | DefaultError | `src/components/ui/data-container.tsx` |
| 성공 | children     | -                                      |

## 품질 자동화 도구

### 1. Lighthouse CI

성능, 접근성, SEO 자동 검사.

**설정:**

```bash
npm install -g @lhci/cli
```

**실행:**

```bash
npm run build
npm run start &
lhci autorun
```

**설정 파일:** `lighthouserc.js`

**기준 점수:**

- 성능: 80점 이상 (경고)
- 접근성: 90점 이상 (오류)
- SEO: 80점 이상 (경고)

### 2. Playwright 접근성 테스트

axe-core를 사용한 WCAG 자동 검사.

**설정:**

```bash
npm install --save-dev @axe-core/playwright @playwright/test
npx playwright install
```

**실행:**

```bash
npx playwright test tests/accessibility.spec.ts
```

**테스트 파일:** `tests/accessibility.spec.ts`

**검사 항목:**

- WCAG 2.1 AA 수준
- 색상 대비 (4.5:1)
- 이미지 alt 텍스트
- 폼 레이블
- 버튼/링크 접근성 이름
- 키보드 네비게이션

### 3. ESLint jsx-a11y

코드 작성 시점에 접근성 문제 감지.

**이미 설정됨** - `.eslintrc` 또는 `eslint.config.js`

**주요 규칙:**

- `jsx-a11y/alt-text`: 이미지 alt 필수
- `jsx-a11y/click-events-have-key-events`: 클릭 + 키보드 지원
- `jsx-a11y/no-static-element-interactions`: 인터랙티브 요소에 role 필요

### 4. Storybook (선택)

컴포넌트 문서화 및 격리 개발.

**설정:**

```bash
npx storybook@latest init
```

**실행:**

```bash
npm run storybook
```

## CI/CD 통합

### GitHub Actions 워크플로우

`.github/workflows/ci.yml`에 이미 포함된 검사:

- TypeScript 타입 검사
- ESLint (jsx-a11y 포함)
- 단위/통합 테스트

**추가 권장 검사:**

```yaml
# Lighthouse CI
lighthouse:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run build
    - run: |
        npm install -g @lhci/cli
        lhci autorun

# 접근성 테스트
accessibility:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npm run build && npm run start &
    - run: npx wait-on http://localhost:3000
    - run: npx playwright test tests/accessibility.spec.ts
```

## 체크리스트

### 개발 시

- [ ] DataContainer 사용하여 4가지 상태 처리
- [ ] 모든 이미지에 의미있는 alt 텍스트
- [ ] 모든 아이콘 버튼에 aria-label
- [ ] 모든 폼 입력에 label 연결
- [ ] ESLint 경고 0개 유지

### 배포 전

- [ ] `npm run verify` 통과
- [ ] Lighthouse 접근성 90점 이상
- [ ] axe-core 위반 사항 0개
- [ ] 주요 페이지 반응형 확인

### 주간

- [ ] 새 컴포넌트 접근성 검토
- [ ] Lighthouse 점수 모니터링
- [ ] 사용자 피드백 반영

## 관련 파일

- `lighthouserc.js` - Lighthouse CI 설정
- `tests/accessibility.spec.ts` - 접근성 테스트
- `src/components/ui/data-container.tsx` - 통합 상태 관리
- `src/components/ui/empty-state.tsx` - 빈 상태 컴포넌트
- `src/components/ui/skeleton.tsx` - 로딩 스켈레톤
- `.cursorrules` - AI 코딩 규칙 (접근성 포함)
