# JetPrimer 인증 시스템 가이드

## 개요
JetPrimer 대시보드는 **비밀번호 없는 인증(Passwordless Authentication)**을 사용합니다.

## 최종 업데이트
2026년 2월 4일

---

## 1. 지원하는 인증 방식

| 방식 | 설명 | 상태 |
|------|------|------|
| **Google OAuth** | Google 계정으로 1클릭 로그인 | ✅ 활성화 |
| **Magic Link** | 이메일로 로그인 링크 발송 | ✅ 활성화 |
| ~~이메일/비밀번호~~ | 비밀번호 기반 로그인 | ❌ 제거됨 |

### 이 조합을 선택한 이유

1. **운영 효율성**: 비밀번호 찾기 문의 없음
2. **보안 강화**: 비밀번호 유출 위험 없음
3. **사용자 경험**: 빠른 로그인 (1클릭 또는 이메일 클릭)
4. **일본 시장 대비**: Google 계정 없는 사용자도 Magic Link로 가입 가능
5. **검증된 패턴**: Slack, Notion, Medium이 동일한 조합 사용

---

## 2. 계정 관리 정보

### Google OAuth 관리
- **Google Cloud Console 계정**: cicabearstudio@gmail.com
- **프로젝트**: My First Project (citric-gradient-440107-e5)
- **OAuth 클라이언트 이름**: JetPrimer

### Supabase 관리
- **프로젝트 URL**: https://gqccxvlmbwtzbkhpchut.supabase.co
- **인증 설정 위치**: Authentication > Providers

---

## 3. 인증 플로우

### Google OAuth 플로우
```
사용자가 "Google로 계속하기" 클릭
         ↓
Google 로그인 페이지로 리디렉션
         ↓
Google 인증 완료
         ↓
/auth/callback으로 리디렉션 (code 포함)
         ↓
Supabase가 code를 세션으로 교환
         ↓
/dashboard로 이동
```

### Magic Link 플로우
```
사용자가 이메일 입력 후 "로그인 링크 받기" 클릭
         ↓
Supabase가 이메일 발송 (로그인 링크 포함)
         ↓
사용자가 이메일에서 링크 클릭
         ↓
자동으로 로그인 및 /dashboard로 이동
```

---

## 4. 신규 사용자 vs 기존 사용자

### Google OAuth
- **신규**: 자동으로 계정 생성 후 로그인
- **기존**: 바로 로그인

### Magic Link
- **신규**: 자동으로 계정 생성 후 로그인
- **기존**: 바로 로그인

> **참고**: 별도의 회원가입 페이지가 필요 없습니다. 두 방식 모두 자동으로 신규 사용자를 생성합니다.

---

## 5. Supabase 설정

### Sign In / Providers 설정 (2026-02-04 확인)

**User Signups**
| 설정 | 값 | 비고 |
|------|-----|------|
| Allow new users to sign up | ✅ ON | 신규 가입 허용 |
| Allow manual linking | OFF | |
| Allow anonymous sign-ins | OFF | |
| Confirm email | ✅ OFF | Magic Link 사용 시 OFF 권장 |

**Auth Providers**
| Provider | 상태 | 용도 |
|----------|------|------|
| Email | ✅ Enabled | Magic Link |
| Google | ✅ Enabled | Google OAuth |
| 기타 | Disabled | 사용 안함 |

### Email Templates (Magic Link용)
Supabase Dashboard > Authentication > Email Templates

**Magic Link 이메일 제목 예시:**
```
JetPrimer 로그인 링크
```

**Magic Link 이메일 본문 예시:**
```html
<h2>JetPrimer 로그인</h2>
<p>아래 버튼을 클릭하여 로그인하세요.</p>
<a href="{{ .ConfirmationURL }}">로그인하기</a>
<p>이 링크는 1시간 동안 유효합니다.</p>
<p>본인이 요청하지 않았다면 이 이메일을 무시하세요.</p>
```

### URL Configuration
- **Site URL**: https://dashboard.jetprimer.com
- **Redirect URLs**:
  - https://dashboard.jetprimer.com/**
  - http://localhost:3000/** (개발용)

---

## 6. 보안 고려사항

### Magic Link 보안
- 링크 유효시간: 1시간 (Supabase 기본값)
- 1회 사용 후 무효화
- HTTPS 필수

### Google OAuth 보안
- Google의 2FA 정책 적용
- 승인된 도메인만 허용

### 세션 관리
- Supabase가 자동으로 세션 갱신
- 미들웨어에서 매 요청마다 세션 확인

---

## 7. 문제 해결

### Magic Link 이메일이 안 오는 경우
1. 스팸함 확인
2. Supabase Dashboard > Authentication > Users에서 이메일 발송 로그 확인
3. 이메일 제공업체의 차단 여부 확인

### Google 로그인 오류
1. Google Cloud Console에서 승인된 도메인 확인
2. Supabase에서 Google Provider 설정 확인
3. 리디렉션 URI 일치 여부 확인

### "Invalid login credentials" 오류
- 이 오류는 비밀번호 로그인에서만 발생
- Magic Link/Google OAuth에서는 발생하지 않음

---

## 8. 관련 파일

| 파일 | 설명 |
|------|------|
| `/src/app/login/page.tsx` | 로그인 페이지 (Google + Magic Link) |
| `/src/app/signup/page.tsx` | 회원가입 페이지 → 로그인으로 리디렉션 |
| `/src/app/auth/callback/route.ts` | OAuth 콜백 핸들러 |
| `/src/middleware.ts` | 인증 미들웨어 |
| `/src/lib/supabase/client.ts` | 클라이언트 Supabase |
| `/src/lib/supabase/server.ts` | 서버 Supabase |

> **참고**: 회원가입 페이지(`/signup`)는 자동으로 로그인 페이지로 리디렉션됩니다. Google OAuth와 Magic Link 모두 신규 사용자를 자동 생성하므로 별도의 회원가입 플로우가 필요 없습니다.

---

## 9. 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-04 | Supabase 설정 확인 및 Confirm email OFF 설정 |
| 2026-02-04 | 비밀번호 로그인 제거, Magic Link 추가 |
| 2026-02-04 | Google OAuth 설정 완료 |
