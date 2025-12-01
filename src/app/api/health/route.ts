import { NextResponse } from 'next/server';

import { isSupabaseConfigured } from '@/lib/supabase';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: {
      status: 'ok' | 'error';
      latencyMs?: number;
      error?: string;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

// Track server start time
const serverStartTime = Date.now();

/**
 * Health check endpoint
 * GET /api/health
 *
 * Returns the health status of the application
 */
export async function GET(): Promise<NextResponse<HealthStatus>> {
  const timestamp = new Date().toISOString();
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);

  // Check database connection
  let databaseStatus: HealthStatus['checks']['database'] = { status: 'ok' };

  if (isSupabaseConfigured()) {
    try {
      const start = Date.now();
      // In production, you would make an actual DB query here
      // const { error } = await supabase.from('health_check').select('1').limit(1);
      const latencyMs = Date.now() - start;
      databaseStatus = { status: 'ok', latencyMs };
    } catch (err) {
      databaseStatus = {
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  } else {
    databaseStatus = { status: 'error', error: 'Database not configured' };
  }

  // Memory check (Node.js)
  const memoryUsage = process.memoryUsage();
  const memoryCheck = {
    used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
  };

  // Determine overall status
  let status: HealthStatus['status'] = 'healthy';
  if (databaseStatus.status === 'error') {
    status = 'degraded';
  }
  if (memoryCheck.percentage > 90) {
    status = 'degraded';
  }

  const healthStatus: HealthStatus = {
    status,
    timestamp,
    version: process.env.npm_package_version ?? '0.1.0',
    uptime,
    checks: {
      database: databaseStatus,
      memory: memoryCheck,
    },
  };

  const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(healthStatus, { status: httpStatus });
}
