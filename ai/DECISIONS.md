# 의사결정 기록

## 2026-02-04

### 대시보드의 목적
**결정**: 대시보드는 기술 제품이 아닌 "마케팅 도구"로 활용
**이유**: 고객이 결제 전에 대시보드를 보고 "이 정도로 체계적으로 관리해주는구나"라는 신뢰를 갖게 하는 것이 목적. 대시보드 자체를 SaaS로 판매하는 게 아님.

### 공항 컨셉 채택
**결정**: LLC 설립 여정을 비행에 비유하는 공항 테마 사용
**이유**:
- 여정(journey)의 느낌을 줌
- 프리미엄하고 글로벌한 이미지
- 다양한 메타포 확장 가능 (boarding pass, waypoint, cruising 등)
- 경쟁사와 차별화

### 글로벌 서비스 가능성
**결정**: 한국 시작 → 일본 → 글로벌 확장 계획
**이유**: 공항 컨셉이 문화권 상관없이 통용됨. 비영어권 시장에 프리미엄 서비스 부재.

### 컬러 스킴 변경
**결정**: 다크 앰버 테마 → 밝은 스카이 블루
**이유**: 더 밝고 신뢰감 있는 느낌. 공항/하늘 테마와도 잘 맞음.

### 개발 접근법
**결정**: AI와 함께 풀 시스템을 먼저 개발하고, 지속적으로 개선
**이유**:
- AI 활용으로 개발 비용(시간) 감소
- 실제 작동하는 제품이 PPT보다 설득력 있음
- 신뢰가 핵심인 서비스라 "보여줄 수 있는 것"이 중요

### 기억 시스템
**결정**: `.ai` 폴더에 프로젝트 맥락 파일 저장
**이유**:
- 대화가 끊겨도 맥락 유지 가능
- 다른 프로젝트에도 동일한 컨벤션 적용 가능
- 별도 시스템 없이 파일만으로 해결

---

## 기술 아키텍처

### 백엔드 스택
**결정**: Next.js + Supabase + Vercel + Resend
**이유**:
- **Next.js (App Router)**: 프론트엔드와 API를 한 프로젝트에서 관리. Server Components로 성능 최적화.
- **Supabase**: Auth, Database, Storage를 하나의 서비스로. PostgreSQL 기반이라 확장성 좋음. 무료 티어로 시작 가능.
- **Vercel**: Next.js와 최적 호환. 자동 배포, 프리뷰 환경 제공.
- **Resend**: 개발자 친화적인 이메일 API. Waypoint 알림, 환영 이메일 등에 사용.

### 데이터베이스 스키마
**결정**: 5개 핵심 테이블로 시작

```
customers (고객/Captain)
├── id, email, name, phone, language, timezone
└── created_at, updated_at

companies (회사/Aircraft)
├── id, customer_id, name, flight_number
├── state, ein, formed_date, status
├── bank_name, bank_status
└── ra_provider, ra_renewal_date

waypoints (마감일)
├── id, company_id, name, due_date
├── status (clear, prepare, overdue)
└── notified_30d, notified_7d, notified_1d

documents (문서/Cargo)
├── id, company_id, name, file_path
├── type, uploaded_at
└── storage_url

notifications (알림)
├── id, customer_id, type, title, message
├── read, sent_at
└── related_waypoint_id
```

### 인증 방식
**결정**: Supabase Auth (이메일 + 매직링크)
**이유**:
- 비밀번호 없이 이메일로 로그인 (매직링크)
- 고객 입장에서 간편함
- 나중에 소셜 로그인 추가 가능

### 다국어 지원
**결정**: next-intl 또는 next-i18next 사용
**이유**:
- Next.js App Router와 호환
- URL 기반 로케일 (`/ko`, `/ja`, `/en`)
- 서버/클라이언트 모두 지원
