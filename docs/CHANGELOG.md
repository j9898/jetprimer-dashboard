# 변경 이력 (Changelog)

## 2026-02-05

### GitHub 연결 및 보안 키 로테이션

#### 변경 사항

1. **로컬 폴더 ↔ GitHub 연결 완료**
   - `git init`으로 로컬 저장소 초기화
   - 기존 GitHub 저장소 (j9898/jetprimer-dashboard)와 연결
   - 충돌 해결 후 성공적으로 push 완료

2. **보안 이슈 발견 및 해결**
   - GitHub Push Protection이 문서 내 노출된 OAuth 키 감지
   - `GOOGLE_OAUTH_SETUP.md`와 `SUPABASE_CONFIGURATION.md`에서 Client ID/Secret 제거
   - 실제 키 값을 `[Google Cloud Console에서 확인 - 보안상 Git에 저장하지 않음]`으로 대체

3. **Google OAuth Client Secret 로테이션**
   - 기존 Secret (****uVQg) 삭제
   - 새 Secret (****CeAp) 생성
   - Supabase Google Provider에 새 Secret 적용 완료

#### 보안 관련 학습 내용
- Client ID: Google Cloud Console에서 언제든 확인 가능
- Client Secret: 생성 시에만 전체 값 확인 가능 (이후 끝 4자리만 표시)
- Secret 저장 불필요: Supabase에 저장되어 있으면 충분
- 키 로테이션해도 기존 사용자 데이터는 영향 없음

---

## 2026-02-04 (저녁)

### 비밀번호 없는 인증으로 전환

#### 변경 사항

1. **로그인 페이지 업데이트** (`/src/app/login/page.tsx`)
   - 비밀번호 기반 로그인 제거
   - Google OAuth 유지 (기본 로그인 방법)
   - Magic Link 추가 (이메일로 로그인 링크 발송)
   - UI 개선: Google 로그인 버튼을 상단에 배치

2. **회원가입 페이지 변경** (`/src/app/signup/page.tsx`)
   - 비밀번호 기반 회원가입 제거
   - 로그인 페이지로 자동 리디렉션 처리
   - Google OAuth와 Magic Link가 자동으로 신규 사용자 생성

3. **문서 생성** (`/docs/AUTHENTICATION.md`)
   - 인증 시스템 전체 가이드 작성
   - 운영 관련 정보 문서화 (Google OAuth 관리 계정: cicabearstudio@gmail.com)

#### 설계 결정 사유
- Slack, Notion, Medium이 동일한 조합 사용
- 비밀번호 찾기 문의 제거로 운영 효율성 향상
- 일본 시장 대비 (Google 계정 없는 사용자도 Magic Link로 가입 가능)

---

## 2026-02-04 (오후)

### 프로덕션 배포 설정 완료

#### 변경 사항

1. **Supabase URL Configuration 수정**
   - Site URL: `http://localhost:3000` → `https://dashboard.jetprimer.com`
   - Redirect URLs 추가: `https://dashboard.jetprimer.com/**`

2. **Google OAuth 설정 업데이트**
   - Authorized JavaScript origins 추가: `https://dashboard.jetprimer.com`
   - 이로 인해 `jetprimer.com`이 승인된 도메인에 자동 추가됨

3. **문서 업데이트**
   - Google Cloud 프로젝트 정보 정정 (실제 프로젝트: "My First Project", ID: citric-gradient-440107-e5)
   - 모든 설정 변경 사항 문서화

#### 확인된 설정

| 서비스 | 설정 항목 | 값 |
|--------|----------|-----|
| Vercel | 커스텀 도메인 | dashboard.jetprimer.com (이미 설정됨) |
| Supabase | Site URL | https://dashboard.jetprimer.com |
| Supabase | Redirect URLs | https://dashboard.jetprimer.com/** |
| Google OAuth | JavaScript origins | https://dashboard.jetprimer.com |
| Google OAuth | Redirect URIs | https://gqccxvlmbwtzbkhpchut.supabase.co/auth/v1/callback |

