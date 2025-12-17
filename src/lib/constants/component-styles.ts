/**
 * Component Styles - 일관된 컴포넌트 스타일 가이드
 *
 * 챕터 20.4에서 권장하는 컴포넌트별 스타일 패턴
 * 새로운 컴포넌트를 만들 때 이 가이드를 참조하세요
 *
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 20
 */

import { cn } from '@/lib/utils';

// 카드 스타일
export const cardStyles = {
  base: 'bg-card rounded-lg border shadow-sm',
  padding: {
    sm: 'p-4',
    DEFAULT: 'p-6',
    lg: 'p-8',
  },
  hover: 'hover:shadow-md transition-shadow duration-200',
  interactive: 'cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200',
} as const;

// 페이지 레이아웃 스타일
export const pageStyles = {
  // 컨테이너
  container: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
  containerNarrow: 'max-w-4xl mx-auto px-4 md:px-6',
  containerWide: 'max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8',

  // 섹션 간격
  section: 'py-8 md:py-12',
  sectionLarge: 'py-12 md:py-16 lg:py-20',
  sectionSmall: 'py-4 md:py-6',

  // 제목
  title: 'text-2xl font-bold mb-6',
  titleWithDescription: 'text-2xl font-bold mb-2',
  description: 'text-muted-foreground mb-6',

  // 헤더 영역
  header: 'flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6',
} as const;

// 폼 스타일
export const formStyles = {
  // 그룹
  group: 'space-y-4',
  groupCompact: 'space-y-3',

  // 필드
  field: 'space-y-2',
  fieldInline: 'flex items-center gap-2',

  // 레이블
  label:
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  labelRequired: "after:content-['*'] after:ml-0.5 after:text-destructive",

  // 힌트/에러
  hint: 'text-xs text-muted-foreground mt-1',
  error: 'text-xs text-destructive mt-1',

  // 버튼 그룹
  actions: 'flex gap-3 pt-4',
  actionsEnd: 'flex justify-end gap-3 pt-4',
} as const;

// 리스트 스타일
export const listStyles = {
  // 기본 리스트
  container: 'divide-y',
  item: 'py-4 first:pt-0 last:pb-0',
  itemInteractive: 'py-4 first:pt-0 last:pb-0 hover:bg-muted/50 -mx-4 px-4 transition-colors',

  // 그리드 리스트
  grid: {
    base: 'grid gap-4',
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 md:grid-cols-2',
    cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },

  // 빈 상태
  empty: 'py-12 text-center',
  emptyIcon: 'mx-auto h-12 w-12 text-muted-foreground/50',
  emptyTitle: 'mt-4 text-lg font-semibold',
  emptyDescription: 'mt-2 text-muted-foreground',
} as const;

// 테이블 스타일
export const tableStyles = {
  container: 'w-full overflow-auto',
  table: 'w-full caption-bottom text-sm',
  header: 'border-b',
  headerCell: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
  body: '[&_tr:last-child]:border-0',
  row: 'border-b transition-colors hover:bg-muted/50',
  cell: 'p-4 align-middle',
} as const;

// 모달/다이얼로그 스타일
export const modalStyles = {
  overlay: 'fixed inset-0 z-50 bg-black/80',
  content:
    'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-background rounded-lg shadow-lg',
  sizes: {
    sm: 'w-full max-w-sm',
    DEFAULT: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl',
    full: 'w-full max-w-[calc(100%-2rem)] h-[calc(100%-2rem)]',
  },
  header: 'flex flex-col space-y-1.5 text-center sm:text-left px-6 pt-6',
  title: 'text-lg font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  body: 'px-6 py-4',
  footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6',
} as const;

