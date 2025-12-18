# StoryVerse 배포 체크리스트

> 워크플로우 가이드 챕터 3-4 기반 체크리스트
> 배포 전 반드시 모든 항목을 확인하세요.

## 1. TypeScript 검증 (챕터 3)

### 1.1 tsconfig.json 설정 확인

```bash
# 현재 설정 확인
cat tsconfig.json | grep -E "(forceConsistentCasing|noUnchecked|strict)"
```

- [x] `forceConsistentCasingInFileNames: true` - 대소문자 일관성 강제
- [x] `strict: true` - 엄격 모드 활성화
- [x] `noUncheckedIndexedAccess: true` - 인덱스 접근 안전성
- [x] `noImplicitReturns: true` - 암시적 반환 금지
- [x] `noUnusedLocals: true` - 미사용 변수 금지
- [x] `noUnusedParameters: true` - 미사용 매개변수 금지

### 1.2 배포 전 검증 명령어

```bash
# 타입 체크
npm run typecheck

# 린트 검사
npm run lint

# 전체 검증 (필수!)
npm run verify

# Vercel 환경과 동일하게 빌드
vercel build
```

### 1.3 import 경로 대소문자 확인

```bash
# Git 대소문자 변경 추적 활성화 (로컬에서 한 번만)
git config core.ignorecase false
```

- [ ] import 경로가 실제 파일명과 대소문자 일치
- [ ] `@/components/ui/Button` vs `button.tsx` 확인

## 2. 환경 변수 (챕터 3.6)

### 2.1 필수 환경 변수

```bash
# .env.local (로컬 개발)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (결제)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# 기타
JWT_SECRET=
NEXTAUTH_SECRET=
```

### 2.2 Vercel 환경 변수 동기화

```bash
# Vercel에서 환경 변수 가져오기
vercel pull

# 환경 변수 목록 확인
vercel env ls
```

- [ ] 로컬 `.env.local`과 Vercel 환경 변수 일치
- [ ] 프로덕션/프리뷰/개발 환경별 변수 설정

## 3. Supabase 설정 (챕터 4 원칙 적용)

### 3.1 클라이언트 싱글톤 패턴

`src/lib/supabase.ts`에서 globalThis 싱글톤 패턴 사용 중:

```typescript
const globalForSupabase = globalThis as unknown as {
  supabaseClient: SupabaseClient | undefined;
};

// Hot Reload에서도 단일 인스턴스 유지
if (!globalForSupabase.supabaseClient) {
  globalForSupabase.supabaseClient = createClient(...);
}
```

- [x] getSupabase() 함수에서 싱글톤 패턴 사용
- [x] createServerClient() 함수에서 싱글톤 패턴 사용

### 3.2 Supabase Connection Pooling (Serverless 환경)

```bash
# 환경 변수 예시 (Supabase)

# Pooled connection (애플리케이션용) - 포트 6543
# NEXT_PUBLIC_SUPABASE_URL에 pooler URL 사용 권장
# https://xxx.supabase.co → https://xxx.pooler.supabase.com

# 마이그레이션/관리 작업은 직접 연결 사용
```

## 4. 보안 체크리스트

### 4.1 민감 정보 확인

```bash
# .gitignore 확인
cat .gitignore | grep -E "(env|secret|key)"
```

- [ ] `.env.local` 파일이 .gitignore에 포함
- [ ] API 키가 코드에 하드코딩되지 않음
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트에 노출되지 않음

### 4.2 API 보안 헤더

`vercel.json`에서 설정됨:

- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] X-XSS-Protection: 1; mode=block

## 5. 빌드 검증

### 5.1 로컬 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물로 실행
npm run start

# 또는 Vercel CLI로 동일 환경 테스트
vercel build && vercel dev
```

### 5.2 번들 크기 확인

```bash
# 빌드 후 .next/analyze 확인 (설정 시)
npm run build
```

## 6. 테스트 확인

```bash
# 단위 테스트
npm run test:run

# E2E 테스트 (설정된 경우)
npm run test:e2e

# 현재 테스트 현황
# 266개 테스트 통과 확인
```

## 7. 배포 전 최종 확인

```bash
# 전체 검증 실행
npm run verify

# 예상 출력:
# ✓ TypeScript 검사 통과
# ✓ ESLint 검사 통과
# ✓ 빌드 성공
```

### 체크리스트 요약

```
□ npm run verify 성공
□ 환경 변수 설정 완료 (Vercel)
□ import 경로 대소문자 확인
□ 민감 정보 노출 없음
□ 테스트 통과
□ vercel build 성공 (선택)
```

## 8. 배포 후 확인

- [ ] 배포 URL 접근 가능
- [ ] API 엔드포인트 정상 작동
- [ ] 로그에 오류 없음 (`vercel logs`)
- [ ] 성능 모니터링 확인

---

## 참고 문서

- [워크플로우 가이드](./SOLO_DEVELOPER_WORKFLOW_GUIDE.md) - 챕터 1-4
- [Vercel 배포 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
