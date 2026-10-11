-- Aplicar uma vez. Preserva contas, sessões e perfis existentes.
BEGIN;
CREATE TABLE gestational_events (
 id uuid PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title varchar(100) NOT NULL CHECK(length(trim(title))>0),
 type text NOT NULL CHECK(type IN ('Consulta','Exame','Vacinação','Medicamento','Medição','Outra atividade')),
 event_date date NOT NULL,
 event_time time NOT NULL,
 notes text NOT NULL DEFAULT '' CHECK(length(notes)<=1000),
 done boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX gestational_events_user_date_idx ON gestational_events(user_id,event_date,event_time);
COMMIT;
