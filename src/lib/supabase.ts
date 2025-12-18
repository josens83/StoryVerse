import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase 클라이언트 싱글톤 패턴 (Prisma 패턴 적용)
 *
 * 개발 환경에서 Hot Reload 시 새 클라이언트가 생성되면 연결 누수가 발생할 수 있습니다.
 * globalThis를 사용하여 HMR에서도 단일 인스턴스를 유지합니다.
 *
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 4.6
 */
const globalForSupabase = globalThis as unknown as {
  supabaseClient: SupabaseClient | undefined;
  supabaseServerClient: SupabaseClient | undefined;
};

/**
 * Supabase 클라이언트 가져오기 (클라이언트/서버 공용)
 * Hot Reload에서도 단일 인스턴스 유지
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL and Anon Key are required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  if (!globalForSupabase.supabaseClient) {
    globalForSupabase.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return globalForSupabase.supabaseClient;
}

/**
 * Supabase 클라이언트 (직접 접근용)
 * 환경변수가 설정되지 않은 경우 getSupabase() 호출 시 에러 발생
 */
export const supabase = supabaseUrl && supabaseAnonKey ? getSupabase() : (null as never);

/**
 * 서버 사이드 클라이언트 (Service Role 키 사용)
 * 관리자 권한이 필요한 작업에 사용
 * Hot Reload에서도 단일 인스턴스 유지
 */
export function createServerClient(): SupabaseClient {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase URL and Service Role Key are required. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  // 서버 클라이언트도 싱글톤 패턴 적용
  if (!globalForSupabase.supabaseServerClient) {
    globalForSupabase.supabaseServerClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return globalForSupabase.supabaseServerClient;
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          password_hash: string | null;
          avatar_url: string | null;
          tier: 'free' | 'vip' | 'svip';
          vip_expires_at: string | null;
          purchased_coins: number;
          earned_coins: number;
          earned_coins_expire_at: string | null;
          total_read_time: number;
          consecutive_checkins: number;
          last_checkin_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      authors: {
        Row: {
          id: string;
          user_id: string;
          pen_name: string;
          bio: string | null;
          tier: 'newcomer' | 'rising' | 'established' | 'gold' | 'platinum' | 'legendary';
          total_novels: number;
          total_words: number;
          total_views: number;
          total_followers: number;
          total_revenue: number;
          revenue_share_rate: number;
          pending_revenue: number;
          withdrawable_revenue: number;
          is_exclusive: boolean;
          contract_start_at: string | null;
          contract_end_at: string | null;
          created_at: string;
          verified_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['authors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['authors']['Insert']>;
      };
      novels: {
        Row: {
          id: string;
          title: string;
          author_id: string;
          genre: string;
          tags: string[];
          cover_url: string | null;
          synopsis: string | null;
          total_chapters: number;
          total_words: number;
          view_count: number;
          like_count: number;
          favorite_count: number;
          rating: number;
          rating_count: number;
          status: 'ongoing' | 'completed' | 'hiatus';
          is_exclusive: boolean;
          free_chapters: number;
          coin_price: number;
          created_at: string;
          updated_at: string;
          last_chapter_at: string | null;
        };
        Insert: Omit<
          Database['public']['Tables']['novels']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['novels']['Insert']>;
      };
      chapters: {
        Row: {
          id: string;
          novel_id: string;
          number: number;
          title: string | null;
          content: string;
          word_count: number;
          access_type: 'free' | 'ad_unlock' | 'coin' | 'vip' | 'wait_free';
          coin_price: number;
          free_at: string | null;
          view_count: number;
          like_count: number;
          comment_count: number;
          published_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chapters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['chapters']['Insert']>;
      };
      chapter_unlocks: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          novel_id: string;
          unlock_method: 'free' | 'ad' | 'coin' | 'vip' | 'wait_free';
          coin_spent: number;
          wait_free_started_at: string | null;
          wait_free_unlocks_at: string | null;
          unlocked_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['chapter_unlocks']['Row'], 'id' | 'unlocked_at'>;
        Update: Partial<Database['public']['Tables']['chapter_unlocks']['Insert']>;
      };
      coin_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'purchase' | 'earn' | 'spend' | 'gift' | 'expire';
          coin_type: 'purchased' | 'earned';
          amount: number;
          balance: number;
          source: string | null;
          chapter_id: string | null;
          order_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['coin_transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['coin_transactions']['Insert']>;
      };
      tips: {
        Row: {
          id: string;
          sender_id: string;
          author_id: string;
          novel_id: string;
          tip_item_id: string;
          coin_cost: number;
          author_receives: number;
          message: string | null;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tips']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tips']['Insert']>;
      };
      reading_history: {
        Row: {
          id: string;
          user_id: string;
          novel_id: string;
          chapter_id: string;
          progress: number;
          read_time: number;
          last_read_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reading_history']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['reading_history']['Insert']>;
      };
      bookshelf: {
        Row: {
          id: string;
          user_id: string;
          novel_id: string;
          category: 'reading' | 'finished' | 'dropped';
          notification_enabled: boolean;
          added_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookshelf']['Row'], 'id' | 'added_at'>;
        Update: Partial<Database['public']['Tables']['bookshelf']['Insert']>;
      };
    };
  };
};
