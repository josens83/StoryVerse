'use client';

import { BookOpen, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NovelCover } from '@/components/ui/optimized-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth-store';
import { GENRE_LABELS, type Genre } from '@/types';

type BookshelfCategory = 'reading' | 'finished' | 'dropped';

interface BookshelfItem {
  id: string;
  novelId: string;
  title: string;
  authorName: string;
  coverUrl: string;
  genre: Genre;
  lastReadChapter: number;
  totalChapters: number;
  lastReadAt: string;
  hasNewChapter: boolean;
  category: BookshelfCategory;
}

// Mock bookshelf data
const mockBookshelfItems: BookshelfItem[] = [
  {
    id: '1',
    novelId: '1',
    title: '무한 회귀의 마법사',
    authorName: '시간여행자',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop',
    genre: 'fantasy',
    lastReadChapter: 45,
    totalChapters: 342,
    lastReadAt: '2024-01-15',
    hasNewChapter: true,
    category: 'reading',
  },
  {
    id: '2',
    novelId: '2',
    title: '달빛 아래 사랑을',
    authorName: '로맨티스트',
    coverUrl: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=400&fit=crop',
    genre: 'romance',
    lastReadChapter: 120,
    totalChapters: 200,
    lastReadAt: '2024-01-14',
    hasNewChapter: false,
    category: 'reading',
  },
  {
    id: '3',
    novelId: '3',
    title: '검의 제왕',
    authorName: '무림검객',
    coverUrl: 'https://images.unsplash.com/photo-1534951009808-766178b47a4f?w=300&h=400&fit=crop',
    genre: 'martial_arts',
    lastReadChapter: 500,
    totalChapters: 500,
    lastReadAt: '2024-01-10',
    hasNewChapter: false,
    category: 'finished',
  },
];

function BookshelfCard({ item, onRemove }: { item: BookshelfItem; onRemove: () => void }) {
  const progress = Math.round((item.lastReadChapter / item.totalChapters) * 100);

  return (
    <Card className="group overflow-hidden">
      <Link href={`/novel/${item.novelId}`}>
        <div className="flex gap-3 p-3">
          <div className="relative shrink-0">
            <NovelCover src={item.coverUrl} title={item.title} size="md" />
            {item.hasNewChapter ? (
              <Badge variant="primary" size="sm" className="absolute -right-1 -top-1 animate-pulse">
                N
              </Badge>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="truncate font-medium group-hover:text-orange-500">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.authorName}</p>
            <Badge variant="outline" size="sm" className="mt-1 w-fit">
              {GENRE_LABELS[item.genre]}
            </Badge>

            <div className="mt-auto">
              <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {item.lastReadChapter}화 / {item.totalChapters}화
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="flex items-center justify-between border-t bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-xs text-gray-500">최근 읽음: {item.lastReadAt}</span>
        <div className="flex items-center gap-1">
          <Link href={`/novel/${item.novelId}/chapter/${item.lastReadChapter + 1}`}>
            <Button variant="ghost" size="sm">
              이어보기
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BookshelfPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('reading');
  const [items, setItems] = useState(mockBookshelfItems);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <BookOpen className="mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-2 text-xl font-bold">로그인이 필요합니다</h1>
        <p className="mb-6 text-center text-gray-500">책장을 이용하려면 로그인해주세요.</p>
        <Button onClick={() => router.push('/login')}>로그인</Button>
      </div>
    );
  }

  const readingItems = items.filter((item) => item.category === 'reading');
  const finishedItems = items.filter((item) => item.category === 'finished');
  const droppedItems = items.filter((item) => item.category === 'dropped');

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">내 책장</h1>
          <p className="text-gray-500">
            {user?.username}님의 책장에 {items.length}개의 작품이 있습니다
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="reading" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              읽는 중 ({readingItems.length})
            </TabsTrigger>
            <TabsTrigger value="finished" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              완독 ({finishedItems.length})
            </TabsTrigger>
            <TabsTrigger value="dropped" className="flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              중단 ({droppedItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading">
            {readingItems.length === 0 ? (
              <EmptyState message="읽고 있는 작품이 없습니다" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {readingItems.map((item) => (
                  <BookshelfCard key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finished">
            {finishedItems.length === 0 ? (
              <EmptyState message="완독한 작품이 없습니다" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {finishedItems.map((item) => (
                  <BookshelfCard key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dropped">
            {droppedItems.length === 0 ? (
              <EmptyState message="중단한 작품이 없습니다" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {droppedItems.map((item) => (
                  <BookshelfCard key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
      <p className="text-gray-500">{message}</p>
      <Link href="/" className="mt-4">
        <Button variant="outline">작품 둘러보기</Button>
      </Link>
    </div>
  );
}
