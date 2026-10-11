-- Apply once. Preserve existing events; reminders are off by default.
BEGIN;
ALTER TABLE gestational_events
 ADD COLUMN reminder_days smallint CHECK(reminder_days IN (0,1,2,7)),
 ADD COLUMN reminder_seen boolean NOT NULL DEFAULT false;
COMMIT;
