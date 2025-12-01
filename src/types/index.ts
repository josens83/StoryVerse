// ========================================
// StoryVerse Type Definitions
// ========================================

// Genre Types
export type Genre =
  | 'fantasy'
  | 'romance'
  | 'action'
  | 'mystery'
  | 'scifi'
  | 'horror'
  | 'slice_of_life'
  | 'martial_arts'
  | 'regression'
  | 'academy'
  | 'game'
  | 'modern';

export const GENRE_LABELS: Record<Genre, string> = {
  fantasy: '판타지',
  romance: '로맨스',
  action: '액션',
  mystery: '미스터리',
  scifi: 'SF',
  horror: '호러',
  slice_of_life: '일상',
  martial_arts: '무협',
  regression: '회귀',
  academy: '학원',
  game: '게임',
  modern: '현대',
};

// User Types
export type UserTier = 'free' | 'vip' | 'svip';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  tier: UserTier;
  vipExpiresAt?: Date;
  purchasedCoins: number;
  earnedCoins: number;
  earnedCoinsExpireAt?: Date;
  totalReadTime: number;
  consecutiveCheckIns: number;
  lastCheckInAt?: Date;
  createdAt: Date;
}

// Author Types
export type AuthorTier = 'newcomer' | 'rising' | 'established' | 'gold' | 'platinum' | 'legendary';

export interface Author {
  id: string;
  userId: string;
  penName: string;
  bio?: string;
  avatar?: string;
  tier: AuthorTier;
  totalNovels: number;
  totalWords: number;
  totalViews: number;
  totalFollowers: number;
  totalRevenue: number;
  revenueShareRate: number;
  pendingRevenue: number;
  withdrawableRevenue: number;
  isExclusive: boolean;
  contractStartAt?: Date;
  contractEndAt?: Date;
  createdAt: Date;
  verifiedAt?: Date;
}

export const AUTHOR_TIERS: Record<
  AuthorTier,
  { minWords: number; minFollowers?: number; revenueShare: number }
> = {
  newcomer: { minWords: 0, revenueShare: 0.5 },
  rising: { minWords: 100000, minFollowers: 100, revenueShare: 0.55 },
  established: { minWords: 500000, minFollowers: 1000, revenueShare: 0.6 },
  gold: { minWords: 2000000, minFollowers: 10000, revenueShare: 0.65 },
  platinum: { minWords: 5000000, minFollowers: 50000, revenueShare: 0.68 },
  legendary: { minWords: 10000000, minFollowers: 100000, revenueShare: 0.7 },
};

// Novel Types
export type NovelStatus = 'ongoing' | 'completed' | 'hiatus';

export interface Novel {
  id: string;
  title: string;
  authorId: string;
  author?: Author;
  genre: Genre;
  tags: string[];
  coverUrl: string;
  synopsis: string;
  totalChapters: number;
  totalWords: number;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  rating: number;
  ratingCount: number;
  status: NovelStatus;
  isExclusive: boolean;
  freeChapters: number;
  coinPrice: number;
  createdAt: Date;
  updatedAt: Date;
  lastChapterAt?: Date;
}

// Chapter Types
export type AccessType = 'free' | 'ad_unlock' | 'coin' | 'vip' | 'wait_free';

export interface Chapter {
  id: string;
  novelId: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  accessType: AccessType;
  coinPrice: number;
  freeAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: Date;
  createdAt: Date;
}

// Unlock Types
export type UnlockMethod = 'free' | 'ad' | 'coin' | 'vip' | 'wait_free';

export interface ChapterUnlock {
  id: string;
  userId: string;
  chapterId: string;
  novelId: string;
  unlockMethod: UnlockMethod;
  coinSpent?: number;
  waitFreeStartedAt?: Date;
  waitFreeUnlocksAt?: Date;
  unlockedAt: Date;
  expiresAt?: Date;
}

// Coin Types
export type CoinTransactionType = 'purchase' | 'earn' | 'spend' | 'gift' | 'expire';
export type CoinSource = 'checkin' | 'reading' | 'ad_watch' | 'event' | 'referral';

export interface CoinTransaction {
  id: string;
  userId: string;
  type: CoinTransactionType;
  amount: number;
  balance: number;
  source?: CoinSource;
  chapterId?: string;
  orderId?: string;
  createdAt: Date;
}

// VIP Benefits
export const VIP_BENEFITS: Record<
  UserTier,
  {
    dailyFreeChapters: number;
    adSkip: boolean;
    waitFreeHours: number;
    downloadEnabled: boolean;
    exclusiveContent: boolean;
    monthlyBonusCoins?: number;
    authorDirectMessage?: boolean;
  }
> = {
  free: {
    dailyFreeChapters: 0,
    adSkip: false,
    waitFreeHours: 24,
    downloadEnabled: false,
    exclusiveContent: false,
  },
  vip: {
    dailyFreeChapters: 5,
    adSkip: true,
    waitFreeHours: 12,
    downloadEnabled: true,
    exclusiveContent: false,
    monthlyBonusCoins: 200,
  },
  svip: {
    dailyFreeChapters: 15,
    adSkip: true,
    waitFreeHours: 6,
    downloadEnabled: true,
    exclusiveContent: true,
    monthlyBonusCoins: 500,
    authorDirectMessage: true,
  },
};

// Tip System
export interface TipItem {
  id: string;
  name: string;
  icon: string;
  coinCost: number;
  authorReceives: number;
  animation?: string;
}

