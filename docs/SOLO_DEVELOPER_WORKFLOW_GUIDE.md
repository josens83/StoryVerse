# 솔로 개발자의 3대 워크플로우 병목 해결 가이드

> 바이브 코딩 한계 극복을 위한 실전 가이드

---

## 전체 목차

| 챕터 | 제목                                     | 핵심 내용                                   |
| :--: | ---------------------------------------- | ------------------------------------------- |
|  1   | **솔로 개발자의 3대 워크플로우 병목**    | 문제 정의와 해결 방향 개요                  |
|  2   | **배포 오류의 근본 원인 이해**           | 로컬 vs 클라우드 환경 차이 분석             |
|  3   | **TypeScript 클라우드 배포 완벽 가이드** | 대소문자, strict mode, 모듈 해석 문제       |
|  4   | **Prisma 타입 문제 해결 및 최적화**      | Client 생성, Connection Pooling, Serverless |
|  5   | **CI/CD 파이프라인 구축**                | GitHub Actions 완전 템플릿                  |
|  6   | **배포 전 검증 자동화**                  | Husky, lint-staged, Pre-commit Hook         |
|  7   | **AI 코딩 도구 컨텍스트 관리 전략**      | CLAUDE.md, 세션 관리, 효과적인 프롬프트     |
|  8   | **프로젝트 비전 유지와 아키텍처 문서화** | ADR, C4 모델, Personal Kanban               |
|  9   | **플랫폼별 설정 가이드**                 | Vercel, Railway 최적 설정                   |
|  10  | **즉시 실행 가능한 액션 플랜**           | 체크리스트와 템플릿 모음                    |

### Part 2: UI/UX 심화 가이드

| 챕터 | 제목                                  | 핵심 내용                                |
| :--: | ------------------------------------- | ---------------------------------------- |
|  11  | **바이브 코딩과 UI/UX의 근본적 충돌** | AI 생성 UI의 한계와 문제점 이해          |
|  12  | **AI에게 디자인 시스템 전달하기**     | MCP 서버, Cursor Rules, 디자인 토큰      |
|  13  | **반응형 디자인과 AI 협업**           | Mobile-first 강제, 브레이크포인트 일관성 |
|  14  | **상태별 UI 패턴 완벽 구현**          | 로딩, 에러, 빈 상태, 성공 상태           |
|  15  | **UI/UX 품질 검증 자동화**            | Storybook, Chromatic, 시각적 회귀 테스트 |
|  16  | **마이크로 인터랙션과 애니메이션**    | Framer Motion, 트랜지션 가이드라인       |
|  17  | **접근성(A11y) 완벽 가이드**          | WCAG 2.1, axe-core, 키보드 네비게이션    |
|  18  | **성능과 UX의 교차점**                | Core Web Vitals, 이미지 최적화, 로딩 UX  |
|  19  | **UI 프롬프트 엔지니어링 마스터**     | 효과적인 프롬프트 패턴과 반복 전략       |
|  20  | **디자이너 없이 작업하는 워크플로우** | v0.dev, 피드백 수집, UI/UX 결정 문서화   |

---

## 챕터 1: 솔로 개발자의 3대 워크플로우 병목

### 1.1 왜 이 문제들이 중요한가

혼자서 개발할 때 가장 큰 적은 **시간 낭비의 반복**입니다. 팀에서는 누군가가 잡아주던 문제들을 혼자서 모두 해결해야 하고, 같은 실수를 반복하면 그 비용은 고스란히 본인에게 돌아옵니다.

세 가지 문제는 솔로 개발자들이 가장 흔히 겪는 생산성 병목입니다:

```
┌─────────────────────────────────────────────────────────────────┐
│                    솔로 개발자 시간 낭비 구조                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [코드 작성] → [로컬 테스트 OK] → [배포] → [오류!] → [수정]      │
│        ↑                                              │         │
│        └──────────────────────────────────────────────┘         │
│                      무한 반복 루프                              │
│                                                                 │
│   [AI 대화 시작] → [좋은 응답] → [대화 누적] → [품질 저하]        │
│        ↑                                              │         │
│        └──────── 새 대화창 생성 ──────────────────────┘         │
│                      컨텍스트 리셋 반복                           │
│                                                                 │
│   [프로젝트 시작] → [기능 구현] → [또 다른 기능] → [컨셉 이탈]    │
│        ?                                              │         │
│        └──────── 원래 뭐하려고 했더라? ───────────────┘         │
│                      비전 상실                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 세 가지 문제의 정의

#### 문제 1: 배포 오류의 반복

Vercel이나 Railway에 배포할 때 로컬에서는 잘 되던 코드가 갑자기 실패합니다. 수정하면 또 다른 오류가 나오고, 이 과정이 반복되면서 시간이 사라집니다.

| 증상                                 | 근본 원인                             |
| ------------------------------------ | ------------------------------------- |
| "로컬에서는 되는데 배포하면 안 돼요" | 환경 차이 (OS, Node 버전, 파일시스템) |
| "수정하면 또 다른 오류가 나와요"     | 사전 검증 시스템 부재                 |
| "TypeScript 오류가 배포 때만 나와요" | 대소문자, strict mode 차이            |
| "Prisma Client를 찾을 수 없어요"     | 캐싱, generate 순서 문제              |

#### 문제 2: AI 도구의 컨텍스트 한계

Claude Code Web이나 다른 AI 코딩 도구에서 대화가 길어지면 응답 품질이 떨어집니다. 이전에 논의한 내용을 잊어버리거나, 엉뚱한 코드를 생성하기 시작합니다.

| 증상                             | 근본 원인                 |
| -------------------------------- | ------------------------- |
| "이전에 말한 거 왜 또 물어봐요?" | 컨텍스트 윈도우 한계      |
| "갑자기 이상한 코드를 생성해요"  | 누적된 노이즈로 인한 혼란 |
| "매번 새 대화창을 만들어야 해요" | 세션 관리 전략 부재       |

#### 문제 3: 프로젝트 비전 이탈

세부 기능 구현에 집중하다 보면 원래 프로젝트가 무엇을 하려고 했는지 잊어버립니다. 완성된 결과물이 처음 의도와 다른 방향으로 흘러갑니다.

| 증상                               | 근본 원인            |
| ---------------------------------- | -------------------- |
| "이 기능 왜 추가했더라?"           | 의사결정 기록 부재   |
| "원래 컨셉이랑 달라졌어요"         | 비전 문서 부재       |
| "전체 구조가 머릿속에 안 그려져요" | 아키텍처 시각화 부재 |

### 1.3 해결 방향 개요

이 가이드에서는 각 문제에 대해 **예방 → 감지 → 해결**의 3단계 접근법을 사용합니다.

```
┌────────────────────────────────────────────────────────────────┐
│                      3단계 해결 접근법                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│  │   예방   │ →  │   감지   │ →  │   해결   │                 │
│  └──────────┘    └──────────┘    └──────────┘                 │
│                                                                │
│  배포 오류:                                                    │
│  • 예방: tsconfig, package.json 올바른 설정                    │
│  • 감지: CI/CD 파이프라인, pre-commit hook                     │
│  • 해결: 오류별 즉시 해결 가이드                                │
│                                                                │
│  AI 컨텍스트:                                                  │
│  • 예방: CLAUDE.md로 프로젝트 컨텍스트 사전 제공               │
│  • 감지: 응답 품질 저하 시점 인식                              │
│  • 해결: 세션 종료 전 지식 보존 → 새 세션 시작                 │
│                                                                │
│  비전 이탈:                                                    │
│  • 예방: 비전 문서, ADR 작성                                   │
│  • 감지: 주간/월간 점검 루틴                                   │
│  • 해결: 기능 개발 전 정렬 체크리스트                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1.4 이 가이드의 활용법

**모든 것을 한 번에 적용하려 하지 마세요.**

가장 큰 고통점을 주는 문제 하나를 선택하고, 해당 챕터의 해결책을 먼저 적용하세요. 작은 개선이 누적되면 전체 워크플로우가 변화합니다.

**추천 순서:**

1. **배포 오류가 가장 심각하다면** → 챕터 3, 4, 5 순서로
2. **AI 도구 활용이 비효율적이라면** → 챕터 7 먼저
3. **프로젝트가 산으로 가고 있다면** → 챕터 8 먼저

---

## 챕터 2: 배포 오류의 근본 원인 이해

### 2.1 왜 로컬에서 되는 코드가 클라우드에서 실패하는가

"제 컴퓨터에서는 잘 되는데요..." - 모든 개발자가 한 번쯤 해본 말입니다. 이 현상의 근본 원인은 **로컬 환경과 클라우드 환경의 구조적 차이**입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                   로컬 vs 클라우드 환경 비교                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│        로컬 환경 (Windows/macOS)    클라우드 환경 (Linux)        │
│        ─────────────────────────    ─────────────────────       │
│                                                                 │
│  파일시스템:  대소문자 구분 안 함    대소문자 엄격히 구분          │
│              UserProfile.ts =        UserProfile.ts ≠           │
│              userprofile.ts          userprofile.ts             │
│                                                                 │
│  Node 버전:  내 PC에 설치된 버전     플랫폼 기본값 또는 명시값     │
│              (v20.10.0)              (v18.x? v20.x?)             │
│                                                                 │
│  환경변수:   .env 파일 자동 로드     대시보드에서 직접 설정 필요   │
│              (.env.local 등)         (자동 로드 안 됨)            │
│                                                                 │
│  의존성:     node_modules 유지됨     매 빌드마다 새로 설치         │
│              (캐시 있음)             (캐시 정책에 따라 다름)       │
│                                                                 │
│  빌드 모드:  개발 모드 (관대함)      프로덕션 모드 (엄격함)        │
│              경고만 표시             경고도 오류로 처리            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 파일시스템 대소문자: 가장 흔한 함정

**이것이 TypeScript 배포 오류의 #1 원인입니다.**

Windows와 macOS는 파일 이름의 대소문자를 구분하지 않습니다. `UserProfile.ts`와 `userprofile.ts`는 같은 파일로 취급됩니다. 하지만 Linux 기반 클라우드 서버에서는 완전히 다른 파일입니다.

```typescript
// 로컬에서는 작동, 클라우드에서는 실패하는 코드

// 실제 파일명: components/UserProfile.tsx

// ❌ 이렇게 import하면 로컬에서는 되지만 클라우드에서 실패
import UserProfile from './components/userprofile'; // 소문자

// ✅ 정확한 대소문자로 import
import UserProfile from './components/UserProfile'; // 대문자 P
```

**실제 오류 메시지:**

```
Error: Cannot find module './components/userprofile'
  or
TS1149: File name 'UserProfile.tsx' differs from already
        included file name 'userprofile.tsx' only in casing
```

### 2.3 Node.js 버전 불일치

로컬에서 Node 20을 쓰고 있는데, 클라우드 플랫폼이 Node 18로 빌드하면 최신 문법이나 API가 작동하지 않을 수 있습니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Node 버전별 주요 차이점                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Node 18 vs Node 20:                                            │
│  • Array.prototype.toSorted() - Node 20+                        │
│  • import.meta.resolve() 안정화 - Node 20+                      │
│  • 일부 crypto API 변경                                         │
│                                                                 │
│  Node 16 vs Node 18:                                            │
│  • fetch() 내장 - Node 18+                                      │
│  • --experimental-fetch 불필요 - Node 18+                       │
│  • OpenSSL 3.0 기본 사용 - Node 18+                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**문제 시나리오:**

```javascript
// Node 20에서는 작동, Node 18에서는 실패
const sorted = myArray.toSorted(); // Node 20+ 전용

// Node 18 이하에서는 이렇게 해야 함
const sorted = [...myArray].sort();
```

### 2.4 환경변수 누락

로컬에서는 `.env.local` 파일이 자동으로 로드되지만, 클라우드 플랫폼에서는 대시보드에 직접 등록해야 합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    환경변수 로드 차이                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  로컬 개발 시:                                                  │
│  ─────────────                                                  │
│  .env                    ← 기본 (Git에 커밋 가능)               │
│  .env.local              ← 로컬 전용 (Git 무시)                 │
│  .env.development        ← 개발 모드 전용                       │
│  .env.development.local  ← 개발 모드 + 로컬 전용                │
│                                                                 │
│  → Next.js/Vite가 자동으로 병합해서 로드                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  클라우드 배포 시:                                               │
│  ───────────────                                                │
│  • .env 파일들은 .gitignore에 있어서 배포 안 됨                 │
│  • 플랫폼 대시보드에서 직접 설정 필요                            │
│  • 또는 CLI로 동기화: vercel env pull                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**흔한 오류:**

```
Error: DATABASE_URL environment variable is not set

Error: Invalid prisma.user.findMany() invocation:
       Unable to connect to the database
```

### 2.5 의존성 설치 차이: npm install vs npm ci

로컬에서는 `npm install`을 쓰지만, CI/CD 환경에서는 `npm ci`가 실행됩니다. 이 둘의 동작이 다릅니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                 npm install vs npm ci 비교                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  npm install:                                                   │
│  ─────────────                                                  │
│  • package.json 기준으로 설치                                   │
│  • 버전 범위 내에서 최신 버전 설치 (^1.0.0 → 1.5.0)             │
│  • package-lock.json 업데이트 가능                              │
│  • 기존 node_modules 유지하면서 추가/업데이트                    │
│                                                                 │
│  npm ci (Clean Install):                                        │
│  ────────────────────────                                       │
│  • package-lock.json 기준으로 정확히 설치                       │
│  • 버전 고정 (lock 파일에 명시된 정확한 버전)                    │
│  • package-lock.json 수정 불가 (불일치 시 오류)                 │
│  • node_modules 완전 삭제 후 새로 설치                          │
│                                                                 │
│  ⚠️  CI 환경에서는 npm ci가 기본!                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**문제 시나리오:**

```bash
# 로컬에서 패키지 추가 후 lock 파일 커밋 안 함
npm install some-package  # package.json만 수정됨

# CI에서 빌드 시
npm ci  # package-lock.json과 불일치 → 오류!
```

**오류 메시지:**

```
npm ERR! `npm ci` can only install packages when your
         package.json and package-lock.json are in sync.
```

### 2.6 빌드 모드 차이: 개발 vs 프로덕션

개발 모드는 관대하고, 프로덕션 모드는 엄격합니다. 특히 Next.js는 프로덕션 빌드 시 더 많은 검사를 수행합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                  개발 모드 vs 프로덕션 모드                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  개발 모드 (npm run dev):                                       │
│  ─────────────────────────                                      │
│  • TypeScript 오류 → 경고만 표시, 실행은 됨                     │
│  • ESLint 경고 → 콘솔에만 표시                                  │
│  • 미사용 변수 → 무시                                           │
│  • any 타입 → 허용                                              │
│                                                                 │
│  프로덕션 모드 (npm run build):                                 │
│  ──────────────────────────────                                 │
│  • TypeScript 오류 → 빌드 실패                                  │
│  • ESLint 경고 → 빌드 실패 (설정에 따라)                        │
│  • 미사용 import → 오류                                         │
│  • 타입 불일치 → 오류                                           │
│                                                                 │
│  💡 로컬에서도 npm run build를 자주 실행하세요!                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.7 Prisma 특유의 문제: Client 생성 타이밍

Prisma는 `prisma generate` 명령어로 TypeScript 타입을 생성합니다. 이 타이밍이 맞지 않으면 타입을 찾을 수 없다는 오류가 발생합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Prisma Client 생성 흐름                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  올바른 순서:                                                   │
│  ─────────────                                                  │
│                                                                 │
│  npm install                                                    │
│       ↓                                                         │
│  prisma generate  ← @prisma/client 타입 생성                    │
│       ↓              (node_modules/.prisma/client/)             │
│  npm run build    ← 생성된 타입을 사용해서 빌드                  │
│       ↓                                                         │
│  배포 성공! ✅                                                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  잘못된 순서 (Vercel 캐싱 문제):                                 │
│  ────────────────────────────────                               │
│                                                                 │
│  npm install      ← 캐시된 node_modules 사용                    │
│       ↓              (prisma generate 건너뜀!)                  │
│  npm run build    ← 오래된 타입 사용 또는 타입 없음              │
│       ↓                                                         │
│  빌드 실패! ❌    "Cannot find module '@prisma/client'"          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.8 문제 해결의 핵심 원칙

모든 배포 오류 해결의 핵심은 **"클라우드 환경을 로컬에서 재현하라"**입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    배포 오류 해결 3원칙                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  원칙 1: 환경을 일치시켜라                                       │
│  ─────────────────────────                                      │
│  • Node 버전 명시 (package.json engines)                        │
│  • 환경변수 동기화 (vercel pull)                                │
│  • 대소문자 강제 (forceConsistentCasingInFileNames)             │
│                                                                 │
│  원칙 2: 배포 전에 검증하라                                      │
│  ─────────────────────────                                      │
│  • 로컬에서 프로덕션 빌드 테스트 (npm run build)                │
│  • CI 파이프라인에서 자동 검증                                   │
│  • Pre-commit hook으로 커밋 시점 차단                           │
│                                                                 │
│  원칙 3: 실패를 빨리 발견하라                                    │
│  ─────────────────────────                                      │
│  • 푸시 전에 오류 발견 = 5분 수정                                │
│  • CI에서 오류 발견 = 15분 수정                                  │
│  • 배포 후 오류 발견 = 1시간+ 수정                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 챕터 3: TypeScript 클라우드 배포 완벽 가이드

### 3.1 대소문자 문제 완전 해결

앞서 설명한 대로, 파일명 대소문자 불일치는 **TypeScript 배포 오류의 #1 원인**입니다. 이 문제를 완전히 예방하는 설정을 적용해봅시다.

**tsconfig.json 필수 설정:**

```json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  }
}
```

이 설정을 활성화하면 로컬(Windows/macOS)에서도 대소문자 불일치를 오류로 감지합니다.

**Git 설정도 함께 변경:**

```bash
# 대소문자 변경 추적 활성화
git config core.ignorecase false

# 이미 잘못 커밋된 파일이 있다면 캐시 초기화
git rm -r --cached .
git add --all .
git commit -m "Fix file casing issues"
```

**ESLint로 import 경로 검증 추가:**

```bash
npm install -D eslint-plugin-import
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-unresolved': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
```

### 3.2 Strict Mode 완벽 이해

TypeScript의 `strict` 옵션은 여러 개별 옵션의 묶음입니다. 클라우드 배포 시 문제가 되는 것들을 정확히 이해해야 합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                  strict: true가 활성화하는 옵션들                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  옵션                          영향                             │
│  ────────────────────────────  ──────────────────────────────  │
│                                                                 │
│  strictNullChecks              null/undefined 엄격 검사         │
│                                string | null 구분 필요          │
│                                                                 │
│  strictFunctionTypes           함수 매개변수 타입 엄격 검사     │
│                                                                 │
│  strictBindCallApply           bind, call, apply 타입 검사      │
│                                                                 │
│  strictPropertyInitialization  클래스 속성 초기화 강제          │
│                                constructor에서 초기화 필요      │
│                                                                 │
│  noImplicitAny                 암시적 any 금지                  │
│                                타입 명시 필요                   │
│                                                                 │
│  noImplicitThis                암시적 this 금지                 │
│                                                                 │
│  alwaysStrict                  "use strict" 자동 추가           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**흔한 strict mode 오류와 해결:**

```typescript
// ❌ 오류: Object is possibly 'undefined'
function getUser(id: string) {
  const users = [{ id: '1', name: 'Kim' }];
  const user = users.find((u) => u.id === id);
  return user.name; // user가 undefined일 수 있음!
}

// ✅ 해결 1: 옵셔널 체이닝
return user?.name;

// ✅ 해결 2: 명시적 체크
if (!user) throw new Error('User not found');
return user.name;

// ✅ 해결 3: Non-null assertion (확실할 때만!)
return user!.name;
```

```typescript
// ❌ 오류: Parameter 'event' implicitly has an 'any' type
const handleClick = (event) => { ... }

// ✅ 해결: 타입 명시
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { ... }
```

### 3.3 모듈 해석 문제 해결

`Cannot find module` 오류의 대부분은 `moduleResolution` 설정 문제입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                moduleResolution 옵션 비교                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  "node"        전통적인 Node.js 방식                            │
│                node_modules 폴더 탐색                           │
│                CJS 프로젝트에 적합                              │
│                                                                 │
│  "node16"      Node.js 16+ ESM 지원                             │
│  "nodenext"    package.json exports 필드 인식                   │
│                .js 확장자 필요할 수 있음                        │
│                                                                 │
│  "bundler"     ⭐ 번들러 사용 프로젝트에 최적 (권장)             │
│                Vite, webpack, esbuild 등                        │
│                확장자 생략 가능                                  │
│                package.json exports 인식                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Next.js/Vite 프로젝트 권장 설정:**

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**JSON 파일 import 오류 해결:**

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

```typescript
// 이제 가능
import config from './config.json';
```

### 3.4 Path Alias 설정 (@/ 경로)

상대 경로 지옥(`../../../../components/Button`)을 탈출하는 path alias 설정입니다.

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

**Next.js는 자동 인식됩니다.** 하지만 다른 프레임워크는 별도 설정이 필요합니다.

**Vite 추가 설정 (vite.config.ts):**

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3.5 완벽한 tsconfig.json 템플릿

**Next.js + Vercel 프로젝트용:**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // 타겟 환경
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Strict 모드 (모두 활성화 권장)
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    // 모듈 호환성
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // 빌드 최적화
    "skipLibCheck": true,
    "incremental": true,

    // 대소문자 강제 (필수!)
    "forceConsistentCasingInFileNames": true,

    // Next.js 전용
    "jsx": "preserve",
    "noEmit": true,
    "plugins": [{ "name": "next" }],

    // Path Alias
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out"]
}
```

**Express/Node.js 백엔드용:**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],

    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,

    "esModuleInterop": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,

    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    "skipLibCheck": true,
    "incremental": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.6 흔한 TypeScript 오류 즉시 해결 가이드

| 오류 메시지                              | 원인                          | 즉시 해결법                            |
| ---------------------------------------- | ----------------------------- | -------------------------------------- |
| `TS1149: File name differs in casing`    | import 경로 대소문자 불일치   | import 경로를 실제 파일명과 일치시키기 |
| `TS2307: Cannot find module`             | 모듈 경로 오류 또는 타입 없음 | `@types/` 패키지 설치 또는 경로 확인   |
| `TS2322: Type 'X' is not assignable`     | 타입 불일치                   | 타입 단언 또는 타입 수정               |
| `TS2531: Object is possibly 'null'`      | null 체크 누락                | 옵셔널 체이닝 `?.` 또는 null 체크 추가 |
| `TS7006: Parameter implicitly has 'any'` | 매개변수 타입 누락            | 명시적 타입 추가                       |
| `TS18048: 'X' is possibly 'undefined'`   | undefined 체크 누락           | 옵셔널 체이닝 또는 기본값 설정         |

**타입 단언이 필요한 경우:**

```typescript
// 외부 라이브러리 타입이 불완전할 때
const result = someLibraryFunction() as ExpectedType;

// DOM 요소 타입 단언
const button = document.getElementById('btn') as HTMLButtonElement;

// 확실히 값이 있을 때 (주의해서 사용)
const value = possiblyNull!;
```

### 3.7 배포 전 TypeScript 검증 명령어

**package.json에 추가:**

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "verify": "npm run typecheck && npm run lint && npm run build"
  }
}
```

**배포 전 필수 실행:**

```bash
# 타입 체크만 (빠름)
npm run typecheck

# 전체 검증 (권장)
npm run verify
```

### 3.8 로컬에서 Vercel 환경 완벽 재현

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 연결
vercel link

# 환경변수 동기화 (중요!)
vercel pull

# 로컬에서 Vercel과 동일하게 빌드
vercel build

# 빌드 결과물로 로컬 실행
vercel dev
```

**`vercel build`가 성공하면 실제 배포도 성공합니다.** 이 명령어를 습관적으로 사용하세요.

### 3.9 TypeScript 배포 오류 체크리스트

배포 전 이 항목들을 확인하세요:

```
□ tsconfig.json에 forceConsistentCasingInFileNames: true 설정
□ import 경로의 대소문자가 실제 파일명과 일치
□ npm run typecheck 통과
□ npm run build 로컬에서 성공
□ package.json에 engines.node 버전 명시
□ 모든 타입 오류 해결 (no any, no implicit)
□ vercel build 또는 로컬 프로덕션 빌드 성공
```

---

## 챕터 4: Prisma 타입 문제 해결 및 최적화

### 4.1 Prisma Client 생성 원리 이해

Prisma의 독특한 점은 **스키마 파일에서 TypeScript 타입을 동적으로 생성**한다는 것입니다. 이 과정을 이해하면 대부분의 오류를 예방할 수 있습니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                 Prisma Client 생성 흐름                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  prisma/schema.prisma                                           │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ prisma generate │  ← 이 명령이 핵심!                          │
│  └─────────────────┘                                            │
│         │                                                       │
│         ▼                                                       │
│  node_modules/.prisma/client/                                   │
│  ├── index.js          (런타임 코드)                            │
│  ├── index.d.ts        (TypeScript 타입)                        │
│  ├── schema.prisma     (스키마 복사본)                          │
│  └── libquery_engine-* (쿼리 엔진 바이너리)                     │
│         │                                                       │
│         ▼                                                       │
│  node_modules/@prisma/client/                                   │
│  └── index.d.ts        (.prisma/client로 re-export)             │
│                                                                 │
│  💡 @prisma/client는 .prisma/client의 래퍼일 뿐!                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 포인트:** `prisma generate`가 실행되지 않으면 타입이 없어서 빌드가 실패합니다.

### 4.2 "Cannot find module '@prisma/client'" 완벽 해결

이 오류의 99%는 **Vercel/Railway의 캐싱 메커니즘** 때문입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    문제 발생 시나리오                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  첫 번째 배포:                                                   │
│  ─────────────                                                  │
│  npm install     → prisma 설치됨                                │
│  postinstall     → prisma generate 실행                         │
│  npm run build   → 타입 있음, 빌드 성공 ✅                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  두 번째 배포 (schema.prisma 변경 없음):                         │
│  ───────────────────────────────────────                        │
│  npm install     → node_modules 캐시 사용 (설치 건너뜀)         │
│  postinstall     → 건너뜀! (npm install 안 했으니까)            │
│  npm run build   → 오래된 타입 또는 타입 없음 ❌                 │
│                                                                 │
│  오류: Cannot find module '@prisma/client'                      │
│  또는: PrismaClient is not a constructor                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**해결책 1: postinstall 스크립트 (필수)**

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

**해결책 2: 빌드 명령어에 generate 포함**

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

**해결책 3: Vercel 전용 빌드 명령어**

Vercel 대시보드 또는 `vercel.json`에서:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

### 4.3 prisma를 dependencies에 넣어야 하는 이유

많은 튜토리얼이 `prisma`를 `devDependencies`에 넣으라고 하지만, **클라우드 배포에서는 문제**가 됩니다.

```
┌─────────────────────────────────────────────────────────────────┐
│           dependencies vs devDependencies 차이                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  로컬 개발:                                                      │
│  ──────────                                                     │
│  npm install  → dependencies + devDependencies 모두 설치        │
│  prisma CLI   → 사용 가능 ✅                                    │
│                                                                 │
│  프로덕션 배포 (NODE_ENV=production):                            │
│  ────────────────────────────────────                           │
│  npm install --production  → dependencies만 설치                │
│  또는 npm ci                 (devDependencies 제외)              │
│  prisma CLI                → 찾을 수 없음 ❌                     │
│                                                                 │
│  💡 해결: prisma를 dependencies에 넣기                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**올바른 package.json:**

```json
{
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0"
  }
}
```

### 4.4 Prisma 스키마 올바른 설정

**기본 스키마 템플릿 (prisma/schema.prisma):**

```prisma
// 데이터소스 설정
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // 마이그레이션용 직접 연결
}

// 클라이언트 생성기
generator client {
  provider = "prisma-client-js"
}

// 모델 예시
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4.5 Connection Pooling: Serverless 필수 설정

Serverless 환경(Vercel, Railway 등)에서 **Connection Pooling 없이 배포하면 DB 연결이 고갈**됩니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              Serverless Connection 문제                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  문제 상황:                                                      │
│  ──────────                                                     │
│                                                                 │
│  요청 1 → 새 함수 인스턴스 → 새 DB 연결 (연결 1)                 │
│  요청 2 → 새 함수 인스턴스 → 새 DB 연결 (연결 2)                 │
│  요청 3 → 새 함수 인스턴스 → 새 DB 연결 (연결 3)                 │
│  ...                                                            │
│  요청 100 → 연결 한계 초과! ❌                                   │
│                                                                 │
│  PostgreSQL 기본 연결 제한: ~100개                               │
│  Serverless는 요청마다 새 연결 시도 → 금방 고갈                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  해결책: Connection Pooler 사용                                  │
│  ───────────────────────────────                                │
│                                                                 │
│  요청 1 ─┐                                                       │
│  요청 2 ─┼─→ Connection Pooler ─→ DB (연결 5개만 유지)           │
│  요청 3 ─┘      (PgBouncer 등)                                   │
│                                                                 │
│  Pooler가 연결을 재사용하여 효율적으로 관리                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**환경변수 설정 (Supabase 예시):**

```bash
# .env

# Pooled connection (애플리케이션용) - 포트 6543
DATABASE_URL="postgresql://user:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true"

# Direct connection (마이그레이션용) - 포트 5432
DIRECT_URL="postgresql://user:pass@db.xxx.supabase.co:5432/postgres"
```

**스키마 설정:**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled (런타임)
  directUrl = env("DIRECT_URL")        // Direct (마이그레이션)
}
```

| 플랫폼      | Pooler 포트 | Direct 포트   |
| ----------- | ----------- | ------------- |
| Supabase    | 6543        | 5432          |
| Neon        | 기본 URL    | (별도 설정)   |
| PlanetScale | 기본 URL    | (MySQL, 다름) |

### 4.6 Prisma Client 싱글톤 패턴 (필수)

개발 환경에서 Hot Reload 때마다 새 PrismaClient가 생성되면 **연결 누수**가 발생합니다.

**lib/prisma.ts (또는 lib/db.ts):**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

**사용법:**

```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

**❌ 절대 하지 말 것:**

```typescript
// 매 요청마다 새 인스턴스 생성 - 연결 누수!
export async function GET() {
  const prisma = new PrismaClient(); // ❌
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

### 4.7 Prisma Accelerate: 엣지 환경 최적화

Prisma Accelerate는 **글로벌 캐싱**과 **Connection Pooling**을 제공하는 Prisma 공식 서비스입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                 Prisma Accelerate 구조                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Edge Function]                                                │
│       │                                                         │
│       ▼                                                         │
│  [Prisma Accelerate] ←── 전 세계 분산 캐시                      │
│       │                                                         │
│       ▼                                                         │
│  [Connection Pool]                                              │
│       │                                                         │
│       ▼                                                         │
│  [Database]                                                     │
│                                                                 │
│  장점:                                                          │
│  • 쿼리 결과 캐싱 (응답 속도 향상)                               │
│  • 자동 Connection Pooling                                      │
│  • 엣지에서 실행 가능 (Vercel Edge Functions)                    │
│  • 쿼리 엔진 바이너리 불필요 (번들 크기 ~40MB 감소)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**설정 방법:**

1. **Prisma Console에서 Accelerate 활성화** (https://console.prisma.io)

2. **스키마 수정:**

```prisma
generator client {
  provider = "prisma-client-js"
}
```

3. **환경변수 설정:**

```bash
# Accelerate 연결 문자열로 교체
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"

# Direct URL은 마이그레이션용으로 유지
DIRECT_URL="postgresql://user:pass@your-db:5432/db"
```

4. **클라이언트 코드:**

```typescript
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

// 캐싱 적용 쿼리
const posts = await prisma.post.findMany({
  cacheStrategy: {
    ttl: 60, // 60초 캐시
    swr: 120, // 120초 Stale-While-Revalidate
  },
});
```

### 4.8 Binary Target 오류 해결

Prisma는 플랫폼별로 다른 쿼리 엔진 바이너리를 사용합니다. 로컬과 클라우드의 OS가 다르면 오류가 발생합니다.

**오류 메시지:**

```
PrismaClientInitializationError: Unable to require
`/app/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node`

Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"
```

**해결책 1: Pure JavaScript 모드 (Prisma 5.16.0+, 권장)**

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"  // Rust 바이너리 대신 JS 엔진 사용
}
```

장점:

- 바이너리 호환성 문제 완전 해결
- 번들 크기 대폭 감소
- 엣지 환경 지원

**해결책 2: Binary Target 명시**

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x", "linux-musl-openssl-3.0.x"]
}
```

| 플랫폼           | Binary Target                     |
| ---------------- | --------------------------------- |
| Vercel (Node.js) | `rhel-openssl-3.0.x`              |
| Railway          | `linux-musl-openssl-3.0.x`        |
| AWS Lambda       | `rhel-openssl-1.0.x` 또는 `3.0.x` |
| Docker Alpine    | `linux-musl-openssl-3.0.x`        |

### 4.9 흔한 Prisma 오류 즉시 해결

| 오류                                  | 원인                 | 해결                                                 |
| ------------------------------------- | -------------------- | ---------------------------------------------------- |
| `Cannot find module '@prisma/client'` | generate 안 됨       | `postinstall: "prisma generate"` 추가                |
| `PrismaClient is not a constructor`   | 잘못된 import        | `import { PrismaClient } from '@prisma/client'` 확인 |
| `Unable to locate Query Engine`       | 바이너리 불일치      | `engineType: "client"` 또는 binaryTargets 추가       |
| `Too many connections`                | Pooling 없음         | Connection Pooler URL 사용                           |
| `P1001: Can't reach database`         | 환경변수 누락        | DATABASE_URL 확인                                    |
| `P2002: Unique constraint failed`     | 중복 데이터          | 비즈니스 로직에서 처리                               |
| `P2025: Record not found`             | 없는 레코드 업데이트 | findFirst 후 update 또는 upsert 사용                 |

### 4.10 Prisma 배포 체크리스트

```
□ package.json의 postinstall에 "prisma generate" 추가
□ prisma를 dependencies에 포함 (devDependencies 아님)
□ DATABASE_URL 환경변수 설정 완료
□ Connection Pooling 설정 (Serverless 환경)
□ directUrl 설정 (마이그레이션용)
□ PrismaClient 싱글톤 패턴 사용
□ npx prisma validate 통과
□ npx prisma generate 로컬 성공
□ Binary target 또는 engineType: "client" 설정
```

### 4.11 완전한 Prisma + Next.js package.json

```json
{
  "name": "my-prisma-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "verify": "npm run typecheck && npm run lint && npm run build"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 챕터 5: CI/CD 파이프라인 구축

### 5.1 왜 CI/CD가 솔로 개발자에게 중요한가

팀에서는 동료가 코드 리뷰를 해주지만, 혼자 개발할 때는 **자동화된 검증 시스템**이 그 역할을 대신해야 합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                CI/CD 없이 vs CI/CD 있을 때                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CI/CD 없이:                                                    │
│  ───────────                                                    │
│                                                                 │
│  코드 작성 → git push → Vercel 배포 → 오류 발견! → 수정        │
│                                          │                      │
│                                          └─→ 또 오류! → 수정    │
│                                                   │             │
│                                                   └─→ 또 오류!  │
│  소요 시간: 30분 ~ 2시간 (반복 횟수에 따라)                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CI/CD 있을 때:                                                 │
│  ──────────────                                                 │
│                                                                 │
│  코드 작성 → git push → GitHub Actions 검증                     │
│                              │                                  │
│                              ├─→ ✅ 통과 → Vercel 배포 → 성공!  │
│                              │                                  │
│                              └─→ ❌ 실패 → 즉시 알림            │
│                                      │                          │
│                                      └─→ 로컬에서 수정 후 재푸시 │
│                                                                 │
│  소요 시간: 5~10분 (대부분 첫 시도에 성공)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 GitHub Actions 기본 구조 이해

```yaml
# .github/workflows/ci.yml

name: CI # 워크플로우 이름

on: # 트리거 조건
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs: # 실행할 작업들
  build: # 작업 이름
    runs-on: ubuntu-latest # 실행 환경

    steps: # 단계별 실행
      - uses: actions/checkout@v4 # 코드 체크아웃
      - run: npm ci # 명령어 실행
