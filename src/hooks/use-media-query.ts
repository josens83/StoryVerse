'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Custom hook for responsive design using CSS media queries
 * Returns true if the media query matches
 * Uses useSyncExternalStore for proper hydration handling
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  // Server-side always returns false to prevent hydration mismatch
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Predefined breakpoint hooks matching Tailwind CSS defaults
 */
export function useIsMobile(): boolean {
  const isAbove768 = useMediaQuery('(min-width: 768px)');
  return !isAbove768;
}

export function useIsTablet(): boolean {
  const isAbove768 = useMediaQuery('(min-width: 768px)');
  const isAbove1024 = useMediaQuery('(min-width: 1024px)');
  return isAbove768 && !isAbove1024;
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
