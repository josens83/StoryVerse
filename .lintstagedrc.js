/**
 * lint-staged 설정
 *
 * TypeScript 프로젝트에서 중요한 점:
 * - 개별 파일 lint/format은 해당 파일만 처리
 * - TypeScript 타입 체크는 전체 프로젝트를 봐야 함 (파일 간 의존성 때문)
 *
 * @see docs/SOLO_DEVELOPER_WORKFLOW_GUIDE.md - 챕터 6.6
 */
module.exports = {
  // TypeScript/JavaScript 파일
  '*.{ts,tsx}': [
    // TypeScript 전체 프로젝트 타입 체크 (파일 인자 무시)
    // 함수 형태로 작성하면 파일 목록을 인자로 받지 않음
    () => 'tsc --noEmit',
    // 스테이징된 파일만 lint + format
    'eslint --fix',
    'prettier --write',
  ],

  // JavaScript 파일 (있는 경우)
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],

  // 기타 파일
  '*.{json,css,md}': ['prettier --write'],
};
