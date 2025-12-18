# 애니메이션 가이드라인

> Solo Developer Workflow Guide 챕터 16 기반

## 개요

애니메이션은 사용자 경험을 향상시키는 중요한 요소입니다. 하지만 과도하거나 일관성 없는 애니메이션은 오히려 사용성을 해칩니다.

## 핵심 원칙

### 1. 목적 있는 애니메이션

애니메이션은 다음 목적을 위해서만 사용합니다:

- **피드백**: 사용자 액션에 대한 응답
- **전환**: 상태 변화 시각화
- **안내**: 관심 유도 및 방향 제시
- **즐거움**: 브랜드 개성 표현 (절제하여 사용)

### 2. 성능 최적화

```css
/* ✅ GPU 가속 속성 (저렴한 연산) */
transform: translate, scale, rotate;
opacity: 0-1;

/* ❌ 레이아웃 재계산 속성 (비용이 높음) */
width, height;
top, left, right, bottom;
margin, padding;
```

### 3. 접근성 존중

```css
/* 모션 감소 설정 존중 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 애니메이션 시스템

### Duration (지속 시간)

| 용도                 | Duration | CSS 클래스          |
| -------------------- | -------- | ------------------- |
| Micro (호버, 포커스) | 150ms    | `.transition-micro` |
| Fast (버튼 클릭)     | 200ms    | `.transition-fast`  |
| Normal (모달 열기)   | 300ms    | `duration-300`      |
| Slow (페이지 전환)   | 500ms    | `duration-500`      |

### Easing (가속도)

| 용도      | Easing      | Tailwind                            |
| --------- | ----------- | ----------------------------------- |
| 일반 전환 | ease-out    | `ease-out`                          |
| 진입      | ease-out    | `ease-out`                          |
| 퇴장      | ease-in     | `ease-in`                           |
| 강조      | spring-like | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### 구현된 애니메이션 유틸리티

`src/app/globals.css`에 정의된 클래스들:

```css
/* 기본 애니메이션 */
.animate-fade-in    /* 페이드인 */
.animate-slide-up   /* 아래에서 위로 슬라이드 */
.animate-scale-in   /* 스케일 확대 */
.animate-shake      /* 흔들림 (에러) */

/* 전환 유틸리티 */
.transition-micro   /* 150ms ease-out */
.transition-fast    /* 200ms ease-out */

/* 인터랙션 */
.active-scale       /* 클릭 시 95% 축소 */
.hover-lift         /* 호버 시 살짝 위로 */
```

## 상황별 패턴

### 버튼 인터랙션

```tsx
// 기본 버튼 애니메이션
<Button className="transition-micro hover:scale-105 active:scale-95">
  클릭
</Button>

// 또는 유틸리티 클래스 사용
<Button className="hover-lift active-scale">
  클릭
</Button>
```

### 카드 호버

```tsx
<Card className="transition-fast hover:shadow-lg hover:-translate-y-1">
  <CardContent>콘텐츠</CardContent>
</Card>
```

### 모달/드롭다운 진입

```tsx
// 페이드 + 스케일
<div className="animate-fade-in animate-scale-in">
  <Modal />
</div>

// 슬라이드 업
<div className="animate-slide-up">
  <BottomSheet />
</div>
```

### 에러 피드백

```tsx
// 잘못된 입력 시 흔들림
<Input className={error ? 'animate-shake border-destructive' : ''} />
```

### 로딩 상태

```tsx
// 스피너
<div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />

// 펄스
<Skeleton className="animate-pulse" />
```

### 토스트 알림

```tsx
// 아래에서 슬라이드 업
<Toast className="animate-slide-up">저장되었습니다</Toast>
```

## Framer Motion 패턴 (고급)

복잡한 애니메이션이 필요한 경우 Framer Motion 사용:

```bash
npm install framer-motion
```

### 기본 사용

```tsx
import { motion } from 'framer-motion';

// 간단한 애니메이션
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  콘텐츠
</motion.div>;
```

### 리스트 스태거 애니메이션

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={item}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>;
```

### 페이지 전환

```tsx
// app/template.tsx
'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}
```

### 접근성 고려 Framer Motion

```tsx
import { motion, useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      콘텐츠
    </motion.div>
  );
}
```

## 체크리스트

### 애니메이션 추가 시

- [ ] 애니메이션의 목적이 명확한가?
- [ ] Duration이 적절한가? (150-500ms)
- [ ] GPU 가속 속성만 사용하는가? (transform, opacity)
- [ ] prefers-reduced-motion을 존중하는가?
- [ ] 모바일에서 성능 문제가 없는가?

### 하지 말아야 할 것

- ❌ 1초 이상의 긴 애니메이션
- ❌ 자동 재생 루프 애니메이션 (명확한 목적 없이)
- ❌ 레이아웃 속성 애니메이션 (width, height, margin)
- ❌ 과도한 spring/bounce 효과
- ❌ reduced-motion 설정 무시

## 관련 파일

- `src/app/globals.css` - 애니메이션 유틸리티 정의
- `.cursorrules` - 코딩 규칙
- `tailwind.config.js` - Tailwind 설정
