import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { type NextRequest, type NextResponse } from 'next/server';

import { type User } from '@/types';

/**
 * JWT Secret Key
 * @throws Error if JWT_SECRET environment variable is not set in production
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production');
    }
    // Development fallback - logs warning
    console.warn('⚠️ JWT_SECRET not set. Using development default. Set JWT_SECRET in production!');
    return 'dev-only-secret-DO-NOT-USE-IN-PRODUCTION';
  }

  // Validate secret strength (minimum 32 characters recommended)
  if (secret.length < 32) {
    console.warn('⚠️ JWT_SECRET should be at least 32 characters for security');
  }

  return secret;
}

const JWT_SECRET = getJWTSecret();
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  tier: User['tier'];
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const cookie = request.cookies.get('auth-token');
  return cookie?.value || null;
}

export function getCurrentUser(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = getCurrentUser(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete('auth-token');
}
