BEGIN;
CREATE TABLE IF NOT EXISTS activity_log (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 owner_user_id uuid NOT NULL,
 entity_type text NOT NULL CHECK (entity_type IN ('profile','event','record')),
 entity_id uuid NOT NULL,
 action text NOT NULL CHECK (action IN ('created','updated','deleted')),
 occurred_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS activity_log_owner_time_idx ON activity_log(owner_user_id,occurred_at DESC,id DESC);
CREATE OR REPLACE FUNCTION gestarbem_log_activity() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE row_data jsonb; owner_id uuid; item_id uuid; event_action text;
BEGIN
 IF TG_OP='DELETE' THEN row_data:=to_jsonb(OLD); ELSE row_data:=to_jsonb(NEW); END IF;
 owner_id:=(row_data->>'user_id')::uuid;
 IF TG_ARGV[0]='profile' THEN item_id:=owner_id; ELSE item_id:=(row_data->>'id')::uuid; END IF;
 event_action:=CASE TG_OP WHEN 'INSERT' THEN 'created' WHEN 'UPDATE' THEN 'updated' ELSE 'deleted' END;
 INSERT INTO activity_log(owner_user_id,entity_type,entity_id,action) VALUES(owner_id,TG_ARGV[0],item_id,event_action);
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
DROP TRIGGER IF EXISTS gestarbem_profile_activity ON gestational_profiles;
CREATE TRIGGER gestarbem_profile_activity AFTER INSERT OR UPDATE OR DELETE ON gestational_profiles FOR EACH ROW EXECUTE FUNCTION gestarbem_log_activity('profile');
DROP TRIGGER IF EXISTS gestarbem_event_activity ON gestational_events;
CREATE TRIGGER gestarbem_event_activity AFTER INSERT OR UPDATE OR DELETE ON gestational_events FOR EACH ROW EXECUTE FUNCTION gestarbem_log_activity('event');
DROP TRIGGER IF EXISTS gestarbem_record_activity ON gestational_records;
CREATE TRIGGER gestarbem_record_activity AFTER INSERT OR UPDATE OR DELETE ON gestational_records FOR EACH ROW EXECUTE FUNCTION gestarbem_log_activity('record');
COMMIT;