```

```
┌─────────────────────────────────────────────────────────────────┐
│                GitHub Actions 실행 흐름                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  git push                                                       │
│      │                                                          │
│      ▼                                                          │
│  GitHub이 .github/workflows/*.yml 파일 감지                     │
│      │                                                          │
│      ▼                                                          │
│  Runner 머신 할당 (ubuntu-latest)                               │
│      │                                                          │
│      ▼                                                          │
│  ┌─────────────────────────────────────┐                        │
│  │ Step 1: actions/checkout            │ 코드 다운로드          │
│  │ Step 2: actions/setup-node          │ Node.js 설치           │
│  │ Step 3: npm ci                      │ 의존성 설치            │
│  │ Step 4: npm run typecheck           │ 타입 검사              │
│  │ Step 5: npm run lint                │ 린트 검사              │
│  │ Step 6: npm run build               │ 빌드 테스트            │
│  └─────────────────────────────────────┘                        │
│      │                                                          │
│      ▼                                                          │
│  ✅ 모든 Step 성공 → 워크플로우 성공                             │
│  ❌ 하나라도 실패 → 워크플로우 실패 + 알림                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 TypeScript + Prisma 검증 파이프라인 (기본)

**`.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: 코드 검증
    runs-on: ubuntu-latest

    steps:
      # 1. 코드 체크아웃
      - name: 코드 체크아웃
        uses: actions/checkout@v4

      # 2. Node.js 설정 (캐싱 포함)
      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 3. 의존성 설치
      - name: 의존성 설치
        run: npm ci

      # 4. Prisma Client 생성
      - name: Prisma 생성
        run: npx prisma generate

      # 5. TypeScript 타입 체크
      - name: 타입 체크
        run: npx tsc --noEmit

      # 6. ESLint 검사
      - name: 린트 검사
        run: npm run lint

      # 7. 빌드 테스트
      - name: 빌드
        run: npm run build
```

### 5.4 고급 파이프라인: 캐싱 + 병렬 실행

속도를 높이기 위해 **Prisma 캐싱**과 **작업 병렬화**를 적용합니다.

```yaml
name: CI (Advanced)

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ─────────────────────────────────────────────────────────────
  # 의존성 설치 (다른 작업들이 재사용)
  # ─────────────────────────────────────────────────────────────
  install:
    name: 📦 의존성 설치
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      # Prisma Client 캐싱
      - name: Prisma 캐시
        uses: actions/cache@v4
        with:
          path: node_modules/.prisma
          key: prisma-${{ hashFiles('prisma/schema.prisma') }}
          restore-keys: |
            prisma-

      - run: npm ci
      - run: npx prisma generate

      # node_modules를 아티팩트로 저장
      - uses: actions/upload-artifact@v4
        with:
          name: node_modules
          path: node_modules
          retention-days: 1

  # ─────────────────────────────────────────────────────────────
  # 타입 체크 (병렬)
  # ─────────────────────────────────────────────────────────────
  typecheck:
    name: 🔍 타입 체크
    needs: install
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/download-artifact@v4
        with:
          name: node_modules
          path: node_modules

      - run: npx tsc --noEmit

  # ─────────────────────────────────────────────────────────────
  # 린트 검사 (병렬)
  # ─────────────────────────────────────────────────────────────
  lint:
    name: 📋 린트 검사
    needs: install
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/download-artifact@v4
        with:
          name: node_modules
          path: node_modules

      - run: npm run lint

  # ─────────────────────────────────────────────────────────────
  # Prisma 스키마 검증 (병렬)
  # ─────────────────────────────────────────────────────────────
  prisma:
    name: 🗄️ Prisma 검증
    needs: install
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/download-artifact@v4
        with:
          name: node_modules
          path: node_modules

      - name: Prisma 스키마 검증
        run: npx prisma validate

      - name: Prisma 포맷 검사
        run: |
          npx prisma format
          git diff --exit-code prisma/schema.prisma || \
            (echo "❌ Prisma 스키마 포맷이 필요합니다: npx prisma format" && exit 1)

  # ─────────────────────────────────────────────────────────────
  # 빌드 테스트 (typecheck, lint, prisma 모두 통과 후)
  # ─────────────────────────────────────────────────────────────
  build:
    name: 🏗️ 빌드
    needs: [typecheck, lint, prisma]
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/download-artifact@v4
        with:
          name: node_modules
          path: node_modules

      - run: npm run build

      - name: 빌드 결과물 저장
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: |
            .next
            out
          retention-days: 7
```

**실행 흐름:**

```
┌──────────┐
│ install  │
└────┬─────┘
     │
     ├──────────────┬──────────────┐
     ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│typecheck │  │   lint   │  │  prisma  │  ← 병렬 실행
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │              │
     └──────────────┴──────────────┘
                    │
                    ▼
              ┌──────────┐
              │  build   │  ← 모두 통과 후 실행
              └──────────┘
```

### 5.5 데이터베이스 통합 테스트 파이프라인

실제 DB와 연동하는 테스트가 필요한 경우:

```yaml
name: Integration Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  integration:
    name: 🧪 통합 테스트
    runs-on: ubuntu-latest

    # PostgreSQL 서비스 컨테이너
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://test:test@localhost:5432/test_db

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npx prisma generate

      # DB 스키마 적용
      - name: DB 마이그레이션
        run: npx prisma db push --skip-generate

      # 시드 데이터 (선택)
      - name: 시드 데이터 삽입
        run: npx prisma db seed
        continue-on-error: true

      # 통합 테스트 실행
      - name: 테스트 실행
        run: npm run test:integration
```

### 5.6 자동 배포 파이프라인 (Vercel)

테스트 통과 후 자동으로 Vercel에 배포:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  validate:
    name: 검증
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run build

  deploy:
    name: 🚀 Vercel 배포
    needs: validate
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npx prisma generate

      - name: Vercel CLI 설치
        run: npm install -g vercel

      - name: Vercel 환경 가져오기
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Vercel 빌드
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Vercel 배포
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

      # DB 마이그레이션 (배포 후)
      - name: DB 마이그레이션 실행
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**필요한 GitHub Secrets:**

```
VERCEL_TOKEN      - Vercel 액세스 토큰
VERCEL_ORG_ID     - Vercel 조직 ID
VERCEL_PROJECT_ID - Vercel 프로젝트 ID
DATABASE_URL      - 프로덕션 DB URL
```

### 5.7 Railway 배포 파이프라인

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  validate:
    # ... (위와 동일)

  deploy:
    name: 🚂 Railway 배포
    needs: validate
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Railway CLI 설치
        run: npm install -g @railway/cli

      - name: Railway 배포
        run: railway up --service ${{ secrets.RAILWAY_SERVICE_ID }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 5.8 PR 미리보기 배포

Pull Request마다 미리보기 환경을 자동 생성:

```yaml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  preview:
    name: 🔍 미리보기 배포
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npx prisma generate

      - name: Vercel 미리보기 배포
        id: deploy
        run: |
          npm install -g vercel
          url=$(vercel deploy --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      # PR에 댓글로 미리보기 URL 추가
      - name: PR 댓글 추가
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🚀 미리보기 배포 완료!\n\n**URL:** ${{ steps.deploy.outputs.url }}`
            })
```

### 5.9 워크플로우 상태 배지

README.md에 CI 상태 배지 추가:

```markdown
# My Project

![CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/USERNAME/REPO/actions/workflows/deploy.yml/badge.svg)

프로젝트 설명...
```

### 5.10 실패 알림 설정

Slack이나 Discord로 실패 알림 받기:

```yaml
# 워크플로우 마지막에 추가

notify:
  name: 📢 알림
  needs: [build]
  if: failure()
  runs-on: ubuntu-latest

  steps:
    - name: Discord 알림
      uses: sarisia/actions-status-discord@v1
      with:
        webhook: ${{ secrets.DISCORD_WEBHOOK }}
        status: failure
        title: 'CI 실패'
        description: |
          브랜치: ${{ github.ref_name }}
          커밋: ${{ github.sha }}
        color: 0xff0000
```

### 5.11 CI/CD 도입 체크리스트

```
□ .github/workflows/ 폴더 생성
□ ci.yml 파일 작성
□ package.json에 필요한 스크립트 추가
  - typecheck: "tsc --noEmit"
  - lint: "next lint" 또는 "eslint ."
  - build: "next build"
□ GitHub Secrets 설정 (배포용)
  - VERCEL_TOKEN
  - DATABASE_URL
□ 첫 번째 푸시로 워크플로우 테스트
□ README.md에 상태 배지 추가
□ 실패 알림 설정 (선택)
```

### 5.12 다음 챕터 미리보기

**챕터 6: 배포 전 검증 자동화**에서는 커밋 시점에서 오류를 차단하는 Husky와 lint-staged 설정을 다룹니다. GitHub에 푸시하기 전에 로컬에서 먼저 문제를 잡아내는 방법을 배웁니다.

---

## 챕터 6: 배포 전 검증 자동화

### 6.1 "실패를 빨리 발견할수록 비용이 줄어든다"

오류를 발견하는 시점에 따라 수정 비용이 기하급수적으로 증가합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                오류 발견 시점별 수정 비용                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  발견 시점              예상 소요 시간      스트레스 레벨         │
│  ─────────────────────  ──────────────────  ─────────────────   │
│                                                                 │
│  코드 작성 중 (IDE)     30초               😊 낮음              │
│       │                                                         │
│       ▼                                                         │
│  커밋 시점 (pre-commit) 1~2분              🙂 낮음              │
│       │                                                         │
│       ▼                                                         │
│  푸시 후 (CI)           5~10분             😐 보통              │
│       │                                                         │
│       ▼                                                         │
│  배포 실패 (Vercel)     15~30분            😟 높음              │
│       │                                                         │
│       ▼                                                         │
│  프로덕션 오류          1시간+             😱 매우 높음          │
│                                                                 │
│  💡 목표: 오류를 가능한 한 위쪽에서 잡기!                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Git Hooks 이해하기

Git은 특정 이벤트가 발생할 때 스크립트를 실행하는 **Hook 시스템**을 제공합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Git Hook 실행 시점                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  git commit 실행                                                │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │   pre-commit    │ ← 커밋 전 검증 (lint, format)              │
│  └────────┬────────┘                                            │
│           │ 통과                                                │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │  commit-msg     │ ← 커밋 메시지 검증                         │
│  └────────┬────────┘                                            │
│           │ 통과                                                │
│           ▼                                                     │
│      커밋 완료 ✅                                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  git push 실행                                                  │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │    pre-push     │ ← 푸시 전 검증 (테스트, 빌드)              │
│  └────────┬────────┘                                            │
│           │ 통과                                                │
│           ▼                                                     │
│      푸시 완료 ✅                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Husky 설치 및 설정

**Husky**는 Git Hooks를 쉽게 관리할 수 있게 해주는 도구입니다.

**설치:**

```bash
# Husky 설치
npm install -D husky

# Husky 초기화 (.husky 폴더 생성)
npx husky init
```

**자동으로 생성되는 구조:**

```
프로젝트/
├── .husky/
│   ├── _/
│   │   └── husky.sh
│   └── pre-commit      ← 여기에 스크립트 작성
├── package.json
└── ...
```

**package.json에 자동 추가된 스크립트:**

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

> `prepare` 스크립트는 `npm install` 후 자동 실행되어 Husky를 설정합니다.

### 6.4 Pre-commit Hook 설정

**기본 pre-commit hook (.husky/pre-commit):**

```bash
#!/usr/bin/env sh

# TypeScript 타입 체크
npm run typecheck

# ESLint 검사
npm run lint

# 빌드 테스트 (선택 - 시간이 오래 걸릴 수 있음)
# npm run build
```

**실행 권한 부여 (필요한 경우):**

```bash
chmod +x .husky/pre-commit
```

이제 `git commit`을 실행하면 **자동으로 검증이 실행**되고, 실패하면 커밋이 중단됩니다.

### 6.5 lint-staged: 변경된 파일만 검사

전체 프로젝트를 검사하면 시간이 오래 걸립니다. **lint-staged**는 **Git에 스테이징된 파일만** 검사합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│               전체 검사 vs lint-staged 비교                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  전체 검사 (npm run lint):                                      │
│  ─────────────────────────                                      │
│  프로젝트 전체 파일 검사 → 30초 ~ 2분                           │
│  파일 1개만 수정해도 전체 검사                                   │
│                                                                 │
│  lint-staged:                                                   │
│  ────────────                                                   │
│  스테이징된 파일만 검사 → 1~5초                                  │
│  수정한 파일만 빠르게 검증                                       │
│                                                                 │
│  💡 빠른 피드백 → 개발 흐름 유지                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**설치:**

```bash
npm install -D lint-staged
```

**설정 파일 생성 (.lintstagedrc.json):**

```json
{
  "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{js,jsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.prisma": ["npx prisma format", "npx prisma validate"],
  "*.{json,md}": ["prettier --write"]
}
```

**Husky와 연동 (.husky/pre-commit):**

```bash
#!/usr/bin/env sh

npx lint-staged
```

### 6.6 TypeScript 전체 타입 체크 포함하기

lint-staged는 **개별 파일 단위**로 동작하지만, TypeScript 타입 체크는 **프로젝트 전체**를 봐야 합니다.

**문제 시나리오:**

```typescript
// types.ts (수정 안 함)
export interface User {
  id: string;
  name: string;
}

// userService.ts (수정함 - 스테이징됨)
import { User } from './types';

function getUser(): User {
  return { id: '1' }; // ❌ name 누락 - 하지만 types.ts는 검사 안 됨!
}
```

**해결책 (.lintstagedrc.js):**

```javascript
module.exports = {
  '*.{ts,tsx}': [
    // TypeScript 전체 프로젝트 타입 체크 (파일 인자 무시)
    () => 'tsc --noEmit',
    // 스테이징된 파일만 lint + format
    'eslint --fix --max-warnings=0',
    'prettier --write',
  ],
  '*.prisma': ['npx prisma format', 'npx prisma validate'],
  '*.{json,md,css}': ['prettier --write'],
};
```

> `() => 'tsc --noEmit'` 형태로 작성하면 파일 목록을 인자로 받지 않고 명령어만 실행합니다.

### 6.7 Pre-push Hook: 푸시 전 최종 검증

커밋은 빠르게, 푸시 전에 더 철저한 검증을 수행합니다.

**Pre-push hook 생성:**

```bash
# .husky/pre-push 파일 생성
echo '#!/usr/bin/env sh
npm run typecheck
npm run lint
npm run build
' > .husky/pre-push

chmod +x .husky/pre-push
```

**.husky/pre-push:**

```bash
#!/usr/bin/env sh

echo "🔍 푸시 전 검증 시작..."

# TypeScript 타입 체크
echo "📝 TypeScript 검사 중..."
npm run typecheck || exit 1

# ESLint 검사
echo "📋 ESLint 검사 중..."
npm run lint || exit 1

# 빌드 테스트
echo "🏗️ 빌드 테스트 중..."
npm run build || exit 1

echo "✅ 모든 검증 통과! 푸시를 진행합니다."
```

### 6.8 Commit Message 규칙 강제하기

일관된 커밋 메시지는 히스토리 추적에 도움이 됩니다.

**commitlint 설치:**

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

**설정 파일 (commitlint.config.js):**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새 기능
        'fix', // 버그 수정
        'docs', // 문서 수정
        'style', // 코드 포맷팅
        'refactor', // 리팩토링
        'test', // 테스트
        'chore', // 빌드, 설정 등
        'perf', // 성능 개선
        'ci', // CI 설정
        'revert', // 되돌리기
      ],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
```

**Husky와 연동:**

```bash
echo '#!/usr/bin/env sh
npx --no -- commitlint --edit $1
' > .husky/commit-msg

chmod +x .husky/commit-msg
```

**커밋 메시지 예시:**

```bash
# ✅ 올바른 형식
git commit -m "feat: 사용자 로그인 기능 추가"
git commit -m "fix: 로그아웃 시 세션 미삭제 버그 수정"
git commit -m "docs: README 설치 방법 업데이트"

# ❌ 잘못된 형식 (커밋 거부됨)
git commit -m "로그인 기능"
git commit -m "update"
```

### 6.9 완전한 설정 예시

**package.json:**

```json
{
  "name": "my-project",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky",
    "verify": "npm run typecheck && npm run lint && npm run build"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0"
  }
}
```

**.lintstagedrc.js:**

```javascript
module.exports = {
  '*.{ts,tsx}': [() => 'tsc --noEmit', 'eslint --fix --max-warnings=0', 'prettier --write'],
  '*.prisma': ['npx prisma format', 'npx prisma validate'],
  '*.{js,jsx,json,md,css,scss}': ['prettier --write'],
};
```

**.husky/pre-commit:**

```bash
#!/usr/bin/env sh

echo "🔍 커밋 전 검증..."
npx lint-staged
```

**.husky/pre-push:**

```bash
#!/usr/bin/env sh

echo "🚀 푸시 전 최종 검증..."

npm run typecheck || exit 1
npm run lint || exit 1
npm run build || exit 1

echo "✅ 검증 완료!"
```

**.husky/commit-msg:**

```bash
#!/usr/bin/env sh

npx --no -- commitlint --edit $1
```

**commitlint.config.js:**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### 6.10 검증 우회하기 (긴급 상황)

가끔 급하게 커밋/푸시해야 할 때가 있습니다. **권장하지 않지만** 우회 방법이 있습니다.

```bash
# pre-commit hook 우회
git commit --no-verify -m "hotfix: 긴급 수정"

# pre-push hook 우회
git push --no-verify

# 축약형
git commit -n -m "hotfix: 긴급 수정"
```

> ⚠️ **주의:** `--no-verify`는 정말 긴급한 상황에서만 사용하세요. CI에서 실패하면 결국 수정해야 합니다.

### 6.11 트러블슈팅

**문제 1: "husky - command not found"**

```bash
# 해결: Husky 재설치
rm -rf .husky
npm install
npx husky init
```

**문제 2: Windows에서 Hook이 실행 안 됨**

```bash
# Git 설정 확인
git config core.hooksPath

# .husky로 설정
git config core.hooksPath .husky
```

**문제 3: lint-staged가 너무 느림**

```javascript
// .lintstagedrc.js - 병렬 실행 비활성화
module.exports = {
  '*.{ts,tsx}': ['eslint --fix --max-warnings=0'],
};

// tsc는 pre-push로 이동
```

**문제 4: Prisma validate 실패**

```bash
# DATABASE_URL 없이도 validate 가능하도록
# validate는 스키마 문법만 체크함

# 만약 실패하면 스키마 문법 오류
npx prisma validate
```

### 6.12 검증 자동화 체크리스트

```
□ Husky 설치 및 초기화
  npm install -D husky && npx husky init

□ lint-staged 설치 및 설정
  npm install -D lint-staged
  .lintstagedrc.js 파일 생성

□ pre-commit hook 설정
  .husky/pre-commit에 npx lint-staged 추가

□ pre-push hook 설정 (선택)
  .husky/pre-push에 빌드 검증 추가

□ commitlint 설정 (선택)
  npm install -D @commitlint/cli @commitlint/config-conventional
  .husky/commit-msg 설정

□ 테스트 커밋으로 동작 확인
  git add . && git commit -m "test: hook 테스트"
```

### 6.13 다음 챕터 미리보기

**챕터 7: AI 코딩 도구 컨텍스트 관리 전략**에서는 Claude Code Web의 컨텍스트 한계를 극복하는 방법을 다룹니다. CLAUDE.md 파일 작성법, 효과적인 세션 관리, 그리고 AI와 효율적으로 협업하는 프롬프트 전략을 배웁니다.

---

## 챕터 7: AI 코딩 도구 컨텍스트 관리 전략

### 7.1 AI 코딩 도구의 구조적 한계 이해

Claude Code Web, Cursor, GitHub Copilot Chat 등 모든 AI 코딩 도구는 **컨텍스트 윈도우**라는 근본적 한계가 있습니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                   컨텍스트 윈도우란?                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI가 한 번에 "볼 수 있는" 텍스트의 최대 크기                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    컨텍스트 윈도우                         │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ 시스템 프롬프트 │ 이전 대화들 │ 현재 질문 │ 파일들  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ← ─ ─ ─ ─ ─ ─ ─ ─ 한계 ─ ─ ─ ─ ─ ─ ─ ─ →              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  대화가 길어지면:                                                │
│  ─────────────────                                              │
│  • 오래된 대화가 잘려나감 (또는 요약됨)                          │
│  • AI가 이전에 논의한 내용을 "잊어버림"                          │
│  • 응답 품질이 저하됨                                           │
│  • 모순되거나 반복적인 답변 생성                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**증상 체크리스트 - 컨텍스트 한계에 도달했을 때:**

```
□ AI가 이전에 말한 내용을 다시 물어본다
□ 같은 실수를 반복한다
□ 프로젝트 구조를 갑자기 잊어버린다
□ 이전에 합의한 코딩 스타일을 무시한다
□ 응답이 점점 짧아지거나 부정확해진다
□ "긴 대화는 사용량 제한에 더 빨리 도달합니다" 경고가 나타난다
```

### 7.2 CLAUDE.md로 프로젝트 컨텍스트 전달

**CLAUDE.md**는 프로젝트 루트에 두는 특별한 파일로, Claude Code가 **매 대화 시작 시 자동으로 읽어들입니다.**

```
┌─────────────────────────────────────────────────────────────────┐
│                   CLAUDE.md 동작 원리                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  프로젝트/                                                      │
│  ├── CLAUDE.md        ← Claude Code가 자동으로 읽음             │
│  ├── src/                                                       │
│  ├── package.json                                               │
│  └── ...                                                        │
│                                                                 │
│  새 대화 시작                                                   │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Claude: "CLAUDE.md를 읽었습니다. 이 프로젝트는..."      │    │
│  │         (프로젝트 컨텍스트를 이미 알고 있음)            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  💡 매번 프로젝트 설명을 반복할 필요 없음!                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CLAUDE.md 템플릿:**

```markdown
# Project: [프로젝트명]

## 개요

[2-3문장으로 프로젝트가 무엇을 하는지]

## 기술 스택

- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Database: PostgreSQL + Prisma ORM
- Styling: Tailwind CSS
- Auth: NextAuth.js
- Deployment: Vercel

## 프로젝트 구조
```

src/
├── app/ # Next.js App Router 페이지
├── components/ # React 컴포넌트
│ ├── ui/ # 재사용 가능한 UI 컴포넌트
│ └── features/ # 기능별 컴포넌트
├── lib/ # 유틸리티 함수, DB 클라이언트
├── types/ # TypeScript 타입 정의
└── services/ # API 호출, 비즈니스 로직

```

## 명령어
- `npm run dev` - 개발 서버 (http://localhost:3000)
- `npm run build` - 프로덕션 빌드
- `npm run typecheck` - TypeScript 검사
- `npm run lint` - ESLint 검사
- `npx prisma studio` - DB GUI

## 코딩 컨벤션
- 함수형 컴포넌트 + React Hooks 사용
- 세미콜론 생략 (Prettier 설정)
- 절대 경로 import 사용 (@/로 시작)
- 한국어 주석 OK, 변수명은 영어

## 현재 작업 중
[현재 집중하고 있는 기능이나 문제 기술]

## 주의사항
- API 키는 .env.local에만 저장 (커밋 금지)
- Prisma 스키마 변경 후 반드시 `npx prisma generate` 실행
- 배포 전 `npm run verify` 실행 필수
```

### 7.3 세션 관리 전략: 언제 새 대화를 시작할까

**새 대화를 시작해야 하는 시점:**

```
┌─────────────────────────────────────────────────────────────────┐
│                새 대화 시작 타이밍                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ 새 대화 시작이 필요한 경우:                                  │
│  ───────────────────────────────                                │
│  • 하나의 기능/태스크가 완료되었을 때                            │
│  • AI 응답이 이전 맥락과 맞지 않기 시작할 때                     │
│  • 완전히 다른 주제로 전환할 때                                  │
│  • 사용량 제한 경고가 나타났을 때                                │
│  • AI가 같은 실수를 반복할 때                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🔄 같은 대화를 유지해도 되는 경우:                              │
│  ─────────────────────────────────                              │
│  • 연관된 기능을 연속으로 개발할 때                              │
│  • 버그 수정 중 추가 정보가 필요할 때                            │
│  • 방금 작성한 코드에 대한 후속 질문                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**권장 세션 패턴:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  1 태스크 = 1 세션 원칙                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  세션 1: 사용자 인증 기능                                        │
│  ├── 로그인 API 구현                                            │
│  ├── 세션 관리 설정                                              │
│  └── 완료 → 세션 종료 전 요약 저장                               │
│                                                                 │
│  세션 2: 대시보드 UI                                             │
│  ├── 레이아웃 구성                                               │
│  ├── 차트 컴포넌트                                               │
│  └── 완료 → 세션 종료 전 요약 저장                               │
│                                                                 │
│  세션 3: 버그 수정                                               │
│  ├── 이슈 분석                                                   │
│  ├── 수정 및 테스트                                              │
│  └── 완료 → 세션 종료 전 요약 저장                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 세션 종료 전 지식 보존 기법

긴 대화를 종료하기 전, 다음 세션을 위해 **지식을 추출하고 저장**합니다.

**세션 종료 전 요청 프롬프트:**

```
이번 대화에서 작업한 내용을 다음 형식으로 정리해줘:

## 완료된 작업
- [구현한 기능들]

## 주요 결정사항
- [내린 기술적 결정과 그 이유]

## 변경된 파일
- [수정/생성한 파일 목록]

## 미해결 이슈
- [아직 해결하지 못한 문제]

## 다음 할 일
- [이어서 해야 할 작업]
```

**저장 위치:** `docs/session-notes/` 또는 `CHANGELOG.md`

```markdown
<!-- docs/session-notes/2024-12-16-auth.md -->

# 세션: 사용자 인증 구현 (2024-12-16)

## 완료된 작업

- NextAuth.js 설정 완료
- Google OAuth 연동
- 로그인/로그아웃 UI 구현

## 주요 결정사항

- JWT 대신 Database 세션 사용 (보안상 이유)
- 세션 만료 시간: 7일

## 변경된 파일

- src/app/api/auth/[...nextauth]/route.ts
- src/components/auth/LoginButton.tsx
- prisma/schema.prisma (User, Session 모델 추가)

## 미해결 이슈

- 이메일 인증 미구현

## 다음 할 일

- 비밀번호 로그인 추가
- 회원가입 페이지 구현
```

### 7.5 효과적인 프롬프트 작성법

AI의 응답 품질은 **프롬프트의 구체성**에 비례합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│             비효율적 vs 효과적 프롬프트 비교                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ 비효율적:                                                    │
│  "테스트 추가해줘"                                               │
│  "이거 왜 안 돼?"                                                │
│  "더 좋게 만들어줘"                                              │
│  "API 만들어줘"                                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✅ 효과적:                                                      │
│  "src/services/userService.ts의 createUser 함수에               │
│   이메일 중복 체크 실패 케이스를 테스트하는 코드를 작성해줘.     │
│   Jest와 프로젝트의 기존 테스트 패턴을 따라줘."                  │
│                                                                 │
│  "로그인 시 'Invalid credentials' 오류가 발생해.                 │
│   src/app/api/auth/login/route.ts 파일이야.                     │
│   bcrypt.compare가 항상 false를 반환하는 것 같아."              │
│                                                                 │
│  "UserCard 컴포넌트의 로딩 상태 UX를 개선해줘.                  │
│   Skeleton UI를 추가하고, 기존 Spinner는 제거해.                │
│   src/components/ui/Skeleton.tsx 패턴을 참고해."                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**효과적인 프롬프트의 구성 요소:**

| 요소            | 설명                 | 예시                                    |
| --------------- | -------------------- | --------------------------------------- |
| **대상 파일**   | 어떤 파일을 수정할지 | "src/lib/prisma.ts에서"                 |
| **구체적 작업** | 무엇을 해야 하는지   | "싱글톤 패턴을 적용해줘"                |
| **참조 예시**   | 따라야 할 패턴       | "기존 userService.ts 스타일로"          |
| **제약 조건**   | 하지 말아야 할 것    | "외부 라이브러리 추가 없이"             |
| **기대 결과**   | 완료 기준            | "TypeScript 오류 없이 빌드 가능해야 함" |

### 7.6 Explore → Plan → Code → Commit 워크플로우

Anthropic이 권장하는 AI 협업 워크플로우입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              4단계 AI 협업 워크플로우                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ EXPLORE (탐색)                                              │
│  ─────────────────                                              │
│  "src/services/ 폴더의 구조를 파악하고,                          │
│   기존 서비스들이 어떤 패턴을 사용하는지 분석해줘.               │
│   코드는 아직 작성하지 마."                                      │
│                                                                 │
│       ↓ AI가 구조 파악 후 설명                                   │
│                                                                 │
│  2️⃣ PLAN (계획)                                                 │
│  ───────────────                                                │
│  "PaymentService를 추가하려고 해.                                │
│   구현 계획을 단계별로 작성해줘.                                 │
│   내가 승인하면 코딩 시작해."                                    │
│                                                                 │
│       ↓ 계획 검토 및 승인                                        │
│                                                                 │
│  3️⃣ CODE (구현)                                                 │
│  ───────────────                                                │
│  "좋아, 계획대로 진행해줘.                                       │
│   1단계부터 시작하고, 각 단계 완료 후 알려줘."                   │
│                                                                 │
│       ↓ 구현 완료                                                │
│                                                                 │
│  4️⃣ COMMIT (완료)                                               │
│  ─────────────────                                              │
│  "변경사항을 커밋하려고 해.                                      │
│   커밋 메시지와 변경 요약을 작성해줘."                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**왜 이 워크플로우가 효과적인가:**

- AI가 **충분히 맥락을 이해한 후** 코드를 작성
- **잘못된 방향으로 진행하기 전에** 수정 가능
- 복잡한 작업을 **관리 가능한 단계로 분해**
- 결과물의 **품질과 일관성 향상**

### 7.7 파일 참조와 코드 블록 활용

AI에게 코드를 보여줄 때는 **파일 경로를 명시**합니다.

**좋은 예시:**

````
다음 코드에 에러 핸들링을 추가해줘:

```typescript
// src/services/userService.ts

export async function createUser(data: CreateUserInput) {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  })
  return user
}
````

Prisma 오류와 이메일 중복 케이스를 처리해야 해.

```

**나쁜 예시:**
```

이 코드에 에러 핸들링 추가해줘:

export async function createUser(data) {
const user = await prisma.user.create({ data })
return user
}

````

> 파일 경로가 없으면 AI는 프로젝트 구조를 추측해야 하고, 타입 정보도 부족합니다.

### 7.8 AI 도구별 컨텍스트 관리

| 도구 | 컨텍스트 파일 | 특별 기능 |
|------|--------------|----------|
| **Claude Code** | CLAUDE.md | 프로젝트 자동 인식 |
| **Cursor** | .cursorrules | @파일 멘션, Docs 연동 |
| **GitHub Copilot** | .github/copilot-instructions.md | 코드 컨텍스트 자동 수집 |
| **Windsurf** | .windsurfrules | Cascade 메모리 |

**Cursor 사용자를 위한 .cursorrules 예시:**

```markdown
# Cursor Rules for [Project Name]

## Project Context
This is a Next.js 14 application using App Router.

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Use absolute imports with @/ prefix

## File Structure
- Pages: src/app/
- Components: src/components/
- Utilities: src/lib/
- Types: src/types/

## Naming Conventions
- Components: PascalCase (UserCard.tsx)
- Utilities: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE

## Don't
- Don't use class components
- Don't use CSS modules
- Don't add unnecessary dependencies
````

### 7.9 컨텍스트 오염 방지

대화가 길어지면서 **잘못된 정보가 누적**되는 것을 방지합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                컨텍스트 오염이란?                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  대화 초반:                                                      │
│  You: "React 18 사용 중이야"                                     │
│  AI: "React 18 기준으로 답변드릴게요" ✅                         │
│                                                                 │
│  ... 많은 대화 후 ...                                            │
│                                                                 │
│  대화 후반:                                                      │
│  AI: "React 16에서는 이렇게..." ❌ (초반 정보를 잊음)            │
│                                                                 │
│  또는                                                            │
│                                                                 │
│  대화 중간에 실수로 잘못된 정보 제공:                            │
│  You: "아, PostgreSQL 아니고 MySQL이었어" (실수)                 │
│  AI: 이후 MySQL 기준으로 계속 답변 ❌                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**방지 전략:**

1. **CLAUDE.md에 핵심 정보 고정** - 매 세션마다 읽히므로 일관성 유지

2. **정기적으로 컨텍스트 확인**

   ```
   "현재 이 프로젝트에 대해 알고 있는 내용을 요약해줘"
   ```

3. **명시적으로 수정**

   ```
   "앞서 MySQL이라고 했는데, 잘못 말한 거야.
    PostgreSQL이 맞아. 이후 답변은 PostgreSQL 기준으로 해줘."
   ```

4. **새 세션 시작 시 핵심 정보 재확인**
   ```
   "이 프로젝트는 Next.js 14 + TypeScript + Prisma + PostgreSQL을 사용해.
    CLAUDE.md 내용을 확인했어?"
   ```

### 7.10 AI 코딩 도구 활용 체크리스트

```
□ CLAUDE.md (또는 해당 도구의 컨텍스트 파일) 작성
  - 기술 스택 명시
  - 프로젝트 구조 설명
  - 코딩 컨벤션 정의
  - 현재 작업 기술

□ 세션 관리 습관
  - 1 태스크 = 1 세션 원칙
  - 세션 종료 전 지식 보존
  - 컨텍스트 한계 증상 인식

□ 효과적인 프롬프트
  - 파일 경로 명시
  - 구체적인 요구사항
  - 참조 예시 제공
  - 제약 조건 명시

□ Explore → Plan → Code → Commit 워크플로우 적용
```

### 7.11 다음 챕터 미리보기

**챕터 8: 프로젝트 비전 유지와 아키텍처 문서화**에서는 혼자 개발하면서 프로젝트의 큰 그림을 잃지 않는 방법을 다룹니다. ADR(Architecture Decision Record), C4 모델, Personal Kanban을 활용하여 프로젝트 비전을 체계적으로 관리하는 방법을 배웁니다.

---

## 챕터 8: 프로젝트 비전 유지와 아키텍처 문서화

### 8.1 솔로 개발자가 비전을 잃는 이유

혼자 개발할 때는 **외부의 피드백이 없어서** 자신도 모르게 원래 방향에서 벗어납니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                  비전 이탈의 일반적 과정                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1주차: "간단한 할 일 관리 앱을 만들자!"                         │
│         ├── 할 일 추가/삭제                                      │
│         └── 완료 체크                                            │
│                                                                 │
│  2주차: "캘린더 뷰도 있으면 좋겠다"                               │
│         └── 캘린더 기능 추가                                     │
│                                                                 │
│  3주차: "팀 협업 기능도 넣어볼까?"                                │
│         └── 멀티 유저, 공유 기능 추가                            │
│                                                                 │
│  4주차: "알림 기능이 필요해"                                      │
│         └── 푸시 알림, 이메일 알림 추가                          │
│                                                                 │
│  5주차: "이게 뭐였지...?" 😵                                      │
│         └── 복잡한 프로젝트 관리 툴이 되어버림                   │
│                                                                 │
│  💡 문제: 각 단계에서 "왜?"를 기록하지 않음                       │
│           원래 목표를 문서화하지 않음                            │
│           범위를 명시적으로 정의하지 않음                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 비전 문서 작성하기

프로젝트 시작 시 **비전 문서**를 작성하고, 정기적으로 검토합니다.

**README.md 상단 또는 VISION.md로 작성:**

```markdown
# 프로젝트 비전

## 한 줄 정의

[이 프로젝트를 한 문장으로 설명]
예: "개인 사용자를 위한 미니멀한 할 일 관리 앱"

## 대상 사용자

[누구를 위한 것인가]
예: 복잡한 기능 없이 빠르게 할 일을 관리하고 싶은 개인 사용자

## 해결하는 문제

[어떤 고통점을 해결하는가]
예: 기존 할 일 앱들이 너무 복잡하고 기능이 과함

## 핵심 가치 (최대 3개)

1. 단순함 - 3초 안에 할 일 추가 가능
2. 빠름 - 즉시 로딩, 오프라인 지원
3. 집중 - 오늘 할 일만 보여줌

## 핵심 기능 (MVP)

- [ ] 할 일 추가/삭제
- [ ] 완료 체크
- [ ] 오늘의 할 일 필터
- [ ] 로컬 저장

## 🚫 목표 NOT (명시적으로 하지 않을 것)

- 팀 협업 기능
- 캘린더 통합
- 프로젝트/폴더 구조
- 반복 일정
- 알림/리마인더

## 성공 지표

- 할 일 추가까지 3초 이내
- 앱 로딩 1초 이내
- 기능 개수 10개 미만 유지
```

**"목표 NOT" 섹션이 가장 중요합니다.** 새 기능을 추가하고 싶을 때 이 목록을 확인하면 범위 확장(scope creep)을 방지할 수 있습니다.

### 8.3 Architecture Decision Records (ADR)

**ADR**은 중요한 기술적 결정을 기록하는 경량 문서입니다. 나중에 "왜 이렇게 했지?"라는 질문에 **과거의 자신이 답변**해줍니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADR이 필요한 이유                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  3개월 후의 나:                                                  │
│  "왜 PostgreSQL을 선택했지? MongoDB가 더 좋았을 것 같은데..."    │
│                                                                 │
│  ADR 없이: 🤷 기억 안 남, 다시 조사하거나 그냥 바꿔버림          │
│                                                                 │
│  ADR 있으면: 📄 "아, JSON 데이터와 관계형 데이터를 함께          │
│              저장해야 해서 JSONB 지원하는 PostgreSQL을            │
│              선택했구나. 타당한 이유였네."                        │
│                                                                 │
│  💡 ADR = 미래의 나에게 보내는 메모                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**ADR 폴더 구조:**

```
docs/
└── adr/
    ├── 0001-use-postgresql.md
    ├── 0002-nextjs-app-router.md
    ├── 0003-tailwind-over-css-modules.md
    └── template.md
```

**ADR 템플릿 (docs/adr/template.md):**

```markdown
# ADR [번호]: [결정 제목]

## 상태

[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## 날짜

[YYYY-MM-DD]

## 맥락

[이 결정이 필요한 배경. 어떤 문제를 해결하려고 하는가?]

## 고려한 옵션들

### 옵션 1: [이름]

- 장점: ...
- 단점: ...

### 옵션 2: [이름]

- 장점: ...
- 단점: ...

## 결정

[선택한 옵션과 그 이유]

## 결과

### 긍정적

- ...

### 부정적

- ...

### 리스크

- ...
```

**실제 ADR 예시:**

```markdown
# ADR 001: PostgreSQL 선택

## 상태

Accepted

## 날짜

2024-12-01

## 맥락

데이터베이스 선택이 필요함.

- 사용자 정보(관계형)와 사용자 설정(JSON)을 저장해야 함
- 향후 검색 기능 추가 가능성 있음
- 1인 프로젝트로 관리 용이성 중요

## 고려한 옵션들

### 옵션 1: PostgreSQL

- 장점: JSONB로 JSON + 관계형 동시 처리, 풍부한 생태계, Prisma 지원 우수
- 단점: 초기 설정이 MongoDB보다 복잡

### 옵션 2: MongoDB

- 장점: JSON 저장에 최적화, 스키마 유연성
- 단점: 관계형 쿼리 어려움, 트랜잭션 제한적

### 옵션 3: SQLite

- 장점: 파일 기반으로 간단, 배포 쉬움
- 단점: 동시성 제한, 프로덕션 확장성 부족

## 결정

**PostgreSQL** 선택

이유:

1. JSONB 타입으로 JSON 데이터도 효율적으로 처리 가능
2. Prisma ORM과의 호환성 우수
3. Supabase/Neon 등 무료 호스팅 옵션 풍부
4. 향후 확장 시에도 마이그레이션 불필요

## 결과

### 긍정적

- 하나의 DB로 모든 데이터 타입 처리 가능
- Prisma로 타입 안전한 쿼리 가능

### 부정적

- MongoDB 대비 JSON 쿼리 문법이 복잡함
- 초기 학습 곡선 존재

### 리스크

- 복잡한 JSON 쿼리 성능 모니터링 필요
```

### 8.4 C4 모델로 아키텍처 시각화

**C4 모델**은 소프트웨어 아키텍처를 4단계 줌 레벨로 시각화하는 방법입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    C4 모델 4단계                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Level 1: System Context (시스템 컨텍스트)                       │
│  ─────────────────────────────────────────                      │
│  "숲 전체를 보는 관점"                                           │
│  - 시스템과 외부 사용자/시스템의 관계                            │
│  - 비개발자도 이해 가능                                          │
│                                                                 │
│  Level 2: Container (컨테이너)                                   │
│  ────────────────────────────                                   │
│  "건물들을 보는 관점"                                            │
│  - 애플리케이션, 데이터베이스, 서비스 구분                       │
│  - 기술 스택 표시                                                │
│                                                                 │
│  Level 3: Component (컴포넌트)                                   │
│  ─────────────────────────────                                  │
│  "건물 내부 구조"                                                │
│  - 주요 모듈/컴포넌트 구조                                       │
│  - 개발자용 상세 뷰                                              │
│                                                                 │
│  Level 4: Code (코드)                                            │
│  ───────────────────                                            │
│  "방 내부 설계도"                                                │
│  - 클래스/함수 수준 다이어그램                                   │
│  - 보통 생략 (코드 자체가 문서)                                  │
│                                                                 │
│  💡 솔로 개발자는 Level 1 + Level 2만으로 충분!                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Mermaid로 그리는 C4 다이어그램 (Level 2):**

````markdown
<!-- docs/architecture/c4-container.md -->

# 시스템 아키텍처 (Container Diagram)

```mermaid
graph TB
    subgraph "My Todo App"
        WEB[Next.js Frontend<br/>React, TypeScript]
        API[API Routes<br/>Next.js API]
        DB[(PostgreSQL<br/>Supabase)]
    end

    USER[사용자] --> WEB
    WEB --> API
    API --> DB

    AUTH[Supabase Auth] --> API
    WEB --> AUTH
```
````

## 컴포넌트 설명

| 컨테이너 | 기술                          | 역할                   |
| -------- | ----------------------------- | ---------------------- |
| Frontend | Next.js 14, React, TypeScript | 사용자 인터페이스      |
| API      | Next.js API Routes            | 비즈니스 로직, DB 접근 |
| Database | PostgreSQL (Supabase)         | 데이터 저장            |
| Auth     | Supabase Auth                 | 인증/인가              |

```

**시각화 도구 추천:**

| 도구 | 특징 | 추천 대상 |
|------|------|----------|
| **Mermaid** | Markdown 내장, GitHub 렌더링 지원 | 코드와 함께 관리하고 싶은 경우 |
| **Excalidraw** | 손그림 스타일, 무료 | 빠르게 스케치하고 싶은 경우 |
| **Structurizr** | C4 전용 DSL, 코드로 다이어그램 생성 | 정교한 C4 다이어그램 필요 시 |
| **Miro/FigJam** | 드래그앤드롭, 협업 기능 | 시각적 편집 선호 |

### 8.5 Personal Kanban 적용하기

**Kanban**은 작업을 시각화하고 진행 중인 작업 수를 제한하는 방법론입니다.

```

┌─────────────────────────────────────────────────────────────────┐
│ Personal Kanban 보드 │
├─────────────────────────────────────────────────────────────────┤
│ │
│ Backlog To Do In Progress Done │
│ (언젠가) (이번 주) (지금, 최대 3개) (완료) │
│ ───────── ───────── ─────────────── ───────── │
│ │
│ □ 알림 기능 □ 로그인 UI ■ API 인증 ✓ DB 설계 │
│ □ 다크모드 □ 회원가입 ■ 사용자 모델 ✓ 프로젝트 셋업 │
│ □ 내보내기 ■ Prisma 설정 ✓ 환경 구성 │
│ □ 검색 기능 │
│ │
│ ⚠️ WIP 제한: In Progress는 최대 3개! │
│ → 집중력 유지, 컨텍스트 스위칭 최소화 │
│ │
└─────────────────────────────────────────────────────────────────┘

````

**GitHub Projects로 Kanban 설정:**

1. GitHub 저장소 → Projects 탭 → New project
2. "Board" 템플릿 선택
3. 컬럼 설정:
   - **Backlog**: 아이디어, 언젠가 할 것
   - **To Do**: 이번 스프린트(주)에 할 것
   - **In Progress**: 현재 진행 중 (WIP 제한: 3)
   - **Review**: 테스트/검토 중
   - **Done**: 완료

4. 자동화 설정:
   - Issue 생성 시 → Backlog로
   - PR 생성 시 → In Progress로
   - PR 머지 시 → Done으로

### 8.6 기능 개발 전 정렬 체크리스트

새 기능을 시작하기 전에 **반드시** 이 질문들에 답합니다.

```markdown
## 기능 정렬 체크리스트

### 1. 비전 정렬
- [ ] 이 기능이 프로젝트 비전에 부합하는가?
- [ ] "목표 NOT" 목록에 해당하지 않는가?
- [ ] 핵심 가치를 강화하는가?

### 2. 사용자 스토리
이 형식으로 설명할 수 있는가?

"As a [사용자 유형],
 I want [목표/기능],
 so that [이유/가치]"

예: "As a 바쁜 직장인,
     I want 3초 안에 할 일을 추가하고 싶다,
     so that 생각날 때 바로 기록할 수 있다"

### 3. 범위 정의
- [ ] 이 기능의 **스코프 안**에 있는 것은?
- [ ] 이 기능의 **스코프 밖**에 있는 것은?
- [ ] 최소 구현(MVP)은 무엇인가?

### 4. 성공 기준
- [ ] 이 기능이 "완료"되었다는 것을 어떻게 알 수 있는가?
- [ ] 측정 가능한 지표가 있는가?

### 5. 의존성
- [ ] 다른 기능에 의존하는가?
- [ ] 새로운 라이브러리가 필요한가?
- [ ] DB 스키마 변경이 필요한가?
````

**예시 - "검색 기능" 추가 검토:**

```markdown
## 검색 기능 정렬 체크

### 1. 비전 정렬

- [x] 프로젝트 비전: "빠르게 할 일 관리" - 검색은 빠른 접근 지원 ✅
- [x] "목표 NOT"에 없음 ✅
- [x] 핵심 가치 "빠름" 강화 ✅

### 2. 사용자 스토리

"As a 할 일이 많은 사용자,
I want 키워드로 할 일을 검색하고 싶다,
so that 특정 할 일을 빠르게 찾을 수 있다"
✅ 명확함

### 3. 범위 정의

**스코프 안:**

- 제목 키워드 검색
- 실시간 필터링

**스코프 밖 (나중에):**

- 전문 검색 (Full-text search)
- 필터 조합 (날짜 + 키워드)
- 검색 히스토리

**MVP:**

- 입력창에 타이핑하면 제목에서 필터링

### 4. 성공 기준

- 100개 할 일에서 검색 결과 100ms 이내
- 사용자가 3글자 이상 입력 시 결과 표시

### 5. 의존성

- 추가 라이브러리: 없음 (기본 filter 사용)
- DB 변경: 없음
- 선행 작업: 없음

→ ✅ 진행 승인
```

### 8.7 주간/월간 점검 루틴

**정기적인 점검 없이는 비전 이탈을 감지할 수 없습니다.**

```
┌─────────────────────────────────────────────────────────────────┐
│                    점검 루틴                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📅 주간 점검 (매주 금요일, 15분)                                │
│  ──────────────────────────────                                 │
│  □ 이번 주 완료한 작업 목록 확인                                 │
│  □ 각 작업이 프로젝트 비전과 일치하는지 검토                     │
│  □ Kanban 보드 정리                                             │
│  □ 다음 주 우선순위 3개 선정                                    │
│  □ 막힌 부분이나 기술 부채 기록                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📅 월간 점검 (매월 마지막 주, 1시간)                            │
│  ──────────────────────────────────                             │
│  □ 비전 문서 재검토 - 여전히 유효한가?                          │
│  □ 구현된 기능 vs 원래 계획 비교                                │
│  □ "목표 NOT" 목록 업데이트                                     │
│  □ 백로그 정리 (더 이상 필요 없는 항목 삭제)                    │
│  □ ADR 검토 - 재고해야 할 결정이 있는가?                        │
│  □ 아키텍처 문서 업데이트                                       │
│  □ 다음 달 주요 목표 3개 설정                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**주간 점검 템플릿 (docs/reviews/weekly-template.md):**

```markdown
# 주간 점검 - [YYYY-MM-DD]

## 이번 주 완료

- [x] 작업 1
- [x] 작업 2
- [ ] 작업 3 (미완료 - 이유: )

## 비전 정렬 체크

모든 작업이 프로젝트 비전과 일치하는가?

- [ ] 예
- [ ] 아니오 - 이탈한 부분:

## 다음 주 우선순위

1.
2.
3.

## 막힌 점 / 기술 부채

-

## 메모

-
```

### 8.8 CONTEXT.md: AI 도구를 위한 프로젝트 맥락

챕터 7의 CLAUDE.md와 별개로, **전체 프로젝트 맥락**을 담은 문서입니다.

```markdown
<!-- CONTEXT.md -->

# 프로젝트 컨텍스트

## 프로젝트 개요

개인 사용자를 위한 미니멀한 할 일 관리 앱.
복잡한 기능 없이 빠르게 할 일을 추가하고 관리하는 것이 목표.

## 아키텍처
```

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Next.js │────▶│ API Routes │────▶│ PostgreSQL │
│ Frontend │ │ Backend │ │ (Supabase) │
└─────────────┘ └─────────────┘ └─────────────┘

```

- Frontend: Next.js 14 (App Router)
- Backend: Next.js API Routes
- Database: PostgreSQL (Supabase)
- ORM: Prisma
- Auth: Supabase Auth
- Styling: Tailwind CSS

## 주요 설계 결정 (ADR 요약)
1. **PostgreSQL 선택** - JSON + 관계형 데이터 동시 처리
2. **App Router 사용** - 서버 컴포넌트로 성능 최적화
3. **Tailwind CSS** - 빠른 스타일링, 번들 최적화

## 현재 상태
- [x] 프로젝트 설정
- [x] 인증 구현
- [ ] 할 일 CRUD (진행 중)
- [ ] 검색 기능

## 다음 마일스톤
v0.1.0 - 기본 할 일 관리 (예정: 2024-12-31)
- 할 일 추가/삭제/수정
- 완료 체크
- 로컬 저장

## 제약사항
- 팀 협업 기능 없음
- 알림 기능 없음
- 모바일 앱 없음 (웹 반응형만)

## 코드 위치
- 페이지: `src/app/`
- 컴포넌트: `src/components/`
- API: `src/app/api/`
- DB 스키마: `prisma/schema.prisma`
- 타입: `src/types/`
```

### 8.9 문서 구조 정리

```
프로젝트/
├── README.md              # 프로젝트 소개 + 비전
├── CLAUDE.md              # AI 도구용 컨텍스트 (기술 중심)
├── CONTEXT.md             # 프로젝트 전체 맥락 (선택)
├── CHANGELOG.md           # 버전별 변경사항
│
├── docs/
│   ├── VISION.md          # 상세 비전 문서
│   │
│   ├── adr/               # 아키텍처 결정 기록
│   │   ├── 0001-postgresql.md
│   │   ├── 0002-app-router.md
│   │   └── template.md
│   │
│   ├── architecture/      # 아키텍처 다이어그램
│   │   ├── c4-context.md
│   │   └── c4-container.md
│   │
│   ├── session-notes/     # AI 세션 메모 (챕터 7)
│   │   └── 2024-12-16-auth.md
│   │
│   └── reviews/           # 점검 기록
│       ├── weekly/
│       └── monthly/
│
└── ...
```

### 8.10 프로젝트 비전 유지 체크리스트

```
□ 비전 문서 작성
  - README.md 또는 VISION.md에 비전 명시
  - "목표 NOT" 섹션 포함
  - 핵심 가치 3개 이하로 정의

□ ADR 시스템 구축
  - docs/adr/ 폴더 생성
  - 템플릿 파일 작성
  - 첫 번째 ADR 작성 (가장 중요한 기술 결정)

□ 아키텍처 시각화
  - C4 Level 1 (Context) 또는 Level 2 (Container) 다이어그램
  - Mermaid, Excalidraw, 또는 선호하는 도구 사용

□ Kanban 보드 설정
  - GitHub Projects 또는 선호하는 도구
  - WIP 제한 설정 (권장: 3개)

□ 점검 루틴 수립
  - 주간 점검 시간 캘린더에 등록
  - 월간 점검 시간 캘린더에 등록
  - 점검 템플릿 준비

□ 기능 개발 프로세스
  - 새 기능 시작 전 정렬 체크리스트 확인
  - 비전과 일치하지 않으면 거절 또는 백로그로
```

### 8.11 다음 챕터 미리보기

**챕터 9: 플랫폼별 설정 가이드**에서는 Vercel과 Railway의 최적 설정을 다룹니다. vercel.json, railway.json 템플릿과 각 플랫폼의 특성에 맞는 설정 방법을 배웁니다.

---

## 챕터 9: 플랫폼별 설정 가이드

### 9.1 Vercel vs Railway 비교

두 플랫폼 모두 훌륭하지만, **사용 사례에 따라 최적의 선택**이 다릅니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Vercel vs Railway 비교                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  항목              Vercel              Railway                  │
│  ────────────────  ─────────────────   ─────────────────        │
│                                                                 │
│  최적화 대상       프론트엔드/Next.js   풀스택/백엔드             │
│                                                                 │
│  서버리스 함수     ✅ 기본 지원          ✅ 지원                  │
│                                                                 │
│  장기 실행 서버    ❌ 제한적             ✅ 완벽 지원             │
│                                                                 │
│  DB 호스팅         ❌ 별도 필요          ✅ 내장 PostgreSQL       │
│                                                                 │
│  무료 티어         관대함               $5 크레딧/월              │
│                                                                 │
│  빌드 시스템       자체 최적화          Nixpacks                 │
│                                                                 │
│  엣지 함수         ✅ 강력              ❌ 미지원                 │
│                                                                 │
│  프리뷰 배포       ✅ PR마다 자동        ✅ 설정 필요             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💡 추천:                                                        │
│  • Next.js 프론트엔드 중심 → Vercel                              │
│  • 백엔드 API + DB 필요 → Railway                                │
│  • 둘 다 사용 (프론트: Vercel, 백엔드: Railway)도 좋은 조합      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part A: Vercel 완벽 가이드

### 9.2 Vercel 프로젝트 구조

```
프로젝트/
├── .vercel/                    # vercel link 후 생성 (gitignore)
│   ├── project.json
│   └── .env.*.local           # vercel pull로 가져온 환경변수
│
├── vercel.json                 # Vercel 설정 파일
├── next.config.js              # Next.js 설정
├── package.json
└── ...
```

### 9.3 vercel.json 완전 템플릿

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",

  "framework": "nextjs",

  "buildCommand": "prisma generate && next build",

  "installCommand": "npm ci",

  "outputDirectory": ".next",

  "regions": ["icn1"],

  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },

  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ],

  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" }
      ]
    }
  ],

  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],

  "rewrites": [
    {
      "source": "/blog/:slug",
      "destination": "/posts/:slug"
    }
  ]
}
```

**주요 설정 설명:**

| 설정           | 설명                               | 권장값                            |
| -------------- | ---------------------------------- | --------------------------------- |
| `framework`    | 프레임워크 자동 감지 오버라이드    | `"nextjs"`                        |
| `buildCommand` | 빌드 명령어 (Prisma generate 포함) | `"prisma generate && next build"` |
| `regions`      | 배포 리전                          | `["icn1"]` (서울)                 |
| `maxDuration`  | 함수 최대 실행 시간 (초)           | Hobby: 60, Pro: 300               |
| `memory`       | 함수 메모리 (MB)                   | 1024 (기본), 최대 3008            |

### 9.4 Vercel 환경변수 관리

```
┌─────────────────────────────────────────────────────────────────┐
│                  Vercel 환경변수 우선순위                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  우선순위 (높음 → 낮음):                                         │
│                                                                 │
│  1. Vercel 대시보드 설정                                         │
│     └── Environment Variables 섹션                              │
│                                                                 │
│  2. vercel.json의 env 설정                                       │
│     └── 비밀값에는 사용 금지! (커밋되므로)                        │
│                                                                 │
│  3. .env 파일들 (로컬 개발용)                                    │
│     └── .gitignore에 포함되어 배포 안 됨                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  환경별 변수 설정:                                                │
│                                                                 │
│  Production    → 실제 운영 환경                                  │
│  Preview       → PR 프리뷰 배포                                  │
│  Development   → vercel dev 로컬 실행                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**로컬에서 환경변수 동기화:**

```bash
# Vercel 프로젝트 연결
vercel link

# 환경변수 가져오기 (Development 환경)
vercel env pull .env.local

# 특정 환경의 변수 가져오기
vercel env pull .env.production.local --environment=production
```

**필수 환경변수 예시:**

```bash
# .env.local (로컬 개발용 - gitignore)

# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Third-party APIs
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 9.5 Vercel Serverless 함수 최적화

**함수별 설정 (App Router):**

```typescript
// app/api/heavy-task/route.ts

// 함수 설정
export const maxDuration = 60; // 최대 실행 시간 (초)
export const dynamic = 'force-dynamic'; // 항상 서버에서 실행

export async function POST(request: Request) {
  // 무거운 작업 처리
  const result = await heavyComputation();
  return Response.json(result);
}
```

**타임아웃 설정 가이드:**

| 플랜       | 기본 | 최대  | 설정 방법                       |
| ---------- | ---- | ----- | ------------------------------- |
| Hobby      | 10초 | 60초  | `export const maxDuration = 60` |
| Pro        | 15초 | 300초 | vercel.json 또는 코드에서 설정  |
| Enterprise | 15초 | 900초 | 동일                            |

**Cold Start 최소화:**

```typescript
// lib/prisma.ts - 싱글톤 패턴 필수!

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 9.6 Vercel Edge Functions

**일반 Serverless vs Edge 비교:**

```
┌─────────────────────────────────────────────────────────────────┐
│              Serverless vs Edge Functions                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Serverless Functions:                                          │
│  ─────────────────────                                          │
│  • Node.js 런타임                                               │
│  • 모든 npm 패키지 사용 가능                                    │
│  • Cold start 있음 (~250ms)                                     │
│  • 특정 리전에서 실행                                           │
│                                                                 │
│  Edge Functions:                                                │
│  ───────────────                                                │
│  • V8 런타임 (브라우저와 유사)                                   │
│  • 제한된 API (Node.js API 일부 미지원)                         │
│  • Cold start 거의 없음 (~0ms)                                  │
│  • 사용자와 가장 가까운 엣지에서 실행                            │
│                                                                 │
│  💡 Edge 적합: 인증 체크, 리다이렉트, A/B 테스트                  │
│  💡 Serverless 적합: DB 쿼리, 복잡한 로직, 외부 API 호출          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Edge Function 예시:**

```typescript
// app/api/geo/route.ts

export const runtime = 'edge'; // Edge 런타임 사용

export async function GET(request: Request) {
  // 사용자 위치 정보 (Edge에서 자동 제공)
  const country = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');

  return Response.json({
    country,
    city,
    message: `Hello from ${city}, ${country}!`,
  });
}
```

### 9.7 Vercel + Prisma 최적 설정

**문제:** Vercel의 캐싱으로 인해 Prisma Client가 오래된 버전을 사용할 수 있음

**해결책 1: postinstall 스크립트**

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

**해결책 2: 빌드 명령어에 포함**

```json
// vercel.json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

**해결책 3: Prisma Accelerate 사용 (권장)**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Accelerate URL
  directUrl = env("DIRECT_URL")        // 마이그레이션용
}
```

---

## Part B: Railway 완벽 가이드

### 9.8 Railway 프로젝트 구조

```
프로젝트/
├── railway.json               # Railway 설정 (선택)
├── railway.toml               # Railway 설정 (대안)
├── nixpacks.toml              # Nixpacks 빌드 설정 (선택)
├── Procfile                   # 시작 명령어 (선택)
├── package.json
└── ...
```

### 9.9 railway.json 완전 템플릿

```json
{
  "$schema": "https://railway.com/railway.schema.json",

  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },

  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5,
    "numReplicas": 1
  }
}
```

**주요 설정 설명:**

| 설정                | 설명                | 권장값                 |
| ------------------- | ------------------- | ---------------------- |
| `builder`           | 빌드 시스템         | `"NIXPACKS"` (기본)    |
| `healthcheckPath`   | 헬스체크 엔드포인트 | `"/api/health"`        |
| `restartPolicyType` | 재시작 정책         | `"ON_FAILURE"`         |
| `numReplicas`       | 인스턴스 수         | `1` (무료), `2+` (Pro) |

### 9.10 Nixpacks 설정 (Railway 빌드 시스템)

Railway는 **Nixpacks**를 사용하여 자동으로 빌드 환경을 구성합니다. 대부분의 경우 설정 없이 작동하지만, 커스터마이징이 필요할 때 `nixpacks.toml`을 사용합니다.

**nixpacks.toml 완전 템플릿:**

```toml
# 빌드 환경 설정
[phases.setup]
nixPkgs = ["nodejs_20", "npm"]
aptPkgs = ["openssl", "libssl-dev"]  # Prisma 5+ 필수

# 의존성 설치
[phases.install]
cmds = ["npm ci"]

# 빌드 단계
[phases.build]
cmds = [
  "npx prisma generate",
  "npm run build"
]

# 시작 명령어
[start]
cmd = "npm run start"

# 환경변수
[variables]
NODE_ENV = "production"
```

**Prisma + OpenSSL 문제 해결:**

Prisma 5+는 OpenSSL 3.0이 필요합니다. Railway의 기본 이미지에 없을 수 있습니다.

```toml
# nixpacks.toml

[phases.setup]
aptPkgs = ["openssl", "libssl-dev", "ca-certificates"]

[phases.build]
cmds = [
  "npx prisma generate",
  "npm run build"
]
```

### 9.11 Railway 환경변수 관리

```
┌─────────────────────────────────────────────────────────────────┐
│                Railway 환경변수 설정                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  설정 위치:                                                      │
│  ──────────                                                     │
│  Railway Dashboard → Project → Service → Variables              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Railway 내장 변수 (자동 제공):                                  │
│  ─────────────────────────────                                  │
│  • RAILWAY_ENVIRONMENT    - 환경 이름 (production, staging)     │
│  • RAILWAY_SERVICE_NAME   - 서비스 이름                         │
│  • RAILWAY_PROJECT_ID     - 프로젝트 ID                         │
│  • PORT                   - 할당된 포트 (필수 사용!)             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Railway PostgreSQL 연결 (내장 DB 사용 시):                      │
│  ─────────────────────────────────────────                      │
│  • DATABASE_URL           - 연결 문자열                         │
│  • PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE              │
│                                                                 │
│  💡 내부 네트워크 URL 사용 권장:                                  │
│     ${{Postgres.DATABASE_PRIVATE_URL}}                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Railway에서 환경변수 참조 문법:**

```bash
# 같은 프로젝트의 다른 서비스 참조
DATABASE_URL="${{Postgres.DATABASE_PRIVATE_URL}}"

# 내부 네트워크 URL (더 빠름, 권장)
DATABASE_PRIVATE_URL="${{Postgres.DATABASE_PRIVATE_URL}}"

# 외부 접근 URL (로컬 개발용)
DATABASE_PUBLIC_URL="${{Postgres.DATABASE_PUBLIC_URL}}"
```

### 9.12 Railway에서 포트 설정 (중요!)

**Railway는 동적으로 포트를 할당합니다.** 하드코딩된 포트(예: 3000)를 사용하면 실패합니다.

```typescript
// ❌ 잘못된 예시
const PORT = 3000;
app.listen(PORT);

// ✅ 올바른 예시
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0'); // 0.0.0.0 바인딩 필수!
```

**Next.js의 경우 (package.json):**

```json
{
  "scripts": {
    "start": "next start -p $PORT"
  }
}
```

**Express의 경우:**

```typescript
// server.ts
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// 0.0.0.0에 바인딩 (Railway 필수)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 9.13 Railway Health Check 설정

Railway는 헬스체크를 통해 서비스 상태를 모니터링합니다.

**헬스체크 엔드포인트 구현:**

```typescript
// app/api/health/route.ts (Next.js App Router)

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // DB 연결 확인
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

**railway.json에서 헬스체크 설정:**

```json
{
  "deploy": {
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  }
}
```

### 9.14 Railway + Prisma 최적 설정

**package.json:**

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build",
    "start": "next start -p $PORT",
    "db:migrate:deploy": "prisma migrate deploy"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0"
  }
}
```

**railway.json:**

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run db:migrate:deploy && npm run start",
    "healthcheckPath": "/api/health"
  }
}
```

**Prisma 스키마 (Railway PostgreSQL용):**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 9.15 Railway 내장 PostgreSQL 설정

```
┌─────────────────────────────────────────────────────────────────┐
│              Railway PostgreSQL 설정 단계                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 서비스 추가                                                  │
│     Dashboard → New → Database → PostgreSQL                     │
│                                                                 │
│  2. 환경변수 연결                                                │
│     앱 서비스 → Variables → Add Reference Variable              │
│     DATABASE_URL = ${{Postgres.DATABASE_PRIVATE_URL}}           │
│                                                                 │
│  3. 마이그레이션 실행                                            │
│     Railway CLI 또는 Deploy hook에서 실행                       │
│                                                                 │
│  4. 백업 설정 (Pro 플랜)                                         │
│     Database → Settings → Backups → Enable                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part C: 공통 설정 및 비교

### 9.16 package.json 통합 템플릿

Vercel과 Railway 모두에서 작동하는 설정:

```json
{
  "name": "my-fullstack-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "postinstall": "prisma generate",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:push": "prisma db push",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "verify": "npm run typecheck && npm run lint && npm run build"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 9.17 플랫폼별 배포 명령어

```bash
# ─────────────────────────────────────────────────────────
# Vercel
# ─────────────────────────────────────────────────────────

# CLI 설치
npm install -g vercel

# 프로젝트 연결
vercel link

# 환경변수 가져오기
vercel pull

# 로컬에서 프로덕션 빌드 테스트
vercel build

# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod

# ─────────────────────────────────────────────────────────
# Railway
# ─────────────────────────────────────────────────────────

# CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 연결
railway link

# 로컬에서 Railway 환경으로 실행
railway run npm run dev

# 배포
railway up

# 로그 확인
railway logs
```

### 9.18 트러블슈팅 가이드

**Vercel 흔한 오류:**

| 오류                              | 원인                    | 해결                                |
| --------------------------------- | ----------------------- | ----------------------------------- |
| `FUNCTION_INVOCATION_TIMEOUT`     | 함수 실행 시간 초과     | `maxDuration` 증가 또는 로직 최적화 |
| `EDGE_FUNCTION_INVOCATION_FAILED` | Edge 런타임 호환성 문제 | Node.js API 사용 확인, runtime 변경 |
| `BUILD_FAILED: prisma generate`   | Prisma Client 생성 실패 | `postinstall` 스크립트 확인         |
| `504 Gateway Timeout`             | 서버리스 함수 타임아웃  | DB 쿼리 최적화, Connection Pooling  |

**Railway 흔한 오류:**

| 오류                            | 원인             | 해결                                      |
| ------------------------------- | ---------------- | ----------------------------------------- |
| `Application failed to respond` | 포트 바인딩 문제 | `process.env.PORT` 사용, `0.0.0.0` 바인딩 |
| `Build failed: openssl`         | OpenSSL 누락     | `nixpacks.toml`에 aptPkgs 추가            |
| `Connection refused`            | DB 연결 실패     | 환경변수 확인, Private URL 사용           |
| `Health check failed`           | 헬스체크 실패    | `/api/health` 엔드포인트 구현             |

### 9.19 플랫폼별 설정 체크리스트

**Vercel 체크리스트:**

```
□ vercel link로 프로젝트 연결
□ vercel pull로 환경변수 동기화
□ vercel.json 설정 (필요시)
□ postinstall에 prisma generate 추가
□ 환경변수 대시보드에 설정
  - DATABASE_URL
  - DIRECT_URL (마이그레이션용)
  - 기타 API 키들
□ vercel build로 로컬 테스트
□ vercel --prod로 프로덕션 배포
```

**Railway 체크리스트:**

```
□ railway link로 프로젝트 연결
□ PostgreSQL 서비스 추가 (필요시)
□ 환경변수 설정
  - DATABASE_URL = ${{Postgres.DATABASE_PRIVATE_URL}}
  - 기타 필요한 변수들
□ package.json start 스크립트에 $PORT 사용
□ 0.0.0.0 바인딩 확인
□ /api/health 엔드포인트 구현
□ nixpacks.toml 설정 (필요시)
□ railway up으로 배포
□ railway logs로 로그 확인
```

### 9.20 다음 챕터 미리보기

**챕터 10: 즉시 실행 가능한 액션 플랜**에서는 지금까지 배운 모든 내용을 정리하고, 오늘부터 바로 적용할 수 있는 체크리스트와 템플릿 모음을 제공합니다.

---

## 챕터 10: 즉시 실행 가능한 액션 플랜

### 10.1 이 가이드의 핵심 요약

지금까지 배운 내용을 한 장으로 정리합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│            솔로 개발자 워크플로우 개선 핵심 요약                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  문제 1: 배포 오류 반복                                          │
│  ─────────────────────                                          │
│  원인: 로컬 ≠ 클라우드 환경 차이                                 │
│  해결: 환경 일치 + 사전 검증 + 자동화                            │
│  핵심 도구: Vercel CLI, GitHub Actions, Husky                   │
│                                                                 │
│  문제 2: AI 도구 컨텍스트 한계                                   │
│  ───────────────────────────                                    │
│  원인: 컨텍스트 윈도우의 구조적 제한                             │
│  해결: CLAUDE.md + 1태스크=1세션 + 지식 보존                     │
│  핵심 도구: CLAUDE.md, 세션 노트, 효과적인 프롬프트              │
│                                                                 │
│  문제 3: 프로젝트 비전 이탈                                      │
│  ─────────────────────────                                      │
│  원인: 기록 없는 의사결정 + 정기 점검 부재                       │
│  해결: 비전 문서 + ADR + 주간/월간 점검                          │
│  핵심 도구: VISION.md, ADR, Kanban, 점검 루틴                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 우선순위별 액션 플랜

**모든 것을 한 번에 하려고 하지 마세요.** 가장 큰 고통점부터 해결합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    3단계 도입 로드맵                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔴 1단계: 오늘 당장 (30분)                                      │
│  ─────────────────────────                                      │
│  □ tsconfig.json에 forceConsistentCasingInFileNames 추가        │
│  □ package.json에 postinstall: "prisma generate" 추가           │
│  □ CLAUDE.md 파일 생성 (기본 템플릿)                             │
│  □ README.md에 비전 섹션 추가                                   │
│                                                                 │
│  🟡 2단계: 이번 주 안에 (2-3시간)                                │
│  ────────────────────────────                                   │
│  □ Vercel/Railway CLI 설치 및 프로젝트 연결                     │
│  □ GitHub Actions CI 파이프라인 설정                            │
│  □ Husky + lint-staged 설치                                     │
│  □ 첫 번째 ADR 작성                                             │
│  □ Kanban 보드 설정 (GitHub Projects)                           │
│                                                                 │
│  🟢 3단계: 습관화 (매주/매월)                                    │
│  ───────────────────────────                                    │
│  □ 배포 전 vercel build / nixpacks build 실행                   │
│  □ AI 세션 종료 전 지식 보존                                    │
│  □ 주간 15분 점검                                               │
│  □ 월간 1시간 점검                                              │
│  □ 새 기능 전 정렬 체크리스트 확인                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 10.3 복사해서 바로 쓰는 템플릿 모음

#### 템플릿 1: tsconfig.json (Next.js + Vercel)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "incremental": true,
    "jsx": "preserve",
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 템플릿 2: package.json (Next.js + Prisma)

```json
{
  "name": "my-app",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "postinstall": "prisma generate",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "verify": "npm run typecheck && npm run lint && npm run build",
    "prepare": "husky"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  },
  "engines": { "node": ">=18.0.0" }
}
```

#### 템플릿 3: .lintstagedrc.js

```javascript
module.exports = {
  '*.{ts,tsx}': [() => 'tsc --noEmit', 'eslint --fix --max-warnings=0', 'prettier --write'],
  '*.prisma': ['npx prisma format', 'npx prisma validate'],
  '*.{js,jsx,json,md,css}': ['prettier --write'],
};
```

#### 템플릿 4: GitHub Actions CI (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma validate
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

#### 템플릿 5: CLAUDE.md

```markdown
# Project: [프로젝트명]

## 기술 스택

- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Database: PostgreSQL + Prisma ORM
- Styling: Tailwind CSS
- Deployment: Vercel / Railway

## 프로젝트 구조

src/
├── app/ # 페이지 및 API 라우트
├── components/ # React 컴포넌트
├── lib/ # 유틸리티, DB 클라이언트
└── types/ # TypeScript 타입

## 명령어

- npm run dev # 개발 서버
- npm run build # 프로덕션 빌드
- npm run verify # 타입체크 + 린트 + 빌드

## 코딩 컨벤션

- 함수형 컴포넌트 + Hooks
- 절대 경로 import (@/)
- 세미콜론 생략

## 현재 작업

[현재 집중하고 있는 기능]

## 주의사항

- Prisma 스키마 변경 후 prisma generate 필수
- 배포 전 npm run verify 실행
```

#### 템플릿 6: VISION.md

```markdown
# 프로젝트 비전

## 한 줄 정의

[이 프로젝트를 한 문장으로]

## 대상 사용자

[누구를 위한 것인가]

## 해결하는 문제

[어떤 고통점을 해결하는가]

## 핵심 가치 (최대 3개)

1.
2.
3.

## 핵심 기능 (MVP)

- [ ] 기능 1
- [ ] 기능 2
- [ ] 기능 3

## 🚫 목표 NOT

- [명시적으로 하지 않을 것 1]
- [명시적으로 하지 않을 것 2]
- [명시적으로 하지 않을 것 3]

## 성공 지표

- [측정 가능한 지표]
```

#### 템플릿 7: ADR (docs/adr/template.md)

```markdown
# ADR [번호]: [결정 제목]

## 상태

[Proposed | Accepted | Deprecated]

## 날짜

[YYYY-MM-DD]

## 맥락

[이 결정이 필요한 배경]

## 고려한 옵션들

### 옵션 1: [이름]

- 장점:
- 단점:

### 옵션 2: [이름]

- 장점:
- 단점:

## 결정

[선택한 옵션과 그 이유]

## 결과

- 긍정적:
- 부정적:
```

#### 템플릿 8: 주간 점검 (docs/reviews/weekly-template.md)

```markdown
# 주간 점검 - [YYYY-MM-DD]

## 이번 주 완료

- [x]
- [x]
- [ ] (미완료 - 이유: )

## 비전 정렬 체크

- [ ] 모든 작업이 프로젝트 비전과 일치함

## 다음 주 우선순위 (최대 3개)

1.
2.
3.

## 막힌 점 / 기술 부채

-

## 메모

-
```

#### 템플릿 9: Prisma 싱글톤 (lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

#### 템플릿 10: Health Check API (app/api/health/route.ts)

```typescript
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 503 }
    );
  }
}
```

---

### 10.4 빠른 참조 체크리스트

#### 배포 전 체크리스트

```
□ npm run verify 통과 (typecheck + lint + build)
□ vercel build 또는 로컬 프로덕션 빌드 성공
□ 환경변수 모두 설정됨
□ Prisma 스키마 변경 시 migration 준비됨
□ package.json engines.node 버전 명시됨
□ postinstall에 prisma generate 포함됨
```

#### 새 기능 시작 전 체크리스트

```
□ 프로젝트 비전과 일치하는가?
□ "목표 NOT" 목록에 해당하지 않는가?
□ 사용자 스토리로 설명할 수 있는가?
□ MVP 범위가 정의되었는가?
□ 성공 기준이 명확한가?
```

#### AI 세션 관리 체크리스트

```
□ CLAUDE.md가 최신 상태인가?
□ 1 태스크 = 1 세션 원칙 준수
□ 세션 종료 전 지식 보존 요청
□ 프롬프트에 파일 경로 명시
□ Explore → Plan → Code → Commit 워크플로우 적용
```

---

### 10.5 문제별 즉시 해결 가이드

#### TypeScript 오류

| 오류                           | 즉시 해결                                       |
| ------------------------------ | ----------------------------------------------- |
| `File name differs in casing`  | import 경로 대소문자를 실제 파일명과 일치시키기 |
| `Cannot find module`           | 경로 확인, @types 패키지 설치                   |
| `Object is possibly null`      | `?.` 옵셔널 체이닝 또는 null 체크 추가          |
| `Parameter implicitly has any` | 타입 명시: `(param: Type) => ...`               |

#### Prisma 오류

| 오류                                  | 즉시 해결                                           |
| ------------------------------------- | --------------------------------------------------- |
| `Cannot find module '@prisma/client'` | `npx prisma generate` 실행, postinstall 확인        |
| `Unable to locate Query Engine`       | `engineType: "client"` 추가 또는 binaryTargets 설정 |
| `Too many connections`                | Connection Pooling URL 사용, 싱글톤 패턴 확인       |
| `P1001: Can't reach database`         | DATABASE_URL 환경변수 확인                          |

#### 배포 오류

| 오류                                    | 즉시 해결                                 |
| --------------------------------------- | ----------------------------------------- |
| Vercel `BUILD_FAILED`                   | `vercel build` 로컬 실행으로 원인 파악    |
| Railway `Application failed to respond` | `process.env.PORT` 사용, `0.0.0.0` 바인딩 |
| `FUNCTION_INVOCATION_TIMEOUT`           | `maxDuration` 증가 또는 로직 최적화       |

---

### 10.6 추천 도구 요약표

| 영역                | 핵심 도구            | 대안                |
| ------------------- | -------------------- | ------------------- |
| **로컬 빌드 검증**  | Vercel CLI, Nixpacks | Docker              |
| **CI/CD**           | GitHub Actions       | GitLab CI           |
| **커밋 검증**       | Husky + lint-staged  | pre-commit          |
| **AI 컨텍스트**     | CLAUDE.md            | .cursorrules        |
| **아키텍처 문서**   | Mermaid, ADR         | Structurizr         |
| **태스크 관리**     | GitHub Projects      | Notion, Linear      |
| **DB ORM**          | Prisma               | Drizzle, TypeORM    |
| **배포 (Frontend)** | Vercel               | Netlify, Cloudflare |
| **배포 (Backend)**  | Railway              | Render, Fly.io      |

---

### 10.7 최종 점검: 당신의 워크플로우 성숙도

각 항목에 체크하고 점수를 계산해보세요.

```
배포 안정성 (각 2점, 총 10점)
─────────────────────────────
□ tsconfig.json에 forceConsistentCasingInFileNames 설정됨
□ package.json에 postinstall: "prisma generate" 있음
□ GitHub Actions CI 파이프라인 구축됨
□ Husky pre-commit hook 설정됨
□ 배포 전 로컬 빌드 테스트 습관화

AI 도구 활용 (각 2점, 총 10점)
─────────────────────────────
□ CLAUDE.md (또는 동등한 컨텍스트 파일) 존재함
□ 1 태스크 = 1 세션 원칙 실천 중
□ 세션 종료 전 지식 보존 습관화
□ 구체적인 프롬프트 작성 습관화
□ Explore → Plan → Code 워크플로우 적용

프로젝트 관리 (각 2점, 총 10점)
─────────────────────────────
□ 비전 문서 (README 또는 VISION.md) 존재함
□ "목표 NOT" 섹션 정의됨
□ ADR 최소 1개 이상 작성됨
□ Kanban 보드 사용 중
□ 주간/월간 점검 루틴 실천 중

──────────────────────────────
총점: ___ / 30점

해석:
• 25-30점: 🏆 마스터 - 체계적인 워크플로우 구축 완료
• 15-24점: 🌟 중급 - 기본기 갖춤, 일부 개선 필요
• 8-14점:  📈 초급 - 핵심 요소 도입 시작 권장
• 0-7점:   🚀 시작 - 이 가이드의 1단계부터 시작!
```

---

### 10.8 마무리: 작은 개선의 힘

**완벽한 워크플로우는 없습니다.** 중요한 것은 **지속적인 개선**입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                     기억해야 할 것들                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 한 번에 모든 것을 바꾸려 하지 마세요                         │
│     → 가장 큰 고통점 하나부터 해결                               │
│                                                                 │
│  2. 자동화는 투자입니다                                          │
│     → 처음 30분 투자가 앞으로 수십 시간을 절약                   │
│                                                                 │
│  3. 문서화는 미래의 나를 위한 것입니다                           │
│     → 3개월 후의 내가 고마워할 것                                │
│                                                                 │
│  4. 실패를 빨리 발견할수록 비용이 줄어듭니다                     │
│     → 커밋 시점 > CI > 배포 후                                   │
│                                                                 │
│  5. AI 도구는 보조 수단입니다                                    │
│     → 컨텍스트를 잘 전달하면 10배 효과                           │
│                                                                 │
│  6. 비전을 잃지 마세요                                           │
│     → 정기적인 점검이 방향을 유지해줍니다                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 10.9 다음 단계 추천

이 가이드를 완료했다면, 다음 단계로 고려해볼 것들:

1. **테스트 자동화** - Jest, Vitest, Playwright
2. **모니터링** - Sentry, LogRocket, Vercel Analytics
3. **성능 최적화** - Lighthouse CI, Bundle Analyzer
4. **인프라 코드화** - Terraform, Pulumi
5. **더 나은 타입 안전성** - Zod, tRPC

---

## Part 1 완료!

10개 챕터를 통해 솔로 개발자의 3대 워크플로우 병목을 해결하는 방법을 배웠습니다.

**오늘 바로 시작하세요:**

1. `tsconfig.json`에 `forceConsistentCasingInFileNames: true` 추가
2. `package.json`에 `postinstall: "prisma generate"` 추가
3. `CLAUDE.md` 파일 생성

작은 첫 걸음이 큰 변화를 만듭니다!

---

# Part 2: UI/UX 심화 가이드

> 바이브 코딩 환경에서 고품질 UI/UX를 구현하기 위한 전략

Part 1에서 배포 안정성, AI 컨텍스트 관리, 프로젝트 비전 유지를 다뤘다면, Part 2에서는 **AI와 협업하여 좋은 UI/UX를 만드는 방법**을 다룹니다.

---

## 챕터 11: 바이브 코딩과 UI/UX의 근본적 충돌

### 11.1 바이브 코딩이란?

**바이브 코딩(Vibe Coding)**은 AI에게 자연어로 원하는 것을 설명하고, AI가 생성한 코드를 수락하거나 수정하는 개발 방식입니다. "대충 이런 느낌으로 만들어줘"라고 요청하면 AI가 코드를 생성해주는 것이죠.

```
┌─────────────────────────────────────────────────────────────────┐
│                    바이브 코딩의 약속과 현실                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  약속 (Promise):                                                │
│  ────────────────                                               │
│  "대시보드 만들어줘" → 🪄 → 완벽한 대시보드 UI                   │
│                                                                 │
│  현실 (Reality):                                                │
│  ────────────────                                               │
│  "대시보드 만들어줘" → 🪄 → 작동은 하지만...                     │
│                           • 일관성 없는 디자인                   │
│                           • 누락된 상태들 (로딩, 에러)           │
│                           • 접근성 위반                          │
│                           • 반응형 깨짐                          │
│                           • 기존 컴포넌트 무시                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 AI 생성 UI의 5가지 근본적 문제

**2024년 GitClear 보고서**에 따르면 AI 코드 생성으로 코드 중복 블록 빈도가 **8배 증가**했습니다. UI 코드에서 이 문제는 더욱 심각하게 나타납니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              AI 생성 UI의 5가지 근본적 문제                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ Frankenstein 레이아웃                                       │
│  ───────────────────────                                        │
│  AI는 개별 컴포넌트(버튼, 카드, 폼)를 알지만,                    │
│  이들을 조합할 때 시각적 계층 구조를 이해하지 못함               │
│                                                                 │
│  결과: 정보 밀도 불균형, 시각적 혼잡, 일관성 없는 레이아웃       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  2️⃣ Happy Path만 구현                                           │
│  ─────────────────────                                          │
│  AI는 "성공 케이스"만 구현하고, 예외 상황을 무시함               │
│                                                                 │
│  누락되는 것들:                                                  │
│  • 로딩 상태 (Skeleton, Spinner)                                │
│  • 에러 상태 (에러 메시지, 재시도 버튼)                          │
│  • 빈 상태 (데이터 없을 때 안내)                                 │
│  • 엣지 케이스 (긴 텍스트, 이미지 없음 등)                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  3️⃣ 기존 컴포넌트 무시                                          │
│  ─────────────────────                                          │
│  프로젝트에 이미 Button 컴포넌트가 있어도,                       │
│  AI는 새로운 버튼을 매번 새로 생성함                             │
│                                                                 │
│  결과: 디자인 일관성 파괴, 유지보수 악몽                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  4️⃣ 접근성 무시                                                  │
│  ────────────────                                               │
│  WebAIM 연구: 웹페이지의 95.9%가 접근성 위반 포함                │
│                                                                 │
│  AI가 놓치는 것들:                                               │
│  • alt 텍스트 누락 또는 의미 없는 텍스트                         │
│  • 키보드 네비게이션 불가                                        │
│  • 색상 대비 부족                                                │
│  • ARIA 속성 누락                                                │
│  • 포커스 상태 미구현                                            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  5️⃣ 개념적 모델 부재                                             │
│  ─────────────────────                                          │
│  AI는 데이터 구조와 비즈니스 로직의 관계를 이해하지 못함         │
│                                                                 │
│  Smashing Magazine 사례:                                        │
│  테스트 트래커 앱에서 3단계 만에 데이터 동기화 버그 발생         │
│  엔티티 간 관계가 명확하지 않아 고아 데이터 생성                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 실제 사례: "작동하지만 좋지 않은" UI

**COAX Software UI/UX 디자이너의 증언:**

> "AI가 생성한 폼은 Figma에서 완벽해 보였지만 기본적인 사용성 테스트에서 실패했습니다. 검증(validation)이 없었고, 에러 상태가 부실했으며, 네비게이션이 혼란스러웠습니다."

**문제 있는 AI 생성 코드 예시:**

```tsx
// ❌ AI가 흔히 생성하는 문제 있는 폼
const SignupForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 바로 API 호출 - 로딩 상태 없음!
    fetch('/api/signup', { method: 'POST', body: formData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" /> {/* label 없음! */}
      <input type="password" placeholder="Password" /> {/* 검증 없음! */}
      <button type="submit">Sign Up</button> {/* 로딩 상태 없음! */}
    </form>
  );
};
```

**문제점 분석:**

| 누락된 요소    | 사용자 경험 영향                       |
| -------------- | -------------------------------------- |
| `<label>` 요소 | 스크린 리더 사용자 접근 불가           |
| 로딩 상태      | 버튼 클릭 후 피드백 없음 → "작동하나?" |
| 에러 상태      | 실패 시 사용자가 원인 모름             |
| 검증 피드백    | 잘못된 입력을 서버까지 보냄            |
| 성공 상태      | 성공했는지 알 수 없음                  |

### 11.4 왜 이런 문제가 발생하는가?

AI의 학습 데이터와 동작 방식의 구조적 한계 때문입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                AI UI 생성의 구조적 한계                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 학습 데이터의 문제                                           │
│  ─────────────────────                                          │
│  • 인터넷의 대부분 코드는 "예시 코드" (프로덕션 아님)            │
│  • 튜토리얼은 간결함을 위해 에러 핸들링 생략                     │
│  • 접근성은 "추가 작업"으로 취급되어 누락                        │
│                                                                 │
│  2. 컨텍스트의 부재                                              │
│  ──────────────────                                             │
│  • AI는 당신의 디자인 시스템을 모름                              │
│  • 프로젝트의 기존 컴포넌트를 모름                               │
│  • 비즈니스 로직과 데이터 구조를 모름                            │
│                                                                 │
│  3. 평가 기준의 차이                                             │
│  ─────────────────                                              │
│  AI의 목표: "작동하는 코드" 생성                                 │
│  실제 필요: "좋은 UX를 제공하는 코드"                            │
│                                                                 │
│  AI는 "작동 여부"는 판단할 수 있지만                             │
│  "좋은 UX인지"는 판단할 수 없음                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.5 바이브 코딩의 위험한 함정

**"충분히 좋아 보이는 것"의 함정:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  바이브 코딩 함정 사이클                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    "로그인 폼 만들어줘"                                          │
│           │                                                     │
│           ▼                                                     │
│    AI가 멋진 UI 생성 ✨                                          │
│           │                                                     │
│           ▼                                                     │
│    "와, 잘 되네!" (기본 테스트만)                                │
│           │                                                     │
│           ▼                                                     │
│    배포 🚀                                                       │
│           │                                                     │
│           ▼                                                     │
│    실제 사용자 문제 발견 😱                                      │
│    • 비밀번호 틀려도 피드백 없음                                 │
│    • 네트워크 오류 시 무반응                                     │
│    • 모바일에서 버튼 클릭 안 됨                                  │
│    • 시각 장애인 사용 불가                                       │
│           │                                                     │
│           ▼                                                     │
│    급하게 수정 (시간 2배 소요)                                   │
│                                                                 │
│  💡 처음부터 제대로 요청했다면 절약된 시간                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.6 해결 방향: Intent Prototyping

**Smashing Magazine**이 제안하는 **Intent Prototyping** 접근법:

AI에게 바로 UI를 요청하지 말고, **먼저 개념적 모델을 정의**하세요.

```
┌─────────────────────────────────────────────────────────────────┐
│              Intent Prototyping 워크플로우                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ 잘못된 접근:                                                 │
│  ─────────────────                                              │
│  "대시보드 만들어줘" → AI가 추측으로 생성 → 문제 발생            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✅ 올바른 접근 (Intent Prototyping):                            │
│  ─────────────────────────────────────                          │
│                                                                 │
│  1단계: 개념적 모델 정의                                         │
│  ────────────────────────                                       │
│  "이 대시보드의 주요 엔티티와 관계를 정의해줘:                   │
│   - 사용자(User)                                                │
│   - 프로젝트(Project) - 사용자가 여러 개 소유                   │
│   - 태스크(Task) - 프로젝트에 속함                              │
│   - 상태: pending, in_progress, completed"                      │
│                                                                 │
│  2단계: 사용자 플로우 정의                                       │
│  ──────────────────────                                         │
│  "핵심 사용자 플로우:                                            │
│   1. 로그인 → 대시보드 (프로젝트 목록)                          │
│   2. 프로젝트 선택 → 태스크 목록                                │
│   3. 태스크 상태 변경 → 즉시 반영"                              │
│                                                                 │
│  3단계: 상태 정의                                                │
│  ────────────────                                               │
│  "각 화면의 상태:                                                │
│   - 로딩 중                                                     │
│   - 데이터 있음                                                  │
│   - 데이터 없음 (빈 상태)                                        │
│   - 에러 발생"                                                   │
│                                                                 │
│  4단계: 이제 UI 요청                                             │
│  ────────────────────                                           │
│  "위 정의를 바탕으로 프로젝트 목록 컴포넌트를 구현해줘"          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.7 AI 생성 UI 품질 체크리스트

