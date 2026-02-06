-- 승무원 메시지 (전체 공지) 테이블
CREATE TABLE IF NOT EXISTS crew_messages (
  id SERIAL PRIMARY KEY,
  message_ko TEXT NOT NULL DEFAULT '',
  message_en TEXT NOT NULL DEFAULT '',
  message_ja TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 기본 메시지 삽입
INSERT INTO crew_messages (message_ko, message_en, message_ja) VALUES (
  '35,000피트 상공에서 순항 중입니다. 즐거운 비행 되세요, 기장님.',
  'Smooth cruising at 35,000 ft. Enjoy the flight, Captain.',
  '高度35,000フィートで順調に飛行中です。機長、良いフライトを。'
);

-- RLS 활성화
ALTER TABLE crew_messages ENABLE ROW LEVEL SECURITY;

-- 모든 인증된 사용자가 읽기 가능
CREATE POLICY "Anyone can read crew messages" ON crew_messages
  FOR SELECT USING (true);
