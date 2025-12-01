import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'StoryVerse - 웹소설 플랫폼',
    template: '%s | StoryVerse',
  },
  description: '최고의 웹소설을 무료로 읽고, 작가를 응원하세요. 판타지, 로맨스, 회귀물 등 다양한 장르의 웹소설을 만나보세요.',
  keywords: ['웹소설', '소설', '판타지', '로맨스', '무료소설', 'StoryVerse'],
  authors: [{ name: 'StoryVerse' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://storyverse.app',
    siteName: 'StoryVerse',
    title: 'StoryVerse - 웹소설 플랫폼',
    description: '최고의 웹소설을 무료로 읽고, 작가를 응원하세요.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StoryVerse - 웹소설 플랫폼',
    description: '최고의 웹소설을 무료로 읽고, 작가를 응원하세요.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#FF6B35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
