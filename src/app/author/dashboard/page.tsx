'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import type { Author, Novel } from '@/types';

interface AuthorAnalytics {
  overview: {
    totalViews: number;
    totalViewsChange: number;
    totalRevenue: number;
    totalRevenueChange: number;
    totalFollowers: number;
    totalFollowersChange: number;
    averageRating: number;
  };
  revenueByNovel: { novelId: string; title: string; revenue: number; percentage: number }[];
  viewsByDay: { date: string; views: number }[];
}

export default function AuthorDashboardPage() {
  const [author, setAuthor] = useState<Author | null>(null);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [analytics, setAnalytics] = useState<AuthorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'novels' | 'revenue' | 'settings'>(
    'overview'
  );

  const authorId = 'author-1';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, analyticsRes] = await Promise.all([
        fetch(`/api/author?authorId=${authorId}`),
        fetch(`/api/author?authorId=${authorId}&type=analytics`),
      ]);

      const profileData = await profileRes.json();
      const analyticsData = await analyticsRes.json();

      if (profileData.success) {
        setAuthor(profileData.data.author);
        setNovels(profileData.data.novels);
      }
      if (analyticsData.success) {
        setAnalytics(analyticsData.data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !author || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto" />
          <p className="mt-4 text-gray-500">대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
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
              <h1 className="text-xl font-bold">작가 스튜디오</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/author/write"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                새 챕터 작성
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 -mb-px">
            {[
              { id: 'overview', label: '개요' },
              { id: 'novels', label: '작품 관리' },
              { id: 'revenue', label: '수익' },
              { id: 'settings', label: '설정' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'overview' | 'novels' | 'revenue' | 'settings')
                }
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="총 조회수"
                value={analytics.overview.totalViews.toLocaleString()}
                change={analytics.overview.totalViewsChange}
                icon="👁️"
              />
              <StatCard
                title="총 수익"
                value={`₩${(analytics.overview.totalRevenue / 10000).toFixed(0)}만`}
                change={analytics.overview.totalRevenueChange}
                icon="💰"
              />
              <StatCard
                title="팔로워"
                value={analytics.overview.totalFollowers.toLocaleString()}
                change={analytics.overview.totalFollowersChange}
                icon="👥"
              />
              <StatCard
                title="평균 평점"
                value={analytics.overview.averageRating.toFixed(2)}
                icon="⭐"
              />
            </div>

            {/* Revenue & Views Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">최근 30일 조회수</h3>
                <div className="h-48 flex items-end gap-1">
                  {analytics.viewsByDay.slice(-30).map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(day.views / 50000) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">작품별 수익</h3>
                <div className="space-y-4">
                  {analytics.revenueByNovel.map((item) => (
                    <div key={item.novelId}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm truncate">{item.title}</span>
                        <span className="text-sm font-medium">
                          ₩{(item.revenue / 10000).toFixed(0)}만
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">작가 정보</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{author.tier.toUpperCase()}</p>
                  <p className="text-sm text-gray-500">작가 등급</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{author.totalNovels}</p>
                  <p className="text-sm text-gray-500">연재 작품</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{(author.totalWords / 10000).toFixed(0)}만</p>
                  <p className="text-sm text-gray-500">총 글자수</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">
                    {(author.revenueShareRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-500">수익 분배율</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'novels' && (
          <div className="space-y-4">
            {novels.map((novel) => (
              <div key={novel.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                <div className="w-20 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{novel.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {novel.totalChapters}화 · {(novel.totalWords / 10000).toFixed(0)}만자
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        novel.status === 'ongoing'
                          ? 'bg-green-100 text-green-700'
                          : novel.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {novel.status === 'ongoing'
                        ? '연재중'
                        : novel.status === 'completed'
                          ? '완결'
                          : '휴재'}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>👁️ {novel.viewCount.toLocaleString()}</span>
                    <span>❤️ {novel.likeCount.toLocaleString()}</span>
                    <span>⭐ {novel.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/author/write?novelId=${novel.id}`}
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      새 챕터
                    </Link>
                    <Link
                      href={`/author/novel/${novel.id}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                    >
                      관리
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">출금 가능 금액</p>
                  <p className="text-3xl font-bold mt-1">
                    ₩{author.withdrawableRevenue.toLocaleString()}
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50">
                  출금 신청
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/80 text-sm">정산 대기</p>
                  <p className="font-medium">₩{author.pendingRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">총 누적 수익</p>
                  <p className="font-medium">₩{author.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Revenue History */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">정산 내역</h3>
              <div className="space-y-3">
                {[
                  {
                    period: '2024년 11월',
                    gross: 12500000,
                    net: 8125000,
                    status: 'completed',
                  },
                  { period: '2024년 12월', gross: 7700000, net: 5005000, status: 'pending' },
                ].map((settlement, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{settlement.period}</p>
                      <p className="text-sm text-gray-500">
                        총 {(settlement.gross / 10000).toFixed(0)}만원
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₩{settlement.net.toLocaleString()}</p>
                      <p
                        className={`text-sm ${settlement.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {settlement.status === 'completed' ? '지급 완료' : '정산 예정'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-6">작가 설정</h3>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="author-pen-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  필명
                </label>
                <input
                  id="author-pen-name"
                  type="text"
                  defaultValue={author.penName}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="author-bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  소개
                </label>
                <textarea
                  id="author-bio"
                  rows={4}
                  defaultValue={author.bio}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="author-bank-account"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  정산 계좌
                </label>
                <div className="flex gap-2">
                  <select
                    id="author-bank"
                    aria-label="은행 선택"
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option>국민은행</option>
                    <option>신한은행</option>
                    <option>우리은행</option>
                    <option>하나은행</option>
                  </select>
                  <input
                    id="author-bank-account"
                    type="text"
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                저장
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change?: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
