-- 고객 마지막 방문 시간 기록
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_visited_at TIMESTAMPTZ;
