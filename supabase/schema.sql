-- StoryVerse Database Schema
-- PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,

  tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'vip', 'svip')),
  vip_expires_at TIMESTAMP,

  purchased_coins INTEGER DEFAULT 0,
  earned_coins INTEGER DEFAULT 0,
  earned_coins_expire_at TIMESTAMP,

  total_read_time INTEGER DEFAULT 0,
  consecutive_checkins INTEGER DEFAULT 0,
  last_checkin_at DATE,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Authors table
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pen_name VARCHAR(100) NOT NULL,
  bio TEXT,

  tier VARCHAR(20) DEFAULT 'newcomer' CHECK (tier IN ('newcomer', 'rising', 'established', 'gold', 'platinum', 'legendary')),

  total_novels INTEGER DEFAULT 0,
  total_words BIGINT DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  total_followers INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,

  revenue_share_rate DECIMAL(3,2) DEFAULT 0.5,
  pending_revenue DECIMAL(12,2) DEFAULT 0,
  withdrawable_revenue DECIMAL(12,2) DEFAULT 0,

  is_exclusive BOOLEAN DEFAULT false,
  contract_start_at TIMESTAMP,
  contract_end_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP
);

-- Novels table
CREATE TABLE novels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,

  genre VARCHAR(50) NOT NULL,
  tags TEXT[],
  cover_url TEXT,
  synopsis TEXT,

  total_chapters INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,

  status VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus')),
  is_exclusive BOOLEAN DEFAULT false,
  free_chapters INTEGER DEFAULT 5,
  coin_price INTEGER DEFAULT 5,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_chapter_at TIMESTAMP
);

-- Chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,

  access_type VARCHAR(20) DEFAULT 'coin' CHECK (access_type IN ('free', 'ad_unlock', 'coin', 'vip', 'wait_free')),
  coin_price INTEGER DEFAULT 5,
  free_at TIMESTAMP, -- When this chapter becomes free (wait-free system)

  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,

  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(novel_id, number)
);

-- Chapter unlocks table
CREATE TABLE chapter_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id),

  unlock_method VARCHAR(20) NOT NULL CHECK (unlock_method IN ('free', 'ad', 'coin', 'vip', 'wait_free')),
  coin_spent INTEGER DEFAULT 0,

  wait_free_started_at TIMESTAMP,
  wait_free_unlocks_at TIMESTAMP,

  unlocked_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- For ad unlocks (24 hours)

  UNIQUE(user_id, chapter_id)
);

-- Coin transactions table
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'earn', 'spend', 'gift', 'expire')),
  coin_type VARCHAR(20) NOT NULL CHECK (coin_type IN ('purchased', 'earned')),
  amount INTEGER NOT NULL,
  balance INTEGER NOT NULL,

  source VARCHAR(50), -- checkin, reading, ad_watch, event, referral
  chapter_id UUID REFERENCES chapters(id),
  order_id VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW()
);

-- Tips table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  author_id UUID REFERENCES authors(id),
  novel_id UUID REFERENCES novels(id),

  tip_item_id VARCHAR(50) NOT NULL,
  coin_cost INTEGER NOT NULL,
  author_receives INTEGER NOT NULL,

  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Reading history table
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id),
  chapter_id UUID REFERENCES chapters(id),

  progress DECIMAL(5,2) DEFAULT 0, -- 0-100%
  read_time INTEGER DEFAULT 0, -- seconds

  last_read_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, novel_id)
);

-- Bookshelf table
CREATE TABLE bookshelf (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id),

  category VARCHAR(50) DEFAULT 'reading' CHECK (category IN ('reading', 'finished', 'dropped')),
  notification_enabled BOOLEAN DEFAULT true,

  added_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, novel_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id),

  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Author revenue table
CREATE TABLE author_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id),

  type VARCHAR(50) NOT NULL CHECK (type IN ('chapter_unlock', 'tip', 'vip_pool', 'ad_share', 'bonus')),

  gross_amount DECIMAL(12,2) NOT NULL,
  platform_fee DECIMAL(12,2) NOT NULL,
  net_amount DECIMAL(12,2) NOT NULL,

  user_id UUID REFERENCES users(id), -- For tips
  chapter_id UUID REFERENCES chapters(id),

  created_at TIMESTAMP DEFAULT NOW(),
  settled_at TIMESTAMP
);

-- Subscriptions table (VIP)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  stripe_subscription_id VARCHAR(100),

  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'expired')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  canceled_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_novels_genre ON novels(genre);
CREATE INDEX idx_novels_status ON novels(status);
CREATE INDEX idx_novels_ranking ON novels(view_count DESC, rating DESC);
CREATE INDEX idx_novels_author ON novels(author_id);
CREATE INDEX idx_chapters_novel ON chapters(novel_id, number);
CREATE INDEX idx_unlocks_user ON chapter_unlocks(user_id);
CREATE INDEX idx_unlocks_expires ON chapter_unlocks(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_history_user ON reading_history(user_id, last_read_at DESC);
CREATE INDEX idx_bookshelf_user ON bookshelf(user_id);
CREATE INDEX idx_comments_chapter ON comments(chapter_id, created_at DESC);
CREATE INDEX idx_transactions_user ON coin_transactions(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookshelf ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Novels are public
CREATE POLICY "Novels are viewable by everyone" ON novels FOR SELECT USING (true);

-- Chapters are public (content check in application)
CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR SELECT USING (true);

-- Users can only see their own unlocks
CREATE POLICY "Users can view own unlocks" ON chapter_unlocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own unlocks" ON chapter_unlocks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own reading history
CREATE POLICY "Users can manage own history" ON reading_history FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own bookshelf
CREATE POLICY "Users can manage own bookshelf" ON bookshelf FOR ALL USING (auth.uid() = user_id);
