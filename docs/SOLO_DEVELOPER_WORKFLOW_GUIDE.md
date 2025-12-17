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
