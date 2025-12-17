'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import { GENRE_LABELS } from '@/types';

import type { ReadingStats, ReadingGoal, Genre } from '@/types';

const TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-300 to-cyan-500',
  diamond: 'from-purple-400 to-pink-500',
};

const TIER_LABELS = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
  platinum: '플래티넘',
  diamond: '다이아몬드',
};

export default function StatsPage() {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'genres' | 'time' | 'achievements'>(
    'overview'
  );

  const userId = 'user-1';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, goalsRes] = await Promise.all([
        fetch(`/api/stats?userId=${userId}`),
        fetch(`/api/stats?action=goals&userId=${userId}`),
      ]);

      const statsData = await statsRes.json();
      const goalsData = await goalsRes.json();

      if (statsData.success) {
        setStats(statsData.data);
      }
      if (goalsData.success) {
        setGoals(goalsData.data.goals);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto" />
          <p className="mt-4 text-gray-500">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-14 gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">독서 통계</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Rank Card */}
        <div
          className={`bg-gradient-to-r ${TIER_COLORS[stats.rank.tier]} rounded-2xl p-6 text-white mb-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">나의 랭크</p>
              <h2 className="text-3xl font-bold mt-1">{TIER_LABELS[stats.rank.tier]}</h2>
              <p className="text-white/80 mt-2">상위 {100 - stats.rank.percentile}%</p>
            </div>
            <div className="text-right">
              <p className="text-6xl font-bold">#{stats.rank.overall.toLocaleString()}</p>
              <p className="text-white/80 mt-1">전체 순위</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-white/80 text-xs">연속 독서</p>
              <p className="font-bold">{stats.currentStreak}일</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-white/80 text-xs">최장 기록</p>
              <p className="font-bold">{stats.longestStreak}일</p>
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-semibold mb-4">독서 목표</h3>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {goal.type === 'daily' ? '일일' : goal.type === 'weekly' ? '주간' : '월간'} 목표
                  </span>
                  <span className="text-sm font-medium">
                    {goal.current}/{goal.target} {goal.unit === 'chapters' ? '화' : '분'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>
                {goal.rewardCoins ? (
                  <p className="text-xs text-gray-400 mt-1">달성 시 {goal.rewardCoins} 코인</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '개요' },
            { id: 'genres', label: '장르' },
            { id: 'time', label: '시간' },
            { id: 'achievements', label: '업적' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as 'overview' | 'genres' | 'time' | 'achievements')
              }
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="읽은 소설" value={stats.totalNovels} unit="권" icon="📚" />
            <StatCard title="읽은 화수" value={stats.totalChapters} unit="화" icon="📖" />
            <StatCard
              title="총 독서 시간"
              value={Math.floor(stats.totalReadTime / 60)}
              unit="시간"
              icon="⏱️"
            />
            <StatCard
              title="읽은 글자 수"
              value={Math.floor(stats.totalWords / 10000)}
              unit="만자"
              icon="📝"
            />
            <StatCard
              title="평균 독서 속도"
              value={stats.averageReadSpeed}
              unit="자/분"
              icon="⚡"
            />
            <StatCard title="획득 업적" value={stats.achievements.length} unit="개" icon="🏆" />
          </div>
        )}

        {activeTab === 'genres' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4">장르별 독서량</h3>
            <div className="space-y-3">
              {stats.favoriteGenres.map((g, i) => (
                <div key={g.genre}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2">
                      {i === 0 && '👑'}
                      {GENRE_LABELS[g.genre as Genre]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {g.count}권 ({g.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${g.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">시간대별 독서량</h3>
              <div className="h-32 flex items-end gap-1">
                {stats.readingByHour.map((h) => (
                  <div key={h.hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(h.minutes / 90) * 100}%` }}
                    />
                    {h.hour % 6 === 0 && (
                      <span className="text-xs text-gray-400 mt-1">{h.hour}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">요일별 독서량</h3>
              <div className="flex gap-2">
                {stats.readingByDay.map((d) => (
                  <div key={d.day} className="flex-1 text-center">
                    <div
                      className="w-full bg-blue-500 rounded-t mx-auto mb-2"
                      style={{ height: `${(d.minutes / 150) * 80}px` }}
                    />
                    <span className="text-xs text-gray-500">{d.day}</span>
                    <p className="text-xs text-gray-400">{d.minutes}분</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-4">
            {stats.achievements.map((ua) => (
              <div key={ua.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl mb-2">{ua.achievement.icon || '🏆'}</div>
                <h4 className="font-medium">{ua.achievement.name}</h4>
                <p className="text-sm text-gray-500">{ua.achievement.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(ua.unlockedAt).toLocaleDateString('ko-KR')} 달성
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
  icon,
}: {
  title: string;
  value: number;
  unit: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value.toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