AI가 생성한 UI를 수락하기 전에 **반드시 확인**해야 할 항목들:

```
┌─────────────────────────────────────────────────────────────────┐
│              AI 생성 UI 품질 체크리스트                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  상태 완전성 (State Completeness)                                │
│  ─────────────────────────────────                              │
│  □ 로딩 상태가 구현되어 있는가?                                  │
│  □ 에러 상태가 구현되어 있는가?                                  │
│  □ 빈 상태(Empty State)가 구현되어 있는가?                       │
│  □ 성공 상태 피드백이 있는가?                                    │
│                                                                 │
│  일관성 (Consistency)                                            │
│  ─────────────────────                                          │
│  □ 기존 디자인 시스템 컴포넌트를 사용하는가?                     │
│  □ 색상이 디자인 토큰을 사용하는가?                              │
│  □ 간격이 일관적인가?                                           │
│  □ 타이포그래피가 프로젝트 스타일과 맞는가?                      │
│                                                                 │
│  접근성 (Accessibility)                                          │
│  ───────────────────────                                        │
│  □ 모든 이미지에 의미 있는 alt 텍스트가 있는가?                  │
│  □ 폼 요소에 label이 연결되어 있는가?                           │
│  □ 키보드로 모든 기능을 사용할 수 있는가?                        │
│  □ 색상 대비가 충분한가? (4.5:1 이상)                            │
│  □ 포커스 상태가 표시되는가?                                    │
│                                                                 │
│  반응형 (Responsiveness)                                         │
│  ───────────────────────                                        │
│  □ 모바일에서 레이아웃이 정상인가?                               │
│  □ 터치 타겟이 충분히 큰가? (44x44px 이상)                       │
│  □ 가로 스크롤이 발생하지 않는가?                                │
│                                                                 │
│  코드 품질 (Code Quality)                                        │
│  ─────────────────────────                                      │
│  □ 시맨틱 HTML을 사용하는가? (<button>, <nav> 등)               │
│  □ 불필요한 div 중첩이 없는가?                                   │
│  □ 하드코딩된 값 대신 변수/토큰을 사용하는가?                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.8 이 챕터의 핵심 교훈

```
┌─────────────────────────────────────────────────────────────────┐
│                    핵심 교훈 3가지                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. AI는 "만능 디자이너"가 아니라 "빠른 초안 생성기"             │
│     ─────────────────────────────────────────────────           │
│     AI의 출력물은 항상 검토와 개선이 필요함                      │
│                                                                 │
│  2. "작동함" ≠ "좋은 UX"                                         │
│     ─────────────────────                                       │
│     기능적으로 작동하는 것과 사용자 경험이                       │
│     좋은 것은 완전히 다른 문제                                   │
│                                                                 │
│  3. 컨텍스트를 제공하지 않으면 AI는 추측한다                     │
│     ─────────────────────────────────────────                   │
│     디자인 시스템, 상태 요구사항, 접근성 기준을                  │
│     명시적으로 전달해야 함                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.9 다음 챕터 미리보기

