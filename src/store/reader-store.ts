'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReaderSettings, DEFAULT_READER_SETTINGS, ReaderTheme, FontFamily, PageMode } from '@/types';

interface ReaderState extends ReaderSettings {
  isSettingsOpen: boolean;
  isMenuVisible: boolean;
  currentProgress: number;

  // Actions
  setTheme: (theme: ReaderTheme) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setPageMode: (mode: PageMode) => void;
  setBrightness: (brightness: number) => void;
  setAutoScroll: (enabled: boolean) => void;
  setAutoScrollSpeed: (speed: number) => void;
  toggleSettings: () => void;
  toggleMenu: () => void;
  setProgress: (progress: number) => void;
  resetSettings: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      ...DEFAULT_READER_SETTINGS,
      isSettingsOpen: false,
      isMenuVisible: true,
      currentProgress: 0,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize: Math.min(28, Math.max(14, fontSize)) }),
      setLineHeight: (lineHeight) => set({ lineHeight: Math.min(2.5, Math.max(1.5, lineHeight)) }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setPageMode: (pageMode) => set({ pageMode }),
      setBrightness: (brightness) => set({ brightness: Math.min(100, Math.max(0, brightness)) }),
      setAutoScroll: (autoScroll) => set({ autoScroll }),
      setAutoScrollSpeed: (autoScrollSpeed) => set({ autoScrollSpeed }),
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      toggleMenu: () => set((state) => ({ isMenuVisible: !state.isMenuVisible })),
      setProgress: (currentProgress) => set({ currentProgress }),
      resetSettings: () => set(DEFAULT_READER_SETTINGS),
    }),
    {
      name: 'storyverse-reader',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        fontFamily: state.fontFamily,
        pageMode: state.pageMode,
        brightness: state.brightness,
        autoScroll: state.autoScroll,
        autoScrollSpeed: state.autoScrollSpeed,
      }),
    }
  )
);
