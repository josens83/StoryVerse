import { type NextRequest } from 'next/server';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';
import { ACHIEVEMENTS } from '@/types';

import type { ReadingStats, ReadingGoal, Genre } from '@/types';

// Mock reading stats data
function generateMockStats(userId: string): ReadingStats {
  const genres: Genre[] = ['fantasy', 'romance', 'action', 'regression', 'academy'];
  const genreStats = genres.map((genre) => ({
    genre,
    count: Math.floor(Math.random() * 50) + 10,
    percentage: 0,
  }));
  const totalGenreCount = genreStats.reduce((sum, g) => sum + g.count, 0);
  genreStats.forEach((g) => {
    g.percentage = Math.round((g.count / totalGenreCount) * 100);
  });
  genreStats.sort((a, b) => b.count - a.count);

  const readingByHour = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    minutes:
      hour >= 20 || hour <= 2
        ? Math.floor(Math.random() * 60) + 30
        : Math.floor(Math.random() * 20),
  }));

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const readingByDay = days.map((day) => ({
    day,
    minutes: Math.floor(Math.random() * 120) + 30,
  }));

  const months = ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
  const monthlyProgress = months.map((month) => ({
    month,
    chapters: Math.floor(Math.random() * 200) + 50,
    words: Math.floor(Math.random() * 500000) + 100000,
  }));

  const unlockedAchievements = ACHIEVEMENTS.slice(0, 4).map((achievement, i) => ({
    id: `ua-${i}`,
    achievementId: achievement.id,
    achievement,
    unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    progress: 100,
    maxProgress: 100,
  }));

  return {
    userId,
    totalNovels: 47,
    totalChapters: 2350,
    totalWords: 4720000,
    totalReadTime: 8640, // 144 hours
    averageReadSpeed: 450,
    longestStreak: 45,
    currentStreak: 12,
    favoriteGenres: genreStats,
    readingByHour,
    readingByDay,
    monthlyProgress,
    achievements: unlockedAchievements,
    rank: {
      overall: 1523,
      percentile: 92,
      tier: 'platinum',
    },
  };
}

// Mock reading goals
function generateMockGoals(userId: string): ReadingGoal[] {
  return [
    {
      id: 'goal-1',
      userId,
      type: 'daily',
      target: 10,
      unit: 'chapters',
      current: 7,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isCompleted: false,
      rewardCoins: 5,
    },
    {
      id: 'goal-2',
      userId,
      type: 'weekly',
      target: 50,
      unit: 'chapters',
      current: 35,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      rewardCoins: 30,
    },
    {
      id: 'goal-3',
      userId,
      type: 'monthly',
      target: 180,
      unit: 'minutes',
      current: 180,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      isCompleted: true,
      rewardCoins: 100,
    },
  ];
}

// GET /api/stats - Get user reading statistics
async function handleGetStats(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const stats = generateMockStats(userId);

  return apiSuccess(stats);
}

// GET /api/stats/goals - Get user reading goals
async function handleGetGoals(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const goals = generateMockGoals(userId);

  return apiSuccess({ goals });
}

// GET /api/stats/leaderboard - Get reading leaderboard
async function handleGetLeaderboard(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'weekly'; // daily, weekly, monthly, all
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);

  const leaderboard = Array.from({ length: limit }, (_, i) => ({
    rank: i + 1,
    userId: `user-${i + 1}`,
    username: `독서왕${i + 1}`,
    avatar: `/avatars/user-${i + 1}.jpg`,
    tier: i < 3 ? 'diamond' : i < 10 ? 'platinum' : i < 30 ? 'gold' : 'silver',
    chaptersRead: Math.floor(Math.random() * 500) + 100 - i * 5,
    readTime: Math.floor(Math.random() * 3000) + 500 - i * 20,
  }));

  return apiSuccess({
    period,
    leaderboard,
    updatedAt: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'goals') {
      return handleGetGoals(request);
    }

    if (action === 'leaderboard') {
      return handleGetLeaderboard(request);
    }

    return handleGetStats(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
