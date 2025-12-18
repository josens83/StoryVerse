/**
 * Lighthouse CI Configuration
 * Based on Solo Developer Workflow Guide Chapter 15
 *
 * Usage:
 * 1. npm install -g @lhci/cli
 * 2. npm run build && npm run start (in another terminal)
 * 3. lhci autorun
 */
module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/login',
        'http://localhost:3000/register',
        'http://localhost:3000/genre',
        'http://localhost:3000/ranking',
      ],
      // Start command for the server
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      // Number of runs for averaging
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Performance score minimum 80%
        'categories:performance': ['warn', { minScore: 0.8 }],

        // Accessibility score minimum 90%
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Best practices minimum 80%
        'categories:best-practices': ['warn', { minScore: 0.8 }],

        // SEO score minimum 80%
        'categories:seo': ['warn', { minScore: 0.8 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],

        // Accessibility specific
        bypass: 'error',
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        label: 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
      },
    },
    upload: {
      // Free temporary storage for reports
      target: 'temporary-public-storage',
    },
  },
};
