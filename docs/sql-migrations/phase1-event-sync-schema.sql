-- =============================================
-- Phase 1: Event Registration & External Sync
-- Database Schema Migration
-- =============================================

-- Add external system tracking columns to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS curling_io_id TEXT,
ADD COLUMN IF NOT EXISTS curlingzone_id TEXT,
ADD COLUMN IF NOT EXISTS trustevent_id TEXT,
ADD COLUMN IF NOT EXISTS curlingreg_id TEXT,
ADD COLUMN IF NOT EXISTS external_source TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Create indexes for external ID lookups
CREATE INDEX IF NOT EXISTS idx_events_curling_io_id ON events(curling_io_id);
CREATE INDEX IF NOT EXISTS idx_events_curlingzone_id ON events(curlingzone_id);
CREATE INDEX IF NOT EXISTS idx_events_trustevent_id ON events(trustevent_id);
CREATE INDEX IF NOT EXISTS idx_events_curlingreg_id ON events(curlingreg_id);
CREATE INDEX IF NOT EXISTS idx_events_external_source ON events(external_source);

-- =============================================
-- Event Sync Logs Table
-- =============================================
CREATE TABLE IF NOT EXISTS event_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  sync_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sync_completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress',
  events_fetched INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  events_updated INTEGER DEFAULT 0,
  events_skipped INTEGER DEFAULT 0,
  error_message TEXT,
  error_details JSONB,
  sync_params JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_sync_logs_source ON event_sync_logs(source);
CREATE INDEX IF NOT EXISTS idx_event_sync_logs_status ON event_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_event_sync_logs_started_at ON event_sync_logs(sync_started_at);

-- =============================================
-- Event Teams Table
-- =============================================
CREATE TABLE IF NOT EXISTS event_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  skip_user_id TEXT,
  skip_name TEXT NOT NULL,
  skip_email TEXT NOT NULL,
  skip_phone TEXT,
  team_size INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_teams_event_id ON event_teams(event_id);
CREATE INDEX IF NOT EXISTS idx_event_teams_skip_user_id ON event_teams(skip_user_id);
CREATE INDEX IF NOT EXISTS idx_event_teams_status ON event_teams(status);

-- =============================================
-- Event Participants Table
-- =============================================
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_team_id UUID NOT NULL REFERENCES event_teams(id) ON DELETE CASCADE,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_participants_team_id ON event_participants(event_team_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);

-- =============================================
-- Extend Event Registrations Table
-- =============================================
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS event_team_id UUID REFERENCES event_teams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS confirmation_code TEXT,
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

CREATE INDEX IF NOT EXISTS idx_event_registrations_team_id ON event_registrations(event_team_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_payment_status ON event_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_confirmation_code ON event_registrations(confirmation_code);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Enable RLS on new tables
ALTER TABLE event_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Event Sync Logs: Admin only
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_sync_logs' AND policyname = 'Admin can view sync logs') THEN
    CREATE POLICY "Admin can view sync logs" ON event_sync_logs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_sync_logs' AND policyname = 'Admin can insert sync logs') THEN
    CREATE POLICY "Admin can insert sync logs" ON event_sync_logs FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_sync_logs' AND policyname = 'Admin can update sync logs') THEN
    CREATE POLICY "Admin can update sync logs" ON event_sync_logs FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

-- Event Teams: Skip ownership + participants can view
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_teams' AND policyname = 'Users can view teams they''re part of') THEN
    CREATE POLICY "Users can view teams they're part of" ON event_teams FOR SELECT 
    USING (skip_user_id = auth.uid()::TEXT OR id IN (SELECT event_team_id FROM event_participants WHERE user_id = auth.uid()::TEXT));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_teams' AND policyname = 'Skips can create teams') THEN
    CREATE POLICY "Skips can create teams" ON event_teams FOR INSERT WITH CHECK (skip_user_id = auth.uid()::TEXT);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_teams' AND policyname = 'Skips can update their teams') THEN
    CREATE POLICY "Skips can update their teams" ON event_teams FOR UPDATE USING (skip_user_id = auth.uid()::TEXT);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_teams' AND policyname = 'Skips can delete their teams') THEN
    CREATE POLICY "Skips can delete their teams" ON event_teams FOR DELETE USING (skip_user_id = auth.uid()::TEXT);
  END IF;
END $$;

-- Event Participants: Team skip can manage
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_participants' AND policyname = 'Users can view team participants') THEN
    CREATE POLICY "Users can view team participants" ON event_participants FOR SELECT 
    USING (user_id = auth.uid()::TEXT OR event_team_id IN (SELECT id FROM event_teams WHERE skip_user_id = auth.uid()::TEXT));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_participants' AND policyname = 'Skips can add participants to their teams') THEN
    CREATE POLICY "Skips can add participants to their teams" ON event_participants FOR INSERT 
    WITH CHECK (event_team_id IN (SELECT id FROM event_teams WHERE skip_user_id = auth.uid()::TEXT));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_participants' AND policyname = 'Skips can update participants on their teams') THEN
    CREATE POLICY "Skips can update participants on their teams" ON event_participants FOR UPDATE 
    USING (event_team_id IN (SELECT id FROM event_teams WHERE skip_user_id = auth.uid()::TEXT));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_participants' AND policyname = 'Skips can remove participants from their teams') THEN
    CREATE POLICY "Skips can remove participants from their teams" ON event_participants FOR DELETE 
    USING (event_team_id IN (SELECT id FROM event_teams WHERE skip_user_id = auth.uid()::TEXT));
  END IF;
END $$;

-- =============================================
-- Triggers for updated_at timestamps
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_sync_logs_updated_at
  BEFORE UPDATE ON event_sync_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_teams_updated_at
  BEFORE UPDATE ON event_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_participants_updated_at
  BEFORE UPDATE ON event_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Success message
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'Phase 1 Event Sync Schema Migration Complete!';
  RAISE NOTICE 'Tables: events (extended), event_sync_logs, event_teams, event_participants, event_registrations (extended)';
  RAISE NOTICE 'RLS Policies: Applied for all new tables';
END $$;
