-- Repair type constraint without changing event rows. ASCII-only SQL.
-- Apply once after 003-agenda.sql. If existing rows are invalid, transaction rolls back.
BEGIN;
ALTER TABLE gestational_events DROP CONSTRAINT gestational_events_type_check;
ALTER TABLE gestational_events
 ADD CONSTRAINT gestational_events_type_check
 CHECK (type IN ('Consulta','Exame',U&'Vacina\00E7\00E3o','Medicamento',U&'Medi\00E7\00E3o','Outra atividade'));
COMMIT;
