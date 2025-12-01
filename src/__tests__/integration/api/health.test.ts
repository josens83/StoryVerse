import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GET } from '@/app/api/health/route';
import { isSupabaseConfigured } from '@/lib/supabase';

// Mock modules
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
  isSupabaseConfigured: vi.fn(),
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return healthy status when database is configured', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.uptime).toBeGreaterThanOrEqual(0);
    expect(data.checks.database.status).toBe('ok');
    expect(data.checks.memory).toBeDefined();
    expect(data.checks.memory.used).toBeGreaterThan(0);
    expect(data.checks.memory.total).toBeGreaterThan(0);
    expect(data.checks.memory.percentage).toBeGreaterThan(0);
    expect(data.checks.memory.percentage).toBeLessThanOrEqual(100);
  });

  it('should return degraded status when database is not configured', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200); // Still returns 200 for degraded
    expect(data.status).toBe('degraded');
    expect(data.checks.database.status).toBe('error');
    expect(data.checks.database.error).toBe('Database not configured');
  });

  it('should include proper timestamp format', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const response = await GET();
    const data = await response.json();

    // Verify ISO 8601 format
    const timestamp = new Date(data.timestamp);
    expect(timestamp.toISOString()).toBe(data.timestamp);
  });

  it('should track uptime correctly', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const response = await GET();
    const data = await response.json();

    // Uptime should be a non-negative integer
    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(data.uptime)).toBe(true);
  });

  it('should include version information', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const response = await GET();
    const data = await response.json();

    expect(data.version).toBeDefined();
    expect(typeof data.version).toBe('string');
  });

  it('should include memory metrics', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    const response = await GET();
    const data = await response.json();

    const { memory } = data.checks;
    expect(memory.used).toBeDefined();
    expect(memory.total).toBeDefined();
    expect(memory.percentage).toBeDefined();

    // Memory values should be positive numbers
    expect(memory.used).toBeGreaterThan(0);
    expect(memory.total).toBeGreaterThan(0);
    expect(memory.total).toBeGreaterThanOrEqual(memory.used);

    // Percentage should be between 0 and 100
    expect(memory.percentage).toBeGreaterThan(0);
    expect(memory.percentage).toBeLessThanOrEqual(100);
  });
});