**챕터 12: AI에게 디자인 시스템 전달하기**에서는 MCP 서버와 Cursor Rules를 활용하여 AI가 프로젝트의 디자인 시스템을 이해하고 일관된 UI를 생성하도록 하는 방법을 다룹니다. shadcn/ui, Tailwind CSS와의 통합 설정도 포함됩니다.

---

## 챕터 12: AI에게 디자인 시스템 전달하기

> "AI가 내 디자인 시스템을 무시합니다" - 가장 흔한 불만
> 그건 AI의 문제가 아니라, 컨텍스트 전달의 문제입니다.

### 12.1 AI가 디자인 시스템을 무시하는 이유

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI의 디자인 결정 과정                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  사용자 요청: "로그인 폼 만들어줘"                              │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────────────────────┐                   │
│  │  AI가 참조하는 컨텍스트                 │                   │
│  │  ─────────────────────                   │                   │
│  │  1. 현재 열린 파일 (있다면)             │                   │
│  │  2. 대화 히스토리                        │                   │
│  │  3. 일반적인 패턴 (학습 데이터)         │                   │
│  │                                          │                   │
│  │  ❌ 참조하지 않는 것:                    │                   │
│  │  - 당신의 디자인 시스템                  │                   │
│  │  - 프로젝트의 컬러 팔레트               │                   │
│  │  - 기존 컴포넌트 라이브러리             │                   │
│  │  - Tailwind 커스텀 설정                  │                   │
│  └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│  결과: 일반적인 스타일의 "작동하는" 코드                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 문제: AI는 당신의 프로젝트 컨텍스트를 모른다**

### 12.2 컨텍스트 전달의 3가지 레벨

```
┌─────────────────────────────────────────────────────────────────┐
│                   컨텍스트 전달 방법 비교                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  레벨 1: MCP 서버 (가장 강력)                                   │
│  ═══════════════════════════                                    │
│  ✅ 실시간 컨텍스트 제공                                        │
│  ✅ 파일 시스템 접근                                            │
│  ✅ 도구 통합 가능                                              │
│  ⚠️ 설정 복잡도 높음                                            │
│                                                                 │
│  레벨 2: Rules 파일 (.cursorrules, CLAUDE.md)                   │
│  ═══════════════════════════════════════════                    │
│  ✅ 자동으로 매 대화에 포함                                     │
│  ✅ 프로젝트별 커스터마이징                                     │
│  ✅ 버전 관리 가능                                              │
│  ⚠️ 토큰 제한 존재                                              │
│                                                                 │
│  레벨 3: 직접 프롬프트                                          │
│  ═══════════════════                                            │
│  ✅ 즉시 적용 가능                                              │
│  ✅ 유연한 조정                                                 │
│  ⚠️ 매번 반복 필요                                              │
│  ⚠️ 일관성 유지 어려움                                          │
│                                                                 │
│  ─────────────────────────────────────────                      │
│  추천: 레벨 2 기반 + 레벨 1 점진적 도입                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.3 MCP 서버 활용하기

#### 12.3.1 MCP(Model Context Protocol)란?

```
┌─────────────────────────────────────────────────────────────────┐
│                      MCP 아키텍처                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌──────────────┐     ┌────────────────┐   │
│  │   AI IDE    │────▶│  MCP 서버    │────▶│  프로젝트 자원  │   │
│  │  (Cursor,   │     │              │     │  - 파일        │   │
│  │   Claude)   │◀────│  프로토콜     │◀────│  - DB          │   │
│  └─────────────┘     └──────────────┘     │  - API         │   │
│                                           └────────────────┘   │
│                                                                 │
│  MCP가 제공하는 것:                                             │
│  ─────────────────                                              │
│  1. Tools: AI가 호출할 수 있는 함수                            │
│  2. Resources: AI가 읽을 수 있는 데이터                        │
│  3. Prompts: 미리 정의된 프롬프트 템플릿                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 12.3.2 디자인 시스템용 MCP 서버 예시

```typescript
// mcp-design-system/src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

const server = new McpServer({
  name: 'design-system',
  version: '1.0.0',
});

// 디자인 토큰 읽기 도구
server.tool(
  'get-design-tokens',
  'Get the project design tokens (colors, spacing, typography)',
  {},
  async () => {
    const tokensPath = path.join(process.cwd(), 'src/styles/tokens.css');
    try {
      const content = await fs.readFile(tokensPath, 'utf-8');
      return {
        content: [
          {
            type: 'text',
            text: `Design Tokens:\n\n${content}`,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: 'text',
            text: 'Design tokens file not found',
          },
        ],
        isError: true,
      };
    }
  }
);

// 컴포넌트 목록 조회 도구
server.tool(
  'list-components',
  'List all available UI components with their props',
  {
    category: z.string().optional().describe('Filter by category (ui, layout, form)'),
  },
  async ({ category }) => {
    const componentsDir = path.join(process.cwd(), 'src/components');
    const categories = category ? [category] : ['ui', 'layout', 'form'];

    const components: string[] = [];

    for (const cat of categories) {
      const catPath = path.join(componentsDir, cat);
      try {
        const files = await fs.readdir(catPath);
        const tsxFiles = files.filter((f) => f.endsWith('.tsx'));
        components.push(`\n## ${cat}/\n${tsxFiles.map((f) => `- ${f}`).join('\n')}`);
      } catch {
        // Category doesn't exist
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Available Components:${components.join('\n')}`,
        },
      ],
    };
  }
);

// 컴포넌트 사용법 조회 도구
server.tool(
  'get-component-usage',
  'Get usage example and props for a specific component',
  {
    name: z.string().describe('Component name (e.g., Button, Card)'),
  },
  async ({ name }) => {
    // 컴포넌트 파일 찾기
    const possiblePaths = [
      `src/components/ui/${name}.tsx`,
      `src/components/ui/${name.toLowerCase()}.tsx`,
      `src/components/layout/${name}.tsx`,
      `src/components/form/${name}.tsx`,
    ];

    for (const p of possiblePaths) {
      try {
        const content = await fs.readFile(path.join(process.cwd(), p), 'utf-8');

        // Props 인터페이스 추출
        const propsMatch = content.match(/interface \w+Props[^{]*\{[\s\S]*?\}/);
        const props = propsMatch ? propsMatch[0] : 'Props not found';

        // JSDoc 추출
        const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
        const jsdoc = jsdocMatch ? jsdocMatch[0] : '';

        return {
          content: [
            {
              type: 'text',
              text: `# ${name} Component\n\nPath: ${p}\n\n## Documentation\n${jsdoc}\n\n## Props\n\`\`\`typescript\n${props}\n\`\`\``,
            },
          ],
        };
      } catch {
        // File doesn't exist, try next path
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Component "${name}" not found`,
        },
      ],
      isError: true,
    };
  }
);

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

#### 12.3.3 MCP 서버 설정 (Claude Code)

```json
// .mcp.json (프로젝트 루트)
{
  "mcpServers": {
    "design-system": {
      "command": "npx",
      "args": ["tsx", "mcp-design-system/src/index.ts"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

#### 12.3.4 shadcn/ui 전용 MCP 서버

```typescript
// mcp-shadcn/src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

const server = new McpServer({
  name: 'shadcn-ui',
  version: '1.0.0',
});

// shadcn/ui 컴포넌트 설정 확인
server.tool('get-shadcn-config', 'Get shadcn/ui configuration for this project', {}, async () => {
  try {
    const configPath = path.join(process.cwd(), 'components.json');
    const config = await fs.readFile(configPath, 'utf-8');
    return {
      content: [
        {
          type: 'text',
          text: `shadcn/ui Configuration:\n\n\`\`\`json\n${config}\n\`\`\``,
        },
      ],
    };
  } catch {
    return {
      content: [
        {
          type: 'text',
          text: 'shadcn/ui not configured in this project',
        },
      ],
      isError: true,
    };
  }
});

// 설치된 shadcn 컴포넌트 목록
server.tool('list-shadcn-components', 'List all installed shadcn/ui components', {}, async () => {
  try {
    const uiDir = path.join(process.cwd(), 'src/components/ui');
    const files = await fs.readdir(uiDir);
    const components = files.filter((f) => f.endsWith('.tsx')).map((f) => f.replace('.tsx', ''));

    return {
      content: [
        {
          type: 'text',
          text: `Installed shadcn/ui components:\n\n${components.map((c) => `- ${c}`).join('\n')}\n\nTo use: import { ComponentName } from "@/components/ui/component-name"`,
        },
      ],
    };
  } catch {
    return {
      content: [
        {
          type: 'text',
          text: 'No shadcn/ui components directory found',
        },
      ],
      isError: true,
    };
  }
});

