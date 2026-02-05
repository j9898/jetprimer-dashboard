# Google OAuth 설정 가이드

## 개요
JetPrimer 대시보드의 Google OAuth 로그인 기능 설정에 대한 문서입니다.

## 설정 완료 일자
2026년 2월 4일

## 최종 업데이트
2026년 2월 4일 - Authorized JavaScript origins 추가

---

## 1. Google Cloud Console 설정

### 프로젝트 정보
- **Google 계정**: cicabearstudio@gmail.com
- **프로젝트 이름**: My First Project
- **프로젝트 ID**: citric-gradient-440107-e5

> **중요**: OAuth 클라이언트는 "JetPrimer"라는 이름의 프로젝트가 아닌, cicabearstudio@gmail.com 계정의 "My First Project"에 설정되어 있습니다.

### OAuth 동의 화면 (OAuth Consent Screen)
- **사용자 유형**: External (외부)
- **앱 이름**: JetPrimer
- **지원 이메일**: cicabearstudio@gmail.com
- **승인된 도메인**:
  - `supabase.co`
  - `jetprimer.com`

### OAuth 2.0 클라이언트 자격증명
- **애플리케이션 유형**: 웹 애플리케이션
- **이름**: JetPrimer

#### 클라이언트 ID
```
[Google Cloud Console에서 확인 - 보안상 Git에 저장하지 않음]
```

#### 클라이언트 시크릿
```
[Google Cloud Console에서 확인 - 보안상 Git에 저장하지 않음]
```

#### 승인된 JavaScript 원본 (Authorized JavaScript origins)
```
https://dashboard.jetprimer.com
```

#### 승인된 리디렉션 URI (Authorized redirect URIs)
```
https://gqccxvlmbwtzbkhpchut.supabase.co/auth/v1/callback
```

---

## 2. Google Cloud Console 접속 방법

1. https://console.cloud.google.com 접속
2. **cicabearstudio@gmail.com** 계정으로 로그인
3. 프로젝트 선택: **My First Project** (citric-gradient-440107-e5)
4. 메뉴 > APIs & Services > Credentials
5. OAuth 2.0 Client IDs에서 "JetPrimer" 클릭

---

## 3. 주의사항

### 보안
- 클라이언트 시크릿은 절대 공개 저장소에 커밋하지 마세요
- 프로덕션 환경에서는 환경 변수로 관리하세요

### OAuth 동의 화면 상태
- 현재 **테스트 모드**로 설정되어 있습니다
- 테스트 사용자만 로그인 가능합니다
- 프로덕션 배포 시 Google 인증 검토가 필요할 수 있습니다

### 테스트 사용자 추가 방법
1. Google Cloud Console > APIs & Services > OAuth consent screen
2. "Test users" 섹션에서 "ADD USERS" 클릭
3. 테스트할 Gmail 주소 추가

---

## 4. 관련 링크

- [Google Cloud Console](https://console.cloud.google.com)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
