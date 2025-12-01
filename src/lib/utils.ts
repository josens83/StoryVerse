import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Threshold configuration for number formatting (reduces cyclomatic complexity)
const NUMBER_THRESHOLDS = [
  { min: 100_000_000, divisor: 100_000_000, unit: '억' },
  { min: 10_000, divisor: 10_000, unit: '만' },
  { min: 1_000, divisor: 1_000, unit: '천' },
] as const;

export function formatNumber(num: number): string {
  const formatWithUnit = (value: number, unit: string): string => {
    const fixed = value.toFixed(1);
    const parsed = parseFloat(fixed);
    return fixed.endsWith('.0') ? `${Math.round(parsed)}${unit}` : `${fixed}${unit}`;
  };

  const threshold = NUMBER_THRESHOLDS.find((t) => num >= t.min);
  if (threshold) {
    return formatWithUnit(num / threshold.divisor, threshold.unit);
  }
  return num.toLocaleString();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
}

// Relative time thresholds (reduces cyclomatic complexity in formatDate)
const RELATIVE_TIME_THRESHOLDS = [
  { maxSeconds: 60, format: () => '방금 전' },
  { maxSeconds: 3600, format: (s: number) => `${Math.floor(s / 60)}분 전` },
  { maxSeconds: 86400, format: (s: number) => `${Math.floor(s / 3600)}시간 전` },
  { maxSeconds: 604800, format: (s: number) => `${Math.floor(s / 86400)}일 전` },
  { maxSeconds: 2592000, format: (s: number) => `${Math.floor(s / 604800)}주 전` },
  { maxSeconds: 31536000, format: (s: number) => `${Math.floor(s / 2592000)}개월 전` },
] as const;

function formatRelativeTime(seconds: number): string {
  const threshold = RELATIVE_TIME_THRESHOLDS.find((t) => seconds < t.maxSeconds);
  if (threshold) {
    return threshold.format(seconds);
  }
  return `${Math.floor(seconds / 31536000)}년 전`;
}

export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
    return formatRelativeTime(seconds);
  }

  if (format === 'long') {
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCountdown(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return '해금됨';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${mins}분`;
}

export function formatWordCount(words: number): string {
  if (words >= 10000) {
    const value = words / 10000;
    const fixed = value.toFixed(1);
    return fixed.endsWith('.0') ? `${Math.floor(value)}만자` : `${fixed}만자`;
  }
  return `${words.toLocaleString()}자`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

export function calculateReadingProgress(currentChapter: number, totalChapters: number): number {
  if (totalChapters === 0) {
    return 0;
  }
  return Math.round((currentChapter / totalChapters) * 100);
}

export function isVipExpired(expiresAt?: Date | null): boolean {
  if (!expiresAt) {
    return true;
  }
  return new Date(expiresAt) < new Date();
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