// 컴포넌트 변형 조회
server.tool(
  'get-component-variants',
  'Get all variants for a shadcn/ui component',
  {
    component: z.string().describe('Component name (e.g., button, badge)'),
  },
  async ({ component }) => {
    try {
      const filePath = path.join(process.cwd(), `src/components/ui/${component}.tsx`);
      const content = await fs.readFile(filePath, 'utf-8');

      // cva variants 추출
      const cvaMatch = content.match(
        /cva\([^)]+,\s*\{[\s\S]*?variants:\s*\{([\s\S]*?)\}\s*,?\s*defaultVariants/
      );

      if (cvaMatch) {
        return {
          content: [
            {
              type: 'text',
              text: `Variants for ${component}:\n\n\`\`\`typescript\nvariants: {${cvaMatch[1]}}\n\`\`\``,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `No variants found for ${component}`,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: 'text',
            text: `Component "${component}" not found`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### 12.4 .cursorrules 완벽 가이드

#### 12.4.1 효과적인 .cursorrules 구조

````markdown
<!-- .cursorrules -->

# Project: StoryVerse

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- UI: shadcn/ui + Tailwind CSS v4
- State: Zustand + TanStack Query

## Design System

### Colors (use CSS variables)

- Primary: `var(--primary)` - Brand blue
- Secondary: `var(--secondary)` - Supporting gray
- Destructive: `var(--destructive)` - Error red
- Muted: `var(--muted)` - Disabled/placeholder

### Spacing Scale

- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

### Typography

- Heading: font-bold text-foreground
- Body: text-base text-foreground
- Caption: text-sm text-muted-foreground

## Component Usage Rules

### Always use existing components:

- Button: `import { Button } from "@/components/ui/button"`
  - Variants: default, destructive, outline, secondary, ghost, link
  - Sizes: default, sm, lg, icon

- Card: `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"`

- Input: `import { Input } from "@/components/ui/input"`
  - Always wrap with Label for accessibility

- Form: Use react-hook-form + zod for all forms
  ```tsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  ```
````

### Never do:

- ❌ Inline styles
- ❌ Custom color values (use CSS variables)
- ❌ Direct DOM manipulation
- ❌ Creating new components without checking existing ones first

## File Patterns

### Component files:

```tsx
// src/components/[category]/ComponentName.tsx
'use client' // Only if needed

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ ...props }: ComponentNameProps) {
  return (/* JSX */)
}
```

### API Routes:

```tsx
// src/app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return apiSuccess(data);
  } catch (error) {
    return apiError('Error message', 500);
  }
}
```

## Common Patterns

### Loading States:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Use skeletons that match the content shape
<Skeleton className="h-4 w-[200px]" />;
```

### Error States:

```tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>{error.message}</AlertDescription>
</Alert>;
```

### Empty States:

```tsx
<div className="flex flex-col items-center justify-center p-8 text-center">
  <IconComponent className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="font-semibold">No items found</h3>
  <p className="text-sm text-muted-foreground">Description of what to do next</p>
</div>
```

````

#### 12.4.2 상황별 .cursorrules 섹션

```markdown
<!-- 폼 집중 프로젝트용 추가 섹션 -->

## Form Patterns

### Standard Form Structure:
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields */}
        <Button type="submit" className="w-full">
          로그인
        </Button>
      </form>
    </Form>
  )
}
````

### Form Validation Messages (Korean):

- Required: "필수 항목입니다"
- Email: "유효한 이메일을 입력하세요"
- Min length: "{n}자 이상 입력하세요"
- Max length: "{n}자 이하로 입력하세요"
- Pattern: "올바른 형식으로 입력하세요"

````

### 12.5 CLAUDE.md 디자인 시스템 섹션

```markdown
<!-- CLAUDE.md에 추가할 디자인 시스템 섹션 -->

## 디자인 시스템

### UI 컴포넌트 사용 규칙

이 프로젝트는 shadcn/ui를 사용합니다. 새로운 UI를 만들 때:

1. **먼저 기존 컴포넌트 확인**: `src/components/ui/` 디렉토리
2. **shadcn/ui 공식 문서 참조**: https://ui.shadcn.com
3. **커스텀 컴포넌트는 최후의 수단**

### 설치된 컴포넌트 목록
- Button (variants: default, destructive, outline, secondary, ghost, link)
- Card (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Input, Textarea, Select, Checkbox, Radio
- Dialog, AlertDialog, Sheet, Drawer
- Tabs, Accordion
- Badge, Avatar
- Skeleton, Spinner
- Toast (sonner)

### 스타일링 규칙

```tsx
// ✅ 올바른 방법
<div className="flex items-center gap-4 p-4">
  <Button variant="outline" size="sm">
    Click me
  </Button>
</div>

// ❌ 잘못된 방법
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
  <button className="border rounded px-3 py-1">
    Click me
  </button>
</div>
````

### 반응형 브레이크포인트

- Mobile: 기본 (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `md:` (≥ 768px)
- Large: `lg:` (≥ 1024px)
- XL: `xl:` (≥ 1280px)

### 다크 모드

- 모든 색상은 CSS 변수 사용
- `dark:` prefix로 다크 모드 스타일 추가
- 이미지는 `dark:invert` 또는 별도 에셋 사용

````

### 12.6 디자인 토큰 문서화 (Tailwind CSS v4)

#### 12.6.1 CSS 기반 설계 토큰

```css
/* src/styles/tokens.css */
@import "tailwindcss";

@theme {
  /* ═══════════════════════════════════════════════════════
     브랜드 컬러
     ═══════════════════════════════════════════════════════ */

  /* Primary - 메인 브랜드 컬러 */
  --color-primary-50: oklch(0.97 0.02 250);
  --color-primary-100: oklch(0.93 0.04 250);
  --color-primary-200: oklch(0.86 0.08 250);
  --color-primary-300: oklch(0.76 0.12 250);
  --color-primary-400: oklch(0.64 0.16 250);
  --color-primary-500: oklch(0.55 0.18 250);  /* 기본값 */
  --color-primary-600: oklch(0.47 0.18 250);
  --color-primary-700: oklch(0.40 0.16 250);
  --color-primary-800: oklch(0.34 0.12 250);
  --color-primary-900: oklch(0.28 0.08 250);
  --color-primary-950: oklch(0.20 0.06 250);

  /* Secondary - 보조 컬러 */
  --color-secondary-50: oklch(0.98 0.01 260);
  --color-secondary-500: oklch(0.60 0.02 260);
  --color-secondary-900: oklch(0.25 0.02 260);

  /* Success, Warning, Error */
  --color-success: oklch(0.65 0.15 145);
  --color-warning: oklch(0.75 0.15 70);
  --color-error: oklch(0.55 0.20 25);

  /* ═══════════════════════════════════════════════════════
     시맨틱 컬러 (라이트/다크 자동 대응)
     ═══════════════════════════════════════════════════════ */

  --color-background: var(--color-white);
  --color-foreground: var(--color-gray-950);
  --color-muted: var(--color-gray-100);
  --color-muted-foreground: var(--color-gray-500);
  --color-border: var(--color-gray-200);

  /* ═══════════════════════════════════════════════════════
     스페이싱 스케일
     ═══════════════════════════════════════════════════════ */

  --spacing-page: 1.5rem;          /* 페이지 좌우 패딩 */
  --spacing-section: 3rem;         /* 섹션 간 간격 */
  --spacing-card: 1.5rem;          /* 카드 내부 패딩 */
  --spacing-input: 0.75rem;        /* 입력 필드 패딩 */

  /* ═══════════════════════════════════════════════════════
     타이포그래피
     ═══════════════════════════════════════════════════════ */

  --font-sans: "Pretendard", "Apple SD Gothic Neo", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --text-display: 3rem;            /* 48px - 히어로 */
  --text-h1: 2.25rem;              /* 36px */
  --text-h2: 1.875rem;             /* 30px */
  --text-h3: 1.5rem;               /* 24px */
  --text-h4: 1.25rem;              /* 20px */
  --text-body: 1rem;               /* 16px */
  --text-small: 0.875rem;          /* 14px */
  --text-caption: 0.75rem;         /* 12px */

  /* ═══════════════════════════════════════════════════════
     반경 (Border Radius)
     ═══════════════════════════════════════════════════════ */

  --radius-sm: 0.25rem;            /* 4px - 작은 요소 */
  --radius-md: 0.5rem;             /* 8px - 기본 */
  --radius-lg: 0.75rem;            /* 12px - 카드 */
  --radius-xl: 1rem;               /* 16px - 모달 */
  --radius-full: 9999px;           /* 완전한 원 */

  /* ═══════════════════════════════════════════════════════
     그림자
     ═══════════════════════════════════════════════════════ */

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* ═══════════════════════════════════════════════════════
     트랜지션
     ═══════════════════════════════════════════════════════ */

  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;

  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 다크 모드 오버라이드 */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: var(--color-gray-950);
    --color-foreground: var(--color-gray-50);
    --color-muted: var(--color-gray-900);
    --color-muted-foreground: var(--color-gray-400);
    --color-border: var(--color-gray-800);
  }
}
````

#### 12.6.2 토큰 사용 예시

```tsx
// 토큰을 활용한 컴포넌트 작성
export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div
      className="
      bg-background
      border border-border
      rounded-lg
      p-card
      shadow-sm
      hover:shadow-md
      transition-shadow duration-normal ease-out
    "
    >
      <div className="text-primary-500 mb-4">{icon}</div>
      <h3 className="text-h4 font-bold text-foreground mb-2">{title}</h3>
      <p className="text-body text-muted-foreground">{description}</p>
    </div>
  );
}
```

### 12.7 컴포넌트 문서화 with JSDoc

#### 12.7.1 AI가 이해하기 쉬운 컴포넌트 문서화

```tsx
// src/components/ui/status-badge.tsx

/**
 * StatusBadge - 상태를 시각적으로 표시하는 뱃지 컴포넌트
 *
 * @description
 * 소설의 연재 상태, 사용자 등급 등 다양한 상태를 표시할 때 사용합니다.
 * 각 상태별로 미리 정의된 색상과 스타일이 적용됩니다.
 *
 * @example
 * // 기본 사용
 * <StatusBadge status="ongoing" />
 *
 * @example
 * // 크기 조절
 * <StatusBadge status="completed" size="lg" />
 *
 * @example
 * // 커스텀 라벨
 * <StatusBadge status="hiatus" label="휴재 중" />
 *
 * @see Button - 클릭 가능한 액션에는 Button 사용
 * @see Badge - 범용 뱃지는 Badge 컴포넌트 사용
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * 상태 타입 정의
 * - ongoing: 연재 중 (녹색)
 * - completed: 완결 (파란색)
 * - hiatus: 휴재 (노란색)
 * - dropped: 중단 (빨간색)
 */
type Status = 'ongoing' | 'completed' | 'hiatus' | 'dropped';

const statusBadgeVariants = cva('inline-flex items-center rounded-full font-medium', {
  variants: {
    status: {
      ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      hiatus: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      dropped: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/** 상태별 기본 라벨 */
const defaultLabels: Record<Status, string> = {
  ongoing: '연재 중',
  completed: '완결',
  hiatus: '휴재',
  dropped: '중단',
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  /** 상태 값 (필수) */
  status: Status;
  /** 커스텀 라벨 (선택, 미지정 시 기본 라벨 사용) */
  label?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function StatusBadge({ status, size, label, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status, size }), className)}>
      {label ?? defaultLabels[status]}
    </span>
  );
}
```

#### 12.7.2 복합 컴포넌트 문서화

```tsx
// src/components/ui/novel-card.tsx

/**
 * NovelCard - 소설 정보를 카드 형태로 표시하는 컴포넌트
 *
 * @description
 * 소설 목록, 검색 결과, 추천 섹션 등에서 소설 정보를 표시할 때 사용합니다.
 * 커버 이미지, 제목, 작가, 장르, 통계 정보를 포함합니다.
 *
 * ## 사용 컨텍스트
 * - 홈페이지 추천 소설
 * - 장르별 소설 목록
 * - 검색 결과
 * - 작가 페이지 작품 목록
 *
 * ## 내부 사용 컴포넌트
 * - Card (shadcn/ui)
 * - StatusBadge (@/components/ui/status-badge)
 * - Avatar (@/components/ui/avatar)
 *
 * @example
 * // 기본 사용
 * <NovelCard novel={novelData} />
 *
 * @example
 * // 컴팩트 모드 (목록용)
 * <NovelCard novel={novelData} variant="compact" />
 *
 * @example
 * // 클릭 핸들러와 함께
 * <NovelCard
 *   novel={novelData}
 *   onClick={(id) => router.push(`/novel/${id}`)}
 * />
 *
 * @example
 * // 그리드 레이아웃에서
 * <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 *   {novels.map(novel => (
 *     <NovelCard key={novel.id} novel={novel} />
 *   ))}
 * </div>
 */

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Eye, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Novel } from '@/types/novel';

interface NovelCardProps {
  /** 소설 데이터 객체 */
  novel: Novel;
  /** 카드 스타일 변형 */
  variant?: 'default' | 'compact' | 'featured';
  /** 클릭 이벤트 핸들러 */
  onClick?: (novelId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function NovelCard({ novel, variant = 'default', onClick, className }: NovelCardProps) {
  // ... 구현
}
```

### 12.8 컴포넌트 사용 매트릭스

AI에게 "언제 어떤 컴포넌트를 쓸지" 명확히 전달:

````markdown
<!-- .cursorrules 또는 CLAUDE.md에 추가 -->

## 컴포넌트 선택 가이드

| 상황        | 사용할 컴포넌트                        | 예시             |
| ----------- | -------------------------------------- | ---------------- |
| 주요 액션   | `<Button>`                             | 저장, 제출, 확인 |
| 보조 액션   | `<Button variant="outline">`           | 취소, 닫기       |
| 위험한 액션 | `<Button variant="destructive">`       | 삭제, 탈퇴       |
| 텍스트 링크 | `<Button variant="link">`              | 더보기, 자세히   |
| 아이콘만    | `<Button variant="ghost" size="icon">` | 설정, 메뉴       |
| 짧은 입력   | `<Input>`                              | 이름, 이메일     |
| 긴 입력     | `<Textarea>`                           | 소개, 설명       |
| 선택 (단일) | `<Select>`                             | 장르, 정렬       |
| 선택 (다중) | `<Checkbox>` 그룹                      | 태그, 카테고리   |
| On/Off      | `<Switch>`                             | 알림, 공개 설정  |
| 정보 표시   | `<Card>`                               | 프로필, 통계     |
| 상태 표시   | `<Badge>` or `<StatusBadge>`           | 연재중, VIP      |
| 알림 메시지 | `<Toast>` (sonner)                     | 성공, 에러       |
| 확인 요청   | `<AlertDialog>`                        | 삭제 확인        |
| 사이드 패널 | `<Sheet>`                              | 모바일 메뉴      |
| 상세 정보   | `<Dialog>`                             | 상세 보기        |
| 로딩        | `<Skeleton>`                           | 컨텐츠 로딩      |
| 빈 상태     | 커스텀 EmptyState                      | 검색 결과 없음   |

### 컴포넌트 조합 패턴

```tsx
// 폼 제출 버튼
<Button type="submit" disabled={isLoading}>
  {isLoading ? <Spinner className="mr-2" /> : null}
  저장하기
</Button>

// 목록 아이템 액션
<div className="flex items-center gap-2">
  <Button variant="ghost" size="icon">
    <Edit className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="icon">
    <Trash className="h-4 w-4" />
  </Button>
</div>

// 통계 카드
<Card>
  <CardHeader>
    <CardTitle>총 조회수</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">12,345</div>
    <p className="text-sm text-muted-foreground">
      지난 주 대비 +12%
    </p>
  </CardContent>
</Card>
```
````

````

### 12.9 직접 프롬프트 컨텍스트 템플릿

Rules 파일이 없거나 빠른 작업 시 사용:

```markdown
## UI 생성 프롬프트 템플릿

### 템플릿 1: 새 컴포넌트 요청
````

다음 컴포넌트를 만들어주세요:

**컴포넌트 정보:**

- 이름: [컴포넌트명]
- 용도: [사용 목적]
- 위치: src/components/[category]/

**디자인 시스템:**

- UI 라이브러리: shadcn/ui 사용
- 스타일링: Tailwind CSS (인라인 스타일 금지)
- 색상: CSS 변수만 사용 (var(--primary) 등)

**필요한 기능:**

- [기능 1]
- [기능 2]

**참고 컴포넌트:**

- 프로젝트 내 유사 컴포넌트: [경로]

**반응형:**

- 모바일: [설명]
- 데스크톱: [설명]

```

### 템플릿 2: 기존 컴포넌트 수정
```

[컴포넌트 경로]를 다음과 같이 수정해주세요:

**현재 문제:**

- [문제 설명]

**원하는 변경:**

- [변경 1]
- [변경 2]

**유지해야 할 것:**

- 기존 Props 인터페이스
- 현재 사용 중인 CSS 변수
- shadcn/ui 컴포넌트 사용

**참고:**

- 디자인 토큰: src/styles/tokens.css

```

### 템플릿 3: 페이지 레이아웃 요청
```

다음 페이지를 만들어주세요:

**페이지 정보:**

- 경로: /[route]
- 용도: [설명]

**레이아웃 구조:**

```
┌─────────────────────────────┐
│ Header (기존 사용)          │
├─────────────────────────────┤
│                             │
│ [메인 컨텐츠 영역]          │
│                             │
├─────────────────────────────┤
│ Footer (기존 사용)          │
└─────────────────────────────┘
```

**사용할 컴포넌트:**

- Header: @/components/layout/Header
- Footer: @/components/layout/Footer
- Card: @/components/ui/card
- Button: @/components/ui/button

**데이터 요구사항:**

- [API 엔드포인트]
- [필요한 데이터]

**상태 처리:**

- 로딩: Skeleton 사용
- 에러: Alert 컴포넌트 사용
- 빈 상태: EmptyState 패턴 사용

```

```

### 12.10 Before/After: 디자인 시스템 컨텍스트 효과

#### Before (컨텍스트 없이)

**프롬프트:** "프로필 카드 만들어줘"

```tsx
// AI가 생성한 코드 (컨텍스트 없음)
function ProfileCard({ user }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
      }}
    >
      <img
        src={user.avatar}
        alt="Profile"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
        }}
      />
      <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name}</h2>
      <p style={{ color: '#666' }}>{user.bio}</p>
      <button
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
        }}
      >
        Follow
      </button>
    </div>
  );
}
```

**문제점:**

- 인라인 스타일 사용
- 하드코딩된 색상
- 프로젝트 컴포넌트 미사용
- 접근성 미고려

#### After (디자인 시스템 컨텍스트 제공)

**프롬프트 + .cursorrules:**

```tsx
// AI가 생성한 코드 (컨텍스트 있음)
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ProfileCardProps {
  user: {
    name: string;
    avatar?: string;
    bio?: string;
    isFollowing?: boolean;
  };
  onFollow?: () => void;
}

export function ProfileCard({ user, onFollow }: ProfileCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={user.avatar} alt={`${user.name} 프로필`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>

          {user.bio && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
          )}

          <Button
            onClick={onFollow}
            variant={user.isFollowing ? 'outline' : 'default'}
            className="mt-4 w-full"
          >
            {user.isFollowing ? '팔로잉' : '팔로우'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**개선된 점:**

- ✅ shadcn/ui 컴포넌트 사용
- ✅ CSS 변수 기반 색상
- ✅ TypeScript Props 정의
- ✅ 접근성 (alt 텍스트)
- ✅ 한국어 UI 텍스트
- ✅ 반응형 고려

### 12.11 디자인 시스템 전달 체크리스트

```
┌─────────────────────────────────────────────────────────────────┐
│               디자인 시스템 전달 체크리스트                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  레벨 1: 기본 설정 (필수)                                       │
│  ═══════════════════════                                        │
│  □ .cursorrules 또는 CLAUDE.md에 Tech Stack 명시               │
│  □ UI 라이브러리 명시 (shadcn/ui, MUI, etc.)                   │
│  □ 스타일링 방식 명시 (Tailwind, CSS Modules, etc.)            │
│  □ "하지 말아야 할 것" 목록 작성                               │
│                                                                 │
│  레벨 2: 컴포넌트 가이드 (권장)                                 │
│  ═══════════════════════════                                    │
│  □ 설치된 UI 컴포넌트 목록                                     │
│  □ 컴포넌트별 import 경로                                      │
│  □ 주요 컴포넌트 variants 문서화                               │
│  □ 컴포넌트 선택 가이드 (상황별)                               │
│                                                                 │
│  레벨 3: 디자인 토큰 (심화)                                     │
│  ═══════════════════════                                        │
│  □ 색상 시스템 (CSS 변수)                                      │
│  □ 스페이싱 스케일                                             │
│  □ 타이포그래피 스케일                                         │
│  □ 반응형 브레이크포인트                                       │
│                                                                 │
│  레벨 4: 패턴 라이브러리 (고급)                                 │
│  ═══════════════════════════                                    │
│  □ 로딩/에러/빈 상태 패턴                                      │
│  □ 폼 패턴                                                     │
│  □ 레이아웃 패턴                                               │
│  □ 컴포넌트 조합 예시                                          │
│                                                                 │
│  레벨 5: MCP 서버 (선택)                                        │
│  ═══════════════════════                                        │
│  □ 디자인 토큰 조회 도구                                       │
│  □ 컴포넌트 목록 조회 도구                                     │
│  □ 사용 예시 조회 도구                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.12 다음 챕터 미리보기

**챕터 13: 반응형 디자인과 AI 협업**에서는 모바일-퍼스트 접근법, 브레이크포인트별 레이아웃 지시, 그리고 AI가 생성한 UI가 모든 화면 크기에서 잘 작동하도록 하는 테스트 전략을 다룹니다.

---

## 챕터 13: 반응형 디자인과 AI 협업

### 13.1 AI는 왜 데스크톱 우선으로 코드를 생성하는가?

AI 코딩 도구는 기본적으로 **데스크톱 우선(Desktop-first)** 코드를 생성하는 경향이 있습니다. 이는 학습 데이터의 특성과 프롬프트의 모호함 때문입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              AI가 데스크톱 우선으로 생성하는 이유                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 학습 데이터 편향                                             │
│  ─────────────────────                                          │
│  • 대부분의 튜토리얼과 예제가 데스크톱 기준                       │
│  • 반응형은 "추가 작업"으로 취급됨                               │
│  • 모바일 스타일은 미디어 쿼리 안에 "숨겨져" 있음                │
│                                                                 │
│  2. 프롬프트의 암묵적 가정                                       │
│  ──────────────────────────                                     │
│  "히어로 섹션 만들어줘"                                          │
│  → AI: "넓은 화면 기준으로 만들면 되겠지?"                       │
│                                                                 │
│  3. 시각적 복잡성                                                │
│  ──────────────────                                             │
│  • 데스크톱 레이아웃이 더 "완성도 높아" 보임                     │
│  • 다중 컬럼, 사이드바 등 시각적으로 인상적                      │
│  • AI는 "인상적인" 결과를 선호하는 경향                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**데스크톱 우선 코드의 문제:**

```tsx
// ❌ AI가 흔히 생성하는 데스크톱 우선 코드
const Hero = () => (
  <div className="flex items-center justify-between px-20 py-16">
    <div className="w-1/2">
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="text-xl mt-4">Some description here</p>
    </div>
    <div className="w-1/2">
      <img src="/hero.jpg" className="w-full" />
    </div>
  </div>
);

// 모바일에서의 문제:
// • px-20: 작은 화면에서 콘텐츠가 좁아짐
// • w-1/2: 두 컬럼이 너무 좁아서 읽기 어려움
// • text-5xl: 작은 화면에서 너무 큼
// • flex 방향이 항상 가로 → 세로 스크롤 필요
```

### 13.2 Mobile-First가 중요한 이유

```
┌─────────────────────────────────────────────────────────────────┐
│                 Mobile-First 접근법의 장점                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  통계적 현실:                                                    │
│  ─────────────                                                  │
│  • 전 세계 웹 트래픽의 ~60%가 모바일                             │
│  • Google은 Mobile-First 인덱싱 사용                            │
│  • 모바일 성능이 SEO에 직접 영향                                 │
│                                                                 │
│  개발 효율성:                                                    │
│  ─────────────                                                  │
│  • 작은 화면 → 큰 화면 확장이 더 쉬움                            │
│  • 핵심 콘텐츠에 집중하게 됨                                     │
│  • 불필요한 요소 자연스럽게 제거                                 │
│                                                                 │
│  CSS 코드량:                                                     │
│  ────────────                                                   │
│  • Mobile-First: 기본 스타일 + 확장                             │
│  • Desktop-First: 기본 스타일 + 축소 + 재정의                   │
│  → Mobile-First가 더 적은 CSS, 더 나은 성능                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 13.3 AI에게 Mobile-First 강제하는 프롬프트

**기본 지시문 (Rules 파일에 추가):**

````markdown
## 반응형 디자인 규칙

### 필수: Mobile-First 접근법

모든 스타일은 모바일 기준으로 먼저 작성하고,
큰 화면으로 확장합니다.

```tsx
// ✅ 올바른 순서 (Mobile-First)
className="
  w-full          // 모바일: 전체 너비
  sm:w-1/2        // 태블릿: 절반
  lg:w-1/3        // 데스크톱: 1/3
"

// ❌ 잘못된 순서 (Desktop-First)
className="
  w-1/3           // 데스크톱 기준
  md:w-1/2        // 태블릿에서 축소?
  sm:w-full       // 모바일에서 확장?
"
```
````

### 브레이크포인트 규칙

- 기본(default): 모바일 (< 640px)
- sm: 640px 이상
- md: 768px 이상
- lg: 1024px 이상
- xl: 1280px 이상

### 클래스 작성 순서

항상 이 순서로 작성: base → sm → md → lg → xl

````

**구체적인 컴포넌트 요청 프롬프트:**

```markdown
다음 규칙을 따라 히어로 섹션을 만들어줘:

## 레이아웃 요구사항
- 모바일 (기본):
  • 단일 컬럼, 세로 스택
  • 이미지가 텍스트 아래
  • 패딩: 16px (p-4)
  • 제목: text-3xl

- 태블릿 (md:):
  • 2컬럼 레이아웃
  • 텍스트와 이미지 나란히
  • 패딩: 24px (p-6)
  • 제목: text-4xl

- 데스크톱 (lg:):
  • 더 넓은 여백
  • 패딩: 32px (p-8)
  • 제목: text-5xl
  • 최대 너비 제한 (max-w-7xl mx-auto)

## 필수 사항
- Mobile-First로 작성 (기본 스타일이 모바일)
- Tailwind 브레이크포인트 사용
- 이미지는 항상 반응형 (w-full)
````

### 13.4 반응형 레이아웃 패턴 라이브러리

AI에게 제공할 **검증된 반응형 패턴**들:

```tsx
// ═══════════════════════════════════════════════════════════════
// 패턴 1: 스택 → 그리드
// ═══════════════════════════════════════════════════════════════

// 모바일: 세로 스택 → 태블릿+: 2컬럼 그리드
const StackToGrid = () => (
  <div
    className="
    flex flex-col gap-4
    md:grid md:grid-cols-2 md:gap-6
    lg:grid-cols-3 lg:gap-8
  "
  >
    {items.map((item) => (
      <Card key={item.id} {...item} />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 패턴 2: 히어로 섹션 (이미지 + 텍스트)
// ═══════════════════════════════════════════════════════════════

const HeroSection = () => (
  <section
    className="
    px-4 py-8
    md:px-6 md:py-12
    lg:px-8 lg:py-16
  "
  >
    <div
      className="
      flex flex-col gap-6
      lg:flex-row lg:items-center lg:gap-12
      max-w-7xl mx-auto
    "
    >
      {/* 텍스트 영역 */}
      <div className="lg:w-1/2">
        <h1
          className="
          text-3xl font-bold
          md:text-4xl
          lg:text-5xl
        "
        >
          제목
        </h1>
        <p
          className="
          mt-4 text-muted-foreground
          md:text-lg
          lg:text-xl
        "
        >
          설명 텍스트
        </p>
      </div>

      {/* 이미지 영역 */}
      <div className="lg:w-1/2">
        <img src="/hero.jpg" alt="히어로 이미지" className="w-full rounded-lg" />
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// 패턴 3: 사이드바 레이아웃
// ═══════════════════════════════════════════════════════════════

const SidebarLayout = () => (
  <div
    className="
    flex flex-col
    lg:flex-row
    min-h-screen
  "
  >
    {/* 사이드바: 모바일에서는 상단, 데스크톱에서는 좌측 */}
    <aside
      className="
      w-full p-4 border-b
      lg:w-64 lg:border-b-0 lg:border-r lg:min-h-screen
    "
    >
      <nav>...</nav>
    </aside>

    {/* 메인 콘텐츠 */}
    <main
      className="
      flex-1 p-4
      md:p-6
      lg:p-8
    "
    >
      {children}
    </main>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 패턴 4: 카드 그리드 (자동 조절)
// ═══════════════════════════════════════════════════════════════

const AutoGrid = () => (
  <div
    className="
    grid gap-4
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
  "
  >
    {items.map((item) => (
      <Card key={item.id} {...item} />
    ))}
  </div>
);

// 또는 auto-fill 사용 (더 유연함)
const FluidGrid = () => (
  <div
    className="
    grid gap-4
    grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
  "
  >
    {items.map((item) => (
      <Card key={item.id} {...item} />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 패턴 5: 반응형 타이포그래피
// ═══════════════════════════════════════════════════════════════

const ResponsiveTypography = () => (
  <>
    {/* 페이지 제목 */}
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">제목</h1>

    {/* 섹션 제목 */}
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">섹션 제목</h2>

    {/* 본문 */}
    <p className="text-base md:text-lg text-muted-foreground">본문 텍스트</p>
  </>
);
```

### 13.5 브레이크포인트 일관성 유지하기

**프로젝트 전체에서 동일한 브레이크포인트를 사용해야 합니다.**

```
┌─────────────────────────────────────────────────────────────────┐
│                 표준 브레이크포인트 시스템                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tailwind 기본값 (권장):                                         │
│  ──────────────────────                                         │
│                                                                 │
│  │ 모바일 │   sm   │   md   │   lg    │   xl    │   2xl   │    │
│  │<640px │ 640px │ 768px │ 1024px │ 1280px │ 1536px │           │
│  │───────┼───────┼───────┼────────┼────────┼────────│           │
│  │ 📱    │ 📱    │ 💻    │  🖥️   │  🖥️   │  🖥️   │           │
│  │       │ 가로  │ 태블릿│데스크톱│ 와이드 │ 초와이드│           │
│                                                                 │
│  실제 사용 빈도:                                                 │
│  ────────────────                                               │
│  • 기본 (모바일): 매우 높음 ████████████                         │
│  • md (태블릿):   높음     ████████                              │
│  • lg (데스크톱): 높음     ████████                              │
│  • sm, xl, 2xl:  낮음     ████                                  │
│                                                                 │
│  💡 대부분의 경우 기본 + md + lg만으로 충분                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Rules 파일에 추가할 브레이크포인트 규칙:**

```markdown
## 브레이크포인트 사용 규칙

### 허용된 브레이크포인트

- 기본: < 640px (모바일 세로)
- md: 768px+ (태블릿/모바일 가로)
- lg: 1024px+ (데스크톱)

### 제한된 브레이크포인트

다음은 특별한 이유가 있을 때만 사용:

- sm: 640px (거의 사용 안 함)
- xl: 1280px (와이드 데스크톱 전용 기능)
- 2xl: 1536px (거의 사용 안 함)

### 커스텀 브레이크포인트 금지

임의의 값 (예: max-w-[847px]) 사용 금지.
표준 브레이크포인트만 사용하세요.
```

### 13.6 반응형 이미지 처리

**Next.js Image 컴포넌트 패턴:**

```tsx
import Image from 'next/image';

// ═══════════════════════════════════════════════════════════════
// 패턴 1: 전체 너비 반응형 이미지
// ═══════════════════════════════════════════════════════════════

const ResponsiveImage = () => (
  <div className="relative w-full aspect-video">
    <Image
      src="/hero.jpg"
      alt="히어로 이미지"
      fill
      sizes="100vw"
      className="object-cover"
      priority // LCP 이미지에 필수
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 패턴 2: 브레이크포인트별 다른 크기
// ═══════════════════════════════════════════════════════════════

const OptimizedImage = () => (
  <Image
    src="/product.jpg"
    alt="제품 이미지"
    width={800}
    height={600}
    sizes="
      (max-width: 640px) 100vw,
      (max-width: 1024px) 50vw,
      33vw
    "
    className="w-full h-auto"
  />
);

// ═══════════════════════════════════════════════════════════════
// 패턴 3: 아트 디렉션 (브레이크포인트별 다른 이미지)
// ═══════════════════════════════════════════════════════════════

const ArtDirectedImage = () => (
  <picture>
    {/* 데스크톱: 가로형 이미지 */}
    <source media="(min-width: 1024px)" srcSet="/hero-desktop.jpg" />
    {/* 태블릿: 정사각형 이미지 */}
    <source media="(min-width: 768px)" srcSet="/hero-tablet.jpg" />
    {/* 모바일: 세로형 이미지 */}
    <img src="/hero-mobile.jpg" alt="히어로 이미지" className="w-full h-auto" />
  </picture>
);
```

### 13.7 터치 타겟과 모바일 인터랙션

**모바일 사용성의 핵심: 터치 타겟 크기**

```
┌─────────────────────────────────────────────────────────────────┐
│                    터치 타겟 가이드라인                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  최소 크기 권장:                                                 │
│  ────────────────                                               │
│  • Apple HIG: 44x44pt                                           │
│  • Material Design: 48x48dp                                     │
│  • WCAG 2.1: 44x44 CSS px                                       │
│                                                                 │
│  Tailwind 클래스:                                                │
│  ─────────────────                                              │
│  • min-h-11 min-w-11 (44px)                                     │
│  • 또는 h-12 w-12 (48px) - 더 안전                              │
│                                                                 │
│  간격:                                                           │
│  ──────                                                         │
│  • 터치 타겟 사이 최소 8px 간격                                  │
│  • 밀집된 UI에서는 더 넓은 간격 필요                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**모바일 친화적 컴포넌트 패턴:**

```tsx
// ═══════════════════════════════════════════════════════════════
// 아이콘 버튼 - 터치 영역 확보
// ═══════════════════════════════════════════════════════════════

const IconButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="
      min-h-11 min-w-11       /* 최소 44px */
      flex items-center justify-center
      rounded-lg
      hover:bg-accent
      active:scale-95         /* 터치 피드백 */
      transition-transform
    "
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </button>
);

// ═══════════════════════════════════════════════════════════════
// 네비게이션 링크 - 넓은 터치 영역
// ═══════════════════════════════════════════════════════════════

const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="
      block                   /* 전체 영역 클릭 가능 */
      px-4 py-3              /* 충분한 패딩 */
      min-h-11
      rounded-lg
      hover:bg-accent
      active:bg-accent/80
    "
  >
    {children}
  </Link>
);

// ═══════════════════════════════════════════════════════════════
// 카드 - 전체 클릭 가능
// ═══════════════════════════════════════════════════════════════

const ClickableCard = ({ href, title, description }) => (
  <Link href={href} className="block group">
    <Card
      className="
      transition-colors
      group-hover:bg-accent
      group-active:scale-[0.98]
    "
    >
      <CardContent className="p-4 md:p-6">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </Link>
);
```

### 13.8 반응형 네비게이션 패턴

```tsx
// ═══════════════════════════════════════════════════════════════
// 모바일: 햄버거 메뉴 / 데스크톱: 가로 네비게이션
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: '홈', href: '/' },
  { label: '제품', href: '/products' },
  { label: '가격', href: '/pricing' },
  { label: '문의', href: '/contact' },
];

export function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="font-bold text-xl">
            Logo
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  block px-4 py-3
                  rounded-lg
                  hover:bg-accent
                  transition-colors
                "
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

### 13.9 컨테이너와 최대 너비 전략

```tsx
// ═══════════════════════════════════════════════════════════════
// 표준 컨테이너 패턴
// ═══════════════════════════════════════════════════════════════

// 옵션 1: 고정 최대 너비 + 자동 중앙 정렬
const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">{children}</div>
);

// 옵션 2: 콘텐츠 유형별 다른 너비
const containers = {
  // 블로그/글 읽기: 좁은 너비
  prose: 'max-w-prose mx-auto px-4', // ~65ch

  // 일반 콘텐츠: 중간 너비
  content: 'max-w-5xl mx-auto px-4 md:px-6', // 1024px

  // 대시보드/앱: 넓은 너비
  wide: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8', // 1280px

  // 전체 너비 (히어로 등)
  full: 'w-full px-4 md:px-6 lg:px-8',
};

// ═══════════════════════════════════════════════════════════════
// 페이지 레이아웃 예시
// ═══════════════════════════════════════════════════════════════

const PageLayout = () => (
  <>
    {/* 히어로: 전체 너비 배경, 컨텐츠는 제한 */}
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <h1>히어로 제목</h1>
      </div>
    </section>

    {/* 본문: 읽기 편한 너비 */}
    <article className="max-w-prose mx-auto px-4 py-8">
      <p>본문 내용...</p>
    </article>

    {/* 카드 그리드: 넓은 너비 */}
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{/* 카드들 */}</div>
    </section>
  </>
);
```

### 13.10 반응형 테이블 처리

테이블은 모바일에서 가장 다루기 어려운 요소 중 하나입니다.

```tsx
// ═══════════════════════════════════════════════════════════════
// 패턴 1: 가로 스크롤 (데이터 테이블)
// ═══════════════════════════════════════════════════════════════

const ScrollableTable = () => (
  <div className="overflow-x-auto -mx-4 md:mx-0">
    <div className="inline-block min-w-full align-middle">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left">이름</th>
            <th className="px-4 py-3 text-left">이메일</th>
            <th className="px-4 py-3 text-left">역할</th>
            <th className="px-4 py-3 text-right">가입일</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3 text-right">{user.joinedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 패턴 2: 카드로 변환 (모바일에서)
// ═══════════════════════════════════════════════════════════════

const ResponsiveTable = ({ users }) => (
  <>
    {/* 데스크톱: 테이블 */}
    <table className="hidden md:table w-full">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>

    {/* 모바일: 카드 리스트 */}
    <div className="md:hidden space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge>{user.role}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">가입: {user.joinedAt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);
```

### 13.11 AI 프롬프트: 반응형 컴포넌트 요청 템플릿

```markdown
## 반응형 컴포넌트 요청 템플릿

다음 요구사항에 맞는 [컴포넌트명]을 만들어줘:

### 레이아웃 명세

**모바일 (기본, < 768px):**

- 레이아웃: [단일 컬럼 / 세로 스택]
- 패딩: [p-4]
- 폰트 크기: [제목 text-2xl, 본문 text-base]
- 특이사항: [예: 이미지가 텍스트 위에]

**태블릿 (md:768px+):**

- 레이아웃: [2컬럼 / 그리드]
- 패딩: [p-6]
- 폰트 크기: [제목 text-3xl]
- 특이사항: [예: 사이드바 표시]

**데스크톱 (lg:1024px+):**

- 레이아웃: [3컬럼 / 사이드바 + 콘텐츠]
- 패딩: [p-8]
- 최대 너비: [max-w-7xl mx-auto]
- 폰트 크기: [제목 text-4xl]

### 필수 요구사항

- [ ] Mobile-First 방식으로 작성
- [ ] 터치 타겟 최소 44px
- [ ] 이미지는 반응형 (w-full 또는 fill)
- [ ] 가로 스크롤 없어야 함
- [ ] Tailwind 표준 브레이크포인트만 사용
```

### 13.12 반응형 디자인 체크리스트

```
□ Mobile-First 작성 확인
  - 기본 스타일이 모바일용인가?
  - 브레이크포인트가 작은 것 → 큰 것 순서인가?

□ 브레이크포인트 일관성
  - 프로젝트 전체에서 동일한 브레이크포인트 사용?
  - 커스텀 브레이크포인트 사용하지 않았는가?

□ 터치 인터랙션
  - 버튼/링크가 최소 44x44px인가?
  - 터치 타겟 사이 충분한 간격이 있는가?
  - 호버 상태 외에 active 상태도 있는가?

□ 이미지 반응형
  - 이미지가 컨테이너를 넘치지 않는가?
  - Next.js Image에 sizes 속성이 있는가?
  - LCP 이미지에 priority 속성이 있는가?

□ 레이아웃 검증
  - 모바일에서 가로 스크롤이 없는가?
  - 텍스트가 읽기 편한 크기인가?
  - 컨테이너 최대 너비가 설정되어 있는가?

□ 실제 디바이스 테스트
  - Chrome DevTools 모바일 뷰 확인
  - 실제 모바일 기기에서 테스트
  - 태블릿 가로/세로 모드 테스트
```

### 13.13 다음 챕터 미리보기

**챕터 14: 상태별 UI 패턴 완벽 구현**에서는 로딩 상태(Skeleton), 에러 상태, 빈 상태(Empty State), 성공 피드백 등 AI가 자주 누락하는 UI 상태들을 체계적으로 구현하는 방법을 다룹니다.

---

## 챕터 14: 상태별 UI 패턴 완벽 구현

### 14.1 AI가 만드는 "Happy Path Only" 문제

AI에게 UI를 요청하면 **성공 케이스만 구현**하고 나머지 상태는 무시합니다. 실제 사용자 경험의 대부분은 "성공"이 아닌 **중간 상태**에서 발생합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              사용자가 실제로 경험하는 UI 상태들                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  사용자 여정 시나리오:                                           │
│  ─────────────────────                                          │
│                                                                 │
│  1. 페이지 접속                                                  │
│     └─→ 🔄 로딩 상태 (1-3초)     ← AI가 자주 누락!              │
│                                                                 │
│  2. 데이터 로드 완료                                             │
│     ├─→ ✅ 성공: 데이터 표시     ← AI가 구현하는 부분            │
│     ├─→ 📭 빈 상태: 데이터 없음  ← AI가 자주 누락!              │
│     └─→ ❌ 에러: 로드 실패       ← AI가 자주 누락!              │
│                                                                 │
│  3. 사용자 액션 (저장, 삭제 등)                                  │
│     ├─→ 🔄 처리 중              ← AI가 자주 누락!               │
│     ├─→ ✅ 성공 피드백           ← AI가 자주 누락!              │
│     └─→ ❌ 실패 피드백           ← AI가 자주 누락!              │
│                                                                 │
│  💡 AI는 ✅ 부분만 구현하고 나머지 80%를 무시함                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 4가지 핵심 상태 정의

모든 데이터 표시 컴포넌트는 **최소 4가지 상태**를 가져야 합니다:

```
┌─────────────────────────────────────────────────────────────────┐
│                    UI의 4가지 핵심 상태                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 로딩 상태 (Loading)                                          │
│  ──────────────────────                                         │
│  • 데이터를 가져오는 중                                          │
│  • Skeleton UI 또는 Spinner 표시                                │
│  • 사용자에게 "작업 중"임을 알림                                 │
│                                                                 │
│  2. 성공 상태 (Success)                                          │
│  ──────────────────────                                         │
│  • 데이터가 정상적으로 로드됨                                    │
│  • 실제 콘텐츠 표시                                              │
│  • 대부분의 AI가 구현하는 부분                                   │
│                                                                 │
│  3. 빈 상태 (Empty)                                              │
│  ──────────────────                                             │
│  • 데이터가 없거나 검색 결과 없음                                │
│  • 안내 메시지 + 다음 액션 제안                                  │
│  • 사용자가 무엇을 해야 하는지 알려줌                            │
│                                                                 │
│  4. 에러 상태 (Error)                                            │
│  ────────────────────                                           │
│  • 데이터 로드 실패                                              │
│  • 에러 메시지 + 재시도 옵션                                     │
│  • 사용자가 다음에 무엇을 할 수 있는지 알려줌                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.3 로딩 상태: Skeleton UI 패턴

**Skeleton UI**는 Spinner보다 더 나은 사용자 경험을 제공합니다. 실제 콘텐츠의 형태를 미리 보여주어 **체감 로딩 시간을 줄입니다.**

```tsx
// ═══════════════════════════════════════════════════════════════
// 기본 Skeleton 컴포넌트 (shadcn/ui 스타일)
// ═══════════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

// ═══════════════════════════════════════════════════════════════
// 카드 Skeleton
// ═══════════════════════════════════════════════════════════════

function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        {/* 이미지 영역 */}
        <Skeleton className="h-48 w-full rounded-lg" />

        {/* 제목 */}
        <Skeleton className="h-6 w-3/4 mt-4" />

        {/* 설명 2줄 */}
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-2/3 mt-2" />

        {/* 버튼 영역 */}
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 리스트 아이템 Skeleton
// ═══════════════════════════════════════════════════════════════

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* 아바타 */}
      <Skeleton className="h-12 w-12 rounded-full" />

      <div className="flex-1 space-y-2">
        {/* 이름 */}
        <Skeleton className="h-4 w-1/3" />
        {/* 설명 */}
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* 액션 버튼 */}
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 테이블 Skeleton
// ═══════════════════════════════════════════════════════════════

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex gap-4 p-4 border-b">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* 행들 */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}
```

**Skeleton vs Spinner 사용 기준:**

```
┌─────────────────────────────────────────────────────────────────┐
│              Skeleton vs Spinner 선택 가이드                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Skeleton 사용 (권장):                                           │
│  ─────────────────────                                          │
│  • 콘텐츠 구조가 예측 가능할 때                                  │
│  • 리스트, 카드, 프로필 등 정형화된 UI                           │
│  • 초기 페이지 로딩                                              │
│  • 로딩 시간이 1초 이상 예상될 때                                │
│                                                                 │
│  Spinner 사용:                                                   │
│  ─────────────                                                  │
│  • 버튼 내부 로딩 표시                                           │
│  • 콘텐츠 구조를 모를 때                                         │
│  • 오버레이 로딩 (모달, 전체 화면)                               │
│  • 매우 짧은 작업 (< 1초)                                        │
│                                                                 │
│  💡 원칙: 가능하면 Skeleton, 불가능하면 Spinner                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.4 빈 상태 (Empty State) 패턴

**빈 상태는 "2 parts instruction + 1 part delight" 공식**을 따릅니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                Empty State의 3요소                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────┐                        │
│  │         🎨 일러스트/아이콘           │  ← Delight            │
│  │         (친근한 시각 요소)           │                        │
│  ├─────────────────────────────────────┤                        │
│  │                                     │                        │
│  │  "아직 프로젝트가 없습니다"         │  ← Instruction 1       │
│  │  (현재 상태 설명)                   │     (무슨 상황인지)    │
│  │                                     │                        │
│  │  "첫 번째 프로젝트를 만들어서       │  ← Instruction 2       │
│  │   작업을 시작해보세요"              │     (무엇을 해야 하는지)│
│  │                                     │                        │
│  │  [ + 새 프로젝트 만들기 ]           │  ← CTA 버튼            │
│  │                                     │                        │
│  └─────────────────────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**범용 Empty State 컴포넌트:**

```tsx
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div
      className="
      flex flex-col items-center justify-center
      py-12 px-4
      text-center
    "
    >
      {/* 아이콘 */}
      <div
        className="
        h-16 w-16
        rounded-full
        bg-muted
        flex items-center justify-center
        mb-4
      "
      >
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* 설명 */}
      <p className="text-muted-foreground mt-1 max-w-sm">{description}</p>

      {/* 액션 버튼들 */}
      {(action || secondaryAction) && (
        <div className="flex gap-3 mt-6">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
```

**상황별 Empty State 예시:**

```tsx
import {
  Inbox,
  Search,
  FolderOpen,
  Users,
  FileText,
  ShoppingCart
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// 1. 첫 사용 - 데이터가 아예 없을 때
// ═══════════════════════════════════════════════════════════════

<EmptyState
  icon={FolderOpen}
  title="아직 프로젝트가 없습니다"
  description="첫 번째 프로젝트를 만들어서 작업을 시작해보세요."
  action={{
    label: "새 프로젝트 만들기",
    onClick: () => setShowCreateModal(true)
  }}
/>

// ═══════════════════════════════════════════════════════════════
// 2. 검색 결과 없음
// ═══════════════════════════════════════════════════════════════

<EmptyState
  icon={Search}
  title="검색 결과가 없습니다"
  description={`"${searchQuery}"에 대한 결과를 찾을 수 없습니다. 다른 키워드로 검색해보세요.`}
  action={{
    label: "검색 초기화",
    onClick: () => setSearchQuery('')
  }}
/>

// ═══════════════════════════════════════════════════════════════
// 3. 필터 결과 없음
// ═══════════════════════════════════════════════════════════════

<EmptyState
  icon={FileText}
  title="조건에 맞는 항목이 없습니다"
  description="현재 필터 조건에 맞는 항목이 없습니다."
  action={{
    label: "필터 초기화",
    onClick: () => resetFilters()
  }}
  secondaryAction={{
    label: "새 항목 추가",
    onClick: () => setShowCreateModal(true)
  }}
/>

// ═══════════════════════════════════════════════════════════════
// 4. 장바구니 비어있음
// ═══════════════════════════════════════════════════════════════

<EmptyState
  icon={ShoppingCart}
  title="장바구니가 비어있습니다"
  description="마음에 드는 상품을 담아보세요."
  action={{
    label: "쇼핑 계속하기",
    onClick: () => router.push('/products')
  }}
/>

// ═══════════════════════════════════════════════════════════════
// 5. 알림 없음
// ═══════════════════════════════════════════════════════════════

<EmptyState
  icon={Inbox}
  title="새로운 알림이 없습니다"
  description="모든 알림을 확인했습니다."
/>

// ═══════════════════════════════════════════════════════════════
// 6. 팀원 없음 (초대 유도)
// ═══════════════════════════════════════════════════════════════

<EmptyState
  icon={Users}
  title="아직 팀원이 없습니다"
  description="팀원을 초대하여 함께 협업해보세요."
  action={{
    label: "팀원 초대하기",
    onClick: () => setShowInviteModal(true)
  }}
/>
```

### 14.5 에러 상태 패턴

**에러 상태는 사용자에게 3가지를 알려줘야 합니다:**

1. 무슨 문제가 발생했는지
2. 왜 발생했는지 (가능하다면)
3. 어떻게 해결할 수 있는지

```tsx
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// ═══════════════════════════════════════════════════════════════
// 범용 에러 상태 컴포넌트
// ═══════════════════════════════════════════════════════════════

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export function ErrorState({
  title = '문제가 발생했습니다',
  message = '데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  onRetry,
  onGoBack,
  onGoHome,
}: ErrorStateProps) {
  return (
    <div
      className="
      flex flex-col items-center justify-center
      py-12 px-4
      text-center
    "
    >
      {/* 에러 아이콘 */}
      <div
        className="
        h-16 w-16
        rounded-full
        bg-destructive/10
        flex items-center justify-center
        mb-4
      "
      >
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* 메시지 */}
      <p className="text-muted-foreground mt-1 max-w-sm">{message}</p>

      {/* 액션 버튼들 */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        )}
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로 가기
          </Button>
        )}
        {onGoHome && (
          <Button variant="outline" onClick={onGoHome}>
            <Home className="h-4 w-4 mr-2" />
            홈으로
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 인라인 에러 (작은 영역용)
// ═══════════════════════════════════════════════════════════════

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>오류</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            재시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

**에러 유형별 메시지 가이드:**

```tsx
// ═══════════════════════════════════════════════════════════════
// 에러 유형별 사용자 친화적 메시지
// ═══════════════════════════════════════════════════════════════

const errorMessages = {
  // 네트워크 에러
  network: {
    title: '연결할 수 없습니다',
    message: '인터넷 연결을 확인하고 다시 시도해주세요.',
  },

  // 서버 에러 (500)
  server: {
    title: '서버에 문제가 발생했습니다',
    message: '잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요.',
  },

  // 인증 에러 (401)
  unauthorized: {
    title: '로그인이 필요합니다',
    message: '이 페이지에 접근하려면 먼저 로그인해주세요.',
  },

  // 권한 에러 (403)
  forbidden: {
    title: '접근 권한이 없습니다',
    message: '이 페이지에 접근할 권한이 없습니다.',
  },

  // 없는 페이지 (404)
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    message: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
  },

  // 타임아웃
  timeout: {
    title: '요청 시간이 초과되었습니다',
    message: '서버 응답이 너무 오래 걸립니다. 나중에 다시 시도해주세요.',
  },

  // 유효성 검사 에러
  validation: {
    title: '입력 정보를 확인해주세요',
    message: '일부 입력 항목이 올바르지 않습니다.',
  },
};

// 사용 예시
function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('network')) {
      return errorMessages.network;
    }
    if (error.message.includes('401')) {
      return errorMessages.unauthorized;
    }
    // ... 기타 에러 타입 처리
  }

  return {
    title: '문제가 발생했습니다',
    message: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
  };
}
```

### 14.6 성공 피드백 패턴

**사용자 액션 후에는 반드시 피드백**을 제공해야 합니다.

```tsx
import { useToast } from '@/components/ui/use-toast';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Toast 기반 피드백 시스템
// ═══════════════════════════════════════════════════════════════

export function useActionFeedback() {
  const { toast } = useToast();

  return {
    // 성공 피드백
    success: (message: string, description?: string) => {
      toast({
        title: message,
        description,
        className: 'bg-green-50 border-green-200',
      });
    },

    // 에러 피드백
    error: (message: string, description?: string) => {
      toast({
        variant: 'destructive',
        title: message,
        description,
      });
    },

    // 경고 피드백
    warning: (message: string, description?: string) => {
      toast({
        title: message,
        description,
        className: 'bg-yellow-50 border-yellow-200',
      });
    },

    // 정보 피드백
    info: (message: string, description?: string) => {
      toast({
        title: message,
        description,
      });
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 사용 예시
// ═══════════════════════════════════════════════════════════════

function SaveButton() {
  const feedback = useActionFeedback();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      await saveData();
      feedback.success('저장 완료', '변경사항이 저장되었습니다.');
    } catch (error) {
      feedback.error('저장 실패', '다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          저장 중...
        </>
      ) : (
        '저장'
      )}
    </Button>
  );
}
```

**피드백 유형별 사용 가이드:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  피드백 유형 선택 가이드                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Toast (일시적, 자동 사라짐):                                    │
│  ─────────────────────────────                                  │
│  • 저장 성공                                                     │
│  • 복사 완료                                                     │
│  • 항목 삭제됨                                                   │
│  • 설정 변경됨                                                   │
│                                                                 │
│  Inline Alert (지속적, 화면에 유지):                             │
│  ─────────────────────────────────                              │
│  • 폼 유효성 검사 에러                                           │
│  • 중요한 경고 메시지                                            │
│  • 필수 조치가 필요한 정보                                       │
│                                                                 │
│  Modal/Dialog (차단형, 확인 필요):                               │
│  ─────────────────────────────────                              │
│  • 삭제 확인                                                     │
│  • 결제 완료                                                     │
│  • 중요한 변경 확인                                              │
│  • 세션 만료 알림                                                │
│                                                                 │
│  Page/Full Screen (전체 화면):                                   │
│  ─────────────────────────────                                  │
│  • 결제 성공 페이지                                              │
│  • 회원가입 완료                                                 │
│  • 중요 오류 (복구 불가)                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.7 통합 상태 관리 패턴

**모든 상태를 한 곳에서 관리하는 패턴:**

```tsx
// ═══════════════════════════════════════════════════════════════
// 데이터 페칭 상태 타입
// ═══════════════════════════════════════════════════════════════

type DataState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'empty' };

// ═══════════════════════════════════════════════════════════════
// 범용 데이터 컨테이너 컴포넌트
// ═══════════════════════════════════════════════════════════════

interface DataContainerProps<T> {
  state: DataState<T>;
  onRetry?: () => void;

  // 각 상태별 렌더링
  renderLoading?: () => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  renderSuccess: (data: T) => React.ReactNode;
}

export function DataContainer<T>({
  state,
  onRetry,
  renderLoading,
  renderEmpty,
  renderError,
  renderSuccess,
}: DataContainerProps<T>) {
  switch (state.status) {
    case 'idle':
    case 'loading':
      return renderLoading?.() ?? <DefaultLoadingSkeleton />;

    case 'empty':
      return (
        renderEmpty?.() ?? (
          <EmptyState
            icon={Inbox}
            title="데이터가 없습니다"
            description="표시할 내용이 없습니다."
          />
        )
      );

    case 'error':
      return (
        renderError?.(state.error) ?? <ErrorState message={state.error.message} onRetry={onRetry} />
      );

    case 'success':
      return renderSuccess(state.data);
  }
}

// ═══════════════════════════════════════════════════════════════
// 사용 예시: 프로젝트 리스트
// ═══════════════════════════════════════════════════════════════

function ProjectList() {
  const [state, setState] = useState<DataState<Project[]>>({ status: 'idle' });

  const fetchProjects = async () => {
    setState({ status: 'loading' });

    try {
      const data = await api.getProjects();

      if (data.length === 0) {
        setState({ status: 'empty' });
      } else {
        setState({ status: 'success', data });
      }
    } catch (error) {
      setState({ status: 'error', error: error as Error });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <DataContainer
      state={state}
      onRetry={fetchProjects}
      renderLoading={() => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}
      renderEmpty={() => (
        <EmptyState
          icon={FolderOpen}
          title="프로젝트가 없습니다"
          description="첫 번째 프로젝트를 만들어보세요."
          action={{
            label: '새 프로젝트',
            onClick: () => setShowCreateModal(true),
          }}
        />
      )}
      renderSuccess={(projects) => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    />
  );
}
```

### 14.8 React Query / SWR와 상태 통합

**React Query 사용 시 상태 처리:**

```tsx
import { useQuery } from '@tanstack/react-query';

function ProjectList() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  }

  // 빈 상태
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="프로젝트가 없습니다"
        description="첫 번째 프로젝트를 만들어보세요."
        action={{
          label: '새 프로젝트',
          onClick: () => setShowCreateModal(true),
        }}
      />
    );
  }

  // 성공 상태
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### 14.9 폼 상태 처리

**폼은 특별히 더 많은 상태가 필요합니다:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

function LoginForm() {
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitState('submitting');
    setSubmitError(null);

    try {
      await api.login(values);
      setSubmitState('success');
      // 리다이렉트 또는 성공 처리
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error instanceof Error ? error.message : '로그인에 실패했습니다');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 전체 폼 에러 메시지 */}
        {submitState === 'error' && submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* 이메일 필드 */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  {...field}
                  disabled={submitState === 'submitting'}
                />
              </FormControl>
              <FormMessage /> {/* 필드별 에러 메시지 */}
            </FormItem>
          )}
        />

        {/* 비밀번호 필드 */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...field} disabled={submitState === 'submitting'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 제출 버튼 */}
        <Button type="submit" className="w-full" disabled={submitState === 'submitting'}>
          {submitState === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </Button>
      </form>
    </Form>
  );
}
```

### 14.10 AI에게 상태 구현 요청하는 프롬프트

```markdown
## 상태별 UI 요청 프롬프트 템플릿

다음 컴포넌트를 만들어줘: [컴포넌트명]

### 필수 구현 상태

1. **로딩 상태**
   - Skeleton UI 사용 (Spinner 아님)
   - 실제 콘텐츠와 동일한 구조
   - 적절한 애니메이션 (animate-pulse)

2. **성공 상태**
   - 실제 데이터 표시
   - 적절한 레이아웃과 스타일링

3. **빈 상태**
   - 아이콘 + 제목 + 설명 + CTA 버튼
   - 사용자가 다음에 무엇을 해야 하는지 안내

4. **에러 상태**
   - 에러 메시지 표시
   - 재시도 버튼 포함
   - 사용자 친화적 메시지 (기술적 용어 금지)

### 추가 요구사항

- TypeScript 타입 정의 포함
- 각 상태는 별도 컴포넌트로 분리
- 상태 전환 로직 포함
- 접근성 고려 (aria-live for 상태 변경)

### 참고할 컴포넌트

- Skeleton: `@/components/ui/skeleton`
- Button: `@/components/ui/button`
- Alert: `@/components/ui/alert`
```

### 14.11 상태별 UI 체크리스트

```
□ 로딩 상태
  - [ ] Skeleton UI 구현 (콘텐츠 구조와 일치)
  - [ ] 적절한 로딩 표시 위치
  - [ ] 과도하게 빠른 깜빡임 방지 (최소 표시 시간)

□ 빈 상태
  - [ ] 명확한 상태 설명
  - [ ] 다음 액션 안내
  - [ ] CTA 버튼 (해당되는 경우)
  - [ ] 친근한 시각 요소 (아이콘/일러스트)

□ 에러 상태
  - [ ] 사용자 친화적 에러 메시지
  - [ ] 재시도 옵션
  - [ ] 대안 제시 (해당되는 경우)
  - [ ] 기술적 세부사항 숨김

□ 성공 피드백
  - [ ] 모든 사용자 액션에 피드백
  - [ ] 적절한 피드백 유형 선택 (Toast/Alert/Modal)
  - [ ] 명확하고 간결한 메시지

□ 폼 상태
  - [ ] 필드별 유효성 검사 메시지
  - [ ] 제출 중 로딩 표시
  - [ ] 제출 버튼 비활성화 (처리 중)
  - [ ] 전체 폼 에러 메시지 영역
```

### 14.12 다음 챕터 미리보기

**챕터 15: UI/UX 품질 검증 자동화**에서는 Storybook, Chromatic, 시각적 회귀 테스트를 통해 UI 품질을 자동으로 검증하는 CI/CD 파이프라인을 구축하는 방법을 다룹니다.

---

## 챕터 15: UI/UX 품질 검증 자동화

### 15.1 왜 UI 품질 검증을 자동화해야 하는가?

바이브 코딩으로 빠르게 UI를 만들 수 있지만, **품질 검증 없이는 기술 부채가 쌓입니다.** 수동 검증은 시간이 오래 걸리고 일관성이 없습니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              수동 검증 vs 자동화 검증                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  수동 검증의 문제:                                               │
│  ─────────────────                                              │
│  • 매번 모든 페이지를 눈으로 확인? → 비현실적                    │
│  • 반응형 테스트 (5+ 브레이크포인트)? → 시간 부족                │
│  • 다크 모드 확인? → 자주 잊음                                   │
│  • 이전 버전과 비교? → 불가능                                    │
│  • 접근성 검사? → 전문 지식 필요                                 │
│                                                                 │
│  결과: 버그가 프로덕션에 배포됨 😱                               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  자동화 검증의 장점:                                             │
│  ─────────────────────                                          │
│  • 모든 컴포넌트 자동 스크린샷                                   │
│  • 이전 버전과 픽셀 단위 비교                                    │
│  • 모든 브레이크포인트 자동 테스트                               │
│  • 접근성 위반 자동 감지                                         │
│  • PR마다 자동 실행                                              │
│                                                                 │
│  결과: 버그가 머지 전에 발견됨 ✅                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 UI 품질 자동화 도구 체인

```
┌─────────────────────────────────────────────────────────────────┐
│                  UI 품질 자동화 도구 체인                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Storybook                                                   │
│     └─→ 컴포넌트 문서화 + 격리된 개발 환경                       │
│                                                                 │
│  2. Chromatic (또는 Percy, Playwright)                          │
│     └─→ 시각적 회귀 테스트 (Visual Regression Testing)          │
│                                                                 │
│  3. axe-core + Playwright                                       │
│     └─→ 접근성 자동 테스트                                       │
│                                                                 │
│  4. Lighthouse CI                                               │
│     └─→ 성능 + 접근성 + SEO 점수 검사                           │
│                                                                 │
│  5. ESLint jsx-a11y                                             │
│     └─→ 코드 작성 시점에 접근성 문제 감지                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💰 비용 (솔로 개발자 기준):                                     │
│                                                                 │
│  도구             무료 티어              유료                    │
│  ──────────────   ──────────────────    ──────────────         │
│  Storybook        완전 무료              -                      │
│  Chromatic        5,000 스냅샷/월       $149/월~                │
│  Playwright       완전 무료              -                      │
│  axe-core         완전 무료              -                      │
│  Lighthouse CI    완전 무료              -                      │
│                                                                 │
│  💡 대부분 무료로 시작 가능!                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.3 Storybook 설정하기

**Storybook**은 컴포넌트를 격리된 환경에서 개발하고 문서화하는 도구입니다.

**설치:**

```bash
# 자동 설정 (권장)
npx storybook@latest init

# 실행
npm run storybook
```

**생성되는 구조:**

```
프로젝트/
├── .storybook/
│   ├── main.ts          # Storybook 설정
│   └── preview.ts       # 전역 데코레이터, 스타일
├── src/
│   └── components/
│       └── ui/
│           ├── button.tsx
│           └── button.stories.tsx  # 스토리 파일
└── ...
```

**main.ts 설정 (Next.js + Tailwind):**

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y', // 접근성 패널
    '@storybook/addon-interactions', // 인터랙션 테스트
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
};

export default config;
```

**preview.ts 설정 (Tailwind CSS 적용):**

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Tailwind CSS

const preview: Preview = {
  parameters: {
    // 배경색 옵션
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    // 반응형 뷰포트
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
};

export default preview;
```

### 15.4 컴포넌트 스토리 작성하기

**Button 컴포넌트 스토리 예시:**

```tsx
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Loader2, Mail, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'], // 자동 문서 생성
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ═══════════════════════════════════════════════════════════════
// 기본 버튼
// ═══════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// ═══════════════════════════════════════════════════════════════
// 모든 변형 (Variants)
// ═══════════════════════════════════════════════════════════════

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 모든 크기 (Sizes)
// ═══════════════════════════════════════════════════════════════

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 아이콘 버튼
// ═══════════════════════════════════════════════════════════════

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
      <Button>
        Next
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 로딩 상태
// ═══════════════════════════════════════════════════════════════

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </Button>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 비활성화 상태
// ═══════════════════════════════════════════════════════════════

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </div>
  ),
};
```

**Card 컴포넌트 스토리 예시 (상태별):**

```tsx
// src/components/ui/card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

// ═══════════════════════════════════════════════════════════════
// 기본 카드
// ═══════════════════════════════════════════════════════════════

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>카드 설명입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드 내용이 여기에 표시됩니다.</p>
      </CardContent>
    </Card>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 로딩 상태
// ═══════════════════════════════════════════════════════════════

export const Loading: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardContent>
    </Card>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 인터랙티브 카드
// ═══════════════════════════════════════════════════════════════

export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>프로젝트 설정</CardTitle>
        <CardDescription>프로젝트 기본 정보를 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">프로젝트 이름</label>
          <input className="w-full px-3 py-2 border rounded-md" placeholder="프로젝트 이름 입력" />
        </div>
        <Button className="w-full">저장</Button>
      </CardContent>
    </Card>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 반응형 테스트
// ═══════════════════════════════════════════════════════════════

export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  render: () => (
    <Card className="w-full max-w-[350px]">
      <CardHeader>
        <CardTitle>반응형 카드</CardTitle>
        <CardDescription>모바일에서 테스트하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>뷰포트 크기를 변경해보세요.</p>
      </CardContent>
    </Card>
  ),
};
```

### 15.5 Chromatic으로 시각적 회귀 테스트

**Chromatic**은 Storybook 스토리를 자동으로 스크린샷하고 변경사항을 감지합니다.

**설치 및 설정:**

```bash
# Chromatic 설치
npm install --save-dev chromatic

# 프로젝트 연결 (처음 한 번)
npx chromatic --project-token=<your-project-token>
```

**GitHub Actions 통합:**

```yaml
# .github/workflows/chromatic.yml
name: Chromatic

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 전체 히스토리 필요

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: true # 변경 있어도 실패 안 함 (리뷰용)
```

**Chromatic 워크플로우:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  Chromatic 시각적 테스트 흐름                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. PR 생성                                                      │
│     │                                                           │
│     ▼                                                           │
│  2. GitHub Actions 실행                                          │
│     │                                                           │
│     ▼                                                           │
│  3. Chromatic이 모든 스토리 스크린샷                             │
│     │                                                           │
│     ▼                                                           │
│  4. 이전 버전과 픽셀 비교                                        │
│     │                                                           │
│     ├─→ 변경 없음: ✅ 통과                                       │
│     │                                                           │
│     └─→ 변경 감지: 📸 리뷰 요청                                  │
│         │                                                       │
│         ▼                                                       │
│  5. Chromatic UI에서 변경 확인                                   │
│     │                                                           │
│     ├─→ 의도한 변경: ✅ Accept                                   │
│     │                                                           │
│     └─→ 버그 발견: ❌ Deny → 수정 후 재푸시                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.6 Playwright로 시각적 테스트 (무료 대안)

Chromatic 대신 **Playwright의 내장 스크린샷 비교** 기능을 사용할 수 있습니다.

**설치:**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**시각적 테스트 작성:**

```typescript
// tests/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  // ═══════════════════════════════════════════════════════════════
  // 페이지 스크린샷 테스트
  // ═══════════════════════════════════════════════════════════════

  test('홈페이지 스크린샷', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 전체 페이지 스크린샷 비교
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100, // 허용 오차
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 컴포넌트 스크린샷 테스트
  // ═══════════════════════════════════════════════════════════════

  test('로그인 폼 스크린샷', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toHaveScreenshot('login-form.png');
  });

  // ═══════════════════════════════════════════════════════════════
  // 다크 모드 테스트
  // ═══════════════════════════════════════════════════════════════

  test('다크 모드 스크린샷', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('http://localhost:3000');

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 반응형 테스트
  // ═══════════════════════════════════════════════════════════════

  test('모바일 뷰 스크린샷', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('태블릿 뷰 스크린샷', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
    });
  });
});
```

**playwright.config.ts:**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // 스크린샷 설정
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2, // 20% 차이까지 허용
    },
  },

  // 여러 브라우저에서 테스트
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],

  // 로컬 서버 자동 실행
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**스크린샷 업데이트:**

```bash
# 기준 스크린샷 업데이트 (의도적 변경 시)
npx playwright test --update-snapshots
```

### 15.7 접근성 자동 테스트 (axe-core)

**Playwright + axe-core 설정:**

```bash
npm install --save-dev @axe-core/playwright
```

**접근성 테스트 작성:**

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('홈페이지 접근성', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // 위반 사항이 없어야 함
    expect(results.violations).toEqual([]);
  });

  test('로그인 페이지 접근성', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  // ═══════════════════════════════════════════════════════════════
  // 특정 영역만 테스트
  // ═══════════════════════════════════════════════════════════════

  test('네비게이션 접근성', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const results = await new AxeBuilder({ page })
      .include('nav') // nav 요소만 테스트
      .analyze();

    expect(results.violations).toEqual([]);
  });

  // ═══════════════════════════════════════════════════════════════
  // 특정 규칙 제외 (예외 처리)
  // ═══════════════════════════════════════════════════════════════

  test('폼 접근성 (특정 규칙 제외)', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) // 색상 대비 규칙 제외 (임시)
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

**접근성 테스트 결과 리포트:**

```typescript
// tests/accessibility.spec.ts (향상된 버전)
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('접근성 검사 with 상세 리포트', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  // 위반 사항 상세 출력
  if (results.violations.length > 0) {
    console.log('\n🚨 접근성 위반 사항:');

    results.violations.forEach((violation) => {
      console.log(`\n❌ ${violation.id}: ${violation.description}`);
      console.log(`   영향: ${violation.impact}`);
      console.log(`   도움말: ${violation.helpUrl}`);

      violation.nodes.forEach((node) => {
        console.log(`   요소: ${node.html}`);
        console.log(`   수정 방법: ${node.failureSummary}`);
      });
    });
  }

  expect(results.violations).toEqual([]);
});
```

### 15.8 Storybook 접근성 애드온

**Storybook에서 실시간 접근성 검사:**

```bash
# 이미 설치됨 (@storybook/addon-a11y)
```

**스토리에서 접근성 테스트:**

```tsx
// button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    a11y: {
      // axe 설정
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
  },
};

export default meta;

// 접근성 문제가 있는 예시 (경고 표시됨)
export const AccessibilityIssue: StoryObj = {
  render: () => (
    // ❌ 아이콘만 있고 텍스트/aria-label 없음
    <button className="p-2">
      <svg>...</svg>
    </button>
  ),
};

// 올바른 예시
export const AccessibilityCorrect: StoryObj = {
  render: () => (
    // ✅ aria-label 제공
    <button className="p-2" aria-label="설정">
      <svg>...</svg>
    </button>
  ),
};
```

### 15.9 ESLint jsx-a11y 설정

**코드 작성 시점에 접근성 문제 감지:**

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

**eslint.config.js:**

```javascript
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // 기존 설정...
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      // 이미지 alt 텍스트 필수
      'jsx-a11y/alt-text': 'error',

      // 클릭 가능한 요소에 키보드 지원
      'jsx-a11y/click-events-have-key-events': 'error',

      // 인터랙티브 요소에 role 필수
      'jsx-a11y/no-static-element-interactions': 'error',

      // label과 input 연결
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          assert: 'either',
        },
      ],

      // 앵커 태그에 href 필수
      'jsx-a11y/anchor-is-valid': 'error',

      // 제목 순서 (h1 → h2 → h3)
      'jsx-a11y/heading-has-content': 'error',
    },
  },
];
```

### 15.10 Lighthouse CI 설정

**Lighthouse CI**는 성능, 접근성, SEO 점수를 자동으로 측정합니다.

```bash
npm install --save-dev @lhci/cli
```

**lighthouserc.js:**

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/login'],
      startServerCommand: 'npm run start',
      numberOfRuns: 3, // 3번 측정 후 평균
    },
    assert: {
      assertions: {
        // 성능 점수 80점 이상
        'categories:performance': ['error', { minScore: 0.8 }],

        // 접근성 점수 90점 이상
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // SEO 점수 80점 이상
        'categories:seo': ['error', { minScore: 0.8 }],

        // 개별 메트릭
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // 무료 임시 저장소
    },
  },
};
```

