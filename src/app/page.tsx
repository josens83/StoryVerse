'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Star, BookOpen, ChevronRight, Sparkles, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatNumber } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { GENRE_LABELS, type Genre, type Novel, type Author } from '@/types';

// Mock data for demonstration
const mockNovels: (Novel & { author: Author })[] = [
  {
    id: '1',
    title: '회귀한 천재 검사',
    authorId: 'a1',
    author: {
      id: 'a1',
      userId: 'u1',
      penName: '글쓰는검사',
      tier: 'gold',
      totalNovels: 5,
      totalWords: 5000000,
      totalViews: 50000000,
      totalFollowers: 50000,
      totalRevenue: 0,
      revenueShareRate: 0.65,
      pendingRevenue: 0,
      withdrawableRevenue: 0,
      isExclusive: true,
      createdAt: new Date(),
    },
    genre: 'regression',
    tags: ['회귀', '법조', '복수'],
    coverUrl: 'https://picsum.photos/seed/novel1/300/400',
    synopsis: '대한민국 최고의 검사가 과거로 회귀했다. 이번 생에는 악을 모두 심판하리라.',
    totalChapters: 345,
    totalWords: 1200000,
    viewCount: 1250000,
    likeCount: 89000,
    favoriteCount: 45000,
    rating: 4.8,
    ratingCount: 12000,
    status: 'ongoing',
    isExclusive: true,
    freeChapters: 30,
    coinPrice: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastChapterAt: new Date(),
  },
  {
    id: '2',
    title: '재벌집 막내아들',
    authorId: 'a2',
    author: {
      id: 'a2',
      userId: 'u2',
      penName: '산경작가',
      tier: 'platinum',
      totalNovels: 3,
      totalWords: 8000000,
      totalViews: 80000000,
      totalFollowers: 100000,
      totalRevenue: 0,
      revenueShareRate: 0.68,
      pendingRevenue: 0,
      withdrawableRevenue: 0,
      isExclusive: true,
      createdAt: new Date(),
    },
    genre: 'modern',
    tags: ['현대', '재벌', '회귀'],
    coverUrl: 'https://picsum.photos/seed/novel2/300/400',
    synopsis: '순양그룹 비서실장이 회장의 막내 손자로 환생했다.',
    totalChapters: 567,
    totalWords: 2100000,
    viewCount: 980000,
    likeCount: 72000,
    favoriteCount: 38000,
    rating: 4.9,
    ratingCount: 15000,
    status: 'completed',
    isExclusive: true,
    freeChapters: 50,
    coinPrice: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastChapterAt: new Date(),
  },
  {
    id: '3',
    title: '나 혼자만 레벨업',
    authorId: 'a3',
    author: {
      id: 'a3',
      userId: 'u3',
      penName: '추공',
      tier: 'legendary',
      totalNovels: 2,
      totalWords: 3000000,
      totalViews: 200000000,
      totalFollowers: 500000,
      totalRevenue: 0,
      revenueShareRate: 0.7,
      pendingRevenue: 0,
      withdrawableRevenue: 0,
      isExclusive: false,
      createdAt: new Date(),
    },
    genre: 'fantasy',
    tags: ['헌터', '성장', '먼치킨'],
    coverUrl: 'https://picsum.photos/seed/novel3/300/400',
    synopsis: 'E급 헌터 성진우는 이중 던전에서 플레이어로 각성한다.',
    totalChapters: 270,
    totalWords: 850000,
    viewCount: 5600000,
    likeCount: 320000,
    favoriteCount: 180000,
    rating: 4.95,
    ratingCount: 85000,
    status: 'completed',
    isExclusive: false,
    freeChapters: 20,
    coinPrice: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastChapterAt: new Date(),
  },
  {
    id: '4',
    title: '전지적 독자 시점',
    authorId: 'a4',
    author: {
      id: 'a4',
      userId: 'u4',
      penName: '싱숑',
      tier: 'legendary',
      totalNovels: 1,
      totalWords: 2500000,
      totalViews: 150000000,
      totalFollowers: 300000,
      totalRevenue: 0,
      revenueShareRate: 0.7,
      pendingRevenue: 0,
      withdrawableRevenue: 0,
      isExclusive: false,
      createdAt: new Date(),
    },
    genre: 'fantasy',
    tags: ['판타지', '아포칼립스', '독자'],
    coverUrl: 'https://picsum.photos/seed/novel4/300/400',
    synopsis: '내가 읽던 소설 속 세계가 현실이 되었다.',
    totalChapters: 551,
    totalWords: 2300000,
    viewCount: 4200000,
    likeCount: 280000,
    favoriteCount: 150000,
    rating: 4.92,
    ratingCount: 72000,
    status: 'completed',
    isExclusive: false,
    freeChapters: 30,
    coinPrice: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastChapterAt: new Date(),
  },
];

