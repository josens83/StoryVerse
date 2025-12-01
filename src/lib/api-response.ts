/**
 * Standardized API Response utilities
 * Ensures consistent response format across all API routes
 */

import { NextResponse } from 'next/server';

import { ERROR_MESSAGES } from './constants';
import { securityHeaders } from './security';

// API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiPaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error codes for consistent error handling
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INSUFFICIENT_COINS: 'INSUFFICIENT_COINS',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Create a success response with security headers
 */
export function apiSuccess<T>(data: T, message?: string, status = 200): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  return NextResponse.json(response, {
    status,
    headers: securityHeaders,
  });
}

/**
 * Create an error response with security headers
 */
export function apiError(
  error: string,
  status = 400,
  code?: ErrorCode,
  details?: Record<string, unknown>
): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details }),
  };
  return NextResponse.json(response, {
    status,
    headers: securityHeaders,
  });
}

/**
 * Create a paginated success response
 */
export function apiPaginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  const response: ApiPaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
  return NextResponse.json(response, {
    status: 200,
    headers: securityHeaders,
  });
}

/**
 * Common error responses
 * Uses centralized error messages from ERROR_MESSAGES
 */
export const ApiErrors = {
  /** Authentication required (no token or invalid token) */
  unauthorized: (message = ERROR_MESSAGES.AUTH.UNAUTHORIZED) =>
    apiError(message, 401, ErrorCodes.AUTHENTICATION_REQUIRED),

  /** User authenticated but lacks permission */
  forbidden: (message = ERROR_MESSAGES.PERMISSION.FORBIDDEN) =>
    apiError(message, 403, ErrorCodes.FORBIDDEN),

  /** Resource not found */
  notFound: (resource = '리소스') =>
    apiError(ERROR_MESSAGES.RESOURCE.NOT_FOUND(resource), 404, ErrorCodes.NOT_FOUND),

  /** Too many requests */
  rateLimited: (retryAfter?: number) =>
    apiError(
      ERROR_MESSAGES.SERVER.RATE_LIMITED,
      429,
      ErrorCodes.RATE_LIMITED,
      retryAfter ? { retryAfter } : undefined
    ),

  /** Input validation failed */
  validation: (message: string) => apiError(message, 400, ErrorCodes.VALIDATION_ERROR),

  /** Internal server error */
  internal: (message = ERROR_MESSAGES.SERVER.INTERNAL_ERROR) =>
    apiError(message, 500, ErrorCodes.INTERNAL_ERROR),

  /** Not enough coins for operation */
  insufficientCoins: () =>
    apiError(ERROR_MESSAGES.COIN.INSUFFICIENT, 400, ErrorCodes.INSUFFICIENT_COINS),

  /** Bad request with custom message */
  badRequest: (message: string) => apiError(message, 400, ErrorCodes.BAD_REQUEST),

  /** Resource conflict (e.g., duplicate) */
  conflict: (message: string) => apiError(message, 409, ErrorCodes.CONFLICT),
};

/**
 * Wrap an async API handler with error handling
 */
export function withErrorHandling(handler: () => Promise<NextResponse>): Promise<NextResponse> {
  return handler().catch((error: unknown) => {
    console.error('API Error:', error);
    return ApiErrors.internal();
  });
}