**GitHub Actions 통합:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### 15.11 통합 CI/CD 파이프라인

**모든 UI 품질 검사를 하나의 파이프라인으로:**

```yaml
# .github/workflows/ui-quality.yml
name: UI Quality

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ─────────────────────────────────────────────────────────────
  # 린트 및 타입 체크
  # ─────────────────────────────────────────────────────────────
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint # ESLint + jsx-a11y
      - run: npm run typecheck # TypeScript

  # ─────────────────────────────────────────────────────────────
  # Storybook 빌드
  # ─────────────────────────────────────────────────────────────
  storybook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build-storybook

      - name: Upload Storybook
        uses: actions/upload-artifact@v4
        with:
          name: storybook
          path: storybook-static

  # ─────────────────────────────────────────────────────────────
  # 시각적 회귀 테스트 (Chromatic)
  # ─────────────────────────────────────────────────────────────
  visual:
    needs: storybook
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: true

  # ─────────────────────────────────────────────────────────────
  # 접근성 테스트
  # ─────────────────────────────────────────────────────────────
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build

      - name: Start server
        run: npm run start &

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run accessibility tests
        run: npx playwright test tests/accessibility.spec.ts

  # ─────────────────────────────────────────────────────────────
  # Lighthouse CI
  # ─────────────────────────────────────────────────────────────
  lighthouse:
    needs: accessibility
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

### 15.12 UI 품질 자동화 체크리스트

```
□ Storybook 설정
  - [ ] Storybook 설치 및 설정
  - [ ] 주요 컴포넌트 스토리 작성
  - [ ] 상태별 스토리 (로딩, 에러, 빈 상태)
  - [ ] 접근성 애드온 활성화

□ 시각적 테스트
  - [ ] Chromatic 연동 또는 Playwright 스크린샷
  - [ ] 주요 페이지 스크린샷 테스트
  - [ ] 반응형 (모바일, 태블릿, 데스크톱)
  - [ ] 다크 모드 테스트

□ 접근성 테스트
  - [ ] ESLint jsx-a11y 규칙 활성화
  - [ ] Playwright + axe-core 테스트
  - [ ] WCAG 2.1 AA 수준 검사

□ 성능 테스트
  - [ ] Lighthouse CI 설정
  - [ ] 성능 점수 80점 이상
  - [ ] 접근성 점수 90점 이상
  - [ ] Core Web Vitals 기준 충족

□ CI/CD 통합
  - [ ] PR마다 자동 실행
  - [ ] 실패 시 머지 차단
  - [ ] 리포트 자동 생성
```

### 15.13 다음 챕터 미리보기

**챕터 16: 마이크로 인터랙션과 애니메이션**에서는 버튼 클릭 피드백, 페이지 전환, 로딩 애니메이션 등 UI에 생동감을 부여하는 마이크로 인터랙션과 Framer Motion을 활용한 애니메이션 구현 방법을 다룹니다.

---

## 챕터 16: 마이크로 인터랙션과 애니메이션

### 16.1 마이크로 인터랙션이란?

**마이크로 인터랙션**은 사용자 액션에 대한 작은 피드백입니다. 버튼 클릭 시 살짝 눌리는 효과, 좋아요 버튼의 하트 애니메이션, 토글 스위치의 부드러운 전환 등이 모두 마이크로 인터랙션입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              마이크로 인터랙션의 4가지 요소                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 트리거 (Trigger)                                             │
│  ─────────────────────                                          │
│  • 사용자 액션: 클릭, 호버, 스크롤, 드래그                        │
│  • 시스템 이벤트: 데이터 로드 완료, 에러 발생                     │
│                                                                 │
│  2. 규칙 (Rules)                                                 │
│  ───────────────                                                │
│  • 트리거에 대한 반응 정의                                        │
│  • 예: 버튼 클릭 → 0.95배로 축소 후 복귀                         │
│                                                                 │
│  3. 피드백 (Feedback)                                            │
│  ─────────────────────                                          │
│  • 시각적: 색상 변화, 크기 변화, 움직임                           │
│  • 청각적: 클릭 사운드 (선택적)                                   │
│  • 촉각적: 햅틱 피드백 (모바일)                                   │
│                                                                 │
│  4. 루프와 모드 (Loops & Modes)                                  │
│  ───────────────────────────────                                │
│  • 반복되는 애니메이션 (로딩 스피너)                              │
│  • 상태에 따른 다른 동작 (토글 on/off)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 16.2 왜 마이크로 인터랙션이 중요한가?

```
┌─────────────────────────────────────────────────────────────────┐
│              애니메이션 없는 UI vs 있는 UI                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  애니메이션 없이:                                                 │
│  ─────────────────                                              │
│  [버튼 클릭] → (아무 피드백 없음) → 결과 표시                     │
│                                                                 │
│  사용자 생각: "클릭됐나? 작동하는 건가?"                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  애니메이션 있을 때:                                              │
│  ────────────────────                                           │
│  [버튼 클릭] → 버튼 살짝 눌림 → 로딩 스피너 → 체크 애니메이션    │
│                                                                 │
│  사용자 생각: "클릭됐고, 처리 중이고, 성공했구나!"                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💡 마이크로 인터랙션의 효과:                                     │
│  • 시스템이 반응한다는 확신 제공                                  │
│  • 현재 상태에 대한 명확한 피드백                                 │
│  • 감정적 연결 형성 (제품이 "살아있는" 느낌)                      │
│  • 체감 속도 향상 (실제 속도는 같아도 빠르게 느껴짐)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 16.3 애니메이션 Duration과 Easing 가이드

**Duration (지속 시간):**

```
┌─────────────────────────────────────────────────────────────────┐
│                애니메이션 Duration 가이드                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Duration        용도                         예시               │
│  ──────────────  ─────────────────────────── ─────────────────  │
│                                                                 │
│  50-100ms        즉각적 피드백               버튼 색상 변화      │
│                  "순간적으로 느껴져야 함"    호버 상태 변경      │
│                                                                 │
│  150-200ms       빠른 전환                   드롭다운 열기      │
│                  "빠르지만 눈에 보임"        툴팁 표시          │
│                                                                 │
│  200-300ms       표준 전환                   모달 열기          │
│                  "자연스러운 움직임"         카드 확장          │
│                                                                 │
│  300-500ms       강조 애니메이션             페이지 전환        │
│                  "주목을 끌어야 함"          성공 체크 표시     │
│                                                                 │
│  500ms+          특수 효과                   온보딩 애니메이션  │
│                  "스토리텔링"                로고 애니메이션    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ⚠️ 주의: 300ms 이상은 사용자가 "기다린다"고 느낌                │
│          일반적인 UI 전환은 200-300ms가 최적                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Easing (가속도 곡선):**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Easing 함수 가이드                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ease-out (권장: 대부분의 UI 전환)                               │
│  ──────────────────────────────────                             │
│  • 빠르게 시작 → 천천히 끝                                       │
│  • "자연스러운 감속"                                             │
│  • 용도: 요소 등장, 모달 열기, 드롭다운                          │
│  • CSS: cubic-bezier(0, 0, 0.2, 1)                              │
│                                                                 │
│  시작 ████████░░░░ 끝                                            │
│       빠름      느림                                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ease-in (퇴장 애니메이션)                                       │
│  ─────────────────────────                                      │
│  • 천천히 시작 → 빠르게 끝                                       │
│  • "가속하며 떠남"                                               │
│  • 용도: 요소 퇴장, 모달 닫기                                    │
│  • CSS: cubic-bezier(0.4, 0, 1, 1)                              │
│                                                                 │
│  시작 ░░░░████████ 끝                                            │
│       느림      빠름                                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ease-in-out (양방향 전환)                                       │
│  ───────────────────────                                        │
│  • 천천히 시작 → 빠르게 → 천천히 끝                              │
│  • "부드러운 왕복"                                               │
│  • 용도: 토글, 스와이프, 위치 이동                               │
│  • CSS: cubic-bezier(0.4, 0, 0.2, 1)                            │
│                                                                 │
│  시작 ░░░████░░░ 끝                                              │
│       느림 빠름 느림                                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  spring (물리 기반, Framer Motion)                               │
│  ─────────────────────────────────                              │
│  • 탄성 있는 움직임                                              │
│  • "살아있는" 느낌                                               │
│  • 용도: 버튼 피드백, 드래그, 바운스                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 16.4 CSS만으로 구현하는 기본 애니메이션

**Tailwind CSS 기본 애니메이션:**

```tsx
// ═══════════════════════════════════════════════════════════════
// 버튼 호버/클릭 효과
// ═══════════════════════════════════════════════════════════════

// 기본 버튼 (호버 시 밝아짐, 클릭 시 눌림)
<button className="
  bg-primary text-primary-foreground
  px-4 py-2 rounded-lg
  transition-all duration-200
  hover:bg-primary/90
  active:scale-95
">
  Click me
</button>

// 아웃라인 버튼 (호버 시 배경 채워짐)
<button className="
  border border-primary text-primary
  px-4 py-2 rounded-lg
  transition-all duration-200
  hover:bg-primary hover:text-primary-foreground
  active:scale-95
">
  Outline
</button>

// 고스트 버튼 (호버 시 배경 나타남)
<button className="
  text-primary
  px-4 py-2 rounded-lg
  transition-colors duration-150
  hover:bg-primary/10
  active:bg-primary/20
">
  Ghost
</button>

// ═══════════════════════════════════════════════════════════════
// 카드 호버 효과
// ═══════════════════════════════════════════════════════════════

// 떠오르는 효과
<div className="
  bg-card rounded-lg p-6 shadow-sm
  transition-all duration-300
  hover:shadow-lg hover:-translate-y-1
">
  Card content
</div>

// 테두리 강조 효과
<div className="
  bg-card rounded-lg p-6
  border-2 border-transparent
  transition-colors duration-200
  hover:border-primary
">
  Card content
</div>

// ═══════════════════════════════════════════════════════════════
// 링크/네비게이션 효과
// ═══════════════════════════════════════════════════════════════

// 밑줄 애니메이션
<a className="
  relative
  after:absolute after:bottom-0 after:left-0
  after:h-0.5 after:w-0 after:bg-primary
  after:transition-all after:duration-300
  hover:after:w-full
">
  Animated Link
</a>

// ═══════════════════════════════════════════════════════════════
// 로딩 애니메이션 (Tailwind 내장)
// ═══════════════════════════════════════════════════════════════

// 스피너 (회전)
<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />

// 펄스 (깜빡임) - Skeleton에 사용
<div className="h-4 w-full animate-pulse rounded bg-muted" />

// 바운스 (튀어오름)
<div className="animate-bounce">↓</div>

// 핑 (확산)
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
</span>
```

**커스텀 Tailwind 애니메이션 (tailwind.config.js):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        // 페이드 인
        'fade-in': 'fadeIn 0.3s ease-out',
        // 슬라이드 업
        'slide-up': 'slideUp 0.3s ease-out',
        // 슬라이드 다운
        'slide-down': 'slideDown 0.3s ease-out',
        // 스케일 인
        'scale-in': 'scaleIn 0.2s ease-out',
        // 쉐이크 (에러 표시)
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
      },
    },
  },
};
```

### 16.5 Framer Motion 기초

**Framer Motion**은 React를 위한 가장 인기 있는 애니메이션 라이브러리입니다.

**설치:**

```bash
npm install framer-motion
```

**기본 사용법:**

```tsx
'use client'

import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════
// 기본 애니메이션 (등장)
// ═══════════════════════════════════════════════════════════════

// 페이드 인
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Fade In Content
</motion.div>

// 슬라이드 + 페이드
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Slide Up Content
</motion.div>

// 스케일 + 페이드
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
>
  Scale In Content
</motion.div>

// ═══════════════════════════════════════════════════════════════
// 호버/탭 인터랙션
// ═══════════════════════════════════════════════════════════════

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
>
  Interactive Button
</motion.button>

// ═══════════════════════════════════════════════════════════════
// Spring 애니메이션 (더 자연스러운 움직임)
// ═══════════════════════════════════════════════════════════════

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    type: 'spring',
    stiffness: 300,   // 스프링 강도 (높을수록 빠름)
    damping: 20,      // 감쇠 (높을수록 덜 튀어오름)
  }}
>
  Spring Animation
</motion.div>
```

### 16.6 AnimatePresence: 퇴장 애니메이션

기본적으로 React는 컴포넌트가 언마운트되면 즉시 사라집니다. **AnimatePresence**를 사용하면 퇴장 애니메이션을 적용할 수 있습니다.

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// 모달 애니메이션
// ═══════════════════════════════════════════════════════════════

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
// 토스트/알림 애니메이션
// ═══════════════════════════════════════════════════════════════

