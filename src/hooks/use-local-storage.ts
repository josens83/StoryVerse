'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to localStorage changes
 */
function subscribeToStorage(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

/**
 * Custom hook for persisting state in localStorage
 * Uses useSyncExternalStore for proper SSR and hydration handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Server snapshot returns initial value
  const getServerSnapshot = useCallback(() => JSON.stringify(initialValue), [initialValue]);

  // Client snapshot reads from localStorage
  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ?? JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  // Subscribe to storage changes for cross-tab sync
  const storedString = useSyncExternalStore(subscribeToStorage, getSnapshot, getServerSnapshot);

  // Parse the stored value
  const storedValue = (() => {
    try {
      return JSON.parse(storedString) as T;
    } catch {
      return initialValue;
    }
  })();

  // Also keep in React state for immediate updates
  const [localValue, setLocalValue] = useState<T>(storedValue);

  // Setter function that updates both localStorage and state
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(localValue) : value;
        setLocalValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Dispatch storage event for cross-tab sync
          window.dispatchEvent(new StorageEvent('storage', { key }));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, localValue]
  );

  // Remove function
  const removeValue = useCallback(() => {
    try {
      setLocalValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [localValue, setValue, removeValue];
}

/**
 * Hook for reading localStorage without persisting (one-way read)
 */
export function useLocalStorageValue<T>(key: string, defaultValue: T): T {
  const getServerSnapshot = useCallback(() => JSON.stringify(defaultValue), [defaultValue]);

  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ?? JSON.stringify(defaultValue);
    } catch {
      return JSON.stringify(defaultValue);
    }
  }, [key, defaultValue]);

  const storedString = useSyncExternalStore(subscribeToStorage, getSnapshot, getServerSnapshot);

  try {
    return JSON.parse(storedString) as T;
  } catch {
    return defaultValue;
  }
}