---

## 2026-02-04 (오전)

### Google OAuth 로그인 기능 추가

#### 변경 사항
- 로그인 페이지에 "Google로 로그인" 버튼 추가
- Google OAuth 인증 플로우 구현
- Supabase Google Provider 연동

#### 수정된 파일
- `src/app/login/page.tsx`
  - `isGoogleLoading` state 추가
  - `handleGoogleLogin` 함수 추가
  - Google 로그인 버튼 UI 추가

#### 기존 파일 (변경 없음)
- `src/app/auth/callback/route.ts` - OAuth 콜백 처리 (기존 구현 사용)

#### 설정 변경
1. **Google Cloud Console** (cicabearstudio@gmail.com / My First Project)
   - OAuth 2.0 클라이언트 생성 (이름: JetPrimer)
   - 리디렉션 URI 설정

2. **Supabase**
   - Google Provider 활성화
   - Client ID/Secret 설정

---

## 프로젝트 초기 설정

### 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **스타일링**: Tailwind CSS
- **백엔드**: Supabase
- **배포**: Vercel

### 주요 기능
- [x] 이메일/비밀번호 로그인
- [x] 회원가입
- [x] Google OAuth 로그인
- [x] 커스텀 도메인 설정 (dashboard.jetprimer.com)
- [ ] 대시보드 기능 (진행 중)

### 도메인 정보
- **도메인 등록처**: 포크번 (Forkburn)
- **대시보드 도메인**: dashboard.jetprimer.com
- **마케팅 페이지 도메인**: jetprimer.com

### 프로젝트 구조
```
jetprimer-dashboard/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # 로그인 페이지
│   │   ├── signup/
│   │   │   └── page.tsx          # 회원가입 페이지
│   │   ├── dashboard/
│   │   │   └── page.tsx          # 대시보드 페이지
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts      # OAuth 콜백 핸들러
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts         # 클라이언트 Supabase
│   │       └── server.ts         # 서버 Supabase
│   └── middleware.ts             # 인증 미들웨어
├── docs/                          # 문서
├── public/
├── package.json
└── next.config.ts
```

---

## 알려진 이슈

### Google OAuth 테스트 모드
- 현재 Google OAuth가 테스트 모드로 설정되어 있습니다
- 테스트 사용자로 등록된 Gmail 계정만 로그인 가능
- 프로덕션 배포 전 Google 인증 검토 필요

### 해결 방법
1. Google Cloud Console > OAuth consent screen (cicabearstudio@gmail.com 계정)
2. "PUBLISH APP" 클릭하여 프로덕션으로 전환
3. 또는 테스트 사용자 추가

---

## 향후 계획

- [ ] Google 로그인 테스트 (키 로테이션 후 정상 작동 확인)
- [ ] 대시보드 UI 완성
- [ ] 사용자 프로필 관리
- [ ] 데이터 시각화 기능
- [ ] 추가 OAuth 제공자 (GitHub, Kakao 등)
- [ ] Google OAuth 앱 프로덕션 승인 신청

---

## 서비스 구조 요약

| 서비스 | 역할 | 비유 |
|--------|------|------|
| **Vercel** | 웹사이트를 인터넷에 보여줌 | 🏪 가게 건물 |
| **Supabase** | 데이터 저장 & 로그인 처리 | 🗄️ 냉장고 + 금고 |
| **GitHub** | 코드 저장 & 버전 관리 | 📁 설계도 보관소 |
| **Google Cloud** | OAuth 인증 제공 | 🔑 신분증 발급소 |

### 도메인 구조
| 도메인 | 용도 | Vercel 프로젝트 |
|--------|------|----------------|
| jetprimer.com | 마케팅 랜딩 페이지 | 별도 프로젝트 |
| dashboard.jetprimer.com | 고객 대시보드 | jetprimer-dashboard |
