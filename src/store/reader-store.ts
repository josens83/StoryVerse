'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { READER } from '@/lib/constants';
import {
  type ReaderSettings,
  DEFAULT_READER_SETTINGS,
  type ReaderTheme,
  type FontFamily,
  type PageMode,
} from '@/types';

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
      setFontSize: (fontSize) =>
        set({ fontSize: Math.min(READER.FONT_SIZE_MAX, Math.max(READER.FONT_SIZE_MIN, fontSize)) }),
      setLineHeight: (lineHeight) =>
        set({
          lineHeight: Math.min(
            READER.LINE_HEIGHT_MAX,
            Math.max(READER.LINE_HEIGHT_MIN, lineHeight)
          ),
        }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setPageMode: (pageMode) => set({ pageMode }),
      setBrightness: (brightness) =>
        set({
          brightness: Math.min(READER.BRIGHTNESS_MAX, Math.max(READER.BRIGHTNESS_MIN, brightness)),
        }),
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