function Toast({ message, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-4 left-1/2 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
// 드롭다운 메뉴 애니메이션
// ═══════════════════════════════════════════════════════════════

function Dropdown({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{ originY: 0 }} // 위에서부터 확장
          className="absolute top-full left-0 mt-1 bg-background border rounded-lg shadow-lg py-1 min-w-[200px]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 16.7 리스트 애니메이션

**아이템이 순차적으로 등장하는 애니메이션:**

```tsx
'use client';

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// 컨테이너 + 아이템 패턴 (Stagger)
// ═══════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 각 아이템 사이 0.1초 간격
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
    },
  },
};

function AnimatedList({ items }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants} className="bg-card p-4 rounded-lg">
          {item.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// ═══════════════════════════════════════════════════════════════
// 카드 그리드 애니메이션
// ═══════════════════════════════════════════════════════════════

function AnimatedGrid({ items }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-muted-foreground mt-2">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 리스트 아이템 추가/삭제 애니메이션
// ═══════════════════════════════════════════════════════════════

function AnimatedTodoList({ todos, onDelete }) {
  return (
    <AnimatePresence mode="popLayout">
      {todos.map((todo) => (
        <motion.div
          key={todo.id}
          layout // 위치 변경 시 자동 애니메이션
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="flex items-center justify-between p-4 bg-card rounded-lg mb-2"
        >
          <span>{todo.text}</span>
          <button onClick={() => onDelete(todo.id)}>삭제</button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### 16.8 페이지 전환 애니메이션 (Next.js App Router)

**Next.js App Router에서 페이지 전환 애니메이션:**

```tsx
// app/template.tsx
'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

**더 정교한 페이지 전환:**

```tsx
// components/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 16.9 마이크로 인터랙션 컴포넌트 라이브러리

```tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Heart, Star, Plus, X } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// 좋아요 버튼 (하트 애니메이션)
// ═══════════════════════════════════════════════════════════════

export function LikeButton({
  isLiked: initialLiked = false,
  onToggle,
}: {
  isLiked?: boolean;
  onToggle?: (liked: boolean) => void;
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = () => {
    setIsLiked(!isLiked);
    onToggle?.(!isLiked);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full hover:bg-muted transition-colors"
    >
      <motion.div
        animate={
          isLiked
            ? {
                scale: [1, 1.3, 1],
              }
            : {}
        }
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-6 w-6 transition-colors ${
            isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          }`}
        />
      </motion.div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
// 체크박스 애니메이션
// ═══════════════════════════════════════════════════════════════

export function AnimatedCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      className={`
        h-6 w-6 rounded border-2 flex items-center justify-center
        transition-colors
        ${checked ? 'bg-primary border-primary' : 'border-muted-foreground'}
      `}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
// 토글 스위치
// ═══════════════════════════════════════════════════════════════

export function AnimatedToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative h-7 w-12 rounded-full p-1 transition-colors
        ${enabled ? 'bg-primary' : 'bg-muted'}
      `}
    >
      <motion.div
        className="h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// 별점 컴포넌트
// ═══════════════════════════════════════════════════════════════

export function StarRating({
  rating,
  onChange,
  max = 5,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  max?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = hovered !== null ? i < hovered : i < rating;

        return (
          <motion.button
            key={i}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange?.(i + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAB (Floating Action Button) 확장 메뉴
// ═══════════════════════════════════════════════════════════════

export function ExpandableFab({
  actions,
}: {
  actions: { icon: React.ReactNode; label: string; onClick: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse items-center gap-3">
      {/* 메인 버튼 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </motion.button>

      {/* 액션 버튼들 */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{
                delay: i * 0.05,
                type: 'spring',
                damping: 20,
              }}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-12 w-12 rounded-full bg-card shadow-md flex items-center justify-center"
            >
              {action.icon}
            </motion.button>
          ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 성공 체크 애니메이션
// ═══════════════════════════════════════════════════════════════

export function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center"
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}
```

### 16.10 prefers-reduced-motion 지원

**일부 사용자는 애니메이션이 어지러울 수 있습니다.** 시스템 설정을 존중해야 합니다.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// 커스텀 훅
// ═══════════════════════════════════════════════════════════════

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// ═══════════════════════════════════════════════════════════════
// Framer Motion 내장 훅 사용
// ═══════════════════════════════════════════════════════════════

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
      }}
    >
      Content
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 전역 설정
// ═══════════════════════════════════════════════════════════════

// globals.css
/*
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
*/
```

### 16.11 성능 최적화 팁

```
┌─────────────────────────────────────────────────────────────────┐
│                애니메이션 성능 최적화 가이드                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ GPU 가속 속성 사용 (빠름):                                   │
│  ─────────────────────────────                                  │
│  • transform (translate, scale, rotate)                         │
│  • opacity                                                      │
│                                                                 │
│  ❌ 레이아웃 유발 속성 피하기 (느림):                             │
│  ──────────────────────────────────                             │
│  • width, height                                                │
│  • top, left, right, bottom                                     │
│  • margin, padding                                              │
│  • font-size                                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  예시:                                                           │
│                                                                 │
│  // ❌ 느림 - height 변경                                        │
│  animate={{ height: isOpen ? 'auto' : 0 }}                      │
│                                                                 │
│  // ✅ 빠름 - scaleY 사용                                        │
│  animate={{ scaleY: isOpen ? 1 : 0 }}                           │
│  style={{ originY: 0 }}                                         │
│                                                                 │
│  // ❌ 느림 - top 변경                                           │
│  animate={{ top: isOpen ? 0 : -100 }}                           │
│                                                                 │
│  // ✅ 빠름 - translateY 사용                                    │
│  animate={{ y: isOpen ? 0 : -100 }}                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**will-change 사용 (주의해서):**

```tsx
// 애니메이션 직전에 힌트 제공
<motion.div style={{ willChange: 'transform, opacity' }} whileHover={{ scale: 1.05 }}>
  ...
</motion.div>

// ⚠️ 주의: will-change를 과도하게 사용하면 오히려 성능 저하
// 실제로 애니메이션이 적용되는 요소에만 사용
```

### 16.12 AI에게 애니메이션 요청하는 프롬프트

```markdown
## 애니메이션 컴포넌트 요청 프롬프트

다음 컴포넌트에 마이크로 인터랙션을 추가해줘: [컴포넌트명]

### 애니메이션 요구사항

**트리거:**

- 호버: [어떤 효과]
- 클릭: [어떤 효과]
- 등장: [어떤 효과]
- 퇴장: [어떤 효과]

**타이밍:**

- Duration: 200-300ms (표준 UI 전환)
- Easing: ease-out (등장), ease-in (퇴장)

### 필수 요구사항

- Framer Motion 사용
- prefers-reduced-motion 지원
- GPU 가속 속성만 사용 (transform, opacity)
- 과하지 않은 자연스러운 움직임

### 참고 패턴

- 버튼: whileTap={{ scale: 0.95 }}
- 카드 호버: whileHover={{ y: -4 }}
- 모달: AnimatePresence + scale + opacity

### 제외할 것

- 과도한 바운스 효과
- 500ms 이상의 긴 애니메이션
- 레이아웃 유발 속성 애니메이션
```

### 16.13 마이크로 인터랙션 체크리스트

```
□ 기본 인터랙션
  - [ ] 버튼 호버/클릭 피드백
  - [ ] 링크 호버 효과
  - [ ] 카드 호버 효과
  - [ ] 입력 필드 포커스 효과

□ 상태 전환
  - [ ] 모달 열기/닫기 애니메이션
  - [ ] 드롭다운 메뉴 애니메이션
  - [ ] 토스트 알림 등장/퇴장
  - [ ] 탭/아코디언 전환

□ 피드백 애니메이션
  - [ ] 로딩 인디케이터
  - [ ] 성공 체크 표시
  - [ ] 에러 쉐이크 효과
  - [ ] 프로그레스 바

□ 리스트 애니메이션
  - [ ] 아이템 등장 stagger
  - [ ] 아이템 추가/삭제
  - [ ] 재정렬 애니메이션

□ 성능 & 접근성
  - [ ] GPU 가속 속성만 사용
  - [ ] prefers-reduced-motion 지원
  - [ ] 300ms 이하 duration
  - [ ] 적절한 easing 함수
```

### 16.14 다음 챕터 미리보기

**챕터 17: 접근성(A11y) 완벽 가이드**에서는 WCAG 2.1 기준, 키보드 네비게이션, 스크린 리더 지원, 색상 대비 등 웹 접근성의 모든 측면을 다룹니다. AI가 자주 놓치는 접근성 문제와 해결 방법을 배웁니다.

---

## 챕터 17: 접근성(A11y) 완벽 가이드

### 17.1 접근성이 중요한 이유

**접근성(Accessibility, A11y)**은 장애가 있는 사용자도 웹사이트를 사용할 수 있게 하는 것입니다. 하지만 접근성은 장애인만을 위한 것이 아닙니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              접근성이 도움이 되는 상황들                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  영구적 장애:                                                    │
│  ─────────────                                                  │
│  • 시각 장애 (전맹, 저시력, 색맹)                                │
│  • 청각 장애                                                     │
│  • 운동 장애 (마우스 사용 불가)                                  │
│  • 인지 장애                                                     │
│                                                                 │
│  일시적 상황:                                                    │
│  ─────────────                                                  │
│  • 팔 부상으로 한 손만 사용 가능                                 │
│  • 눈 수술 후 회복 중                                            │
│  • 시끄러운 환경에서 소리 없이 사용                              │
│                                                                 │
│  상황적 제약:                                                    │
│  ─────────────                                                  │
│  • 밝은 햇빛 아래에서 화면 보기                                  │
│  • 아기를 안고 한 손으로 폰 사용                                 │
│  • 운전 중 음성으로만 사용                                       │
│  • 느린 인터넷 환경                                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💡 통계:                                                        │
│  • 전 세계 인구의 15%가 어떤 형태의 장애를 가짐                  │
│  • 웹페이지의 95.9%가 접근성 위반 포함 (WebAIM 2024)             │
│  • 색맹 남성: 8%, 여성: 0.5%                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.2 WCAG 2.1 기준 이해하기

**WCAG (Web Content Accessibility Guidelines)**는 웹 접근성의 국제 표준입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    WCAG 2.1 핵심 원칙                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POUR 원칙:                                                      │
│  ───────────                                                    │
│                                                                 │
│  1. Perceivable (인지 가능)                                      │
│     ────────────────────────                                    │
│     사용자가 콘텐츠를 인지할 수 있어야 함                        │
│     • 이미지에 대체 텍스트                                       │
│     • 비디오에 자막                                              │
│     • 충분한 색상 대비                                           │
│                                                                 │
│  2. Operable (조작 가능)                                         │
│     ────────────────────                                        │
│     사용자가 인터페이스를 조작할 수 있어야 함                    │
│     • 키보드로 모든 기능 사용 가능                               │
│     • 충분한 시간 제공                                           │
│     • 발작 유발 콘텐츠 금지                                      │
│                                                                 │
│  3. Understandable (이해 가능)                                   │
│     ────────────────────────                                    │
│     콘텐츠와 조작 방법을 이해할 수 있어야 함                     │
│     • 명확한 언어 사용                                           │
│     • 예측 가능한 동작                                           │
│     • 입력 오류 방지 및 수정 지원                                │
│                                                                 │
│  4. Robust (견고함)                                              │
│     ─────────────                                               │
│     다양한 기술로 콘텐츠에 접근할 수 있어야 함                   │
│     • 표준 HTML 사용                                             │
│     • 보조 기술과 호환                                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  적합성 수준:                                                    │
│  ─────────────                                                  │
│  A   - 최소 요구사항 (필수)                                      │
│  AA  - 권장 수준 (대부분의 법적 요구사항)     ← 목표 수준        │
│  AAA - 최고 수준 (특수한 경우)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.3 AI가 자주 놓치는 접근성 문제 10가지

```
┌─────────────────────────────────────────────────────────────────┐
│              AI 생성 코드의 흔한 접근성 문제                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 이미지 alt 텍스트 누락 또는 의미 없는 텍스트                  │
│     ❌ <img src="hero.jpg" />                                    │
│     ❌ <img src="hero.jpg" alt="image" />                        │
│     ✅ <img src="hero.jpg" alt="팀원들이 회의하는 모습" />        │
│                                                                 │
│  2. 폼 요소에 label 누락                                         │
│     ❌ <input placeholder="이메일" />                            │
│     ✅ <label htmlFor="email">이메일</label>                     │
│        <input id="email" />                                     │
│                                                                 │
│  3. 버튼에 접근 가능한 이름 없음                                  │
│     ❌ <button><Icon /></button>                                 │
│     ✅ <button aria-label="메뉴 열기"><Icon /></button>          │
│                                                                 │
│  4. 키보드 접근 불가능한 클릭 요소                                │
│     ❌ <div onClick={...}>Click me</div>                         │
│     ✅ <button onClick={...}>Click me</button>                   │
│                                                                 │
│  5. 색상만으로 정보 전달                                          │
│     ❌ 빨간색 = 에러 (색맹 사용자는 구분 불가)                    │
│     ✅ 빨간색 + 아이콘 + 텍스트로 에러 표시                       │
│                                                                 │
│  6. 불충분한 색상 대비                                            │
│     ❌ 회색 텍스트 on 밝은 회색 배경 (대비 2:1)                   │
│     ✅ 최소 4.5:1 대비 (일반 텍스트)                              │
│                                                                 │
│  7. 포커스 표시 제거                                              │
│     ❌ outline: none; (포커스 보이지 않음)                        │
│     ✅ focus-visible로 키보드 포커스만 표시                       │
│                                                                 │
│  8. 비시맨틱 HTML 사용                                            │
│     ❌ <div class="button">...</div>                             │
│     ✅ <button>...</button>                                      │
│                                                                 │
│  9. 동적 콘텐츠 변경 알림 없음                                    │
│     ❌ 토스트가 나타나도 스크린 리더가 모름                       │
│     ✅ role="alert" 또는 aria-live="polite"                      │
│                                                                 │
│  10. 제목 계층 구조 무시                                          │
│     ❌ h1 → h3 → h2 (순서 뒤죽박죽)                              │
│     ✅ h1 → h2 → h3 (순차적)                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.4 시맨틱 HTML 기초

**시맨틱 HTML**은 접근성의 기초입니다. 올바른 HTML 요소를 사용하면 별도의 ARIA 없이도 접근성이 확보됩니다.

```tsx
// ═══════════════════════════════════════════════════════════════
// 페이지 구조
// ═══════════════════════════════════════════════════════════════

// ❌ 비시맨틱
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>
<div class="footer">...</div>

// ✅ 시맨틱
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>

// ═══════════════════════════════════════════════════════════════
// 전체 페이지 구조 예시
// ═══════════════════════════════════════════════════════════════

export default function Layout({ children }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        본문으로 건너뛰기
      </a>

      <header>
        <nav aria-label="메인 네비게이션">
          <ul>
            <li><a href="/">홈</a></li>
            <li><a href="/about">소개</a></li>
            <li><a href="/contact">문의</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        {children}
      </main>

      <footer>
        <nav aria-label="푸터 네비게이션">
          ...
        </nav>
      </footer>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// 인터랙티브 요소
// ═══════════════════════════════════════════════════════════════

// ❌ 잘못된 사용
<div onClick={handleClick}>클릭하세요</div>
<span onClick={handleClick}>링크</span>
<a onClick={handleClick}>제출</a>

// ✅ 올바른 사용
<button onClick={handleClick}>클릭하세요</button>
<a href="/page">링크</a>
<button type="submit">제출</button>

// ═══════════════════════════════════════════════════════════════
// 목록
// ═══════════════════════════════════════════════════════════════

// ❌ div로 목록 흉내
<div>
  <div>항목 1</div>
  <div>항목 2</div>
</div>

// ✅ 시맨틱 목록
<ul>
  <li>항목 1</li>
  <li>항목 2</li>
</ul>

// 네비게이션 메뉴
<nav>
  <ul role="list">  {/* 일부 스크린 리더용 */}
    <li><a href="/">홈</a></li>
    <li><a href="/about">소개</a></li>
  </ul>
</nav>

// ═══════════════════════════════════════════════════════════════
// 제목 계층
// ═══════════════════════════════════════════════════════════════

// ❌ 잘못된 계층 (건너뛰기)
<h1>페이지 제목</h1>
<h3>섹션 제목</h3>  {/* h2를 건너뜀! */}
<h2>다른 섹션</h2>

// ✅ 올바른 계층
<h1>페이지 제목</h1>
<h2>섹션 제목</h2>
<h3>하위 섹션</h3>
<h2>다른 섹션</h2>

// 💡 시각적 스타일은 CSS로, 계층은 HTML로
<h2 className="text-sm">작은 글씨지만 h2</h2>
```

### 17.5 키보드 네비게이션

**모든 기능은 키보드만으로 사용 가능해야 합니다.**

```
┌─────────────────────────────────────────────────────────────────┐
│                    키보드 네비게이션 기본                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  필수 키보드 지원:                                               │
│  ─────────────────                                              │
│                                                                 │
│  Tab        다음 포커스 가능 요소로 이동                         │
│  Shift+Tab  이전 포커스 가능 요소로 이동                         │
│  Enter      버튼 클릭, 링크 이동                                 │
│  Space      체크박스 토글, 버튼 클릭                             │
│  Escape     모달/드롭다운 닫기                                   │
│  Arrow      메뉴/탭/슬라이더 내 이동                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  기본적으로 포커스 가능한 요소:                                   │
│  ───────────────────────────────                                │
│  • <a href="...">                                               │
│  • <button>                                                     │
│  • <input>, <select>, <textarea>                                │
│  • <details>, <summary>                                         │
│  • 요소에 tabindex="0" 추가된 경우                              │
│                                                                 │
│  ⚠️ tabindex 사용 주의:                                         │
│  • tabindex="0": 자연스러운 순서에 포함                          │
│  • tabindex="-1": 포커스 가능하지만 탭 순서에서 제외             │
│  • tabindex="1+": 사용 금지! 순서가 꼬임                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**포커스 관리 패턴:**

```tsx
'use client';

import { useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// 포커스 트랩 (모달용)
// ═══════════════════════════════════════════════════════════════

function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // 첫 요소에 포커스
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab: 첫 요소에서 마지막으로
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: 마지막 요소에서 첫 번째로
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}

// 사용 예시
function Modal({ isOpen, onClose, children }) {
  const containerRef = useFocusTrap(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">모달 제목</h2>
      {children}
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 포커스 복원 (모달 닫힐 때)
// ═══════════════════════════════════════════════════════════════

function useRestoreFocus(isOpen: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 열릴 때 현재 포커스 저장
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      // 닫힐 때 이전 포커스로 복원
      previousFocusRef.current.focus();
    }
  }, [isOpen]);
}

// ═══════════════════════════════════════════════════════════════
// 커스텀 드롭다운 메뉴 키보드 지원
// ═══════════════════════════════════════════════════════════════

function Dropdown({ items, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          onSelect(items[activeIndex]);
          setIsOpen(false);
          buttonRef.current?.focus();
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        선택하세요
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `option-${activeIndex}` : undefined}
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              id={`option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'bg-accent' : ''}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 17.6 포커스 표시 (Focus Visible)

**포커스 표시를 제거하면 안 됩니다.** 대신 `focus-visible`을 사용합니다.

```tsx
// ═══════════════════════════════════════════════════════════════
// 포커스 스타일 패턴
// ═══════════════════════════════════════════════════════════════

// ❌ 절대 하면 안 됨
<button className="outline-none focus:outline-none">
  포커스 표시 없음!
</button>

// ❌ 마우스 클릭에도 포커스 링 표시 (거슬림)
<button className="focus:ring-2 focus:ring-primary">
  항상 포커스 링
</button>

// ✅ 키보드 포커스만 표시 (권장)
<button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
  focus-visible:ring-offset-2
">
  키보드 포커스만 표시
</button>

// ═══════════════════════════════════════════════════════════════
// 전역 포커스 스타일 (globals.css)
// ═══════════════════════════════════════════════════════════════

/*
/* 기본 포커스 스타일 제거하고 focus-visible만 표시 */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* 또는 Tailwind 베이스 스타일에 추가 */
@layer base {
  *:focus-visible {
    @apply ring-2 ring-primary ring-offset-2 outline-none;
  }
}
*/

// ═══════════════════════════════════════════════════════════════
// 컴포넌트별 포커스 스타일
// ═══════════════════════════════════════════════════════════════

// 버튼
const buttonStyles = `
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
  focus-visible:ring-offset-2
`

// 입력 필드
const inputStyles = `
  focus:outline-none
  focus:ring-2
  focus:ring-primary
  focus:border-primary
`

// 링크
const linkStyles = `
  focus:outline-none
  focus-visible:underline
  focus-visible:decoration-2
`

// 카드 (클릭 가능한 경우)
const cardStyles = `
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
  focus-visible:ring-offset-2
`
```

### 17.7 색상과 대비

```
┌─────────────────────────────────────────────────────────────────┐
│                    색상 대비 요구사항                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WCAG AA 기준 (필수):                                            │
│  ─────────────────────                                          │
│                                                                 │
│  일반 텍스트 (< 18pt):     4.5:1 이상                            │
│  큰 텍스트 (≥ 18pt 또는 14pt bold):  3:1 이상                    │
│  UI 컴포넌트, 그래픽:      3:1 이상                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  예시 (흰색 배경 #FFFFFF 기준):                                  │
│                                                                 │
│  색상              대비     결과                                │
│  ────────────────  ──────   ──────────────────                  │
│  #000000 (검정)    21:1     ✅ 모든 텍스트 OK                    │
│  #595959 (진회색)  7:1      ✅ 모든 텍스트 OK                    │
│  #767676 (회색)    4.5:1    ✅ 일반 텍스트 OK                    │
│  #949494 (연회색)  3:1      ⚠️ 큰 텍스트만 OK                    │
│  #CCCCCC (밝은회색) 1.6:1    ❌ 사용 불가                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💡 유용한 도구:                                                 │
│  • WebAIM Contrast Checker                                      │
│  • Chrome DevTools (Inspect → Contrast ratio)                   │
│  • Figma Contrast plugin                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**색상만으로 정보 전달하지 않기:**

```tsx
// ═══════════════════════════════════════════════════════════════
// ❌ 잘못된 예: 색상만으로 상태 표시
// ═══════════════════════════════════════════════════════════════

// 색맹 사용자는 빨강/초록 구분 불가
<div className={status === 'error' ? 'text-red-500' : 'text-green-500'}>
  {message}
</div>

// ═══════════════════════════════════════════════════════════════
// ✅ 올바른 예: 색상 + 아이콘 + 텍스트
// ═══════════════════════════════════════════════════════════════

import { AlertCircle, CheckCircle } from 'lucide-react'

<div className={`flex items-center gap-2 ${
  status === 'error' ? 'text-red-500' : 'text-green-500'
}`}>
  {status === 'error' ? (
    <AlertCircle className="h-4 w-4" aria-hidden="true" />
  ) : (
    <CheckCircle className="h-4 w-4" aria-hidden="true" />
  )}
  <span>
    {status === 'error' ? '오류: ' : '성공: '}
    {message}
  </span>
</div>

// ═══════════════════════════════════════════════════════════════
// 폼 유효성 검사 피드백
// ═══════════════════════════════════════════════════════════════

// ❌ 테두리 색상만 변경
<input className={error ? 'border-red-500' : 'border-gray-300'} />

// ✅ 색상 + 아이콘 + 텍스트
<div>
  <div className="relative">
    <input
      className={`pr-10 ${error ? 'border-red-500' : 'border-gray-300'}`}
      aria-invalid={!!error}
      aria-describedby={error ? 'email-error' : undefined}
    />
    {error && (
      <AlertCircle
        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500"
        aria-hidden="true"
      />
    )}
  </div>
  {error && (
    <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <span className="sr-only">오류:</span>
      {error}
    </p>
  )}
</div>
```

### 17.8 이미지와 미디어 접근성

```tsx
// ═══════════════════════════════════════════════════════════════
// 이미지 alt 텍스트 가이드
// ═══════════════════════════════════════════════════════════════

// 1. 정보 전달 이미지: 내용을 설명
<img
  src="/chart.png"
  alt="2024년 매출 그래프: 1분기 100만원, 2분기 150만원, 3분기 200만원"
/>

// 2. 기능적 이미지 (버튼/링크 내): 기능 설명
<button>
  <img src="/search.svg" alt="검색" />
</button>

// 3. 장식적 이미지: 빈 alt 또는 aria-hidden
<img src="/decorative-line.svg" alt="" />
// 또는
<img src="/decorative-line.svg" aria-hidden="true" />

// 4. 복잡한 이미지 (차트, 다이어그램): 별도 설명 제공
<figure>
  <img
    src="/complex-chart.png"
    alt="분기별 매출 비교 차트"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">
    2024년 분기별 매출을 보여주는 막대 그래프입니다.
    1분기 100만원에서 시작하여 4분기 300만원으로 지속적인 성장을 보였습니다.
    상세 데이터는 아래 표를 참조하세요.
  </figcaption>
</figure>

// ═══════════════════════════════════════════════════════════════
// 아이콘 접근성
// ═══════════════════════════════════════════════════════════════

// 의미 있는 아이콘 (단독 사용)
<button aria-label="설정">
  <Settings aria-hidden="true" />
</button>

// 텍스트와 함께 사용되는 아이콘
<button>
  <Mail aria-hidden="true" />
  <span>이메일 보내기</span>
</button>

// 순수 장식용 아이콘
<span aria-hidden="true">✨</span>

// ═══════════════════════════════════════════════════════════════
// 비디오/오디오 접근성
// ═══════════════════════════════════════════════════════════════

// 비디오에 자막 제공
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/captions-ko.vtt"
    srclang="ko"
    label="한국어"
    default
  />
  <track
    kind="captions"
    src="/captions-en.vtt"
    srclang="en"
    label="English"
  />
  이 브라우저는 비디오를 지원하지 않습니다.
</video>

// 오디오 콘텐츠에 대본 제공
<div>
  <audio controls src="/podcast.mp3">
    이 브라우저는 오디오를 지원하지 않습니다.
  </audio>
  <details>
    <summary>대본 보기</summary>
    <p>안녕하세요. 오늘의 팟캐스트에 오신 것을 환영합니다...</p>
  </details>
</div>
```

### 17.9 폼 접근성

```tsx
// ═══════════════════════════════════════════════════════════════
// 기본 폼 접근성 패턴
// ═══════════════════════════════════════════════════════════════

function AccessibleForm() {
  return (
    <form aria-labelledby="form-title">
      <h2 id="form-title">회원가입</h2>

      {/* 필수 필드 안내 */}
      <p className="text-sm text-muted-foreground mb-4">
        <span aria-hidden="true">*</span> 표시는 필수 항목입니다.
      </p>

      {/* 이메일 필드 */}
      <div className="space-y-2">
        <label htmlFor="email">
          이메일
          <span aria-hidden="true" className="text-red-500 ml-1">*</span>
          <span className="sr-only">(필수)</span>
        </label>
        <input
          id="email"
          type="email"
          required
          aria-required="true"
          aria-describedby="email-hint"
          autoComplete="email"
        />
        <p id="email-hint" className="text-sm text-muted-foreground">
          실제 사용하는 이메일을 입력해주세요.
        </p>
      </div>

      {/* 비밀번호 필드 (에러 상태) */}
      <div className="space-y-2">
        <label htmlFor="password">
          비밀번호
          <span aria-hidden="true" className="text-red-500 ml-1">*</span>
          <span className="sr-only">(필수)</span>
        </label>
        <input
          id="password"
          type="password"
          required
          aria-required="true"
          aria-invalid="true"
          aria-describedby="password-error password-requirements"
          autoComplete="new-password"
        />
        <p id="password-error" className="text-red-500 text-sm" role="alert">
          비밀번호는 8자 이상이어야 합니다.
        </p>
        <p id="password-requirements" className="text-sm text-muted-foreground">
          영문, 숫자, 특수문자 조합 8자 이상
        </p>
      </div>

      {/* 체크박스 그룹 */}
      <fieldset>
        <legend>알림 설정</legend>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="email-notifications" />
            <label htmlFor="email-notifications">이메일 알림 받기</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="sms-notifications" />
            <label htmlFor="sms-notifications">SMS 알림 받기</label>
          </div>
        </div>
      </fieldset>

      {/* 라디오 버튼 그룹 */}
      <fieldset>
        <legend>성별</legend>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="radio" id="male" name="gender" value="male" />
            <label htmlFor="male">남성</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female">여성</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="other" name="gender" value="other" />
            <label htmlFor="other">기타</label>
          </div>
        </div>
      </fieldset>

      {/* 제출 버튼 */}
      <button type="submit">
        가입하기
      </button>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════
// autoComplete 속성 (자동 완성 지원)
// ═══════════════════════════════════════════════════════════════

// 개인 정보
<input type="text" autoComplete="name" />           // 전체 이름
<input type="text" autoComplete="given-name" />     // 이름
<input type="text" autoComplete="family-name" />    // 성
<input type="email" autoComplete="email" />         // 이메일
<input type="tel" autoComplete="tel" />             // 전화번호

// 주소
<input type="text" autoComplete="street-address" /> // 상세 주소
<input type="text" autoComplete="address-level1" /> // 시/도
<input type="text" autoComplete="postal-code" />    // 우편번호
<input type="text" autoComplete="country-name" />   // 국가

// 로그인/결제
<input type="text" autoComplete="username" />       // 사용자명
<input type="password" autoComplete="current-password" /> // 현재 비밀번호
<input type="password" autoComplete="new-password" />     // 새 비밀번호
<input type="text" autoComplete="cc-name" />        // 카드 소유자명
<input type="text" autoComplete="cc-number" />      // 카드 번호
```

### 17.10 ARIA 속성 가이드

**ARIA (Accessible Rich Internet Applications)**는 HTML만으로 전달하기 어려운 접근성 정보를 제공합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                 ARIA 사용 원칙                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 네이티브 HTML을 먼저 사용                                    │
│     ────────────────────────────                                │
│     ARIA보다 시맨틱 HTML이 우선                                  │
│                                                                 │
│     ❌ <div role="button">클릭</div>                             │
│     ✅ <button>클릭</button>                                     │
│                                                                 │
│  2. ARIA로 네이티브 의미 변경 금지                               │
│     ─────────────────────────────                               │
│     ❌ <button role="heading">제목</button>                      │
│     ✅ <h2>제목</h2>                                             │
│                                                                 │
│  3. 인터랙티브 요소는 키보드 접근 필수                           │
│     ─────────────────────────────────                           │
│     ❌ <div role="button">클릭</div>  // 키보드 작동 안 함       │
│     ✅ <div role="button" tabindex="0"                           │
│           onKeyDown={e => e.key === 'Enter' && onClick()}>      │
│                                                                 │
│  4. 숨겨진 콘텐츠에는 aria-hidden                                │
│     ────────────────────────────────                            │
│     시각적으로 숨기고 스크린 리더에서도 숨길 때                  │
│     ✅ <div aria-hidden="true">장식 요소</div>                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**자주 사용하는 ARIA 속성:**

```tsx
// ═══════════════════════════════════════════════════════════════
// aria-label / aria-labelledby
// 요소에 접근 가능한 이름 제공
// ═══════════════════════════════════════════════════════════════

// aria-label: 직접 이름 제공
<button aria-label="검색">
  <SearchIcon />
</button>

// aria-labelledby: 다른 요소 참조
<dialog aria-labelledby="dialog-title">
  <h2 id="dialog-title">계정 삭제</h2>
  <p>정말 삭제하시겠습니까?</p>
</dialog>

// ═══════════════════════════════════════════════════════════════
// aria-describedby
// 추가 설명 연결
// ═══════════════════════════════════════════════════════════════

<input
  aria-describedby="password-hint password-error"
/>
<p id="password-hint">8자 이상</p>
<p id="password-error">비밀번호가 너무 짧습니다</p>

// ═══════════════════════════════════════════════════════════════
// aria-expanded / aria-controls
// 확장/축소 상태 전달
// ═══════════════════════════════════════════════════════════════

<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
>
  메뉴
</button>
<ul id="dropdown-menu" hidden={!isOpen}>
  <li>항목 1</li>
</ul>

// ═══════════════════════════════════════════════════════════════
// aria-live
// 동적 콘텐츠 변경 알림
// ═══════════════════════════════════════════════════════════════

// polite: 현재 읽기 완료 후 알림
<div aria-live="polite">
  {message}  {/* 변경 시 스크린 리더가 읽음 */}
</div>

// assertive: 즉시 알림 (긴급한 경우만)
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>

// ═══════════════════════════════════════════════════════════════
// aria-current
// 현재 상태 표시 (네비게이션 등)
// ═══════════════════════════════════════════════════════════════

<nav>
  <a href="/" aria-current={isHome ? 'page' : undefined}>홈</a>
  <a href="/about" aria-current={isAbout ? 'page' : undefined}>소개</a>
</nav>

// ═══════════════════════════════════════════════════════════════
// aria-hidden
// 스크린 리더에서 숨기기
// ═══════════════════════════════════════════════════════════════

// 장식적 요소
<span aria-hidden="true">✨</span>

// 텍스트와 중복되는 아이콘
<button>
  <MailIcon aria-hidden="true" />
  이메일 보내기
</button>

// ═══════════════════════════════════════════════════════════════
// role 속성 (주요 역할)
// ═══════════════════════════════════════════════════════════════

// 다이얼로그/모달
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <h2 id="title">제목</h2>
</div>

// 알림
<div role="alert">에러가 발생했습니다</div>

// 상태 메시지 (덜 긴급)
<div role="status">저장 완료</div>

// 탭 인터페이스
<div role="tablist">
  <button role="tab" aria-selected="true">탭 1</button>
  <button role="tab" aria-selected="false">탭 2</button>
</div>
<div role="tabpanel">탭 1 내용</div>
```

### 17.11 스크린 리더 전용 텍스트

**시각적으로는 숨기지만 스크린 리더에서는 읽히는 텍스트:**

```tsx
// ═══════════════════════════════════════════════════════════════
// sr-only 클래스 (Tailwind CSS)
// ═══════════════════════════════════════════════════════════════

// Tailwind에 기본 포함된 sr-only
<span className="sr-only">스크린 리더 전용 텍스트</span>

// 수동 정의 (globals.css)
/*
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
*/

// ═══════════════════════════════════════════════════════════════
// 사용 예시
// ═══════════════════════════════════════════════════════════════

// 1. 아이콘 버튼에 설명 추가
<button>
  <HeartIcon aria-hidden="true" />
  <span className="sr-only">좋아요</span>
</button>

// 2. 테이블 열 헤더 보충
<th>
  <span className="sr-only">작업</span>
</th>

// 3. 현재 페이지 표시
<a href="/about" aria-current="page">
  소개
  <span className="sr-only">(현재 페이지)</span>
</a>

// 4. 추가 컨텍스트 제공
<button>
  삭제
  <span className="sr-only">: {itemName}</span>
</button>

// 5. 건너뛰기 링크 (평소에는 숨김, 포커스 시 표시)
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background p-2 z-50"
>
  본문으로 건너뛰기
</a>
```

### 17.12 접근성 테스트 방법

```
┌─────────────────────────────────────────────────────────────────┐
│                   접근성 테스트 체크리스트                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 자동화 도구 테스트                                           │
│  ─────────────────────                                          │
│  □ ESLint jsx-a11y                                              │
│  □ axe DevTools (브라우저 확장)                                  │
│  □ Lighthouse 접근성 점수                                        │
│  □ WAVE (WebAIM)                                                │
│                                                                 │
│  2. 키보드 테스트                                                │
│  ─────────────────                                              │
│  □ Tab으로 모든 인터랙티브 요소 접근 가능                        │
│  □ 포커스 순서가 논리적                                          │
│  □ 포커스 표시가 보임                                            │
│  □ Enter/Space로 버튼 작동                                       │
│  □ Escape로 모달/드롭다운 닫힘                                   │
│  □ 포커스 트랩이 모달에서 작동                                   │
│                                                                 │
│  3. 스크린 리더 테스트                                           │
│  ─────────────────────                                          │
│  □ VoiceOver (Mac/iOS): Cmd+F5                                  │
│  □ NVDA (Windows): 무료                                         │
│  □ 모든 콘텐츠가 읽힘                                            │
│  □ 이미지 alt 텍스트가 적절                                      │
│  □ 폼 레이블이 올바르게 연결                                     │
│  □ 동적 변경 사항이 알림됨                                       │
│                                                                 │
│  4. 시각적 테스트                                                │
│  ─────────────────                                              │
│  □ 200% 확대에서도 사용 가능                                     │
│  □ 색상 대비 4.5:1 이상                                          │
│  □ 색상만으로 정보 전달하지 않음                                 │
│  □ 텍스트 크기 조절 가능                                         │
│                                                                 │
│  5. 기타 테스트                                                  │
│  ──────────────                                                 │
│  □ 제목 계층 구조 확인                                           │
│  □ 랜드마크 영역 존재                                            │
│  □ 비디오에 자막 있음                                            │
│  □ 애니메이션 비활성화 옵션                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**브라우저 개발자 도구 활용:**

```
Chrome DevTools 접근성 검사:
1. F12 → Elements 패널
2. 요소 선택 후 Accessibility 탭 확인
3. 또는 Lighthouse → Accessibility 검사

axe DevTools 확장 설치:
1. Chrome 웹 스토어에서 "axe DevTools" 설치
2. DevTools → axe DevTools 탭
3. "Scan ALL of my page" 클릭
```

### 17.13 AI에게 접근성 요청하는 프롬프트

```markdown
## 접근성 준수 컴포넌트 요청 프롬프트

다음 컴포넌트를 WCAG 2.1 AA 기준에 맞게 구현해줘: [컴포넌트명]

### 필수 접근성 요구사항

**시맨틱 HTML:**

- 적절한 HTML 요소 사용 (button, a, nav 등)
- 제목 계층 구조 준수 (h1 → h2 → h3)

**키보드 접근성:**

- Tab으로 모든 요소 접근 가능
- Enter/Space로 활성화
- Escape로 닫기 (모달/드롭다운)
- 포커스 트랩 (모달)
- 포커스 복원

**스크린 리더:**

- 의미 있는 aria-label
- aria-describedby로 추가 설명
- aria-live로 동적 변경 알림
- aria-expanded로 상태 전달

**시각적:**

- focus-visible 포커스 표시
- 4.5:1 색상 대비
- 색상 외 추가 표시 (아이콘, 텍스트)

**폼 (해당 시):**

- label과 input 연결
- 에러 메시지 연결 (aria-describedby)
- aria-invalid, aria-required
- autoComplete 속성

### 참고

- sr-only 클래스로 스크린 리더 전용 텍스트
- aria-hidden으로 장식 요소 숨김
- role="alert"로 에러 알림
```

### 17.14 접근성 체크리스트

```
□ 시맨틱 HTML
  - [ ] 적절한 HTML 요소 사용
  - [ ] 제목 계층 구조 (h1 → h2 → h3)
  - [ ] 랜드마크 요소 (header, nav, main, footer)
  - [ ] 목록에 ul/ol 사용

□ 키보드
  - [ ] 모든 기능 키보드로 접근 가능
  - [ ] 논리적인 탭 순서
  - [ ] 포커스 표시 (focus-visible)
  - [ ] 모달 포커스 트랩 및 복원
  - [ ] 건너뛰기 링크

□ 이미지/미디어
  - [ ] 의미 있는 이미지에 alt 텍스트
  - [ ] 장식 이미지에 alt="" 또는 aria-hidden
  - [ ] 비디오에 자막
  - [ ] 복잡한 이미지에 상세 설명

□ 색상/시각
  - [ ] 색상 대비 4.5:1 이상 (일반 텍스트)
  - [ ] 색상만으로 정보 전달하지 않음
  - [ ] 200% 확대에서도 사용 가능

□ 폼
  - [ ] 모든 입력에 label 연결
  - [ ] 필수 필드 표시 (aria-required)
  - [ ] 에러 메시지 연결 (aria-describedby)
  - [ ] 에러 상태 표시 (aria-invalid)
  - [ ] autoComplete 속성

□ 동적 콘텐츠
  - [ ] 변경 사항 알림 (aria-live)
  - [ ] 로딩 상태 알림
  - [ ] 에러 알림 (role="alert")

□ ARIA
  - [ ] 네이티브 HTML 우선 사용
  - [ ] aria-label/aria-labelledby
  - [ ] aria-expanded (확장/축소)
  - [ ] aria-current (현재 페이지)
```

### 17.15 다음 챕터 미리보기

**챕터 18: 성능과 UX의 교차점**에서는 Core Web Vitals(LCP, INP, CLS), 이미지 최적화, 로딩 UX 전략, 프리페칭 등 웹 성능이 사용자 경험에 미치는 영향과 최적화 방법을 다룹니다.

---

## 챕터 18: 성능과 UX의 교차점

### 18.1 성능이 UX에 미치는 영향

**성능은 기능입니다.** 아무리 멋진 UI도 느리면 사용자는 떠납니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              성능과 사용자 행동의 상관관계                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  로딩 시간과 이탈률:                                             │
│  ─────────────────────                                          │
│                                                                 │
│  1초 → 3초:  이탈률 32% 증가                                    │
│  1초 → 5초:  이탈률 90% 증가                                    │
│  1초 → 6초:  이탈률 106% 증가                                   │
│  1초 → 10초: 이탈률 123% 증가                                   │
│                                                                 │
│  (출처: Google/SOASTA Research, 2017)                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  비즈니스 영향:                                                  │
│  ──────────────                                                 │
│  • Amazon: 100ms 지연 → 매출 1% 감소                            │
│  • Google: 500ms 지연 → 검색 20% 감소                           │
│  • Walmart: 1초 개선 → 전환율 2% 증가                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  심리적 임계점:                                                  │
│  ──────────────                                                 │
│  • 0-100ms:   즉각적으로 느껴짐                                  │
│  • 100-300ms: 약간의 지연 인지                                   │
│  • 300-1000ms: "로딩 중"이라고 느낌                              │
│  • 1초+:      사용자가 다른 생각을 시작                          │
│  • 10초+:     사용자가 떠남                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.2 Core Web Vitals 이해하기

**Core Web Vitals**는 Google이 정의한 사용자 경험의 핵심 지표입니다. **SEO 순위에 직접 영향**을 미칩니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Core Web Vitals (2024)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. LCP (Largest Contentful Paint)                              │
│  ─────────────────────────────────                              │
│  "가장 큰 콘텐츠가 보이기까지 시간"                              │
│                                                                 │
│  측정: 뷰포트 내 가장 큰 이미지/텍스트 블록 렌더링 시간          │
│                                                                 │
│  ✅ Good:      ≤ 2.5초                                          │
│  ⚠️ Needs Improvement: 2.5초 ~ 4초                              │
│  ❌ Poor:      > 4초                                            │
│                                                                 │
│  영향 요소: 서버 응답 시간, 리소스 로딩, 렌더링 차단             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  2. INP (Interaction to Next Paint)                             │
│  ─────────────────────────────────                              │
│  "인터랙션 후 화면 반응까지 시간"                                │
│  (2024년 3월부터 FID 대체)                                       │
│                                                                 │
│  측정: 클릭/탭/키 입력 후 시각적 피드백까지 시간                 │
│                                                                 │
│  ✅ Good:      ≤ 200ms                                          │
│  ⚠️ Needs Improvement: 200ms ~ 500ms                            │
│  ❌ Poor:      > 500ms                                          │
│                                                                 │
│  영향 요소: JavaScript 실행 시간, 메인 스레드 블로킹             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  3. CLS (Cumulative Layout Shift)                               │
│  ─────────────────────────────────                              │
│  "예기치 않은 레이아웃 이동 정도"                                │
│                                                                 │
│  측정: 페이지 수명 동안 누적된 레이아웃 이동 점수                │
│                                                                 │
│  ✅ Good:      ≤ 0.1                                            │
│  ⚠️ Needs Improvement: 0.1 ~ 0.25                               │
│  ❌ Poor:      > 0.25                                           │
│                                                                 │
│  영향 요소: 크기 없는 이미지, 동적 콘텐츠 삽입, 웹폰트 FOUT      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.3 LCP 최적화

**LCP 요소가 될 수 있는 것들:**

- `<img>` 요소
- `<video>` 포스터 이미지
- CSS `background-image`
- 텍스트가 포함된 블록 요소

```tsx
// ═══════════════════════════════════════════════════════════════
// Next.js Image 최적화
// ═══════════════════════════════════════════════════════════════

import Image from 'next/image'

// ❌ 최적화되지 않은 이미지
<img src="/hero.jpg" alt="Hero" />

// ✅ Next.js Image 컴포넌트 사용
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // LCP 이미지에 필수!
/>

// ═══════════════════════════════════════════════════════════════
// priority 속성의 중요성
// ═══════════════════════════════════════════════════════════════

// priority가 하는 일:
// 1. preload 링크 자동 생성
// 2. lazy loading 비활성화
// 3. fetchPriority="high" 설정

// 히어로 이미지 (LCP 후보)
<Image
  src="/hero.jpg"
  alt="메인 배너"
  fill
  priority                    // ← 필수!
  sizes="100vw"
  className="object-cover"
/>

// 스크롤 아래 이미지 (lazy loading 유지)
<Image
  src="/below-fold.jpg"
  alt="하단 이미지"
  width={800}
  height={600}
  // priority 없음 = lazy loading
/>

// ═══════════════════════════════════════════════════════════════
// 이미지 포맷 최적화 (next.config.js)
// ═══════════════════════════════════════════════════════════════

// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],  // 최신 포맷 우선
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,  // 30일 캐시
  },
}

// ═══════════════════════════════════════════════════════════════
// 서버 응답 시간 개선
// ═══════════════════════════════════════════════════════════════

// 1. 정적 생성 (SSG) 활용 - 가장 빠름
// app/page.tsx
export const dynamic = 'force-static'  // 빌드 시 생성

// 2. ISR (Incremental Static Regeneration)
export const revalidate = 3600  // 1시간마다 재생성

// 3. 스트리밍 SSR (느린 데이터 대응)
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      {/* 즉시 렌더링되는 부분 */}
      <header>...</header>
      <HeroSection />

      {/* 느린 데이터는 나중에 */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList />  {/* 서버 컴포넌트 */}
      </Suspense>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// 폰트 최적화
// ═══════════════════════════════════════════════════════════════

// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // FOUT 방지
  preload: true,          // 프리로드
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### 18.4 INP 최적화

**INP(Interaction to Next Paint)**는 사용자 인터랙션에 대한 응답성을 측정합니다.

```tsx
// ═══════════════════════════════════════════════════════════════
// 무거운 JavaScript 분리
// ═══════════════════════════════════════════════════════════════

// ❌ 모든 코드가 초기 번들에 포함
import HeavyChart from './HeavyChart'

// ✅ 동적 임포트로 코드 분할
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // 클라이언트에서만 로드
})

// ═══════════════════════════════════════════════════════════════
// 이벤트 핸들러 최적화
// ═══════════════════════════════════════════════════════════════

// ❌ 무거운 작업을 동기적으로 실행
function handleClick() {
  const result = heavyComputation()  // 메인 스레드 블로킹!
  setData(result)
}

// ✅ 무거운 작업을 비동기로 분리
function handleClick() {
  // 즉각적인 시각적 피드백
  setIsLoading(true)

  // 무거운 작업은 다음 프레임에
  requestAnimationFrame(() => {
    setTimeout(() => {
      const result = heavyComputation()
      setData(result)
      setIsLoading(false)
    }, 0)
  })
}

// ✅ 더 나은 방법: Web Worker 사용
// worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
}

// component.tsx
const worker = new Worker(new URL('./worker.ts', import.meta.url))

function handleClick() {
  setIsLoading(true)
  worker.postMessage(inputData)
}

worker.onmessage = (e) => {
  setData(e.data)
  setIsLoading(false)
}

// ═══════════════════════════════════════════════════════════════
// useTransition으로 긴급하지 않은 업데이트 분리
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState, useTransition } from 'react'

function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e) => {
    const value = e.target.value

    // 긴급: 입력 필드 업데이트 (즉시)
    setQuery(value)

    // 긴급하지 않음: 검색 결과 업데이트 (나중에)
    startTransition(() => {
      const filtered = filterItems(value)  // 무거운 작업
      setResults(filtered)
    })
  }

  return (
    <>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="검색..."
      />
      {isPending && <span>검색 중...</span>}
      <ResultsList results={results} />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// useDeferredValue로 느린 컴포넌트 처리
// ═══════════════════════════════════════════════════════════════

'use client'

import { useDeferredValue, memo } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // query가 변경되어도 deferredQuery는 지연되어 업데이트
  const isStale = query !== deferredQuery

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SlowResults query={deferredQuery} />
      </div>
    </>
  )
}

// 메모이제이션으로 불필요한 리렌더 방지
const SlowResults = memo(function SlowResults({ query }) {
  const results = searchItems(query)  // 느린 작업
  return <ul>{results.map(...)}</ul>
})
```

### 18.5 CLS 최적화

**CLS(Cumulative Layout Shift)**는 예기치 않은 레이아웃 이동을 측정합니다.

```tsx
// ═══════════════════════════════════════════════════════════════
// 이미지/비디오 크기 예약
// ═══════════════════════════════════════════════════════════════

// ❌ 크기 없는 이미지 (CLS 발생!)
<img src="/photo.jpg" alt="Photo" />

// ✅ 명시적 크기 지정
<img
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>

// ✅ Next.js Image (자동 크기 예약)
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>

// ✅ 비율 유지 컨테이너
<div className="relative aspect-video">
  <Image
    src="/video-thumb.jpg"
    alt="Video thumbnail"
    fill
    className="object-cover"
  />
</div>

// ═══════════════════════════════════════════════════════════════
// 동적 콘텐츠 공간 예약
// ═══════════════════════════════════════════════════════════════

// ❌ 광고/배너가 로드되면서 레이아웃 밀림
<div>
  <AdBanner />  {/* 로드 후 200px 차지 */}
  <Content />
</div>

// ✅ 최소 높이로 공간 예약
<div className="min-h-[200px]">
  <AdBanner />
</div>
<Content />

// ✅ 또는 Skeleton으로 공간 예약
<div className="h-[200px]">
  {isLoading ? <Skeleton className="h-full" /> : <AdBanner />}
</div>

// ═══════════════════════════════════════════════════════════════
// 폰트 로딩 CLS 방지
// ═══════════════════════════════════════════════════════════════

// ❌ FOUT (Flash of Unstyled Text)
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2');
  /* font-display 없음 */
}

// ✅ font-display: swap (텍스트 즉시 표시, 폰트 로드 후 교체)
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2');
  font-display: swap;
}

// ✅ font-display: optional (빠르면 사용, 아니면 시스템 폰트)
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2');
  font-display: optional;
}

// ✅ Next.js 폰트 최적화 (자동 처리)
import { Noto_Sans_KR } from 'next/font/google'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  adjustFontFallback: true,  // 폴백 폰트 크기 조정
})

// ═══════════════════════════════════════════════════════════════
// 동적 삽입 콘텐츠 처리
// ═══════════════════════════════════════════════════════════════

// ❌ 콘텐츠 위에 갑자기 알림 삽입
<div>
  {showNotification && <Notification />}  {/* 아래 콘텐츠 밀림! */}
  <MainContent />
</div>

// ✅ 고정 위치 사용 (레이아웃 영향 없음)
<div className="relative">
  {showNotification && (
    <div className="fixed top-4 right-4 z-50">
      <Notification />
    </div>
  )}
  <MainContent />
</div>

// ✅ 또는 transform으로 애니메이션 (레이아웃 트리거 안 함)
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="fixed top-4 right-4"
>
  <Notification />
</motion.div>
```

### 18.6 로딩 UX 전략

**체감 성능(Perceived Performance)**은 실제 성능만큼 중요합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                   로딩 UX 전략 선택 가이드                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  로딩 시간        권장 전략                                      │
│  ────────────    ─────────────────────────────────────          │
│                                                                 │
│  < 100ms         아무것도 표시하지 않음 (즉각적으로 느껴짐)      │
│                                                                 │
│  100ms - 1초     미묘한 인디케이터 (버튼 내 스피너)              │
│                                                                 │
│  1초 - 3초       Skeleton UI (콘텐츠 구조 미리보기)              │
│                                                                 │
│  3초+            진행률 표시 + 예상 시간                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💡 핵심 원칙:                                                   │
│  1. 100ms 이전에는 로딩 표시하지 않기 (깜빡임 방지)              │
│  2. 콘텐츠 구조가 예측 가능하면 Skeleton 사용                    │
│  3. 진행 상황을 알 수 있으면 Progress Bar 사용                   │
│  4. 완료 후 부드러운 전환 애니메이션                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Progressive Loading 패턴:**

```tsx
// ═══════════════════════════════════════════════════════════════
// 점진적 콘텐츠 로딩
// ═══════════════════════════════════════════════════════════════

// app/page.tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      {/* 1. 즉시 렌더링 (Critical) */}
      <Header />
      <HeroSection />

      {/* 2. 두 번째로 중요 */}
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* 3. 덜 중요한 콘텐츠 */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <CustomerReviews />
      </Suspense>

      {/* 4. 가장 덜 중요 */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>

      <Footer />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// 지연 로딩 표시기 (100ms 후에만 표시)
// ═══════════════════════════════════════════════════════════════

('use client');

import { useState, useEffect } from 'react';

function DelayedSpinner({ delay = 100, children }) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSpinner) return null;
  return children;
}

// 사용
function LoadingState() {
  return (
    <DelayedSpinner delay={100}>
      <Spinner />
    </DelayedSpinner>
  );
}

// ═══════════════════════════════════════════════════════════════
// Optimistic UI (낙관적 업데이트)
// ═══════════════════════════════════════════════════════════════

('use client');

import { useOptimistic, useTransition } from 'react';

function LikeButton({ postId, initialLiked, initialCount }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (state, newLiked) => ({
      liked: newLiked,
      count: newLiked ? state.count + 1 : state.count - 1,
    })
  );

  const handleLike = async () => {
    const newLiked = !optimisticState.liked;

    startTransition(async () => {
      // 1. 즉시 UI 업데이트 (Optimistic)
      setOptimisticState(newLiked);

      // 2. 서버에 요청
      try {
        await toggleLike(postId, newLiked);
      } catch (error) {
        // 3. 실패 시 롤백 (자동으로 원래 상태로)
        console.error('좋아요 실패');
      }
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      <Heart filled={optimisticState.liked} />
      <span>{optimisticState.count}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// 무한 스크롤 최적화
// ═══════════════════════════════════════════════════════════════

('use client');

import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteList() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ))}

      {/* 트리거 요소 */}
      <div ref={ref} className="h-10">
        {isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}
```

### 18.7 프리페칭과 프리로딩

```tsx
// ═══════════════════════════════════════════════════════════════
// Next.js Link 프리페칭
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'

// 기본: 뷰포트에 들어오면 자동 프리페치
<Link href="/about">About</Link>

// 프리페치 비활성화 (드물게 사용되는 페이지)
<Link href="/terms" prefetch={false}>
  이용약관
</Link>

// 호버 시 프리페치 (App Router 기본값)
<Link href="/product/123">
  상품 보기
</Link>

// ═══════════════════════════════════════════════════════════════
// 프로그래매틱 프리페칭
// ═══════════════════════════════════════════════════════════════

'use client'

import { useRouter } from 'next/navigation'

function ProductCard({ product }) {
  const router = useRouter()

  // 마우스 오버 시 페이지 프리페치
  const handleMouseEnter = () => {
    router.prefetch(`/product/${product.id}`)
  }

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link href={`/product/${product.id}`}>
        {product.name}
      </Link>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 리소스 프리로드
// ═══════════════════════════════════════════════════════════════

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* 중요 이미지 프리로드 */}
        <link
          rel="preload"
          href="/hero.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* 중요 폰트 프리로드 */}
        <link
          rel="preload"
          href="/fonts/custom.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* API 도메인 프리커넥트 */}
        <link rel="preconnect" href="https://api.example.com" />
        <link rel="dns-prefetch" href="https://api.example.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}

// ═══════════════════════════════════════════════════════════════
// React Query 데이터 프리페칭
// ═══════════════════════════════════════════════════════════════

import { useQueryClient } from '@tanstack/react-query'

function CategoryList({ categories }) {
  const queryClient = useQueryClient()

  const prefetchCategory = (categoryId) => {
    queryClient.prefetchQuery({
      queryKey: ['products', categoryId],
      queryFn: () => fetchProducts(categoryId),
      staleTime: 5 * 60 * 1000,  // 5분간 유효
    })
  }

  return (
    <ul>
      {categories.map(category => (
        <li
          key={category.id}
          onMouseEnter={() => prefetchCategory(category.id)}
        >
          <Link href={`/category/${category.id}`}>
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

// ═══════════════════════════════════════════════════════════════
// 이미지 프리로딩
// ═══════════════════════════════════════════════════════════════

// 이미지 갤러리에서 다음 이미지 프리로드
function ImageGallery({ images, currentIndex }) {
  useEffect(() => {
    // 다음 이미지 프리로드
    const nextIndex = currentIndex + 1
    if (nextIndex < images.length) {
      const img = new Image()
      img.src = images[nextIndex].src
    }

    // 이전 이미지도 프리로드
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      const img = new Image()
      img.src = images[prevIndex].src
    }
  }, [currentIndex, images])

  return <img src={images[currentIndex].src} alt="" />
}
```

### 18.8 성능 측정 도구

```
┌─────────────────────────────────────────────────────────────────┐
│                    성능 측정 도구 가이드                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  개발 중 (Lab Data):                                             │
│  ─────────────────────                                          │
│                                                                 │
│  Chrome DevTools                                                │
│  • Performance 탭: 상세 프로파일링                               │
│  • Lighthouse 탭: 종합 점수                                      │
│  • Network 탭: 리소스 로딩 분석                                  │
│                                                                 │
│  Web Vitals Extension                                            │
│  • 실시간 Core Web Vitals 표시                                   │
│  • Chrome 확장 프로그램                                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  프로덕션 (Field Data):                                          │
│  ───────────────────────                                        │
│                                                                 │
│  Google Search Console                                          │
│  • Core Web Vitals 리포트                                        │
│  • 실제 사용자 데이터                                            │
│  • 무료                                                          │
│                                                                 │
│  PageSpeed Insights                                              │
│  • Lab + Field 데이터 통합                                       │
│  • 개선 제안 포함                                                │
│  • web.dev/measure                                               │
│                                                                 │
│  Vercel Analytics                                                │
│  • Next.js 통합                                                  │
│  • 실시간 모니터링                                               │
│  • 무료 티어 제공                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**코드에서 성능 측정:**

```tsx
// ═══════════════════════════════════════════════════════════════
// Web Vitals 측정 및 리포팅
// ═══════════════════════════════════════════════════════════════

// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights /> {/* Core Web Vitals 자동 수집 */}
        <Analytics /> {/* 페이지뷰 분석 */}
      </body>
    </html>
  );
}

// ═══════════════════════════════════════════════════════════════
// 커스텀 Web Vitals 리포팅
// ═══════════════════════════════════════════════════════════════

// app/web-vitals.tsx
('use client');

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // 분석 서비스로 전송
    console.log(metric);

    // 예: Google Analytics로 전송
    if (typeof window.gtag === 'function') {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  return null;
}

// ═══════════════════════════════════════════════════════════════
// 컴포넌트 렌더링 성능 측정
// ═══════════════════════════════════════════════════════════════

// React DevTools Profiler 사용
// 또는 수동 측정:

('use client');

import { Profiler } from 'react';

function onRenderCallback(
  id, // 프로파일러 ID
  phase, // "mount" 또는 "update"
  actualDuration, // 렌더링 시간
  baseDuration, // 메모이제이션 없을 때 예상 시간
  startTime, // 렌더링 시작 시간
  commitTime // 커밋 시간
) {
  console.log(`${id} ${phase}: ${actualDuration}ms`);

  // 느린 렌더링 경고
  if (actualDuration > 16) {
    // 60fps = 16ms/frame
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}
```

### 18.9 번들 크기 최적화

```bash
# 번들 분석
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // 기존 설정
})

# 분석 실행
ANALYZE=true npm run build
```

```tsx
// ═══════════════════════════════════════════════════════════════
// 동적 임포트로 코드 분할
// ═══════════════════════════════════════════════════════════════

// ❌ 모든 아이콘이 번들에 포함
import * as Icons from 'lucide-react'

// ✅ 필요한 아이콘만 임포트
import { Home, Settings, User } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// 무거운 라이브러리 지연 로딩
// ═══════════════════════════════════════════════════════════════

// ❌ 초기 번들에 포함
import { Chart } from 'chart.js'

// ✅ 필요할 때 로드
const loadChart = async () => {
  const { Chart } = await import('chart.js')
  return Chart
}

// ═══════════════════════════════════════════════════════════════
// 조건부 로딩
// ═══════════════════════════════════════════════════════════════

// 관리자만 필요한 기능
const AdminPanel = dynamic(
  () => import('./AdminPanel'),
  {
    loading: () => <Spinner />,
    ssr: false,
  }
)

function Dashboard({ isAdmin }) {
  return (
    <div>
      <UserDashboard />
      {isAdmin && <AdminPanel />}  {/* 관리자만 로드 */}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Tree Shaking 확인
// ═══════════════════════════════════════════════════════════════

// package.json - sideEffects 확인
{
  "sideEffects": false,  // 또는 특정 파일 배열
}

// ❌ 전체 임포트
import _ from 'lodash'
_.debounce(fn, 300)

// ✅ 개별 함수 임포트
import debounce from 'lodash/debounce'
debounce(fn, 300)

// 또는 lodash-es 사용
import { debounce } from 'lodash-es'
```

### 18.10 캐싱 전략

```tsx
// ═══════════════════════════════════════════════════════════════
// Next.js 캐싱 설정
// ═══════════════════════════════════════════════════════════════

// 정적 페이지 (무한 캐시)
// app/about/page.tsx
export const dynamic = 'force-static';

// ISR (주기적 재검증)
// app/products/page.tsx
export const revalidate = 3600; // 1시간

// 온디맨드 재검증
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { path, tag } = await request.json();

  if (path) {
    revalidatePath(path);
  }
  if (tag) {
    revalidateTag(tag);
  }

  return Response.json({ revalidated: true });
}

// ═══════════════════════════════════════════════════════════════
// fetch 캐싱 (서버 컴포넌트)
// ═══════════════════════════════════════════════════════════════

// 기본: 무한 캐시
const data = await fetch('https://api.example.com/data');

// 캐시 없음
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});

// 시간 기반 재검증
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }, // 1시간
});

// 태그 기반 재검증
const data = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] },
});

