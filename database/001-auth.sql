-- Aplicar uma vez no banco gestarbem. Migração atômica, sem exclusão de dados.
BEGIN;
CREATE TABLE users (
 id uuid PRIMARY KEY,
 name varchar(80) NOT NULL CHECK(length(trim(name))>0),
 email varchar(254) NOT NULL UNIQUE CHECK(email=lower(email)),
 password_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
 token_hash char(64) PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_expiry_idx ON sessions(expires_at);
COMMIT;
