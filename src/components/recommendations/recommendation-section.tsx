'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { GENRE_LABELS } from '@/types';

import type { Recommendation, RecommendationReason } from '@/types';

interface RecommendationSectionProps {
  title: string;
  type?: 'forYou' | 'trending' | 'newReleases' | 'related';
  novelId?: string;
  userId?: string;
  limit?: number;
}

const REASON_LABELS: Record<RecommendationReason, string> = {
  similar_genre: '비슷한 장르',
  same_author: '같은 작가',
  readers_also_liked: '독자들이 함께 본',
  trending: '인기 급상승',
  personalized: '맞춤 추천',
  new_release: '신작',
  editorial_pick: '에디터 추천',
};

export function RecommendationSection({
  title,
  type = 'forYou',
  novelId,
  userId,
  limit = 6,
}: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const params = new URLSearchParams();
        params.set('type', type);
        params.set('limit', String(limit));
        if (userId) {
          params.set('userId', userId);
        }
        if (novelId) {
          params.set('novelId', novelId);
        }

        const response = await fetch(`/api/recommendations?${params}`);
        const data = await response.json();

        if (data.success) {
          if (novelId && data.data.related) {
            setRecommendations(data.data.related);
          } else {
            setRecommendations(data.data.recommendations || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [type, novelId, userId, limit]);

  if (loading) {
    return (
      <section className="py-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link
          href={`/recommendations?type=${type}`}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          더보기 →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </section>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const novel = recommendation.novel;

  if (!novel) {
    return null;
  }

  return (
    <Link href={`/novel/${novel.id}`} className="group">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
        {/* Cover image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-4xl">📚</span>
        </div>

        {/* Recommendation reason badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            {REASON_LABELS[recommendation.reason]}
          </span>
        </div>

        {/* Exclusive badge */}
        {novel.isExclusive ? (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
              독점
            </span>
          </div>
        ) : null}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-medium">자세히 보기</span>
        </div>
      </div>

      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
        {novel.title}
      </h3>

      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        <span className="px-1.5 py-0.5 bg-gray-100 rounded">{GENRE_LABELS[novel.genre]}</span>
        <span>⭐ {novel.rating.toFixed(1)}</span>
      </div>

      <p className="text-xs text-gray-400 mt-1">
        {novel.totalChapters}화 · 조회 {formatNumber(novel.viewCount)}
      </p>
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}천만`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`;
  }
  return num.toString();
}
