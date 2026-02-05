# 배포 가이드

## 개요
JetPrimer 대시보드의 배포 설정 및 관리에 대한 문서입니다.

---

## 1. 배포 환경

### 프로덕션 URL (커스텀 도메인)
```
https://dashboard.jetprimer.com
```

### Vercel 도메인 (백업)
```
https://jetprimer-dashboard.vercel.app
```

### GitHub 저장소
```
https://github.com/j9898/jetprimer-dashboard
```

### 도메인 등록처
- **포크번 (Forkburn)**에서 도메인 구매
- `dashboard.jetprimer.com` - 대시보드용
- `jetprimer.com` - 마케팅 랜딩 페이지용

### 배포 플랫폼
- **플랫폼**: Vercel
- **자동 배포**: GitHub main 브랜치 push 시 자동 배포

---

## 2. 배포 흐름

```
GitHub Push → Vercel 자동 빌드 → 배포 완료
```

### 자동 배포 트리거
1. `main` 브랜치에 코드 push
2. Pull Request 머지
3. Vercel이 자동으로 빌드 시작
4. 빌드 성공 시 자동 배포

---

## 3. Vercel 설정

### 프로젝트 설정
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 환경 변수
Vercel 대시보드에서 설정 필요:
```
NEXT_PUBLIC_SUPABASE_URL=https://gqccxvlmbwtzbkhpchut.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 4. 배포 문제 해결

### 빌드 실패 시
1. Vercel 대시보드에서 빌드 로그 확인
2. 에러 메시지 확인
3. 로컬에서 `npm run build` 실행하여 동일한 에러 재현

### 일반적인 빌드 에러

#### TypeScript 에러
```bash
npm run build
# 타입 에러 확인 및 수정
```

#### 모듈 import 에러
```bash
npm install
# package.json 의존성 확인
```

#### 환경 변수 누락
- Vercel 대시보드에서 환경 변수 설정 확인

---

## 5. 로컬 개발 환경

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드 테스트
npm run build

# 프로덕션 모드 실행
npm start
```

### 로컬 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gqccxvlmbwtzbkhpchut.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 6. 도메인 설정

### 현재 도메인 구성
| 도메인 | 용도 | 연결 |
|--------|------|------|
| dashboard.jetprimer.com | 대시보드 | Vercel |
| jetprimer.com | 마케팅 페이지 | 별도 호스팅 |

### 포크번 DNS 설정
dashboard.jetprimer.com이 Vercel을 가리키도록 설정:

```
CNAME dashboard cname.vercel-dns.com
```

또는 A 레코드:
```
A dashboard 76.76.21.21
```

### Vercel 커스텀 도메인 추가 방법
1. Vercel 대시보드 > Project > Settings > Domains
2. `dashboard.jetprimer.com` 입력
3. Add 클릭
4. 포크번에서 DNS 설정 확인/변경

### 도메인 연결 후 필수 작업
1. **Supabase Site URL 변경**: `https://dashboard.jetprimer.com`
2. **Supabase Redirect URLs 추가**: `https://dashboard.jetprimer.com/**`
3. **Google OAuth 승인된 도메인 추가**: `jetprimer.com`

---

## 7. 모니터링

### Vercel Analytics
- Vercel 대시보드에서 트래픽 및 성능 모니터링 가능

### 에러 모니터링
- Vercel 대시보드 > Logs에서 런타임 에러 확인 가능

---

## 8. 롤백

### 이전 배포로 롤백
1. Vercel 대시보드 > Deployments
2. 롤백할 이전 배포 선택
3. "..." 메뉴 > "Promote to Production" 클릭
