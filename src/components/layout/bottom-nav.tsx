'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Grid, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/ranking', icon: TrendingUp, label: '랭킹' },
  { href: '/genre', icon: Grid, label: '장르' },
  { href: '/bookshelf', icon: Library, label: '서재' },
  { href: '/mypage', icon: User, label: '마이' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  // Hide on reader page
  if (pathname.startsWith('/reader')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          // Redirect to login if not authenticated for protected routes
          const href = !isAuthenticated && (item.href === '/bookshelf' || item.href === '/mypage')
            ? '/login'
            : item.href;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2',
                isActive ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
