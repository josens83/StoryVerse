# 반응형 디자인 패턴 가이드

> Mobile-First 접근법과 검증된 레이아웃 패턴

## 브레이크포인트 시스템

### 표준 브레이크포인트

| 브레이크포인트 | 크기    | 용도              |
| -------------- | ------- | ----------------- |
| 기본 (default) | < 640px | 모바일 세로       |
| `md:`          | 768px+  | 태블릿/모바일가로 |
| `lg:`          | 1024px+ | 데스크톱          |
| `xl:`          | 1280px+ | 와이드 (선택적)   |

### 사용 빈도

- **기본 + md + lg**: 대부분의 UI에 충분
- **sm, xl, 2xl**: 특별한 경우에만 사용

## 레이아웃 패턴

### 1. 스택 → 그리드

```tsx
// 모바일: 세로 스택 → 태블릿+: 그리드
<div
  className="
  flex flex-col gap-4
  md:grid md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
"
>
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

### 2. 히어로 섹션

```tsx
<section className="px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
  <div
    className="
    flex flex-col gap-6
    lg:flex-row lg:items-center lg:gap-12
    max-w-7xl mx-auto
  "
  >
    {/* 텍스트 영역 */}
    <div className="lg:w-1/2">
      <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">제목</h1>
      <p className="mt-4 text-muted-foreground md:text-lg lg:text-xl">설명 텍스트</p>
    </div>

    {/* 이미지 영역 */}
    <div className="lg:w-1/2">
      <Image
        src="/hero.jpg"
        alt="히어로 이미지"
        width={800}
        height={600}
        className="w-full rounded-lg"
      />
    </div>
  </div>
</section>
```

### 3. 사이드바 레이아웃

```tsx
<div className="flex flex-col lg:flex-row min-h-screen">
  {/* 사이드바: 모바일=상단, 데스크톱=좌측 */}
  <aside
    className="
    w-full p-4 border-b
    lg:w-64 lg:border-b-0 lg:border-r lg:min-h-screen
  "
  >
    <nav>...</nav>
  </aside>

  {/* 메인 콘텐츠 */}
  <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
</div>
```

### 4. 자동 조절 카드 그리드

```tsx
// 고정 컬럼 수
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>

// 또는 auto-fill (더 유연함)
<div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

### 5. 반응형 타이포그래피

```tsx
// 페이지 제목
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  제목
</h1>

// 섹션 제목
<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">섹션 제목</h2>

// 본문
<p className="text-base md:text-lg text-muted-foreground">본문 텍스트</p>
```

## 컨테이너 패턴

```tsx
// 기본 컨테이너
<div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">{children}</div>;

// 콘텐츠 유형별 너비
const containers = {
  prose: 'max-w-prose mx-auto px-4', // 글 읽기용 (~65ch)
  content: 'max-w-5xl mx-auto px-4 md:px-6', // 일반 콘텐츠 (1024px)
  wide: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8', // 대시보드 (1280px)
  full: 'w-full px-4 md:px-6 lg:px-8', // 전체 너비
};
```

## 반응형 이미지

### Next.js Image 패턴

```tsx
// 전체 너비 반응형 이미지
<div className="relative w-full aspect-video">
  <Image
    src="/hero.jpg"
    alt="히어로 이미지"
    fill
    sizes="100vw"
    className="object-cover"
    priority // LCP 이미지에 필수
  />
</div>

// 브레이크포인트별 다른 크기
<Image
  src="/product.jpg"
  alt="제품 이미지"
  width={800}
  height={600}
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  className="w-full h-auto"
/>
```

## 터치 타겟 가이드라인

### 최소 크기: 44x44px

```tsx
// 아이콘 버튼
<button
  className="
  min-h-11 min-w-11
  flex items-center justify-center
  rounded-lg
  hover:bg-accent
  active:scale-95
  transition-transform
"
  aria-label="메뉴"
>
  <Menu className="h-5 w-5" />
</button>

// 네비게이션 링크
<Link
  href="/page"
  className="
  block px-4 py-3 min-h-11
  rounded-lg
  hover:bg-accent
  active:bg-accent/80
"
>
  메뉴 항목
</Link>
```

## 반응형 네비게이션

```tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="font-bold text-xl">
            StoryVerse
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/genre" className="px-4 py-2 rounded-lg hover:bg-accent">
              장르
            </Link>
            <Link href="/ranking" className="px-4 py-2 rounded-lg hover:bg-accent">
              랭킹
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/genre"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              장르
            </Link>
            <Link
              href="/ranking"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              랭킹
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
```

## 반응형 테이블

### 패턴 1: 가로 스크롤

```tsx
<div className="overflow-x-auto -mx-4 md:mx-0">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-full">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-3 text-left">제목</th>
          <th className="px-4 py-3 text-left">작가</th>
          <th className="px-4 py-3 text-right">조회수</th>
        </tr>
      </thead>
      <tbody>{/* rows */}</tbody>
    </table>
  </div>
</div>
```

### 패턴 2: 카드로 변환 (모바일)

```tsx
// 데스크톱: 테이블
<table className="hidden md:table w-full">...</table>

// 모바일: 카드 리스트
<div className="md:hidden space-y-4">
  {items.map((item) => (
    <Card key={item.id}>
      <CardContent className="p-4">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.author}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

## 체크리스트

### 개발 시 확인사항

- [ ] Mobile-First로 작성 (기본 → md → lg 순서)
- [ ] 표준 브레이크포인트만 사용 (커스텀 값 금지)
- [ ] 터치 타겟 최소 44x44px
- [ ] 이미지에 sizes 속성 설정
- [ ] LCP 이미지에 priority 속성
- [ ] 가로 스크롤 없음 확인

### 테스트 항목

- [ ] Chrome DevTools 모바일 뷰 확인
- [ ] 실제 모바일 기기 테스트
- [ ] 태블릿 가로/세로 모드 확인
- [ ] 텍스트 읽기 편한지 확인
