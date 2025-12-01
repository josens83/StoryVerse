/**
 * Security utilities for StoryVerse
 * Provides input validation, sanitization, and security helpers
 */

import { z } from 'zod';

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Simple rate limiter
 * In production, use Redis or a proper rate limiting service
 */
export function rateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { success: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { valid: boolean; sanitized: string } {
  const schema = z.string().email().max(255);
  const result = schema.safeParse(email.toLowerCase().trim());
  return {
    valid: result.success,
    sanitized: result.success ? result.data : '',
  };
}

/**
 * Validate username
 */
export function validateUsername(username: string): { valid: boolean; sanitized: string } {
  const schema = z
    .string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9가-힣_]+$/, '영문, 한글, 숫자, 밑줄만 허용됩니다');
  const result = schema.safeParse(username.trim());
  return {
    valid: result.success,
    sanitized: result.success ? result.data : '',
  };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다');
  }
  if (password.length > 100) {
    errors.push('비밀번호는 100자 이하여야 합니다');
  }
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('영문자를 포함해야 합니다');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Common security headers for API responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Validate content type for JSON APIs
 */
export function validateContentType(request: Request): boolean {
  const contentType = request.headers.get('content-type');
  return contentType?.includes('application/json') ?? false;
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Common Zod schemas for validation
 */
export const schemas = {
  id: z.string().uuid(),
  email: z.string().email().max(255),
  username: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9가-힣_]+$/),
  password: z.string().min(8).max(100),
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  search: z.string().max(100).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
};

/**
 * Escape SQL special characters (for use with parameterized queries)
 * Note: Always use parameterized queries, this is an additional safety measure
 */
export function escapeSqlWildcards(input: string): string {
  return input.replace(/[%_]/g, '\\$&');
}
