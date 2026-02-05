# 진행 상황

## 완료됨 ✅

### 컨셉 개발
- [x] 공항/비행 테마 확정
- [x] 용어 체계 정리 (Captain, Waypoint, Flight Center 등)
- [x] 경쟁사 분석 및 포지셔닝
- [x] 글로벌 확장 전략 수립

### 데모 대시보드
- [x] React + Vite 프로젝트 셋업
- [x] Tailwind CSS v4 설정 (@tailwindcss/postcss)
- [x] 6개 화면 구현
- [x] 컬러 스킴 변경 (다크 → 밝은 스카이 블루)
- [x] Glass morphism UI 적용

### 기억 시스템
- [x] `ai` 폴더 구조 결정
- [x] 4개 기억 파일 생성

### 풀 시스템 기반 (2026-02-04)
- [x] Supabase 프로젝트 생성 (gqccxvlmbwtzbkhpchut)
- [x] Next.js 16 프로젝트 생성 (TypeScript + Tailwind)
- [x] Supabase 클라이언트 설정 (client.ts, server.ts)
- [x] 환경변수 설정 (.env.local)
- [x] 매직 링크 로그인 시스템 구현
- [x] 인증 미들웨어 (보호된 라우트)
- [x] 홈페이지, 로그인 페이지, 대시보드 페이지

---

## 다음 할 일 📋

### 1단계: 데이터베이스 (다음 세션)
- [ ] Supabase에 테이블 생성 (customers, companies, waypoints, documents)
- [ ] Row Level Security (RLS) 정책 설정
- [ ] 실제 데이터 연동

### 2단계: 핵심 기능
- [ ] 고객별 회사 데이터 표시
- [ ] 문서 업로드/다운로드 (Supabase Storage)
- [ ] Waypoint 알림 시스템

### 3단계: 다국어
- [ ] i18n 설정
- [ ] 한국어/영어 번역
- [ ] (추후) 일본어 추가

### 4단계: 배포
- [ ] Vercel 배포
- [ ] 도메인 연결
- [ ] 이메일 시스템 (Resend)

---

## 파일 위치

### 데모 (React + Vite)
- `/jetprimer-dashboard/src/App.jsx`
- `/jetprimer-dashboard/preview.html`

### 풀 시스템 (Next.js + Supabase)
- `/jetprimer-dashboard/jetprimer-next/`
- `/jetprimer-dashboard/jetprimer-next/src/app/` — 페이지들
- `/jetprimer-dashboard/jetprimer-next/src/lib/supabase/` — Supabase 클라이언트
- `/jetprimer-dashboard/jetprimer-next/.env.local` — 환경변수

---

## Supabase 정보
- **Project ID**: gqccxvlmbwtzbkhpchut
- **Region**: ap-northeast-2 (Seoul)
- **URL**: https://gqccxvlmbwtzbkhpchut.supabase.co
