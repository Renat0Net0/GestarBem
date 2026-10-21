BEGIN;
CREATE TABLE IF NOT EXISTS assistant_usage (
 budget_key text PRIMARY KEY,
 call_count integer NOT NULL CHECK (call_count >= 0)
);
COMMIT;
