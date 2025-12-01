/**
 * Centralized Error Messages
 *
 * All user-facing error messages should be defined here for:
 * - Consistent messaging across the application
 * - Easy localization support
 * - Single source of truth for error texts
 */

export const ERROR_MESSAGES = {
  // Authentication
  AUTH: {
    UNAUTHORIZED: '인증이 필요합니다',
    INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
    SOCIAL_LOGIN_ACCOUNT: '소셜 로그인으로 가입된 계정입니다',
    RATE_LIMITED: '너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.',
    USER_NOT_FOUND: '사용자를 찾을 수 없습니다',
    SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  },

  // Registration
  REGISTER: {
    EMAIL_EXISTS: '이미 사용 중인 이메일입니다',
    USERNAME_EXISTS: '이미 사용 중인 닉네임입니다',
    FAILED: '회원가입에 실패했습니다',
  },

  // Validation
  VALIDATION: {
    INVALID_EMAIL: '유효한 이메일을 입력해주세요',
    PASSWORD_MIN_LENGTH: '비밀번호는 8자 이상이어야 합니다',
    PASSWORD_MAX_LENGTH: '비밀번호는 100자 이하여야 합니다',
    PASSWORD_REQUIRE_LETTER: '영문자를 포함해야 합니다',
    PASSWORD_REQUIRE_NUMBER: '숫자를 포함해야 합니다',
    PASSWORD_REQUIRED: '비밀번호를 입력해주세요',
    USERNAME_MIN_LENGTH: '닉네임은 2자 이상이어야 합니다',
    USERNAME_MAX_LENGTH: '닉네임은 20자 이하여야 합니다',
    USERNAME_INVALID_CHARS: '영문, 한글, 숫자, 밑줄만 허용됩니다',
    INVALID_PARAMS: '잘못된 요청 파라미터입니다',
    VALIDATION_ERROR: '유효성 검사 오류',
    CONTENT_TYPE_JSON: 'Content-Type must be application/json',
  },

  // Resource
  RESOURCE: {
    NOT_FOUND: (resource: string) => `${resource}를 찾을 수 없습니다`,
    NOVEL_NOT_FOUND: '작품을 찾을 수 없습니다',
    CHAPTER_NOT_FOUND: '챕터를 찾을 수 없습니다',
    CHAPTERS_LOAD_FAILED: '챕터 목록을 불러오는데 실패했습니다',
  },

  // Permission
  PERMISSION: {
    FORBIDDEN: '접근 권한이 없습니다',
    VIP_REQUIRED: 'VIP 멤버십이 필요합니다',
    AUTHOR_ONLY: '작가만 이용할 수 있습니다',
  },

  // Coins
  COIN: {
    INSUFFICIENT: '코인이 부족합니다',
    PURCHASE_FAILED: '코인 구매에 실패했습니다',
    TRANSACTION_FAILED: '코인 거래에 실패했습니다',
  },

  // Server
  SERVER: {
    INTERNAL_ERROR: '서버 오류가 발생했습니다',
    DATABASE_ERROR: '데이터베이스 오류가 발생했습니다',
    RATE_LIMITED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요',
    SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다',
  },
} as const;

// Type helper for error message keys
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
