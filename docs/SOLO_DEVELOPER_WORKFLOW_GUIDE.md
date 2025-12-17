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

> 작성 예정

---

## 챕터 6: 배포 전 검증 자동화

> 작성 예정

---

## 챕터 7: AI 코딩 도구 컨텍스트 관리 전략

> 작성 예정

---

## 챕터 8: 프로젝트 비전 유지와 아키텍처 문서화

> 작성 예정

---

## 챕터 9: 플랫폼별 설정 가이드

> 작성 예정

---

## 챕터 10: 즉시 실행 가능한 액션 플랜

> 작성 예정