// 네비게이션 스타일
export const navStyles = {
  // 헤더 네비게이션
  header:
    'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  headerContainer: 'flex h-14 items-center px-4 md:px-6',

  // 사이드바
  sidebar: 'w-64 border-r bg-background h-screen sticky top-0',
  sidebarItem:
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted',
  sidebarItemActive: 'bg-muted font-medium',

  // 탭 네비게이션
  tabs: 'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
  tabItem:
    'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
  tabItemActive: 'bg-background text-foreground shadow-sm',

  // 하단 네비게이션 (모바일)
  bottomNav: 'fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden',
  bottomNavItem: 'flex flex-col items-center justify-center py-2 text-xs',
} as const;

// 배지/태그 스타일
export const badgeStyles = {
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  variants: {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    outline: 'text-foreground',
    success: 'border-transparent bg-green-500/10 text-green-600',
    warning: 'border-transparent bg-yellow-500/10 text-yellow-600',
  },
} as const;

// 버튼 레이아웃 패턴
export const buttonPatterns = {
  // 버튼 그룹
  group: 'flex items-center gap-2',
  groupStacked: 'flex flex-col gap-2 w-full',

  // 아이콘 버튼
  iconOnly: 'h-10 w-10 p-0 flex items-center justify-center',
  iconOnlySmall: 'h-8 w-8 p-0 flex items-center justify-center',
  iconOnlyLarge: 'h-12 w-12 p-0 flex items-center justify-center',

  // 로딩 상태
  loading: 'relative text-transparent pointer-events-none',
  loadingSpinner: 'absolute inset-0 flex items-center justify-center',
} as const;

// 입력 필드 패턴
export const inputPatterns = {
  // 검색
  search: 'pl-10',
  searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',

  // 비밀번호 토글
  password: 'pr-10',
  passwordToggle: 'absolute right-3 top-1/2 -translate-y-1/2',

  // 접두사/접미사
  withPrefix: 'pl-8',
  withSuffix: 'pr-8',
  prefix: 'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm',
  suffix: 'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm',
} as const;

// 애니메이션 패턴
export const animationPatterns = {
  // 페이드
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',

  // 슬라이드
  slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-200',
  slideInFromTop: 'animate-in slide-in-from-top-4 duration-200',
  slideInFromLeft: 'animate-in slide-in-from-left-4 duration-200',
  slideInFromRight: 'animate-in slide-in-from-right-4 duration-200',

  // 스케일
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',

  // 호버 효과
  hoverLift: 'transition-transform duration-200 hover:-translate-y-1',
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverGlow: 'transition-shadow duration-200 hover:shadow-lg',

  // 클릭 효과
  clickShrink: 'active:scale-95 transition-transform duration-100',
} as const;

// 반응형 패턴
export const responsivePatterns = {
  // 모바일에서 숨기기
  hideOnMobile: 'hidden md:block',
  hideOnDesktop: 'block md:hidden',

  // 모바일 풀 너비
  mobileFullWidth: 'w-full md:w-auto',

  // 스택 → 가로 배치
  stackToRow: 'flex flex-col md:flex-row',
  stackToRowGap: 'flex flex-col md:flex-row gap-4',

  // 그리드 반응형
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
} as const;

// 접근성 패턴
export const a11yPatterns = {
  // 스크린 리더 전용
  srOnly: 'sr-only',

  // 포커스 스타일
  focusVisible:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

  // 비활성화 스타일
  disabled: 'disabled:pointer-events-none disabled:opacity-50',

  // 터치 타겟 최소 크기
  touchTarget: 'min-h-11 min-w-11',
} as const;

// 스타일 조합 헬퍼
export function combineStyles(...styles: (string | undefined | null | false)[]): string {
  return cn(...styles.filter(Boolean));
}

// 전체 스타일 내보내기
export const componentStyles = {
  card: cardStyles,
  page: pageStyles,
  form: formStyles,
  list: listStyles,
  table: tableStyles,
  modal: modalStyles,
  nav: navStyles,
  badge: badgeStyles,
  button: buttonPatterns,
  input: inputPatterns,
  animation: animationPatterns,
  responsive: responsivePatterns,
  a11y: a11yPatterns,
} as const;

export type ComponentStyles = typeof componentStyles;
