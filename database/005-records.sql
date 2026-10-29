-- Apply once. ASCII-only SQL; Unicode escapes preserve Portuguese labels.
BEGIN;
CREATE TABLE gestational_records (
 id uuid PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 value varchar(200) NOT NULL CHECK(length(trim(value))>0),
 type text NOT NULL CHECK(type IN ('Peso',U&'Press\00E3o arterial','Sintoma','Medicamento','Consulta realizada','Exame realizado','Vacina',U&'Observa\00E7\00E3o')),
 record_date date NOT NULL,
 notes text NOT NULL DEFAULT '' CHECK(length(notes)<=1000),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX gestational_records_user_date_idx ON gestational_records(user_id,record_date DESC);
COMMIT;
