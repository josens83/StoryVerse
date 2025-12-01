/**
 * Centralized Business Constants
 *
 * All business-related magic numbers and configuration values
 * should be defined here for maintainability and consistency.
 */

// ===========================================
// Time Constants (in milliseconds)
// ===========================================
export const TIME = {
  /** One minute in milliseconds */
  MINUTE: 60 * 1000,
  /** One hour in milliseconds */
  HOUR: 60 * 60 * 1000,
  /** One day in milliseconds */
  DAY: 24 * 60 * 60 * 1000,
  /** One week in milliseconds */
  WEEK: 7 * 24 * 60 * 60 * 1000,
  /** 30 days in milliseconds */
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

// ===========================================
// Coin System Constants
// ===========================================
export const COINS = {
  /** Welcome bonus coins for new users */
  WELCOME_BONUS: 100,
  /** Days until earned coins expire */
  EARNED_EXPIRY_DAYS: 30,
  /** Minimum coins for a transaction */
  MIN_TRANSACTION: 1,
  /** Maximum coins per single purchase */
  MAX_SINGLE_PURCHASE: 100000,
} as const;

// ===========================================
// Authentication & Security Constants
// ===========================================
export const AUTH = {
  /** JWT token expiration time */
  JWT_EXPIRY: '7d',
  /** Maximum login attempts before rate limiting */
  LOGIN_MAX_ATTEMPTS: 5,
  /** Login rate limit window in milliseconds */
  LOGIN_RATE_LIMIT_WINDOW: TIME.MINUTE,
  /** Minimum password length */
  PASSWORD_MIN_LENGTH: 8,
  /** Maximum password length */
  PASSWORD_MAX_LENGTH: 100,
  /** Minimum username length */
  USERNAME_MIN_LENGTH: 2,
  /** Maximum username length */
  USERNAME_MAX_LENGTH: 20,
} as const;

// ===========================================
// Pagination Constants
// ===========================================
export const PAGINATION = {
  /** Default page number */
  DEFAULT_PAGE: 1,
  /** Default items per page */
  DEFAULT_LIMIT: 20,
  /** Maximum items per page */
  MAX_LIMIT: 50,
  /** Minimum items per page */
  MIN_LIMIT: 1,
} as const;

// ===========================================
// Reader Settings Constants
// ===========================================
export const READER = {
  /** Minimum font size in pixels */
  FONT_SIZE_MIN: 14,
  /** Maximum font size in pixels */
  FONT_SIZE_MAX: 28,
  /** Default font size in pixels */
  FONT_SIZE_DEFAULT: 18,
  /** Minimum line height multiplier */
  LINE_HEIGHT_MIN: 1.5,
  /** Maximum line height multiplier */
  LINE_HEIGHT_MAX: 2.5,
  /** Default line height multiplier */
  LINE_HEIGHT_DEFAULT: 1.8,
  /** Minimum brightness percentage */
  BRIGHTNESS_MIN: 0,
  /** Maximum brightness percentage */
  BRIGHTNESS_MAX: 100,
} as const;

// ===========================================
// Wait Free System Constants
// ===========================================
export const WAIT_FREE = {
  /** Hours to wait for free tier users */
  FREE_TIER_HOURS: 24,
  /** Hours to wait for VIP users */
  VIP_TIER_HOURS: 12,
  /** Hours to wait for SVIP users */
  SVIP_TIER_HOURS: 6,
} as const;

// ===========================================
// Cache Constants
// ===========================================
export const CACHE = {
  /** Default TTL in milliseconds */
  DEFAULT_TTL: 5 * TIME.MINUTE,
  /** Long TTL for static data */
  LONG_TTL: TIME.DAY,
  /** Short TTL for dynamic data */
  SHORT_TTL: TIME.MINUTE,
  /** Cleanup interval in milliseconds */
  CLEANUP_INTERVAL: TIME.MINUTE,
} as const;

// ===========================================
// Search Constants
// ===========================================
export const SEARCH = {
  /** Maximum search query length */
  MAX_QUERY_LENGTH: 100,
  /** Minimum search query length */
  MIN_QUERY_LENGTH: 1,
} as const;
