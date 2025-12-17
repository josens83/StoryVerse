'use client';

import { ChevronLeft, ChevronRight, List, Settings, Home, Bookmark, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ReaderSkeleton } from '@/components/ui/skeleton';
import { useReaderStore } from '@/store/reader-store';

// Mock chapter data
const mockChapter = {
  id: 'chapter-1',
  novelId: '1',
  novelTitle: '무한 회귀의 마법사',
  number: 1,
  title: '프롤로그: 죽음과 회귀',
  content: `
    어둠 속에서 아론은 눈을 떴다.

    차가운 돌바닥의 감촉이 뺨에 전해졌다. 몸 곳곳에서 느껴지는 통증은 그가 아직 살아있다는 증거였다.

    "이게... 무슨..."

    머리를 들어 주변을 살폈다. 낯익은 광경이었다. 마법 아카데미의 지하 감옥. 그가 처음 깨어난 곳.

    "설마..."

    손을 들어 얼굴을 만져보았다. 주름 하나 없는 젊은 피부. 수염도 없었다. 그의 손은 떨리기 시작했다.

    "회귀... 했다고?"

    불가능한 일이었다. 시간을 거스르는 마법은 이 세계에 존재하지 않는다. 적어도 그가 아는 한은.

    하지만 현실은 그의 상식을 비웃고 있었다.

    아론은 천천히 몸을 일으켰다. 300년간 쌓아온 기억이 머릿속에 고스란히 남아있었다. 마법의 지식, 전투의 경험, 그리고... 자신을 죽인 자들의 얼굴.

    "다시..."

    그의 눈에 불꽃이 피어올랐다.

    "다시 시작하는 거다."

    이번에는 실수하지 않을 것이다. 이번에는 모든 것을 바꿀 것이다.

    아론은 지하 감옥의 문을 향해 걸어갔다. 그의 새로운 인생이, 지금 시작되고 있었다.

    ***

    지하 감옥을 나온 아론은 깊은 한숨을 내쉬었다.

    "100년 전이군."

    하늘에 떠 있는 두 개의 달을 보며 그는 현재 시점을 가늠했다. 붉은 달 크림슨이 푸른 달 아주르보다 살짝 앞서 있었다. 이것은 '위대한 전쟁' 이전의 천체 배열이었다.

    "시간이 충분해."

    위대한 전쟁. 그것은 100년 후에 일어날 대재앙이었다. 마왕군이 인간 영역을 침공하고, 대륙의 절반이 초토화되는 전쟁.

    전생의 아론은 그 전쟁에서 영웅으로 불렸다. 하지만 전쟁이 끝난 후, 그는 동료들의 배신으로 목숨을 잃었다.

    "이번에는..."

    그는 주먹을 불끈 쥐었다.

    "모든 것을 바꿔놓겠어."

    먼저 해야 할 것은 자신의 현재 상태를 파악하는 것이었다. 아론은 눈을 감고 내면에 집중했다.

    마나 코어. 마법사의 핵심. 그것이 심장 근처에서 희미하게 빛나고 있었다.

    "1서클..."

    예상했던 대로였다. 지금의 그는 갓 마법에 입문한 견습 마법사에 불과했다.

    하지만 아론의 입가에 미소가 떠올랐다.

    "1서클이라..."

    다른 이들에게 1서클은 시작점에 불과했다. 하지만 300년의 경험을 가진 그에게 1서클은...

    "무한한 가능성이지."

    그는 손을 들어 작은 화염구를 만들어냈다. 기초적인 1서클 마법 '파이어볼'.

    하지만 아론의 손에서 만들어진 화염구는 달랐다. 크기는 작았지만, 그 안에 담긴 마나의 밀도는 상상을 초월했다.

    "역시."

    그의 미소가 깊어졌다.

    "몸은 1서클이지만, 마법을 다루는 기술은 그대로야."

    이것이 그의 무기가 될 것이다. 낮은 마나를 효율적으로 사용하는 기술. 300년간 연마한 마법 조작 능력.

    "좋아."

    화염구를 소멸시키며 아론은 앞으로 나아갔다.

    "먼저 아카데미에 입학해야겠군."

    마법 아카데미. 대륙 최고의 마법 교육 기관. 전생에서 그는 아카데미 최하위로 입학해, 수많은 굴욕을 당했었다.

    "하지만 이번에는 다르지."

    그는 자신감에 찬 걸음을 내딛었다.

    새로운 전설이 시작되고 있었다.
  `,
  wordCount: 1200,
  accessType: 'free' as const,
  prevChapter: null,
  nextChapter: 2,
  publishedAt: '2024-01-01',
};

