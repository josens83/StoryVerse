# 접근성(A11y) 가이드

> Solo Developer Workflow Guide 챕터 17 기반

## 개요

웹 접근성은 모든 사용자가 웹 콘텐츠를 이용할 수 있도록 보장합니다. 이는 장애가 있는 사용자뿐만 아니라 모든 사용자의 경험을 향상시킵니다.

**WCAG 2.1 AA 수준**을 목표로 합니다.

## 왜 중요한가?

- **법적 요구사항**: 많은 국가에서 접근성을 법으로 요구
- **더 넓은 사용자층**: 전 세계 인구의 15%가 장애를 가짐
- **SEO 향상**: 시맨틱 HTML은 검색 엔진 최적화에 도움
- **더 나은 UX**: 접근성 개선은 모든 사용자에게 이점

## 핵심 원칙 (POUR)

1. **Perceivable (인지 가능)**: 정보를 인지할 수 있어야 함
2. **Operable (조작 가능)**: 인터페이스를 조작할 수 있어야 함
3. **Understandable (이해 가능)**: 정보와 조작 방법을 이해할 수 있어야 함
4. **Robust (견고함)**: 다양한 기술로 접근 가능해야 함

## 체크리스트

### 1. 시맨틱 HTML

```tsx
// ✅ 올바른 시맨틱 구조
<header>
  <nav aria-label="메인 네비게이션">
    <ul>
      <li><a href="/">홈</a></li>
      <li><a href="/novels">소설</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>소설 제목</h1>
    <section>
      <h2>챕터 1</h2>
      <p>내용...</p>
    </section>
  </article>
</main>

<footer>
  <p>Copyright 2024</p>
</footer>

// ❌ 잘못된 구조
<div className="header">
  <div className="nav">...</div>
</div>
<div className="main">
  <div className="article">...</div>
</div>
```

### 2. 헤딩 계층 구조

```tsx
// ✅ 올바른 순서 (h1 → h2 → h3)
<h1>페이지 제목</h1>
  <h2>섹션 1</h2>
    <h3>하위 섹션</h3>
  <h2>섹션 2</h2>

// ❌ 잘못된 순서 (레벨 건너뛰기)
<h1>페이지 제목</h1>
  <h3>바로 h3로?</h3>  {/* h2를 건너뜀 */}
```

### 3. 이미지 대체 텍스트

```tsx
// ✅ 의미 있는 alt 텍스트
<Image
  src="/novel-cover.jpg"
  alt="소설 '불멸의 대마법사' 표지 - 푸른 로브를 입은 마법사가 마법진 앞에 서 있다"
/>

// ✅ 장식용 이미지
<Image src="/decoration.png" alt="" aria-hidden="true" />

// ❌ 의미 없는 alt
<Image src="/novel-cover.jpg" alt="이미지" />
<Image src="/novel-cover.jpg" alt="novel-cover.jpg" />
```

### 4. 폼 접근성

```tsx
// ✅ 올바른 폼 구조
<form>
  <div>
    <label htmlFor="email">이메일 주소</label>
    <Input
      id="email"
      type="email"
      aria-describedby="email-hint email-error"
      aria-invalid={!!error}
    />
    <p id="email-hint" className="text-sm text-muted-foreground">
      알림을 받을 이메일을 입력하세요
    </p>
    {error && (
      <p id="email-error" className="text-sm text-destructive" role="alert">
        {error}
      </p>
    )}
  </div>

  <Button type="submit">가입하기</Button>
</form>

// ✅ 시각적으로 숨긴 레이블 (검색창 등)
<label htmlFor="search" className="sr-only">검색어 입력</label>
<Input id="search" placeholder="검색..." />

// ❌ 레이블 없는 입력
<Input placeholder="이메일" />  {/* 레이블 없음! */}
```

### 5. 버튼과 링크

```tsx
// ✅ 아이콘 버튼에 aria-label
<Button variant="ghost" size="icon" aria-label="검색 열기">
  <Search className="h-5 w-5" aria-hidden="true" />
</Button>

<Button variant="ghost" size="icon" aria-label="메뉴 닫기">
  <X className="h-5 w-5" aria-hidden="true" />
</Button>

// ✅ 명확한 링크 텍스트
<a href="/terms">이용약관 보기</a>

// ❌ 불명확한 텍스트
<a href="/terms">여기</a>를 클릭하세요
<Button>클릭</Button>  {/* 무엇을 하는 버튼인지 불명확 */}
```

### 6. 키보드 네비게이션

```tsx
// ✅ 커스텀 컴포넌트의 키보드 지원
function Dropdown({ items, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) {
          onSelect(items[activeIndex]);
        }
        break;
      case 'Escape':
        closeDropdown();
        break;
    }
  };

  return (
    <div role="listbox" onKeyDown={handleKeyDown} tabIndex={0}>
      {items.map((item, index) => (
        <div key={item.id} role="option" aria-selected={index === activeIndex}>
          {item.label}
        </div>
      ))}
    </div>
  );
}
```

### 7. 포커스 관리

```tsx
// ✅ 모달 열 때 포커스 트랩
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 이전 포커스 저장
      previousFocusRef.current = document.activeElement as HTMLElement;
      // 모달로 포커스 이동
      modalRef.current?.focus();
    } else {
      // 모달 닫힐 때 이전 포커스로 복귀
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
      <h2 id="modal-title">모달 제목</h2>
      {children}
      <Button onClick={onClose}>닫기</Button>
    </div>
  );
}

// ✅ 포커스 표시 스타일
className =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
```