function NovelCard({
  novel,
  priority = false,
}: {
  novel: Novel & { author: Author };
  priority?: boolean;
}) {
  return (
    <Link href={`/novel/${novel.id}`} className="group">
      <motion.div
        whileHover={{ y: -4 }}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={novel.coverUrl}
            alt={novel.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {novel.isExclusive ? (
            <Badge variant="exclusive" className="absolute left-2 top-2">
              독점
            </Badge>
          ) : null}
          <Badge
            variant={novel.status === 'completed' ? 'completed' : 'ongoing'}
            className="absolute right-2 top-2"
          >
            {novel.status === 'completed' ? '완결' : '연재중'}
          </Badge>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">
            {novel.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{novel.author.penName}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              {novel.rating.toFixed(1)}
            </span>
            <span>{formatNumber(novel.viewCount)}회</span>
          </div>
          <Badge variant="secondary" className="mt-2">
            {GENRE_LABELS[novel.genre as Genre]}
          </Badge>
        </div>
      </motion.div>
    </Link>
  );
}

function HorizontalNovelCard({ novel, rank }: { novel: Novel & { author: Author }; rank: number }) {
  return (
    <Link
      href={`/novel/${novel.id}`}
      className="group flex gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center text-lg font-bold text-orange-500">
        {rank}
      </div>
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
        <Image src={novel.coverUrl} alt={novel.title} fill sizes="56px" className="object-cover" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className="line-clamp-1 font-medium text-gray-900 dark:text-white">{novel.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{novel.author.penName}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            {novel.rating.toFixed(1)}
          </span>
          <span>{formatNumber(novel.viewCount)}회</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  const genres: Genre[] = ['fantasy', 'romance', 'regression', 'modern', 'martial_arts', 'action'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {isAuthenticated
                  ? `${user?.username}님, 환영합니다!`
                  : '무료로 시작하는 웹소설의 세계'}
              </h1>
              <p className="mt-2 text-lg text-white/80">매일 새로운 이야기를 만나보세요</p>
            </div>
            <div className="flex gap-3">
              {!isAuthenticated && (
                <>
                  <Link href="/register">
                    <Button className="bg-white text-orange-500 hover:bg-gray-100">
                      <Sparkles className="mr-2 h-4 w-4" />
                      무료 가입하고 100코인 받기
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/ranking">
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  인기 랭킹 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Genre Quick Links */}
        <section className="mb-8 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-2">
            {genres.map((genre) => (
              <Link key={genre} href={`/genre?g=${genre}`}>
                <Badge
                  variant="outline"
                  className="whitespace-nowrap px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20"
                >
                  {GENRE_LABELS[genre]}
                </Badge>
              </Link>
            ))}
            <Link href="/genre">
              <Badge
                variant="outline"
                className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                전체보기 <ChevronRight className="ml-1 inline h-3 w-3" />
              </Badge>
            </Link>
          </div>
        </section>

        {/* Featured Novels Tabs */}
        <section className="mb-12">
          <Tabs defaultValue="popular">
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="popular">
                  <TrendingUp className="mr-1.5 h-4 w-4" />
                  인기작
                </TabsTrigger>
                <TabsTrigger value="new">
                  <Clock className="mr-1.5 h-4 w-4" />
                  신작
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <BookOpen className="mr-1.5 h-4 w-4" />
                  완결작
                </TabsTrigger>
              </TabsList>
              <Link href="/ranking" className="text-sm text-gray-500 hover:text-orange-500">
                더보기 <ChevronRight className="inline h-4 w-4" />
              </Link>
            </div>

            <TabsContent value="popular">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mockNovels.map((novel, index) => (
                  <NovelCard key={novel.id} novel={novel} priority={index < 4} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mockNovels
                  .slice()
                  .reverse()
                  .map((novel) => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mockNovels
                  .filter((n) => n.status === 'completed')
                  .map((novel) => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Rankings Section */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              실시간 랭킹
            </h2>
            <Link href="/ranking" className="text-sm text-gray-500 hover:text-orange-500">
              전체보기 <ChevronRight className="inline h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                <Star className="mr-1.5 inline h-4 w-4 text-yellow-500" />
                조회수 TOP
              </h3>
              <div className="space-y-2">
                {mockNovels.slice(0, 5).map((novel, index) => (
                  <HorizontalNovelCard key={novel.id} novel={novel} rank={index + 1} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                <Star className="mr-1.5 inline h-4 w-4 text-orange-500" />
                평점 TOP
              </h3>
              <div className="space-y-2">
                {[...mockNovels]
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((novel, index) => (
                    <HorizontalNovelCard key={novel.id} novel={novel} rank={index + 1} />
                  ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                <Crown className="mr-1.5 inline h-4 w-4 text-purple-500" />
                독점작
              </h3>
              <div className="space-y-2">
                {mockNovels
                  .filter((n) => n.isExclusive)
                  .slice(0, 5)
                  .map((novel, index) => (
                    <HorizontalNovelCard key={novel.id} novel={novel} rank={index + 1} />
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIP Promotion */}
        {!isAuthenticated && (
          <section className="mb-12">
            <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    <Crown className="h-6 w-6" />
                    VIP 멤버십
                  </h2>
                  <p className="mt-2 text-white/80">
                    광고 없이 매일 5화 무료 읽기 + 대기시간 50% 단축
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/80">
                    <li>- 매월 200 보너스 코인 지급</li>
                    <li>- 오프라인 다운로드 가능</li>
                    <li>- 기다리면 무료 대기시간 단축</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">월 5,900원</div>
                  <Link href="/register">
                    <Button className="mt-4 bg-white text-purple-600 hover:bg-gray-100">
                      지금 시작하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Genre Sections */}
        {genres.slice(0, 3).map((genre) => (
          <section key={genre} className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {GENRE_LABELS[genre]}
              </h2>
              <Link
                href={`/genre?g=${genre}`}
                className="text-sm text-gray-500 hover:text-orange-500"
              >
                더보기 <ChevronRight className="inline h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {mockNovels
                .filter((n) => n.genre === genre || genre === 'fantasy')
                .slice(0, 5)
                .map((novel) => (
                  <NovelCard key={novel.id} novel={novel} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
