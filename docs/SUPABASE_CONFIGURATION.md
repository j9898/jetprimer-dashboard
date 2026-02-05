# Supabase 설정 가이드

## 개요
JetPrimer 대시보드의 Supabase 프로젝트 설정에 대한 문서입니다.

## 최종 업데이트
2026년 2월 4일 - Site URL 및 Redirect URLs 수정

---

## 1. Supabase 프로젝트 정보

### 프로젝트 URL
```
https://gqccxvlmbwtzbkhpchut.supabase.co
```

### API 키 (anon/public)
```
환경 변수에서 NEXT_PUBLIC_SUPABASE_ANON_KEY 확인
```

### Supabase 대시보드 접속
https://supabase.com/dashboard

---

## 2. Authentication 설정

### 이메일/비밀번호 인증
- **상태**: 활성화됨
- **이메일 확인**: 선택적 (Confirm email 비활성화 가능)

### Google OAuth Provider
- **상태**: 활성화됨 (Enabled)
- **Client ID**: `687294216305-gt2g0hv1uv78nnetud3m34bjebk9v0j1.apps.googleusercontent.com`
- **Client Secret**: `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`

### 리디렉션 URL
Supabase가 OAuth 콜백을 처리하는 URL:
```
https://gqccxvlmbwtzbkhpchut.supabase.co/auth/v1/callback
```

---

## 3. Site URL 설정

Supabase Authentication > URL Configuration에서 설정:

### Site URL
```
https://dashboard.jetprimer.com
```

> **중요**: 이전에 `http://localhost:3000`으로 설정되어 있었으나, 프로덕션 도메인으로 변경됨 (2026-02-04)

### Redirect URLs (허용된 리디렉션 URL)
```
https://dashboard.jetprimer.com/**
https://jetprimer-dashboard.vercel.app/**
http://localhost:3000/**
```

> **중요**: Google OAuth 사용 시 위의 모든 URL이 Supabase Redirect URLs에 등록되어 있어야 합니다.

---

## 4. 환경 변수 설정

### .env.local 파일
```env
NEXT_PUBLIC_SUPABASE_URL=https://gqccxvlmbwtzbkhpchut.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Vercel 환경 변수
Vercel 프로젝트 설정에서 동일한 환경 변수를 설정해야 합니다:
1. Vercel Dashboard > Project > Settings > Environment Variables
2. 위의 변수들을 추가

---

## 5. 데이터베이스 테이블

### users 테이블 (auth.users)
Supabase Auth가 자동으로 관리하는 사용자 테이블

### profiles 테이블 (public.profiles)
사용자 프로필 정보를 저장하는 커스텀 테이블 (필요시 생성)

---

## 6. Supabase 설정 변경 방법

### Site URL 및 Redirect URLs 변경
1. Supabase Dashboard 접속
2. Authentication > URL Configuration
3. Site URL 및 Redirect URLs 수정
4. Save 클릭

### Google Provider 설정 변경
1. Supabase Dashboard 접속
2. Authentication > Providers
3. Google 클릭
4. Client ID, Client Secret 수정
5. Save 클릭

### 새로운 OAuth Provider 추가
1. Authentication > Providers
2. 원하는 Provider 선택 (GitHub, Facebook 등)
3. 해당 서비스의 OAuth 앱 생성
4. Client ID, Client Secret 입력
5. Save 클릭

---

## 7. 관련 파일

### 클라이언트 설정
- `/src/lib/supabase/client.ts` - 클라이언트 사이드 Supabase 클라이언트
- `/src/lib/supabase/server.ts` - 서버 사이드 Supabase 클라이언트

### 인증 관련
- `/src/app/login/page.tsx` - 로그인 페이지
- `/src/app/signup/page.tsx` - 회원가입 페이지
- `/src/app/auth/callback/route.ts` - OAuth 콜백 핸들러
- `/src/middleware.ts` - 인증 미들웨어
