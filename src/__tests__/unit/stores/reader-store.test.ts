import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useReaderStore } from '@/store/reader-store';
import { DEFAULT_READER_SETTINGS } from '@/types';

describe('useReaderStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useReaderStore());
    act(() => {
      result.current.resetSettings();
    });
  });

  describe('Initial State', () => {
    it('should have default reader settings', () => {
      const { result } = renderHook(() => useReaderStore());

      expect(result.current.theme).toBe(DEFAULT_READER_SETTINGS.theme);
      expect(result.current.fontSize).toBe(DEFAULT_READER_SETTINGS.fontSize);
      expect(result.current.lineHeight).toBe(DEFAULT_READER_SETTINGS.lineHeight);
      expect(result.current.fontFamily).toBe(DEFAULT_READER_SETTINGS.fontFamily);
      expect(result.current.pageMode).toBe(DEFAULT_READER_SETTINGS.pageMode);
      expect(result.current.brightness).toBe(DEFAULT_READER_SETTINGS.brightness);
      expect(result.current.autoScroll).toBe(DEFAULT_READER_SETTINGS.autoScroll);
      expect(result.current.autoScrollSpeed).toBe(DEFAULT_READER_SETTINGS.autoScrollSpeed);
    });

    it('should have correct UI state', () => {
      const { result } = renderHook(() => useReaderStore());

      expect(result.current.isSettingsOpen).toBe(false);
      expect(result.current.isMenuVisible).toBe(true);
      expect(result.current.currentProgress).toBe(0);
    });
  });

  describe('Theme', () => {
    it('should set theme to light', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('should set theme to dark', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should set theme to sepia', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setTheme('sepia');
      });

      expect(result.current.theme).toBe('sepia');
    });

    it('should set theme to green', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setTheme('green');
      });

      expect(result.current.theme).toBe('green');
    });
  });

  describe('Font Size', () => {
    it('should set font size within valid range', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setFontSize(22);
      });

      expect(result.current.fontSize).toBe(22);
    });

    it('should clamp font size to minimum (14)', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setFontSize(10);
      });

      expect(result.current.fontSize).toBe(14);
    });

    it('should clamp font size to maximum (28)', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setFontSize(50);
      });

      expect(result.current.fontSize).toBe(28);
    });
  });

  describe('Line Height', () => {
    it('should set line height within valid range', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setLineHeight(2.0);
      });

      expect(result.current.lineHeight).toBe(2.0);
    });

    it('should clamp line height to minimum (1.5)', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setLineHeight(1.0);
      });

      expect(result.current.lineHeight).toBe(1.5);
    });

    it('should clamp line height to maximum (2.5)', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setLineHeight(3.0);
      });

      expect(result.current.lineHeight).toBe(2.5);
    });
  });

  describe('Font Family', () => {
    it('should set font family to system', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setFontFamily('system');
      });

      expect(result.current.fontFamily).toBe('system');
    });

    it('should set font family to nanum', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setFontFamily('nanum');
      });

      expect(result.current.fontFamily).toBe('nanum');
    });

    it('should set font family to gothic', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setFontFamily('gothic');
      });

      expect(result.current.fontFamily).toBe('gothic');
    });
  });

  describe('Page Mode', () => {
    it('should set page mode to scroll', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setPageMode('scroll');
      });

      expect(result.current.pageMode).toBe('scroll');
    });

    it('should set page mode to pagination', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setPageMode('pagination');
      });

      expect(result.current.pageMode).toBe('pagination');
    });
  });

  describe('Brightness', () => {
    it('should set brightness within valid range', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setBrightness(75);
      });

      expect(result.current.brightness).toBe(75);
    });

    it('should clamp brightness to minimum (0)', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setBrightness(-10);
      });

      expect(result.current.brightness).toBe(0);
    });

    it('should clamp brightness to maximum (100)', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setBrightness(150);
      });

      expect(result.current.brightness).toBe(100);
    });
  });

  describe('Auto Scroll', () => {
    it('should enable auto scroll', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setAutoScroll(true);
      });

      expect(result.current.autoScroll).toBe(true);
    });

    it('should disable auto scroll', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setAutoScroll(true);
      });

      act(() => {
        result.current.setAutoScroll(false);
      });

      expect(result.current.autoScroll).toBe(false);
    });

    it('should set auto scroll speed', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setAutoScrollSpeed(75);
      });

      expect(result.current.autoScrollSpeed).toBe(75);
    });
  });

  describe('UI State', () => {
    it('should toggle settings open/closed', () => {
      const { result } = renderHook(() => useReaderStore());

      expect(result.current.isSettingsOpen).toBe(false);

      act(() => {
        result.current.toggleSettings();
      });

      expect(result.current.isSettingsOpen).toBe(true);

      act(() => {
        result.current.toggleSettings();
      });

      expect(result.current.isSettingsOpen).toBe(false);
    });

    it('should toggle menu visibility', () => {
      const { result } = renderHook(() => useReaderStore());

      expect(result.current.isMenuVisible).toBe(true);

      act(() => {
        result.current.toggleMenu();
      });

      expect(result.current.isMenuVisible).toBe(false);

      act(() => {
        result.current.toggleMenu();
      });

      expect(result.current.isMenuVisible).toBe(true);
    });

    it('should set progress', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setProgress(50);
      });

      expect(result.current.currentProgress).toBe(50);
    });
  });

  describe('Reset Settings', () => {
    it('should reset all settings to defaults', () => {
      const { result } = renderHook(() => useReaderStore());

      // Change all settings
      act(() => {
        result.current.setTheme('dark');
        result.current.setFontSize(24);
        result.current.setLineHeight(2.2);
        result.current.setFontFamily('nanum');
        result.current.setPageMode('pagination');
        result.current.setBrightness(80);
        result.current.setAutoScroll(true);
        result.current.setAutoScrollSpeed(75);
      });

      // Verify changes
      expect(result.current.theme).toBe('dark');
      expect(result.current.fontSize).toBe(24);

      // Reset
      act(() => {
        result.current.resetSettings();
      });

      // Verify reset to defaults
      expect(result.current.theme).toBe(DEFAULT_READER_SETTINGS.theme);
      expect(result.current.fontSize).toBe(DEFAULT_READER_SETTINGS.fontSize);
      expect(result.current.lineHeight).toBe(DEFAULT_READER_SETTINGS.lineHeight);
      expect(result.current.fontFamily).toBe(DEFAULT_READER_SETTINGS.fontFamily);
      expect(result.current.pageMode).toBe(DEFAULT_READER_SETTINGS.pageMode);
      expect(result.current.brightness).toBe(DEFAULT_READER_SETTINGS.brightness);
      expect(result.current.autoScroll).toBe(DEFAULT_READER_SETTINGS.autoScroll);
      expect(result.current.autoScrollSpeed).toBe(DEFAULT_READER_SETTINGS.autoScrollSpeed);
    });
  });

  describe('Multiple Settings Changes', () => {
    it('should handle multiple concurrent changes', () => {
      const { result } = renderHook(() => useReaderStore());

      act(() => {
        result.current.setTheme('sepia');
        result.current.setFontSize(20);
        result.current.setBrightness(90);
      });

      expect(result.current.theme).toBe('sepia');
      expect(result.current.fontSize).toBe(20);
      expect(result.current.brightness).toBe(90);
    });
  });
});
