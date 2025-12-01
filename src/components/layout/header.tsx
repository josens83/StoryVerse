'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  BookOpen,
  Crown,
  Coins,
  User,
  Library,
  TrendingUp,
  PenTool,
  LogOut,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useCoinStore } from '@/store/coin-store';
import { formatNumber } from '@/lib/utils';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalCoins } = useCoinStore();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-xl font-bold text-gray-900 dark:text-white sm:block">
            StoryVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/ranking"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <TrendingUp className="h-4 w-4" />
            랭킹
          </Link>
          <Link
            href="/genre"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            장르
          </Link>
          <Link
            href="/bookshelf"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Library className="h-4 w-4" />
            서재
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Search className="h-5 w-5" />
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Coins */}
              <Link
                href="/mypage/coins"
                className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                <Coins className="h-4 w-4" />
                <span>{formatNumber(totalCoins())}</span>
              </Link>

              {/* VIP Badge */}
              {user.tier !== 'free' && (
                <Link
                  href="/mypage/vip"
                  className="flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1.5 text-sm font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                >
                  <Crown className="h-4 w-4" />
                  {user.tier.toUpperCase()}
                </Link>
              )}

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="border-b border-gray-200 px-4 pb-2 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <Link
                        href="/mypage"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        마이페이지
                      </Link>
                      <Link
                        href="/author"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <PenTool className="h-4 w-4" />
                        작가센터
                      </Link>
                      <Link
                        href="/mypage/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        설정
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mx-auto mt-20 max-w-2xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl bg-white p-4 shadow-2xl dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="작품, 작가 검색..."
                    className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
