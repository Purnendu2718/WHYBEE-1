-- ==========================================================
-- MIGRATION: Security Hardening + Notifications + Audit Log
-- Run date: 2024-01-02
-- ==========================================================

-- -------------------------------------------------------
-- 1. ENFORCE RLS on all existing tables (idempotent)
-- -------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students2') THEN
    ALTER TABLE students2 ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN
    ALTER TABLE students ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 2. NOTIFICATIONS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'general',  -- 'broadcast' | 'leave_status' | 'attendance_risk' | 'general'
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "notifications: own read"
  ON notifications FOR SELECT
  USING (recipient_profile_id = auth.uid());

-- Users can only mark their own notifications as read (UPDATE is_read only)
CREATE POLICY "notifications: own mark read"
  ON notifications FOR UPDATE
  USING (recipient_profile_id = auth.uid())
  WITH CHECK (recipient_profile_id = auth.uid());

-- No client-side inserts allowed — inserts come only from service-role/admin context
-- (no INSERT policy = anon/authenticated roles cannot insert)

-- Enable Realtime for live bell updates
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- -------------------------------------------------------
-- 3. AUDIT LOG TABLE (append-only, no UPDATE/DELETE ever)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,        -- 'mark_attendance' | 'update_result' | 'update_fee_status'
  target_table text NOT NULL,
  target_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) can INSERT audit log rows
CREATE POLICY "audit_log: authenticated insert"
  ON audit_log FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admins can read the audit log (via profiles.role check)
CREATE POLICY "audit_log: admin read"
  ON audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Intentionally NO UPDATE or DELETE policy on audit_log for any role.
-- This makes audit_log append-only — the first step toward an immutable ledger.
