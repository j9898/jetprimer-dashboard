# JetPrimer

## 한 줄 요약
비거주자를 위한 프리미엄 미국 LLC 설립 서비스. 공항/비행 테마의 대시보드로 신뢰를 구축하고, 설립 후 컴플라이언스 관리까지 제공.

## 핵심 컨셉: 공항 (Airport)
LLC 설립 여정을 "비행"에 비유. 고객은 Captain, 마감일은 Waypoint, 대시보드는 Flight Center.

### 용어 매핑
| 일반 용어 | JetPrimer 용어 |
|----------|---------------|
| 고객 | Captain |
| 회사 | Aircraft |
| 마감일/일정 | Waypoint |
| 대시보드 | Flight Center |
| 컴플라이언스 캘린더 | Flight Plan |
| 문서 보관함 | Cargo Hold |
| 회사 정보 | My Passport / Boarding Pass |
| 고객지원 | Call Crew |
| 회사 상태 | cruising, boarding, delayed 등 |

## 타겟 시장
1. **1차**: 한국 (388만원)
2. **2차**: 일본 (55万円)
3. **3차**: 글로벌 비영어권

## 가격
- $2,900 USD
- 388만원 KRW
- 55万円 JPY

## 경쟁사 대비 포지셔닝
Stripe Atlas, Firstbase, Doola 등이 있지만, 비영어권 고객을 위한 프리미엄 경험에 집중. 대시보드는 "신뢰 구축"을 위한 마케팅 도구.

## 기술 스택

### 현재 (데모)
- React + Vite
- Tailwind CSS v4 (@tailwindcss/postcss)
- 밝은 스카이 블루 테마 (glass morphism)

### 계획 (풀 시스템)
- Next.js (App Router)
- Supabase (Auth, Database, Storage)
- Vercel (배포)
- Resend (이메일)
- i18n (다국어: 한/일/영)

## 디자인
- 컬러: 밝은 스카이 블루 그라데이션 (`sky-100 → blue-50 → indigo-100`)
- 스타일: Glass morphism (반투명 + backdrop blur)
- 폰트: Inter (본문), JetBrains Mono (코드/숫자)
