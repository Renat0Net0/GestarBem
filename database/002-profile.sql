-- Aplicar uma vez, após 001-auth.sql. Preserva contas e sessões existentes.
BEGIN;
CREATE TABLE gestational_profiles (
 user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 dum date,
 notes text NOT NULL DEFAULT '' CHECK (length(notes)<=1000),
 updated_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