// ═══════════════════════════════════════════════════════════════
// React Query 캐싱
// ═══════════════════════════════════════════════════════════════

const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5분간 fresh
  gcTime: 30 * 60 * 1000, // 30분간 캐시 유지 (cacheTime → gcTime)
  refetchOnWindowFocus: false, // 포커스 시 재요청 비활성화
});

// ═══════════════════════════════════════════════════════════════
// Service Worker 캐싱 (PWA)
// ═══════════════════════════════════════════════════════════════

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 1일
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
        },
      },
    },
  ],
});

module.exports = withPWA({
  // 기존 설정
});
```

### 18.11 AI에게 성능 최적화 요청하는 프롬프트

```markdown
## 성능 최적화 요청 프롬프트

다음 컴포넌트/페이지의 성능을 최적화해줘: [대상]

### Core Web Vitals 목표

- LCP: ≤ 2.5초
- INP: ≤ 200ms
- CLS: ≤ 0.1

### 최적화 요구사항

**LCP:**

- 히어로/LCP 이미지에 priority 속성
- 이미지 포맷 최적화 (WebP/AVIF)
- 서버 응답 시간 최소화
- Critical CSS 인라인

**INP:**

- 무거운 JavaScript 동적 임포트
- useTransition/useDeferredValue 활용
- 이벤트 핸들러 최적화

**CLS:**

- 이미지/비디오 크기 명시
- 폰트 font-display: swap
- 동적 콘텐츠 공간 예약

### 추가 요구사항

- 번들 크기 최소화
- 적절한 캐싱 전략
- Suspense로 점진적 로딩
- React Query/SWR 캐싱 활용
```

### 18.12 성능 최적화 체크리스트

```
□ LCP 최적화
  - [ ] LCP 이미지에 priority 속성
  - [ ] 이미지 포맷 최적화 (WebP/AVIF)
  - [ ] 이미지 크기 최적화 (sizes 속성)
  - [ ] 서버 응답 시간 < 200ms
  - [ ] 폰트 프리로드

□ INP 최적화
  - [ ] 무거운 라이브러리 동적 임포트
  - [ ] useTransition으로 긴급하지 않은 업데이트 분리
  - [ ] 이벤트 핸들러 최적화
  - [ ] 메인 스레드 블로킹 최소화

□ CLS 최적화
  - [ ] 모든 이미지/비디오에 크기 지정
  - [ ] 폰트 font-display 설정
  - [ ] 동적 콘텐츠 공간 예약
  - [ ] 상단에 콘텐츠 삽입 금지

□ 로딩 UX
  - [ ] Suspense로 점진적 로딩
  - [ ] Skeleton UI 적용
  - [ ] 100ms 지연 로딩 표시기
  - [ ] Optimistic UI 적용

□ 캐싱
  - [ ] 정적 페이지 SSG/ISR 활용
  - [ ] fetch 캐싱 설정
  - [ ] React Query staleTime 설정
  - [ ] 이미지 CDN 캐싱

□ 번들 최적화
  - [ ] 동적 임포트 활용
  - [ ] Tree shaking 확인
  - [ ] 번들 분석 및 최적화
  - [ ] 불필요한 폴리필 제거
```

### 18.13 다음 챕터 미리보기

**챕터 19: UI 프롬프트 엔지니어링 마스터**에서는 AI에게 UI 컴포넌트를 효과적으로 요청하는 프롬프트 패턴, 반복적 개선 전략, 참조 이미지 활용법 등 바이브 코딩의 핵심 기술을 심층적으로 다룹니다.

---

## 챕터 19: UI 프롬프트 엔지니어링 마스터

### 19.1 왜 프롬프트 엔지니어링이 중요한가?

바이브 코딩의 품질은 **프롬프트의 품질에 직결**됩니다. 같은 AI 도구를 사용해도 프롬프트에 따라 결과물이 완전히 달라집니다.

```
┌─────────────────────────────────────────────────────────────────┐
│              프롬프트 품질에 따른 결과 차이                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ 나쁜 프롬프트:                                               │
│  ─────────────────                                              │
│  "로그인 폼 만들어줘"                                            │
│                                                                 │
│  결과:                                                           │
│  • 기본적인 HTML 폼                                              │
│  • 스타일 없거나 일관성 없음                                     │
│  • 유효성 검사 없음                                              │
│  • 로딩/에러 상태 없음                                           │
│  • 접근성 고려 없음                                              │
│                                                                 │
│  → 수정에 추가 5-10번의 대화 필요                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✅ 좋은 프롬프트:                                               │
│  ─────────────────                                              │
│  "React + TypeScript로 로그인 폼 만들어줘.                       │
│   shadcn/ui Button, Input 사용.                                 │
│   이메일/비밀번호 필드, Zod 유효성 검사,                         │
│   로딩/에러/성공 상태, WCAG AA 접근성."                          │
│                                                                 │
│  결과:                                                           │
│  • 완전한 기능의 폼 컴포넌트                                     │
│  • 디자인 시스템 준수                                            │
│  • 모든 상태 구현                                                │
│  • 접근성 준수                                                   │
│                                                                 │
│  → 첫 번째 결과로 거의 완성                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 19.2 효과적인 프롬프트의 5가지 구성요소

```
┌─────────────────────────────────────────────────────────────────┐
│              프롬프트의 5가지 핵심 구성요소                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 역할 (Role)                                                  │
│  ─────────────────                                              │
│  AI에게 전문가 역할 부여                                         │
│                                                                 │
│  "당신은 React와 Tailwind CSS 전문 시니어 프론트엔드             │
│   개발자입니다. 접근성과 성능을 중시합니다."                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  2. 컨텍스트 (Context)                                           │
│  ───────────────────────                                        │
│  프로젝트 배경, 기술 스택, 제약 조건                             │
│                                                                 │
│  "Next.js 14 App Router 프로젝트입니다.                          │
│   shadcn/ui와 Tailwind CSS를 사용합니다.                        │
│   TypeScript strict 모드입니다."                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  3. 작업 (Task)                                                  │
│  ───────────────                                                │
│  구체적으로 무엇을 만들어야 하는지                               │
│                                                                 │
│  "사용자 프로필 카드 컴포넌트를 만들어주세요.                    │
│   아바타, 이름, 역할, 팔로우 버튼을 포함합니다."                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  4. 요구사항 (Requirements)                                      │
│  ───────────────────────────                                    │
│  기능적/비기능적 요구사항 상세                                   │
│                                                                 │
│  "- 로딩 상태: Skeleton UI                                       │
│   - 에러 상태: 에러 메시지 + 재시도                              │
│   - 반응형: 모바일 우선                                          │
│   - 접근성: WCAG AA 준수"                                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  5. 형식 (Format)                                                │
│  ─────────────────                                              │
│  출력 형식 지정                                                   │
│                                                                 │
│  "- 완전한 작동 코드                                             │
│   - TypeScript 타입 정의 포함                                    │
│   - 핵심 로직에 주석                                             │
│   - 사용 예시 포함"                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 19.3 UI 컴포넌트 요청 마스터 템플릿

**범용 UI 컴포넌트 프롬프트 템플릿:**

```markdown
## 역할

당신은 React/TypeScript 전문 시니어 프론트엔드 개발자입니다.
클린 코드, 접근성, 성능 최적화를 중시합니다.

## 프로젝트 컨텍스트

- Framework: Next.js 14 (App Router)
- UI Library: shadcn/ui
- Styling: Tailwind CSS
- Language: TypeScript (strict mode)
- State: React Hook Form + Zod (폼)

## 작업

[컴포넌트명] 컴포넌트를 만들어주세요.

## 기능 요구사항

- [기능 1]
- [기능 2]
- [기능 3]

## UI/UX 요구사항

- 상태: 로딩, 성공, 에러, 빈 상태 모두 구현
- 반응형: 모바일 우선 (기본 → md → lg)
- 애니메이션: 호버/클릭 피드백, 부드러운 전환
- 접근성: WCAG 2.1 AA (키보드, 스크린리더, 색상대비)

## 기술적 요구사항

- 기존 컴포넌트 사용: Button, Card, Input from @/components/ui
- 색상: Tailwind 토큰만 사용 (하드코딩 금지)
- 타입: Props 인터페이스 + 내보내기

## 출력 형식

- 완전한 작동 코드 (복사해서 바로 사용 가능)
- TypeScript 타입 정의
- 핵심 로직 인라인 주석
- 사용 예시 코드

## 제외할 것

- 테스트 코드 (별도 요청)
- Storybook 스토리 (별도 요청)
- 과도한 주석
```

### 19.4 상황별 프롬프트 패턴

**패턴 1: 폼 컴포넌트 요청**

```markdown
## 작업

회원가입 폼 컴포넌트를 만들어주세요.

## 필드

1. 이메일 (필수, 이메일 형식 검증)
2. 비밀번호 (필수, 8자 이상, 영문+숫자+특수문자)
3. 비밀번호 확인 (비밀번호와 일치)
4. 이용약관 동의 체크박스 (필수)

## 유효성 검사

- React Hook Form + Zod 사용
- 필드 blur 시 검증
- 비밀번호는 실시간 강도 표시

## 상태

- idle: 기본 상태
- submitting: 제출 중 (버튼 비활성화 + 스피너)
- success: 성공 메시지 또는 리다이렉트
- error: 서버 에러 메시지 (폼 상단)

## 접근성

- 모든 필드에 label 연결
- 에러 메시지 aria-describedby 연결
- 필수 필드 aria-required
- 에러 상태 aria-invalid
- autoComplete 속성
```

**패턴 2: 데이터 리스트 컴포넌트 요청**

````markdown
## 작업

상품 목록 컴포넌트를 만들어주세요.

## 데이터 구조

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}
```
````

## 기능

- 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 3-4열)
- 카테고리 필터 (드롭다운)
- 정렬 (가격순, 평점순, 이름순)
- 무한 스크롤 또는 페이지네이션

## 상태

- loading: Skeleton 그리드 (6개)
- empty: 빈 상태 UI (검색 결과 없음)
- error: 에러 메시지 + 재시도 버튼
- success: 상품 카드 그리드

## 개별 카드

- 이미지 (aspect-square, object-cover)
- 상품명 (1-2줄 말줄임)
- 가격 (원화 포맷)
- 평점 (별 아이콘)
- 품절 표시 (회색 오버레이 + 텍스트)

````

**패턴 3: 모달/다이얼로그 요청**

```markdown
## 작업
삭제 확인 모달 컴포넌트를 만들어주세요.

## Props
- isOpen: boolean
- onClose: () => void
- onConfirm: () => Promise<void>
- title: string
- description: string
- itemName?: string (삭제 대상 이름)

## 기능
- 배경 클릭 시 닫기
- Escape 키로 닫기
- 포커스 트랩 (모달 내부에서만 Tab 이동)
- 열릴 때 첫 번째 버튼에 포커스
- 닫힐 때 트리거 요소로 포커스 복원

## 애니메이션
- 배경: 페이드 인/아웃
- 모달: 스케일 + 페이드 (Framer Motion)
- AnimatePresence로 퇴장 애니메이션

## 버튼
- 취소: variant="outline", 왼쪽
- 삭제: variant="destructive", 오른쪽, 로딩 상태

## 접근성
- role="dialog"
- aria-modal="true"
- aria-labelledby (제목 연결)
- aria-describedby (설명 연결)
````

**패턴 4: 네비게이션 컴포넌트 요청**

````markdown
## 작업

반응형 헤더 네비게이션을 만들어주세요.

## 구조

- 로고 (왼쪽)
- 메인 네비게이션 (가운데 또는 왼쪽 정렬)
- 액션 버튼들 (오른쪽: 검색, 알림, 프로필)

## 반응형 동작

- 데스크톱 (lg+): 가로 메뉴, 모든 요소 표시
- 모바일/태블릿: 햄버거 메뉴, 슬라이드 인 사이드바

## 메뉴 아이템

```typescript
const navItems = [
  { label: '홈', href: '/' },
  { label: '제품', href: '/products', children: [...] },
  { label: '가격', href: '/pricing' },
  { label: '블로그', href: '/blog' },
]
```
````

## 드롭다운 메뉴

- 호버 시 열림 (데스크톱)
- 클릭 시 열림 (모바일)
- 키보드 네비게이션 (Arrow 키)

## 현재 페이지 표시

- aria-current="page"
- 시각적 강조 (밑줄 또는 배경색)

## 모바일 메뉴

- 햄버거 버튼: aria-expanded, aria-controls
- 사이드바: 왼쪽에서 슬라이드 인
- 배경 오버레이 (클릭 시 닫기)
- 포커스 트랩

```

### 19.5 반복적 개선 (Iterative Refinement) 전략

**한 번에 완벽한 결과를 기대하지 마세요.** 3단계 반복 전략을 사용합니다.

```

┌─────────────────────────────────────────────────────────────────┐
│ 3단계 반복 개선 전략 │
├─────────────────────────────────────────────────────────────────┤
│ │
│ 1단계: 구조 (Structure) │
│ ──────────────────────── │
│ "기본 구조와 레이아웃만 만들어줘. │
│ 스타일링은 최소한으로." │
│ │
│ 목표: 컴포넌트 구조, Props, 기본 로직 │
│ 검토: 구조가 맞는지, Props가 적절한지 │
│ │
│ ───────────────────────────────────────────────────────────── │
│ │
│ 2단계: 기능 (Functionality) │
│ ────────────────────────── │
│ "이제 모든 상태(로딩, 에러, 빈 상태)를 추가해줘. │
│ 유효성 검사와 에러 핸들링도 포함해줘." │
│ │
│ 목표: 완전한 기능, 모든 상태, 에러 처리 │
│ 검토: 모든 케이스가 처리되는지 │
│ │
│ ───────────────────────────────────────────────────────────── │
│ │
│ 3단계: 스타일 & 애니메이션 (Polish) │
│ ─────────────────────────────────── │
│ "디자인을 다듬어줘: │
│ - 호버/클릭 애니메이션 추가 │
│ - 반응형 개선 │
│ - 접근성 최종 점검" │
│ │
│ 목표: 프로덕션 품질, 세련된 UX │
│ 검토: 최종 품질 확인 │
│ │
└─────────────────────────────────────────────────────────────────┘

````

**실제 대화 예시:**

```markdown
# 1단계 프롬프트
"상품 카드 컴포넌트의 기본 구조만 만들어줘.
이미지, 제목, 가격, 버튼이 있는 단순한 카드.
스타일링은 기본 Tailwind만."

# AI 응답 후 검토...

# 2단계 프롬프트
"좋아. 이제 다음을 추가해줘:
1. 로딩 상태 (Skeleton)
2. 이미지 로드 실패 시 플레이스홀더
3. 품절 상태 표시
4. 가격 포맷팅 (원화, 천 단위 콤마)"

# AI 응답 후 검토...

# 3단계 프롬프트
"마지막으로 다듬어줘:
1. 카드 호버 시 살짝 떠오르는 효과 (shadow + translateY)
2. 이미지 호버 시 확대 효과 (scale)
3. 버튼 클릭 피드백 (scale 0.95)
4. 품절 상태 시 회색 오버레이 + opacity"
````

### 19.6 구체적인 수정 요청 패턴

**모호한 요청 vs 구체적인 요청:**

```markdown
# ❌ 모호한 요청

"이거 좀 더 예쁘게 해줘"
"버튼이 이상해"
"반응형이 안 돼"

# ✅ 구체적인 요청

## 스타일 수정

"버튼의 패딩을 px-4 py-2에서 px-6 py-3으로 늘려줘.
호버 시 배경색을 primary/90으로 변경해줘."

## 레이아웃 수정

"모바일에서 카드가 2열로 표시되는데,
1열로 변경하고 카드 사이 간격을 gap-4에서 gap-6으로 늘려줘."

## 기능 수정

"폼 제출 후 성공 메시지가 표시되는데,
3초 후 자동으로 사라지도록 해줘.
그리고 메시지 옆에 닫기 버튼도 추가해줘."

## 애니메이션 수정

"모달 열림 애니메이션이 너무 빨라.
duration을 200ms에서 300ms로 늘리고,
easing을 ease-out으로 변경해줘."

## 접근성 수정

"아이콘 버튼에 aria-label이 없어.
설정 버튼에 '설정 열기',
닫기 버튼에 '모달 닫기' aria-label을 추가해줘."
```

### 19.7 참조 이미지/코드 활용법

**참조를 제공하면 AI가 더 정확하게 이해합니다.**

````markdown
## 참조 이미지 활용

"첨부한 이미지와 유사한 카드 컴포넌트를 만들어줘.

관찰되는 특징:

- 둥근 모서리 (rounded-xl 정도)
- 미묘한 그림자 (shadow-sm)
- 이미지 상단, 콘텐츠 하단 구조
- 가격은 굵은 글씨, 원래 가격은 취소선
- 태그/뱃지가 이미지 위에 오버레이
- 하트 아이콘이 우상단에 위치

이 스타일을 참고해서 구현해줘."

## 참조 코드 활용

"다음 기존 컴포넌트 스타일을 참고해서 새 컴포넌트를 만들어줘:

```tsx
// 기존 Button 컴포넌트
<Button
  className="rounded-lg px-4 py-2 font-medium
             transition-all duration-200
             hover:shadow-md active:scale-95"
>
```
````

이 버튼과 일관된 스타일로
Card, Badge, Input 컴포넌트를 만들어줘."

## 참조 사이트 활용

"Linear 앱(linear.app)의 이슈 카드 스타일을 참고해줘.
특히:

- 미니멀한 디자인
- 미묘한 보더
- 호버 시 배경색 변화
- 아이콘과 텍스트 정렬"

````

### 19.8 부정 프롬프트 (하지 말아야 할 것 명시)

**"하지 말 것"을 명시하면 원치 않는 결과를 방지**할 수 있습니다.

```markdown
## 작업
대시보드 사이드바 네비게이션을 만들어줘.

## 해야 할 것
- shadcn/ui 컴포넌트 사용
- Tailwind CSS 토큰 사용
- 키보드 네비게이션 지원
- 현재 페이지 표시

## 하지 말 것 ❌
- 인라인 스타일 사용 금지
- 하드코딩된 색상 값 금지 (예: #3b82f6)
- CSS 모듈 또는 styled-components 사용 금지
- 서드파티 아이콘 라이브러리 금지 (lucide-react만 사용)
- console.log 남기지 않기
- any 타입 사용 금지
- 주석 과다 사용 금지 (핵심 로직만)
- 불필요한 div 래퍼 금지
````

### 19.9 컨텍스트 유지 전략

**긴 대화에서 AI가 이전 컨텍스트를 잊지 않도록** 합니다.

```markdown
## 대화 시작 시 컨텍스트 설정

"이 대화에서 우리는 전자상거래 프로젝트의 UI를 만들 거야.

프로젝트 정보:

- Next.js 14 + TypeScript
- shadcn/ui + Tailwind CSS
- 주요 색상: primary (blue), secondary (gray)
- 폰트: Inter

만들어야 할 컴포넌트:

1. ProductCard
2. ProductList
3. ProductFilter
4. Cart
5. Checkout

이 정보를 기억하고, 모든 컴포넌트에서 일관성을 유지해줘."

## 중간에 컨텍스트 리마인드

"앞서 정의한 프로젝트 컨텍스트를 기억해줘.
지금은 3번 ProductFilter를 만들 거야.
1번 ProductCard, 2번 ProductList와 스타일이 일관되어야 해."

## 요약 요청으로 동기화

"지금까지 만든 컴포넌트들의 공통 스타일 패턴을 요약해줘.
다음 컴포넌트에서도 이 패턴을 따를 거야."
```

### 19.10 복잡한 UI를 단계별로 분해하기

**복잡한 UI는 작은 단위로 나눠서 요청**합니다.

```markdown
## ❌ 나쁜 예: 한 번에 전체 요청

"전자상거래 체크아웃 페이지 전체를 만들어줘.
장바구니 요약, 배송 정보 폼, 결제 정보 폼,
쿠폰 입력, 주문 요약, 결제 버튼 모두 포함."

→ 결과가 불완전하거나, 각 부분의 품질이 낮음

## ✅ 좋은 예: 단계별 분해

### 1단계: 레이아웃 구조

"체크아웃 페이지의 레이아웃만 만들어줘.
왼쪽: 폼 영역 (70%)
오른쪽: 주문 요약 (30%)
스티키 사이드바 (데스크톱)
모바일에서는 세로 스택"

### 2단계: 장바구니 요약 컴포넌트

"주문 요약 사이드바 컴포넌트를 만들어줘.

- 상품 목록 (이미지, 이름, 수량, 가격)
- 소계
- 배송비
- 할인 (있으면)
- 총액"

### 3단계: 배송 정보 폼

"배송 정보 입력 폼을 만들어줘.

- 이름, 전화번호
- 우편번호 검색 (다음 주소 API)
- 상세 주소
- 배송 메모"

### 4단계: 결제 정보 폼

"결제 수단 선택 + 카드 정보 폼을 만들어줘.

- 결제 수단: 카드, 계좌이체, 간편결제
- 카드 선택 시: 카드번호, 유효기간, CVC
- 각 수단별 조건부 렌더링"

### 5단계: 통합

"만든 컴포넌트들을 체크아웃 페이지에 통합해줘.
단계별 진행 표시기 추가하고,
각 단계 간 상태 공유 로직도 추가해줘."
```

### 19.11 디버깅 요청 패턴

**AI에게 문제 해결을 요청할 때의 패턴:**

```markdown
## 에러 메시지와 함께 요청

"이 컴포넌트에서 다음 에러가 발생해:
```

TypeError: Cannot read property 'map' of undefined

````

관련 코드:
```tsx
function ProductList({ products }) {
  return products.map(p => <ProductCard key={p.id} {...p} />)
}
````

원인을 찾고 수정해줘."

## 예상과 다른 동작 설명

"문제:
기대 동작: 버튼 클릭 시 모달이 열림
실제 동작: 클릭해도 아무 반응 없음

코드:

```tsx
const [isOpen, setIsOpen] = useState(false)

<Button onClick={setIsOpen(true)}>열기</Button>
```

뭐가 잘못된 건지 찾아줘."

## 스타일 문제 설명

"문제:

- 모바일에서 텍스트가 잘림
- overflow-hidden이 적용되어 있는데도 가로 스크롤 발생

코드:

```tsx
<div className="w-full overflow-hidden">
  <p className="text-nowrap">긴 텍스트...</p>
</div>
```

원인과 해결책을 알려줘."

## 성능 문제 설명

"이 컴포넌트가 부모 리렌더 시마다 리렌더돼.
memo를 써봤는데도 소용없어.

```tsx
const ExpensiveList = memo(({ items, onSelect }) => {
  // 많은 아이템 렌더링
})

// 부모
function Parent() {
  const handleSelect = (id) => { ... }
  return <ExpensiveList items={items} onSelect={handleSelect} />
}
```

왜 memo가 작동 안 하는지, 어떻게 고쳐야 하는지 알려줘."

````

### 19.12 프롬프트 템플릿 라이브러리

**자주 사용하는 프롬프트를 저장해두세요:**

```markdown
## 템플릿 1: 새 컴포넌트 생성

---
## 역할
시니어 React/TypeScript 프론트엔드 개발자

## 컨텍스트
- Next.js 14 App Router
- shadcn/ui + Tailwind CSS
- TypeScript strict

## 작업
[컴포넌트명] 컴포넌트 생성

## 기능
- [기능 1]
- [기능 2]

## 상태
- 로딩: Skeleton
- 에러: 메시지 + 재시도
- 빈 상태: 안내 + CTA
- 성공: 데이터 표시

## 요구사항
- 반응형 (모바일 우선)
- 접근성 WCAG AA
- TypeScript 타입 정의

## 사용 컴포넌트
@/components/ui에서: Button, Card, Input 등

## 출력
- 완전한 코드
- 타입 정의
- 사용 예시
---

## 템플릿 2: 기존 컴포넌트 수정

---
## 현재 코드
```tsx
[기존 코드 붙여넣기]
````

## 변경 요청

1. [수정 사항 1]
2. [수정 사항 2]

## 유지할 것

- 기존 Props 인터페이스
- 기존 스타일 패턴
- 기존 상태 관리 방식

## 출력

- 수정된 전체 코드
- 변경 사항 요약

---

## 템플릿 3: 코드 리뷰 요청

---

## 코드

```tsx
[코드 붙여넣기]
```

## 리뷰 관점

- [ ] 접근성 문제
- [ ] 성능 문제
- [ ] 타입 안전성
- [ ] 코드 중복
- [ ] 에러 핸들링
- [ ] 엣지 케이스

## 출력

- 문제점 목록 (심각도 표시)
- 각 문제의 수정 제안
- 개선된 코드 (선택적)

---

```

### 19.13 AI 도구별 최적화 팁

```

┌─────────────────────────────────────────────────────────────────┐
│ AI 도구별 프롬프트 팁 │
├─────────────────────────────────────────────────────────────────┤
│ │
│ Claude (Claude.ai, Claude Code) │
│ ───────────────────────────────── │
│ 강점: 긴 컨텍스트, 상세한 설명, 코드 품질 │
│ 팁: │
│ • CLAUDE.md에 프로젝트 컨텍스트 저장 │
│ • 상세한 요구사항 제공 (Claude는 긴 프롬프트 잘 처리) │
│ • "생각해보면..." 형식으로 추론 유도 │
│ • XML 태그로 구조화된 프롬프트 효과적 │
│ │
│ ───────────────────────────────────────────────────────────── │
│ │
│ Cursor │
│ ──────── │
│ 강점: 코드베이스 인식, 인라인 수정 │
│ 팁: │
│ • .cursorrules에 프로젝트 규칙 정의 │
│ • @파일명으로 특정 파일 참조 │
│ • Cmd+K로 인라인 수정 (작은 변경) │
│ • Composer로 여러 파일 동시 수정 │
│ │
│ ───────────────────────────────────────────────────────────── │
│ │
│ v0.dev │
│ ─────── │
│ 강점: 빠른 UI 프로토타이핑, shadcn/ui 네이티브 │
│ 팁: │
│ • 참조 이미지/URL 적극 활용 │
│ • 간결한 프롬프트가 효과적 │
│ • "shadcn 스타일로" 명시 │
│ • 생성 후 "더 미니멀하게" 등으로 반복 개선 │
│ │
│ ───────────────────────────────────────────────────────────── │
│ │
│ GitHub Copilot │
│ ─────────────── │
│ 강점: 인라인 자동완성, 빠른 제안 │
│ 팁: │
│ • 주석으로 의도 설명 후 코드 생성 유도 │
│ • 함수 시그니처 먼저 작성 → 구현 자동완성 │
│ • Tab으로 제안 수락, Esc로 거부 │
│ │
└─────────────────────────────────────────────────────────────────┘

```

### 19.14 프롬프트 엔지니어링 체크리스트

```

□ 프롬프트 구성

- [ ] 역할/페르소나 설정
- [ ] 프로젝트 컨텍스트 제공
- [ ] 구체적인 작업 설명
- [ ] 기능적 요구사항 명시
- [ ] 비기능적 요구사항 (접근성, 성능)
- [ ] 출력 형식 지정
- [ ] 하지 말 것 명시

□ 효과적인 요청

- [ ] 한 번에 하나의 작업에 집중
- [ ] 복잡한 작업은 단계별로 분해
- [ ] 참조 이미지/코드 제공
- [ ] 구체적인 수정 지시

□ 반복 개선

- [ ] 구조 → 기능 → 스타일 순서
- [ ] 각 단계 결과 검토 후 진행
- [ ] 구체적인 피드백 제공

□ 컨텍스트 관리

- [ ] CLAUDE.md / .cursorrules 활용
- [ ] 세션 시작 시 컨텍스트 설정
- [ ] 필요시 컨텍스트 리마인드
- [ ] 긴 대화 시 요약 요청

```

### 19.15 다음 챕터 미리보기

**챕터 20: 디자이너 없이 작업하는 워크플로우**에서는 v0.dev, Bolt.new 등 AI 디자인 도구 활용법, 경쟁사 분석과 디자인 참조 전략, 저비용 사용자 피드백 수집 방법, UI/UX 결정 문서화(ADR) 등 솔로 개발자가 디자이너 없이도 품질 높은 UI를 만드는 실전 워크플로우를 다룹니다.

---

## 챕터 20: 디자이너 없이 작업하는 워크플로우

> 작성 예정
```
