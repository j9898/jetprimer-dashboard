-- Add created_by column to distinguish admin vs customer created todos
ALTER TABLE todos ADD COLUMN created_by TEXT NOT NULL DEFAULT 'customer';

-- Add a CHECK constraint for valid values
ALTER TABLE todos ADD CONSTRAINT todos_created_by_check
  CHECK (created_by IN ('customer', 'admin'));
