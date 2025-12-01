'use client';

import {
  BookOpen,
  Eye,
  Heart,
  Star,
  Clock,
  User,
  ChevronRight,
  Bookmark,
  Share2,
  Lock,
  Coins,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NovelCover } from '@/components/ui/optimized-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { GENRE_LABELS, type Genre } from '@/types';

// Mock data - replace with API call
const mockNovel = {
  id: '1',
  title: '무한 회귀의 마법사',
  authorId: 'author-1',
  authorName: '시간여행자',
  genre: 'fantasy' as Genre,
  tags: ['회귀', '판타지', '마법', '성장'],
  coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop',
  synopsis:
    '죽음의 순간, 과거로 회귀한 마법사 아론. 전생의 기억을 가진 채 다시 시작된 인생에서 그는 최강의 마법사가 되기 위한 여정을 시작한다. 하지만 그의 앞에는 전생에서 그를 죽인 자들이 기다리고 있다...',
  totalChapters: 342,
  totalWords: 1250000,
  viewCount: 2500000,
  likeCount: 45000,
  favoriteCount: 23000,
  rating: 4.7,
  ratingCount: 5600,
  status: 'ongoing' as const,
  isExclusive: true,
  freeChapters: 30,
  coinPrice: 3,
  updatedAt: '2024-01-15',
  lastChapterAt: '2024-01-15',
};

const mockChapters = Array.from({ length: 20 }, (_, i) => ({
  id: `chapter-${i + 1}`,
  number: i + 1,
  title:
    i === 0
      ? '프롤로그: 죽음과 회귀'
      : `제${i}화: ${['새로운 시작', '첫 번째 시련', '마법의 각성', '운명의 만남', '숨겨진 힘'][i % 5]}`,
  wordCount: 2500 + Math.floor(Math.random() * 1000),
  accessType: i < 30 ? 'free' : i < 100 ? 'wait_free' : 'coin',
  viewCount: Math.floor(Math.random() * 50000) + 10000,
  publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

export default function NovelDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');

  const novel = mockNovel;
  const chapters = mockChapters;

  const handleBookmark = () => {
    if (!isAuthenticated) {
      // Show login modal
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: novel.title,
        text: novel.synopsis,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {/* Cover Image */}
            <div className="mx-auto shrink-0 md:mx-0">
              <NovelCover src={novel.coverUrl} title={novel.title} size="lg" />
            </div>

            {/* Novel Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">{novel.title}</h1>
                  <Link
                    href={`/author/${novel.authorId}`}
                    className="mt-1 flex items-center gap-1 text-gray-600 hover:text-orange-500 dark:text-gray-400"
                  >
                    <User className="h-4 w-4" />
                    <span>{novel.authorName}</span>
                  </Link>
                </div>
                {novel.isExclusive ? (
                  <Badge variant="primary" className="shrink-0">
                    독점
                  </Badge>
                ) : null}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{GENRE_LABELS[novel.genre]}</Badge>
                {novel.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatNumber(novel.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {formatNumber(novel.likeCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {novel.rating.toFixed(1)} ({formatNumber(novel.ratingCount)})
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {novel.totalChapters}화
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatNumber(novel.totalWords)}자
                </span>
              </div>

              {/* Synopsis */}
              <p className="text-gray-700 dark:text-gray-300">{novel.synopsis}</p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link href={`/novel/${params.id}/chapter/1`} className="flex-1 sm:flex-none">
                  <Button className="w-full">
                    첫화 보기
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant={isBookmarked ? 'default' : 'outline'}
                  onClick={handleBookmark}
                  className="flex-1 sm:flex-none"
                >
                  <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? '책장에 추가됨' : '책장에 추가'}
                </Button>
                <Button variant="ghost" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Pricing Info */}
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      무료 {novel.freeChapters}화 / 유료 {novel.totalChapters - novel.freeChapters}
                      화
                    </p>
                    <p className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      화당 {novel.coinPrice}코인
                    </p>
                  </div>
                  <Badge variant={novel.status === 'ongoing' ? 'success' : 'secondary'}>
                    {novel.status === 'ongoing'
                      ? '연재중'
                      : novel.status === 'completed'
                        ? '완결'
                        : '휴재'}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="chapters">회차 목록</TabsTrigger>
            <TabsTrigger value="comments">댓글</TabsTrigger>
            <TabsTrigger value="info">작품 정보</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                총 {novel.totalChapters}화
              </span>
              <Button variant="ghost" size="sm">
                정렬
              </Button>
            </div>

            <div className="space-y-2">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/novel/${params.id}/chapter/${chapter.number}`}
                  className="flex items-center justify-between rounded-lg border bg-white p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center text-sm text-gray-500">{chapter.number}</span>
                    <div>
                      <p className="font-medium">{chapter.title}</p>
                      <p className="text-xs text-gray-500">
                        {chapter.wordCount.toLocaleString()}자 · {formatNumber(chapter.viewCount)}{' '}
                        조회
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {chapter.accessType === 'free' ? (
                      <Badge variant="success" size="sm">
                        무료
                      </Badge>
                    ) : chapter.accessType === 'wait_free' ? (
                      <Badge variant="secondary" size="sm">
                        기다무
                      </Badge>
                    ) : (
                      <span className="flex items-center text-sm text-gray-500">
                        <Lock className="mr-1 h-3 w-3" />
                        {novel.coinPrice}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {chapters.length < novel.totalChapters && (
              <div className="mt-4 text-center">
                <Button variant="outline">더 보기</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <p className="py-8 text-center text-gray-500">댓글 기능 준비 중</p>
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div>
                  <h3 className="font-medium">작품 소개</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{novel.synopsis}</p>
                </div>
                <div>
                  <h3 className="font-medium">작품 정보</h3>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div className="flex">
                      <dt className="w-24 text-gray-500">연재 시작</dt>
                      <dd>2023년 1월 1일</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 text-gray-500">최근 업데이트</dt>
                      <dd>{novel.updatedAt}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 text-gray-500">연재 주기</dt>
                      <dd>매일</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