export default function ChapterReaderPage() {
  // params will be used for fetching real chapter data when connected to backend
  const router = useRouter();
  const { fontSize, lineHeight, theme, setFontSize, setLineHeight, setTheme } = useReaderStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const chapter = mockChapter;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Hide/show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const themeClasses: Record<typeof theme, string> = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    sepia: 'bg-amber-50 text-amber-900',
    green: 'bg-green-50 text-green-900',
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeClasses[theme]}`}>
        <ReaderSkeleton />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      {/* Header */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-transform duration-300 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        } ${
          theme === 'dark'
            ? 'border-gray-800 bg-gray-900/95'
            : theme === 'sepia'
              ? 'border-amber-200 bg-amber-50/95'
              : 'border-gray-200 bg-white/95'
        } backdrop-blur-sm`}
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="max-w-[200px] truncate">
              <p className="truncate text-sm font-medium">{chapter.novelTitle}</p>
              <p className="truncate text-xs text-gray-500">{chapter.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link href={`/novel/${chapter.novelId}`}>
              <Button variant="ghost" size="sm">
                <List className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings ? (
        <div
          className={`fixed left-0 right-0 top-14 z-40 border-b p-4 ${
            theme === 'dark'
              ? 'border-gray-800 bg-gray-900'
              : theme === 'sepia'
                ? 'border-amber-200 bg-amber-50'
                : 'border-gray-200 bg-white'
          }`}
        >
          <div className="container mx-auto space-y-4">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-sm">글자 크기</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                >
                  A-
                </Button>
                <span className="w-10 text-center text-sm">{fontSize}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                >
                  A+
                </Button>
              </div>
            </div>

            {/* Line Height */}
            <div className="flex items-center justify-between">
              <span className="text-sm">줄 간격</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLineHeight(Math.max(1.4, lineHeight - 0.2))}
                >
                  좁게
                </Button>
                <span className="w-10 text-center text-sm">{lineHeight.toFixed(1)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLineHeight(Math.min(2.2, lineHeight + 0.2))}
                >
                  넓게
                </Button>
              </div>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="text-sm">테마</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'sepia' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('sepia')}
                >
                  세피아
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <main className="container mx-auto px-4 pb-24 pt-20">
        <article className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-xl font-bold">
            {chapter.number}화. {chapter.title}
          </h1>

          <div
            className="whitespace-pre-wrap"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
          >
            {chapter.content}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            {chapter.wordCount.toLocaleString()}자 · {chapter.publishedAt}
          </p>
        </article>
      </main>

      {/* Footer Navigation */}
      <footer
        className={`fixed bottom-0 left-0 right-0 border-t ${
          theme === 'dark'
            ? 'border-gray-800 bg-gray-900/95'
            : theme === 'sepia'
              ? 'border-amber-200 bg-amber-50/95'
              : 'border-gray-200 bg-white/95'
        } backdrop-blur-sm`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            disabled={!chapter.prevChapter}
            onClick={() =>
              chapter.prevChapter &&
              router.push(`/novel/${chapter.novelId}/chapter/${chapter.prevChapter}`)
            }
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            이전화
          </Button>

          <Button variant="ghost">
            <Bookmark className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            disabled={!chapter.nextChapter}
            onClick={() =>
              chapter.nextChapter &&
              router.push(`/novel/${chapter.novelId}/chapter/${chapter.nextChapter}`)
            }
          >
            다음화
            <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
