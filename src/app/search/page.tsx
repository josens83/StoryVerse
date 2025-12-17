/**
 * Search Page
 *
 * Full search interface with filters and results display.
 *
 * @module app/search
 */

'use client';

import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/loading';
import { formatNumber } from '@/lib/utils';
import { GENRE_LABELS } from '@/types';

import type { Novel, Genre } from '@/types';

type SortOption = 'relevance' | 'latest' | 'popular' | 'rating';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: '관련도순' },
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
];

interface SearchResult {
  novels: Novel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function NovelCard({ novel }: { novel: Novel }) {
  const router = useRouter();

  return (
    <Card
      className="flex cursor-pointer gap-4 p-4 transition-shadow hover:shadow-md"
      onClick={() => router.push(`/novel/${novel.id}`)}
    >
      <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        <div className="flex h-full items-center justify-center text-4xl">
          {novel.genre === 'fantasy' && '🗡️'}
          {novel.genre === 'romance' && '💕'}
          {novel.genre === 'modern' && '🏙️'}
          {novel.genre === 'martial_arts' && '🥋'}
          {novel.genre === 'game' && '🎮'}
          {!['fantasy', 'romance', 'modern', 'martial_arts', 'game'].includes(novel.genre) && '📖'}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{novel.title}</h3>
          {novel.isExclusive ? (
            <Badge variant="primary" size="sm">
              독점
            </Badge>
          ) : null}
        </div>

        <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {novel.synopsis}
        </p>

        <div className="mt-auto flex flex-wrap gap-1">
          <Badge variant="secondary" size="sm">
            {GENRE_LABELS[novel.genre]}
          </Badge>
          {novel.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>조회 {formatNumber(novel.viewCount)}</span>
          <span>평점 {novel.rating.toFixed(1)}</span>
          <span>{novel.totalChapters}화</span>
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
      </div>
    </Card>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialGenre = (searchParams.get('genre') as Genre) || '';
  const initialSort = (searchParams.get('sort') as SortOption) || 'relevance';

  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState<Genre | ''>(initialGenre);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const performSearch = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (genre) {
      params.set('genre', genre);
    }
    if (sort) {
      params.set('sort', sort);
    }

    try {
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, genre, sort]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (genre) {
      params.set('genre', genre);
    }
    if (sort) {
      params.set('sort', sort);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleGenreChange = (newGenre: Genre | '') => {
    setGenre(newGenre);

    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (newGenre) {
      params.set('genre', newGenre);
    }
    if (sort) {
      params.set('sort', sort);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);

    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (genre) {
      params.set('genre', genre);
    }
    params.set('sort', newSort);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Search Header */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="작품명, 작가명, 태그로 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">검색</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            필터
          </Button>
        </div>
      </form>

      {/* Filters */}
      {showFilters ? (
        <Card className="mb-6 p-4">
          <div className="space-y-4">
            {/* Genre Filter */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Filter className="h-4 w-4" />
                장르
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={genre === '' ? 'primary' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => handleGenreChange('')}
                >
                  전체
                </Badge>
                {Object.entries(GENRE_LABELS).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={genre === key ? 'primary' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleGenreChange(key as Genre)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">정렬</h4>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <Badge
                    key={option.value}
                    variant={sort === option.value ? 'primary' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Results Header */}
      {results ? (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {query ? (
              <>
                <span className="font-medium text-gray-900 dark:text-white">{`"${query}"`}</span>
                {` 검색 결과 `}
              </>
            ) : (
              '전체 작품 '
            )}
            <span className="font-medium text-orange-500">{results.pagination.total}</span>건
          </p>
        </div>
      ) : null}

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : results?.novels.length === 0 ? (
        <Card className="py-12 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            다른 키워드로 검색해 보세요
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {results?.novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {results && results.pagination.totalPages > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: results.pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === results.pagination.page ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const params = new URLSearchParams();
                if (query) {
                  params.set('q', query);
                }
                if (genre) {
                  params.set('genre', genre);
                }
                if (sort) {
                  params.set('sort', sort);
                }
                params.set('page', String(page));
                router.push(`/search?${params.toString()}`);
              }}
            >
              {page}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
