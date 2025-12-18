# 빠른 참조 가이드

> Solo Developer Workflow Guide의 핵심 체크리스트와 명령어 모음

## 일일 개발 워크플로우

```
1. git pull origin main
2. npm run dev
3. [개발 작업]
4. npm run verify  # typecheck + lint + build
5. git add . && git commit -m "feat: ..."
6. git push origin main
```

## 검증 명령어

| 명령어              | 용도                             |
| ------------------- | -------------------------------- |
| `npm run typecheck` | TypeScript 타입 검사             |
| `npm run lint`      | ESLint 코드 검사                 |
| `npm run test:run`  | 테스트 실행 (단일)               |
| `npm run test`      | 테스트 실행 (watch)              |
| `npm run build`     | 프로덕션 빌드                    |
| `npm run verify`    | 전체 검증 (typecheck+lint+build) |

## 커밋 메시지 형식

```
<type>(<scope>): <description>

feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경
```

## 배포 전 체크리스트

```
□ npm run verify 통과
□ 모든 테스트 통과
□ 환경 변수 확인
□ 민감한 정보 노출 없음
□ API 엔드포인트 테스트
□ 에러 처리 확인
```

## 환경 변수 설정

### 필수 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel 환경 변수 설정

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
```

### Railway 환경 변수 설정

```bash
railway variables set SUPABASE_SERVICE_ROLE_KEY=xxx
railway variables set STRIPE_SECRET_KEY=xxx
railway variables set STRIPE_WEBHOOK_SECRET=xxx
```

## 플랫폼별 배포 명령어

### Vercel

```bash
# 프로덕션 배포
vercel --prod

# 프리뷰 배포
vercel

# 환경 변수 확인
vercel env ls
```

### Railway

```bash
# 배포
railway up

# 로그 확인
railway logs

# 상태 확인
railway status
```

## 문제 해결

### 빌드 실패 시

```bash
# 캐시 정리
rm -rf .next node_modules
npm install
npm run build
```

### 타입 오류 시

```bash
# TypeScript 캐시 정리
rm -rf tsconfig.tsbuildinfo
npm run typecheck
```

### 테스트 실패 시

```bash
# 단일 테스트 파일 실행
npm run test -- src/__tests__/specific.test.ts

# 테스트 캐시 정리
npm run test -- --clearCache
```

## 주간 점검 체크리스트

```
□ 모든 기능이 비전과 일치하는가?
□ 기술 부채 확인
□ 테스트 커버리지 확인
□ 의존성 업데이트 필요 여부
□ 다음 주 우선순위 설정
```

## AI 세션 종료 체크리스트

```
□ 세션 노트 작성 (docs/session-notes/)
□ CLAUDE.md 업데이트 필요 여부 확인
□ 미완료 작업 기록
□ 다음 할 일 명시
```

## 유용한 Git 명령어

```bash
# 최근 커밋 확인
git log --oneline -10

# 변경 사항 확인
git diff

# 스테이징된 변경 확인
git diff --staged

# 브랜치 상태
git status

# 리모트 동기화
git fetch origin
git pull origin main
```

## 파일 위치 빠른 참조

| 항목              | 위치                       |
| ----------------- | -------------------------- |
| 메인 페이지       | `src/app/page.tsx`         |
| API 라우트        | `src/app/api/`             |
| UI 컴포넌트       | `src/components/ui/`       |
| 타입 정의         | `src/types/`               |
| 테스트            | `src/__tests__/`           |
| 환경 변수         | `.env.local` (gitignore)   |
| Vercel 설정       | `vercel.json`              |
| CI 워크플로우     | `.github/workflows/ci.yml` |
| 프로젝트 컨텍스트 | `CONTEXT.md`, `CLAUDE.md`  |

## 관련 문서

- [배포 체크리스트](DEPLOYMENT_CHECKLIST.md)
- [비전 문서](VISION.md)
- [워크플로우 가이드](SOLO_DEVELOPER_WORKFLOW_GUIDE.md)
- [ADR 목록](adr/)