### 8. 색상과 대비

```tsx
// ✅ 충분한 색상 대비 (4.5:1 이상)
// 디자인 토큰 사용으로 자동 보장
className="text-foreground bg-background"

// ✅ 색상만으로 정보 전달하지 않기
<Badge variant="destructive">
  <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
  에러
</Badge>

// ❌ 색상만으로 상태 표시
<span className="text-red-500">에러</span>  {/* 아이콘이나 텍스트 없이 색상만 */}
```

### 9. 동적 콘텐츠

```tsx
// ✅ 로딩 상태 알림
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <Skeleton /> : <Content />}
</div>

// ✅ 토스트 알림
<div role="alert" aria-live="assertive">
  저장되었습니다
</div>

// ✅ 에러 메시지
<p role="alert" className="text-destructive">
  로그인에 실패했습니다
</p>
```

### 10. 스킵 링크

```tsx
// ✅ 메인 콘텐츠로 건너뛰기 링크
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:rounded"
>
  메인 콘텐츠로 건너뛰기
</a>

<main id="main-content" tabIndex={-1}>
  ...
</main>
```

## ARIA 속성 가이드

### 자주 사용하는 ARIA 속성

| 속성               | 용도               | 예시                               |
| ------------------ | ------------------ | ---------------------------------- |
| `aria-label`       | 요소 설명          | `aria-label="검색"`                |
| `aria-labelledby`  | 다른 요소로 레이블 | `aria-labelledby="modal-title"`    |
| `aria-describedby` | 추가 설명 연결     | `aria-describedby="password-hint"` |
| `aria-hidden`      | 스크린 리더 숨김   | `aria-hidden="true"` (장식용)      |
| `aria-expanded`    | 확장 상태          | `aria-expanded={isOpen}`           |
| `aria-pressed`     | 토글 상태          | `aria-pressed={isActive}`          |
| `aria-live`        | 동적 업데이트 알림 | `aria-live="polite"`               |
| `aria-invalid`     | 유효성 검사 실패   | `aria-invalid={!!error}`           |

### Role 속성

```tsx
// 주요 랜드마크 roles
<div role="banner">헤더</div>      {/* <header> 대신 */}
<div role="navigation">네비게이션</div>  {/* <nav> 대신 */}
<div role="main">메인</div>        {/* <main> 대신 */}
<div role="contentinfo">푸터</div>  {/* <footer> 대신 */}

// 인터랙티브 roles
<div role="button" tabIndex={0}>버튼</div>
<div role="dialog" aria-modal="true">모달</div>
<div role="alert">알림</div>
<div role="status">상태</div>
```

## 테스트 도구

### 1. 브라우저 확장

- **axe DevTools**: WCAG 자동 검사
- **WAVE**: 시각적 접근성 평가
- **Lighthouse**: 종합 성능/접근성 검사

### 2. 스크린 리더 테스트

- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (무료), JAWS
- **모바일**: iOS VoiceOver, Android TalkBack

### 3. 자동화 테스트

```typescript
// Playwright + axe-core
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('홈페이지 접근성', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  expect(results.violations).toEqual([]);
});
```

### 4. 키보드 테스트 체크리스트

- [ ] Tab으로 모든 인터랙티브 요소 접근 가능
- [ ] Shift+Tab으로 역방향 이동 가능
- [ ] Enter/Space로 버튼/링크 활성화 가능
- [ ] Escape로 모달/드롭다운 닫기 가능
- [ ] 포커스 순서가 논리적인가
- [ ] 포커스 표시가 명확하게 보이는가

## 일반적인 실수와 해결책

### 실수 1: 클릭 전용 요소

```tsx
// ❌ 문제
<div onClick={handleClick}>클릭</div>

// ✅ 해결
<button onClick={handleClick}>클릭</button>

// 또는 div를 써야 한다면
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  클릭
</div>
```

### 실수 2: 자동 재생 미디어

```tsx
// ❌ 문제 - 자동 재생, 음소거 불가
<video autoPlay src="/intro.mp4" />

// ✅ 해결 - 음소거, 컨트롤 제공
<video autoPlay muted controls src="/intro.mp4">
  <track kind="captions" src="/captions.vtt" srcLang="ko" label="한국어" />
</video>
```

### 실수 3: 시간 제한

```tsx
// ❌ 문제 - 세션 자동 종료 경고 없음
setTimeout(() => logout(), 30 * 60 * 1000);

// ✅ 해결 - 경고 및 연장 옵션
function SessionWarning() {
  return (
    <div role="alertdialog" aria-labelledby="session-title">
      <h2 id="session-title">세션 만료 경고</h2>
      <p>5분 후 자동 로그아웃됩니다.</p>
      <Button onClick={extendSession}>세션 연장</Button>
    </div>
  );
}
```

## 관련 파일

- `.cursorrules` - 접근성 코딩 규칙
- `docs/UI_QUALITY_AUTOMATION.md` - 품질 자동화
- `docs/templates/accessibility.spec.ts.template` - 테스트 템플릿
- `lighthouserc.js` - Lighthouse CI 설정
- `src/components/ui/` - 접근성 준수 UI 컴포넌트

## 참고 자료

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
