/**
 * Design Tokens - 디자인 시스템의 핵심 값들
 *
 * 챕터 20.4에서 권장하는 미니 디자인 시스템
 * Tailwind CSS와 함께 사용하여 일관성 있는 UI를 구현
 *
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 20
 */

// 색상 팔레트 (CSS 변수 참조용)
export const colors = {
  // 주요 색상 (Tailwind CSS 변수와 매핑)
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  // 배경/전경
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',

  // 테두리/입력
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
} as const;

// 간격 시스템 (4px 기반)
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px (최소 터치 타겟)
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// 반경 시스템
export const radius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)', // 작은 요소
  DEFAULT: 'var(--radius)', // 기본
  md: 'calc(var(--radius) - 2px)', // 중간
  lg: 'var(--radius)', // 큰 요소
  xl: 'calc(var(--radius) + 4px)', // 카드 등
  '2xl': 'calc(var(--radius) + 8px)',
  '3xl': 'calc(var(--radius) + 12px)',
  full: '9999px', // 원형
} as const;

// 그림자 시스템
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// 타이포그래피 스케일
export const typography = {
  // 제목 스타일 (Tailwind 클래스)
  h1: 'text-4xl font-bold tracking-tight lg:text-5xl',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold tracking-tight',

  // 본문 스타일
  body: 'text-base leading-7',
  bodyLarge: 'text-lg leading-8',
  bodySmall: 'text-sm leading-6',

  // 보조 텍스트
  muted: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground',

  // 특수 용도
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
} as const;

// 브레이크포인트 (참조용 - Tailwind 기본값과 동일)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 트랜지션 시스템
export const transitions = {
  // 지속 시간
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // 이징 함수
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // 프리셋 (Tailwind 클래스)
  presets: {
    colors: 'transition-colors duration-200',
    opacity: 'transition-opacity duration-200',
    transform: 'transition-transform duration-200',
    all: 'transition-all duration-200',
    shadow: 'transition-shadow duration-200',
  },
} as const;

// z-index 레이어 시스템
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  max: 9999,
} as const;

// 아이콘 크기 (lucide-react와 함께 사용)
export const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  DEFAULT: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
} as const;

// 아바타 크기
export const avatarSizes = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  DEFAULT: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-20 w-20',
} as const;

// 컨테이너 최대 너비
export const containerWidths = {
  prose: 'max-w-prose', // 65ch - 읽기 콘텐츠
  sm: 'max-w-sm', // 384px
  md: 'max-w-md', // 448px - 폼
  lg: 'max-w-lg', // 512px - 폼
  xl: 'max-w-xl', // 576px
  '2xl': 'max-w-2xl', // 672px
  '4xl': 'max-w-4xl', // 896px
  '6xl': 'max-w-6xl', // 1152px
  '7xl': 'max-w-7xl', // 1280px - 카드 그리드
  full: 'max-w-full',
  screen: 'max-w-screen-xl',
} as const;

// 전체 토큰 내보내기
export const designTokens = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
  breakpoints,
  transitions,
  zIndex,
  iconSizes,
  avatarSizes,
  containerWidths,
} as const;

export type DesignTokens = typeof designTokens;
