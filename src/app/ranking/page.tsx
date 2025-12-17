/**
 * Ranking Page
 *
 * Displays ranked lists of novels by various criteria.
 *
 * @module app/ranking
 */

'use client';

import { TrendingUp, TrendingDown, Minus, Eye, Star, Heart, Flame } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';
import { formatNumber } from '@/lib/utils';
import { GENRE_LABELS } from '@/types';

import type { Novel, Genre } from '@/types';

type RankingType = 'daily' | 'weekly' | 'monthly' | 'total';
type RankingCategory = 'views' | 'rating' | 'favorites' | 'trending';

interface RankingItem {
  rank: number;
  novel: Novel;
  change: number;
}

interface RankingData {
  rankings: RankingItem[];
  type: RankingType;
  category: RankingCategory;
  updatedAt: string;
}

const TYPE_OPTIONS: { value: RankingType; label: string }[] = [
  { value: 'daily', label: '일간' },
  { value: 'weekly', label: '주간' },
  { value: 'monthly', label: '월간' },
  { value: 'total', label: '전체' },
];

const CATEGORY_OPTIONS: { value: RankingCategory; label: string; icon: typeof Eye }[] = [
  { value: 'trending', label: '실시간', icon: Flame },
  { value: 'views', label: '조회수', icon: Eye },
  { value: 'rating', label: '평점', icon: Star },
  { value: 'favorites', label: '선호작', icon: Heart },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-white">
        1
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-white">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white">
        3
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center text-sm font-medium text-gray-500">
      {rank}
    </div>
  );
}

function RankChange({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="flex items-center text-xs text-green-500">
        <TrendingUp className="mr-0.5 h-3 w-3" />
        {change}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="flex items-center text-xs text-red-500">
        <TrendingDown className="mr-0.5 h-3 w-3" />
        {Math.abs(change)}
      </span>
    );
  }
  return (
    <span className="flex items-center text-xs text-gray-400">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function RankingCard({ item }: { item: RankingItem }) {
  const router = useRouter();
  const { rank, novel, change } = item;

  return (
    <Card
      className="flex cursor-pointer items-center gap-4 p-4 transition-shadow hover:shadow-md"
      onClick={() => router.push(`/novel/${novel.id}`)}
    >
      <div className="flex flex-col items-center gap-1">
        <RankBadge rank={rank} />
        <RankChange change={change} />
      </div>

      <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        <div className="flex h-full items-center justify-center text-2xl">
          {novel.genre === 'fantasy' && '🗡️'}
          {novel.genre === 'romance' && '💕'}
          {novel.genre === 'modern' && '🏙️'}
          {novel.genre === 'martial_arts' && '🥋'}
          {novel.genre === 'game' && '🎮'}
          {!['fantasy', 'romance', 'modern', 'martial_arts', 'game'].includes(novel.genre) && '📖'}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{novel.title}</h3>
          {novel.isExclusive ? (
            <Badge variant="primary" size="sm">
              독점
            </Badge>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="secondary" size="sm">
            {GENRE_LABELS[novel.genre]}
          </Badge>
          <Badge
            variant={
              novel.status === 'ongoing'
                ? 'ongoing'
                : novel.status === 'completed'
                  ? 'completed'
                  : 'hiatus'
            }
            size="sm"
          >
            {novel.status === 'ongoing' ? '연재중' : novel.status === 'completed' ? '완결' : '휴재'}
          </Badge>
        </div>

        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(novel.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" />
            {novel.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {formatNumber(novel.favoriteCount)}
          </span>
        </div>
      </div>
    </Card>
  );
}

function RankingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = (searchParams.get('type') as RankingType) || 'daily';
  const initialCategory = (searchParams.get('category') as RankingCategory) || 'trending';
  const initialGenre = (searchParams.get('genre') as Genre) || '';

  const [type, setType] = useState<RankingType>(initialType);
  const [category, setCategory] = useState<RankingCategory>(initialCategory);
  const [genre, setGenre] = useState<Genre | ''>(initialGenre);
  const [data, setData] = useState<RankingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRankings = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    params.set('type', type);
    params.set('category', category);
    if (genre) {
      params.set('genre', genre);
    }
    params.set('limit', '20');

    try {
      const response = await fetch(`/api/ranking?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Ranking fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [type, category, genre]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const updateParams = (newType: RankingType, newCategory: RankingCategory, newGenre: string) => {
    const params = new URLSearchParams();
    params.set('type', newType);
    params.set('category', newCategory);
    if (newGenre) {
      params.set('genre', newGenre);
    }
    router.push(`/ranking?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">랭킹</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          가장 인기있는 작품들을 확인해 보세요
        </p>
      </div>

      {/* Type Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setType(option.value);
              updateParams(option.value, category, genre);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              type === option.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto border-b border-gray-200 pb-4 dark:border-gray-700">
        {CATEGORY_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => {
                setCategory(option.value);
                updateParams(type, option.value, genre);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                category === option.value
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Genre Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge
          variant={genre === '' ? 'primary' : 'secondary'}
          className="cursor-pointer"
          onClick={() => {
            setGenre('');
            updateParams(type, category, '');
          }}
        >
          전체
        </Badge>
        {Object.entries(GENRE_LABELS).map(([key, label]) => (
          <Badge
            key={key}
            variant={genre === key ? 'primary' : 'secondary'}
            className="cursor-pointer"
            onClick={() => {
              setGenre(key as Genre);
              updateParams(type, category, key);
            }}
          >
            {label}
          </Badge>
        ))}
      </div>

      {/* Rankings */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data?.rankings.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">랭킹 데이터가 없습니다</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data?.rankings.map((item) => (
            <RankingCard key={item.novel.id} item={item} />
          ))}
        </div>
      )}

      {/* Last Updated */}
      {data ? (
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          마지막 업데이트: {new Date(data.updatedAt).toLocaleString('ko-KR')}
        </p>
      ) : null}
    </div>
  );
}

export default function RankingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <RankingContent />
    </Suspense>
  );
}
