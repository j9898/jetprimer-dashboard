-- Create todos table for customer to-do list
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  priority INTEGER DEFAULT 0, -- 0: normal, 1: high, 2: urgent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_todos_customer_id ON todos(customer_id);
CREATE INDEX IF NOT EXISTS idx_todos_is_completed ON todos(is_completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own todos
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own todos
CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update their own todos
CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own todos
CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_todos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS todos_updated_at ON todos;
CREATE TRIGGER todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_todos_updated_at();
