import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">StoryVerse</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              최고의 웹소설을 무료로 읽고, 작가를 응원하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/ranking" className="hover:text-gray-900 dark:hover:text-white">랭킹</Link></li>
              <li><Link href="/genre" className="hover:text-gray-900 dark:hover:text-white">장르별</Link></li>
              <li><Link href="/new" className="hover:text-gray-900 dark:hover:text-white">신작</Link></li>
              <li><Link href="/completed" className="hover:text-gray-900 dark:hover:text-white">완결작</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">작가</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/author/register" className="hover:text-gray-900 dark:hover:text-white">작가 등록</Link></li>
              <li><Link href="/author/guide" className="hover:text-gray-900 dark:hover:text-white">작가 가이드</Link></li>
              <li><Link href="/author/revenue" className="hover:text-gray-900 dark:hover:text-white">수익 정책</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">고객지원</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/help" className="hover:text-gray-900 dark:hover:text-white">고객센터</Link></li>
              <li><Link href="/faq" className="hover:text-gray-900 dark:hover:text-white">자주 묻는 질문</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} StoryVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
