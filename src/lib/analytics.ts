/**
 * Analytics tracking utilities for StoryVerse
 * Provides event tracking for user behavior analysis
 */

import { logger } from './logger';

// Event types
export type AnalyticsEvent =
  | 'page_view'
  | 'novel_view'
  | 'chapter_read'
  | 'chapter_unlock'
  | 'coin_purchase'
  | 'coin_spend'
  | 'vip_subscribe'
  | 'search'
  | 'bookmark_add'
  | 'bookmark_remove'
  | 'like'
  | 'comment'
  | 'share'
  | 'author_follow'
  | 'tip_send'
  | 'ad_view'
  | 'ad_click'
  | 'signup'
  | 'login'
  | 'logout';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

interface UserProperties {
  userId?: string;
  tier?: 'free' | 'vip' | 'svip';
  isAuthor?: boolean;
}

class Analytics {
  private userProperties: UserProperties = {};
  private enabled: boolean;

  constructor() {
    // Disable in development unless explicitly enabled
    this.enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  }

  /**
   * Set user properties for all subsequent events
   */
  setUser(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties };
  }

  /**
   * Clear user properties (on logout)
   */
  clearUser(): void {
    this.userProperties = {};
  }

  /**
   * Track an event
   */
  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (!this.enabled) {
      // Log in development for debugging
      logger.debug(`[Analytics] ${event}`, { ...properties, ...this.userProperties });
      return;
    }

    const eventData = {
      event,
      properties: {
        ...properties,
        ...this.userProperties,
      },
      timestamp: new Date().toISOString(),
    };

    // Send to analytics service
    // In production, integrate with your analytics provider:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    this.sendToAnalytics(eventData);
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    this.track('page_view', { path, title });
  }

  /**
   * Track novel view
   */
  novelView(novelId: string, title: string, genre: string): void {
    this.track('novel_view', { novelId, title, genre });
  }

  /**
   * Track chapter read
   */
  chapterRead(
    novelId: string,
    chapterId: string,
    chapterNumber: number,
    readTimeSeconds: number
  ): void {
    this.track('chapter_read', { novelId, chapterId, chapterNumber, readTimeSeconds });
  }

  /**
   * Track chapter unlock
   */
  chapterUnlock(
    novelId: string,
    chapterId: string,
    method: 'coin' | 'ad' | 'wait_free' | 'vip',
    coinsSpent?: number
  ): void {
    this.track('chapter_unlock', { novelId, chapterId, method, coinsSpent });
  }

  /**
   * Track coin purchase
   */
  coinPurchase(amount: number, price: number, currency: string): void {
    this.track('coin_purchase', { amount, price, currency });
  }

  /**
   * Track search
   */
  search(query: string, resultsCount: number): void {
    this.track('search', { query, resultsCount });
  }

  /**
   * Track tip sent to author
   */
  tipSend(authorId: string, novelId: string, amount: number): void {
    this.track('tip_send', { authorId, novelId, amount });
  }

  /**
   * Send data to analytics service
   */
  private sendToAnalytics(data: unknown): void {
    // Implement based on your analytics provider
    // Example with fetch:
    /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => {
      logger.error('Failed to send analytics', err);
    });
    */

    // For now, just log
    logger.info('Analytics event', data as Record<string, unknown>);
  }
}

// Singleton instance
export const analytics = new Analytics();

/**
 * React hook for tracking page views
 */
export function usePageView(path: string, title?: string): void {
  // Track on mount
  if (typeof window !== 'undefined') {
    analytics.pageView(path, title);
  }
}
