/**
 * Genre Page
 *
 * Browse novels by genre with filtering and sorting options.
 *
 * @module app/genre
 */

'use client';

import {
  Swords,
  Heart,
  Building2,
  Dumbbell,
  Gamepad2,
  Ghost,
  Coffee,
  Compass,
  RotateCcw,
  GraduationCap,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';
import { formatNumber } from '@/lib/utils';
import { GENRE_LABELS } from '@/types';

import type { Novel, Genre } from '@/types';

const GENRE_ICONS: Record<Genre, typeof Swords> = {
  fantasy: Swords,
  romance: Heart,
  action: Dumbbell,
  mystery: Compass,
  scifi: Rocket,
  horror: Ghost,
  slice_of_life: Coffee,
  martial_arts: Dumbbell,
  regression: RotateCcw,
  academy: GraduationCap,
  game: Gamepad2,
  modern: Building2,
};

const GENRE_COLORS: Record<Genre, string> = {
  fantasy: 'from-purple-500 to-indigo-500',
  romance: 'from-pink-500 to-rose-500',
  action: 'from-red-500 to-orange-500',
  mystery: 'from-slate-500 to-gray-500',
  scifi: 'from-cyan-500 to-blue-500',
  horror: 'from-gray-700 to-gray-900',
  slice_of_life: 'from-green-400 to-emerald-500',
  martial_arts: 'from-amber-500 to-yellow-500',
  regression: 'from-violet-500 to-purple-500',
  academy: 'from-blue-400 to-indigo-400',
  game: 'from-emerald-500 to-teal-500',
  modern: 'from-gray-500 to-slate-600',
};

interface GenrePageData {
  novels: Novel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function GenreCard({ genre, count }: { genre: Genre; count: number }) {
  const Icon = GENRE_ICONS[genre];
  const color = GENRE_COLORS[genre];

  return (
    <Link href={`/genre?selected=${genre}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
        <div className={`bg-gradient-to-br ${color} p-6`}>
          <Icon className="h-10 w-10 text-white/90" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{GENRE_LABELS[genre]}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatNumber(count)}작품</p>
        </div>
      </Card>
    </Link>
  );
}

function NovelCard({ novel }: { novel: Novel }) {
  const router = useRouter();

  return (
    <Card
      className="flex cursor-pointer gap-3 p-3 transition-shadow hover:shadow-md"
      onClick={() => router.push(`/novel/${novel.id}`)}
    >
      <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
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
        <h3 className="line-clamp-1 font-medium text-gray-900 dark:text-white">{novel.title}</h3>
        <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{novel.synopsis}</p>
        <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
          <span>{novel.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{formatNumber(novel.viewCount)}</span>
          <span>·</span>
          <span>{novel.totalChapters}화</span>
        </div>
      </div>
    </Card>
  );
}

function GenreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get('selected') as Genre | null;

  const [data, setData] = useState<GenrePageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock genre counts
  const genreCounts: Record<Genre, number> = {
    fantasy: 2340,
    romance: 3120,
    action: 890,
    mystery: 456,
    scifi: 234,
    horror: 178,
    slice_of_life: 567,
    martial_arts: 1230,
    regression: 890,
    academy: 456,
    game: 1560,
    modern: 2100,
  };

  const fetchNovels = useCallback(async () => {
    if (!selectedGenre) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/search?genre=${selectedGenre}&limit=12`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Genre fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  // Show genre grid if no genre selected
  if (!selectedGenre) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">장르별 탐색</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            원하는 장르를 선택해서 작품을 찾아보세요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {(Object.keys(GENRE_LABELS) as Genre[]).map((genre) => (
            <GenreCard key={genre} genre={genre} count={genreCounts[genre]} />
          ))}
        </div>
      </div>
    );
  }

  // Show novels for selected genre
  const Icon = GENRE_ICONS[selectedGenre];
  const color = GENRE_COLORS[selectedGenre];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className={`-mx-4 -mt-8 mb-6 bg-gradient-to-br ${color} px-4 py-8`}>
        <button
          onClick={() => router.push('/genre')}
          className="mb-4 text-sm text-white/80 hover:text-white"
        >
          ← 장르 목록으로
        </button>
        <div className="flex items-center gap-3">
          <Icon className="h-10 w-10 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">{GENRE_LABELS[selectedGenre]}</h1>
            <p className="text-sm text-white/80">{formatNumber(genreCounts[selectedGenre])}작품</p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {['인기순', '최신순', '평점순', '완결작'].map((option) => (
          <Badge key={option} variant="secondary" className="cursor-pointer whitespace-nowrap">
            {option}
          </Badge>
        ))}
      </div>

      {/* Novels Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data?.novels.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">해당 장르의 작품이 없습니다</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data?.novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GenrePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <GenreContent />
    </Suspense>
  );
}