export const TIP_ITEMS: TipItem[] = [
  { id: 'flower', name: '꽃다발', icon: '💐', coinCost: 10, authorReceives: 5 },
  { id: 'coffee', name: '커피', icon: '☕', coinCost: 50, authorReceives: 25 },
  { id: 'cake', name: '케이크', icon: '🎂', coinCost: 100, authorReceives: 50 },
  { id: 'crown', name: '왕관', icon: '👑', coinCost: 500, authorReceives: 250 },
  { id: 'rocket', name: '로켓', icon: '🚀', coinCost: 1000, authorReceives: 500 },
  { id: 'castle', name: '성', icon: '🏰', coinCost: 10000, authorReceives: 5000 },
];

// Milestone System
export type MilestoneLevel = 'silver' | 'gold' | 'diamond';

export const MILESTONES: Record<MilestoneLevel, { amount: number; badge: string }> = {
  silver: { amount: 10000, badge: '🥈 실버 서포터' },
  gold: { amount: 100000, badge: '🥇 골드 서포터' },
  diamond: { amount: 1000000, badge: '💎 다이아 서포터' },
};

// Coin Packages
export interface CoinPackage {
  id: string;
  name: string;
  price: number;
  coins: number;
  bonus: number;
  popular?: boolean;
}

export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'starter', name: '스타터', price: 1000, coins: 100, bonus: 0 },
  { id: 'basic', name: '베이직', price: 5000, coins: 500, bonus: 50 },
  { id: 'standard', name: '스탠다드', price: 10000, coins: 1000, bonus: 200, popular: true },
  { id: 'premium', name: '프리미엄', price: 30000, coins: 3000, bonus: 1000 },
  { id: 'ultimate', name: '얼티밋', price: 50000, coins: 5000, bonus: 2500 },
];

// VIP Plans
export interface VipPlan {
  id: string;
  name: string;
  tier: 'vip' | 'svip';
  period: 'monthly' | 'yearly';
  price: number;
  originalPrice?: number;
  bonusCoins: number;
}

export const VIP_PLANS: VipPlan[] = [
  {
    id: 'vip-monthly',
    name: 'VIP 월정액',
    tier: 'vip',
    period: 'monthly',
    price: 5900,
    bonusCoins: 200,
  },
  {
    id: 'vip-yearly',
    name: 'VIP 연정액',
    tier: 'vip',
    period: 'yearly',
    price: 49900,
    originalPrice: 70800,
    bonusCoins: 3000,
  },
  {
    id: 'svip-monthly',
    name: 'SVIP 월정액',
    tier: 'svip',
    period: 'monthly',
    price: 12900,
    bonusCoins: 500,
  },
  {
    id: 'svip-yearly',
    name: 'SVIP 연정액',
    tier: 'svip',
    period: 'yearly',
    price: 109900,
    originalPrice: 154800,
    bonusCoins: 8000,
  },
];

// Check-in Rewards
export interface CheckinReward {
  day: number;
  coins: number;
  bonus?: string;
}

export const CHECKIN_REWARDS: CheckinReward[] = [
  { day: 1, coins: 2 },
  { day: 2, coins: 3 },
  { day: 3, coins: 4 },
  { day: 4, coins: 5 },
  { day: 5, coins: 6 },
  { day: 6, coins: 8 },
  { day: 7, coins: 10, bonus: 'random_chapter_unlock' },
];

// Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  reward: number;
  icon?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_book', name: '첫 걸음', description: '첫 작품 읽기', reward: 50 },
  { id: 'bookworm', name: '책벌레', description: '10권 완독', reward: 200 },
  { id: 'night_owl', name: '올빼미', description: '새벽 3시 독서', reward: 30 },
  { id: 'speed_reader', name: '속독왕', description: '1시간 내 50화 읽기', reward: 100 },
  { id: 'loyal_fan', name: '충성 팬', description: '한 작품 500화 읽기', reward: 500 },
  { id: 'big_spender', name: '큰 손', description: '누적 10,000코인 사용', reward: 1000 },
  { id: 'supporter', name: '서포터', description: '작가에게 팁 10회', reward: 200 },
];

// Reader Settings
export type ReaderTheme = 'light' | 'dark' | 'sepia' | 'green';
export type FontFamily = 'system' | 'nanum' | 'gothic';
export type PageMode = 'scroll' | 'pagination';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number;
  lineHeight: number;
  fontFamily: FontFamily;
  pageMode: PageMode;
  brightness: number;
  autoScroll: boolean;
  autoScrollSpeed: number;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  theme: 'light',
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: 'system',
  pageMode: 'scroll',
  brightness: 100,
  autoScroll: false,
  autoScrollSpeed: 50,
};

// Reading History
export interface ReadingHistory {
  id: string;
  userId: string;
  novelId: string;
  novel?: Novel;
  chapterId: string;
  chapter?: Chapter;
  progress: number;
  readTime: number;
  lastReadAt: Date;
}

// Bookshelf
export type BookshelfCategory = 'reading' | 'finished' | 'dropped';

export interface BookshelfItem {
  id: string;
  userId: string;
  novelId: string;
  novel?: Novel;
  category: BookshelfCategory;
  notificationEnabled: boolean;
  addedAt: Date;
}

// Fan Ranking
export interface FanRanking {
  novelId: string;
  userId: string;
  user?: User;
  totalTipped: number;
  rank: number;
  badge?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
