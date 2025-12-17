/**
 * WebVitalsReporter Component
 *
 * Reports Core Web Vitals metrics for performance monitoring (Chapter 18).
 * Tracks LCP, INP, CLS, FCP, and TTFB to identify performance issues.
 *
 * @module components/analytics/web-vitals-reporter
 *
 * @example
 * // Add to layout.tsx or providers
 * <WebVitalsReporter />
 *
 * @see https://web.dev/vitals/
 */

'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useCallback } from 'react';

/** Core Web Vitals thresholds (in milliseconds) */
const THRESHOLDS = {
  // Largest Contentful Paint - Good < 2.5s, Poor > 4s
  LCP: { good: 2500, poor: 4000 },
  // Interaction to Next Paint - Good < 200ms, Poor > 500ms
  INP: { good: 200, poor: 500 },
  // Cumulative Layout Shift - Good < 0.1, Poor > 0.25 (unitless)
  CLS: { good: 0.1, poor: 0.25 },
  // First Contentful Paint - Good < 1.8s, Poor > 3s
  FCP: { good: 1800, poor: 3000 },
  // Time to First Byte - Good < 800ms, Poor > 1.8s
  TTFB: { good: 800, poor: 1800 },
};

type MetricName = keyof typeof THRESHOLDS;

/**
 * Get rating for a metric value
 */
function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (!threshold) {
    return 'needs-improvement';
  }

  if (value <= threshold.good) {
    return 'good';
  }
  if (value > threshold.poor) {
    return 'poor';
  }
  return 'needs-improvement';
}

/**
 * Format metric value for logging
 */
function formatValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

interface WebVitalsReporterProps {
  /** Enable console logging in development */
  debug?: boolean;
  /** Custom reporter function to send metrics to analytics */
  onReport?: (metric: {
    name: string;
    value: number;
    rating: string;
    id: string;
    navigationType: string;
  }) => void;
}

/**
 * Reports Core Web Vitals metrics
 *
 * Automatically tracks:
 * - LCP (Largest Contentful Paint): When main content loaded
 * - INP (Interaction to Next Paint): Input responsiveness
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): When first content rendered
 * - TTFB (Time to First Byte): Server response time
 */
export function WebVitalsReporter({ debug = false, onReport }: WebVitalsReporterProps) {
  const reportWebVital = useCallback(
    (metric: { id: string; name: string; value: number; navigationType: string }) => {
      const name = metric.name as MetricName;
      const rating = getRating(name, metric.value);

      // Log to console in development if debug is enabled
      if (debug && process.env.NODE_ENV === 'development') {
        const icon = rating === 'good' ? '✅' : rating === 'poor' ? '🔴' : '🟡';
        console.log(
          `${icon} [Web Vitals] ${metric.name}: ${formatValue(metric.name, metric.value)} (${rating})`
        );
      }

      // Send to custom analytics reporter
      if (onReport) {
        onReport({
          name: metric.name,
          value: metric.value,
          rating,
          id: metric.id,
          navigationType: metric.navigationType,
        });
      }

      // Send to analytics endpoint (production)
      if (process.env.NODE_ENV === 'production') {
        // Queue metrics to batch send
        sendToAnalytics({
          name: metric.name,
          value: metric.value,
          rating,
          id: metric.id,
          path: window.location.pathname,
          timestamp: Date.now(),
        });
      }
    },
    [debug, onReport]
  );

  useReportWebVitals(reportWebVital);

  // This component doesn't render anything
  return null;
}

/**
 * Analytics queue for batching metrics
 */
const metricsQueue: Array<{
  name: string;
  value: number;
  rating: string;
  id: string;
  path: string;
  timestamp: number;
}> = [];

let flushTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Send metrics to analytics endpoint (batched)
 */
function sendToAnalytics(metric: (typeof metricsQueue)[0]) {
  metricsQueue.push(metric);

  // Batch metrics and send after 1 second of inactivity
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }

  flushTimeout = setTimeout(() => {
    if (metricsQueue.length === 0) {
      return;
    }

    const body = JSON.stringify(metricsQueue);
    metricsQueue.length = 0;

    // Use sendBeacon for reliable delivery on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics are non-critical
      });
    }
  }, 1000);
}

// Flush metrics on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && metricsQueue.length > 0) {
      const body = JSON.stringify(metricsQueue);
      metricsQueue.length = 0;

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/vitals', body);
      }
    }
  });
}
