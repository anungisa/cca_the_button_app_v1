-- Row Level Security (RLS) Policies - Phase 1: CRITICAL TABLES (CORRECTED)
-- Curling Canada Database
-- Created: November 11, 2025
-- 
-- IMPORTANT: This version handles the UUID/TEXT mismatch between:
-- - clerk_user_id (TEXT) in users table
-- - user_id (UUID) in other tables referencing users.id
--
-- Solution: Helper function to get current user's UUID from Clerk ID

-- ============================================================================
-- HELPER FUNCTION: Get current user's UUID from Clerk JWT
-- ============================================================================

-- Drop if exists
DROP FUNCTION IF EXISTS current_user_id();

-- Create helper function
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_user_id = (auth.jwt() ->> 'sub')
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- PHASE 1: CRITICAL SECURITY TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE (Core authentication)
-- ----------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "users_select_own"
ON users FOR SELECT
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Users can update their own profile
CREATE POLICY "users_update_own"
ON users FOR UPDATE
USING (clerk_user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Admins can view all users
CREATE POLICY "users_select_admin"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions up
    INNER JOIN users u ON u.id = up.user_id
    WHERE u.clerk_user_id = (auth.jwt() ->> 'sub')
    AND up.permission = 'admin'
  )
);

-- Admins can update all users
CREATE POLICY "users_update_admin"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_permissions up
    INNER JOIN users u ON u.id = up.user_id
    WHERE u.clerk_user_id = (auth.jwt() ->> 'sub')
    AND up.permission = 'admin'
  )
);

-- System can insert new users (during signup)
CREATE POLICY "users_insert_system"
ON users FOR INSERT
WITH CHECK (clerk_user_id = (auth.jwt() ->> 'sub'));

-- ----------------------------------------------------------------------------
-- 2. USER PERMISSIONS (Access control)
-- ----------------------------------------------------------------------------

ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own permissions
CREATE POLICY "user_permissions_select_own"
ON user_permissions FOR SELECT
USING (user_id = current_user_id());

-- Admins can view all permissions
CREATE POLICY "user_permissions_select_admin"
ON user_permissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions up
    WHERE up.user_id = current_user_id()
    AND up.permission = 'admin'
  )
);

-- Admins can manage all permissions
CREATE POLICY "user_permissions_all_admin"
ON user_permissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions up
    WHERE up.user_id = current_user_id()
    AND up.permission = 'admin'
  )
);

-- ----------------------------------------------------------------------------
-- 3. USER SETTINGS (Privacy & preferences)
-- ----------------------------------------------------------------------------

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can manage their own settings
CREATE POLICY "user_settings_all_own"
ON user_settings FOR ALL
USING (user_id = current_user_id())
WITH CHECK (user_id = current_user_id());

-- ----------------------------------------------------------------------------
-- 4. CLUBS (Public read, restricted write)
-- ----------------------------------------------------------------------------

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Everyone can view clubs (public information)
CREATE POLICY "clubs_select_public"
ON clubs FOR SELECT
USING (true);

-- Club managers can update their club
CREATE POLICY "clubs_update_manager"
ON clubs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_officials
    WHERE club_officials.club_id = clubs.id
    AND club_officials.user_id = current_user_id()
    AND club_officials.position IN ('manager', 'president')
  )
);

-- Admins can manage all clubs
CREATE POLICY "clubs_all_admin"
ON clubs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- Anyone authenticated can create a club (will be reviewed by admin)
CREATE POLICY "clubs_insert_authenticated"
ON clubs FOR INSERT
WITH CHECK (current_user_id() IS NOT NULL);

-- ----------------------------------------------------------------------------
-- 5. CLUB OFFICIALS (Club management)
-- ----------------------------------------------------------------------------

ALTER TABLE club_officials ENABLE ROW LEVEL SECURITY;

-- Anyone can view club officials (public info)
CREATE POLICY "club_officials_select_public"
ON club_officials FOR SELECT
USING (true);

-- Club managers can manage officials for their club
CREATE POLICY "club_officials_all_manager"
ON club_officials FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM club_officials co
    WHERE co.club_id = club_officials.club_id
    AND co.user_id = current_user_id()
    AND co.position IN ('manager', 'president')
  )
);

-- Admins can manage all club officials
CREATE POLICY "club_officials_all_admin"
ON club_officials FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- ----------------------------------------------------------------------------
-- 6. CLUB MEMBERSHIPS (User-club associations)
-- ----------------------------------------------------------------------------

ALTER TABLE club_memberships ENABLE ROW LEVEL SECURITY;

-- Users can view their own memberships
CREATE POLICY "club_memberships_select_own"
ON club_memberships FOR SELECT
USING (user_id = current_user_id());

-- Club managers can view all memberships for their club
CREATE POLICY "club_memberships_select_manager"
ON club_memberships FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM club_officials
    WHERE club_officials.club_id = club_memberships.club_id
    AND club_officials.user_id = current_user_id()
    AND club_officials.position IN ('manager', 'president')
  )
);

-- Users can create their own memberships
CREATE POLICY "club_memberships_insert_own"
ON club_memberships FOR INSERT
WITH CHECK (user_id = current_user_id());

-- Users can update their own memberships
CREATE POLICY "club_memberships_update_own"
ON club_memberships FOR UPDATE
USING (user_id = current_user_id());

-- Club managers can approve memberships
CREATE POLICY "club_memberships_update_manager"
ON club_memberships FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_officials
    WHERE club_officials.club_id = club_memberships.club_id
    AND club_officials.user_id = current_user_id()
    AND club_officials.position IN ('manager', 'president')
  )
);

-- ----------------------------------------------------------------------------
-- 7. EVENTS (Public with organizer control)
-- ----------------------------------------------------------------------------

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Everyone can view public events
CREATE POLICY "events_select_public"
ON events FOR SELECT
USING (is_public = true);

-- Organizers can view all their events (including private/drafts)
CREATE POLICY "events_select_organizer"
ON events FOR SELECT
USING (organizer_id = current_user_id());

-- Event organizers can view all events
CREATE POLICY "events_select_admin"
ON events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission IN ('admin', 'event_organizer')
  )
);

-- Authorized users can create events
CREATE POLICY "events_insert_organizer"
ON events FOR INSERT
WITH CHECK (
  organizer_id = current_user_id() OR
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission IN ('admin', 'event_organizer')
  )
);

-- Organizers can update their own events
CREATE POLICY "events_update_organizer"
ON events FOR UPDATE
USING (organizer_id = current_user_id());

-- Admins can update any event
CREATE POLICY "events_update_admin"
ON events FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission IN ('admin', 'event_organizer')
  )
);

-- ----------------------------------------------------------------------------
-- 8. EVENT REGISTRATIONS (User-owned)
-- ----------------------------------------------------------------------------

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registrations
CREATE POLICY "event_registrations_select_own"
ON event_registrations FOR SELECT
USING (user_id = current_user_id());

-- Event organizers can view all registrations for their events
CREATE POLICY "event_registrations_select_organizer"
ON event_registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_registrations.event_id
    AND events.organizer_id = current_user_id()
  )
);

-- Admins can view all registrations
CREATE POLICY "event_registrations_select_admin"
ON event_registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- Users can register for events
CREATE POLICY "event_registrations_insert_own"
ON event_registrations FOR INSERT
WITH CHECK (user_id = current_user_id());

-- Users can update their own registrations
CREATE POLICY "event_registrations_update_own"
ON event_registrations FOR UPDATE
USING (user_id = current_user_id());

-- ----------------------------------------------------------------------------
-- 9. ORDERS (E-commerce security)
-- ----------------------------------------------------------------------------

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only view their own orders
CREATE POLICY "orders_select_own"
ON orders FOR SELECT
USING (user_id = current_user_id());

-- Admins can view all orders
CREATE POLICY "orders_select_admin"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- Users can create their own orders
CREATE POLICY "orders_insert_own"
ON orders FOR INSERT
WITH CHECK (user_id = current_user_id());

-- Users can update their own orders (before payment confirmed)
CREATE POLICY "orders_update_own"
ON orders FOR UPDATE
USING (user_id = current_user_id() AND payment_status = 'pending');

-- Admins can update any order
CREATE POLICY "orders_update_admin"
ON orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- ----------------------------------------------------------------------------
-- 10. ORDER ITEMS (E-commerce security)
-- ----------------------------------------------------------------------------

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items from their own orders
CREATE POLICY "order_items_select_own"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = current_user_id()
  )
);

-- Admins can view all order items
CREATE POLICY "order_items_select_admin"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- System can insert order items (during order creation)
CREATE POLICY "order_items_insert_system"
ON order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = current_user_id()
  )
);

-- ----------------------------------------------------------------------------
-- 11. CART ITEMS (User shopping cart)
-- ----------------------------------------------------------------------------

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own cart
CREATE POLICY "cart_items_all_own"
ON cart_items FOR ALL
USING (user_id = current_user_id())
WITH CHECK (user_id = current_user_id());

-- ----------------------------------------------------------------------------
-- 12. POINT TRANSACTIONS (Loyalty program security)
-- ----------------------------------------------------------------------------

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own point transactions
CREATE POLICY "point_transactions_select_own"
ON point_transactions FOR SELECT
USING (user_id = current_user_id());

-- Admins can view all transactions
CREATE POLICY "point_transactions_select_admin"
ON point_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- System can create point transactions (backend only)
CREATE POLICY "point_transactions_insert_system"
ON point_transactions FOR INSERT
WITH CHECK (true); -- Backend will verify via service role

-- No one can update or delete transactions (immutable ledger)

-- ----------------------------------------------------------------------------
-- 13. REDEMPTIONS (Loyalty rewards)
-- ----------------------------------------------------------------------------

ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own redemptions
CREATE POLICY "redemptions_select_own"
ON redemptions FOR SELECT
USING (user_id = current_user_id());

-- Admins can view all redemptions
CREATE POLICY "redemptions_select_admin"
ON redemptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- Users can create redemptions
CREATE POLICY "redemptions_insert_own"
ON redemptions FOR INSERT
WITH CHECK (user_id = current_user_id());

-- Admins can update redemptions (approval/fulfillment)
CREATE POLICY "redemptions_update_admin"
ON redemptions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = current_user_id()
    AND permission = 'admin'
  )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Critical indexes for policy checks
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON user_permissions(permission);
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_club_officials_user_club ON club_officials(user_id, club_id, position);
CREATE INDEX IF NOT EXISTS idx_club_memberships_user ON club_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_club_memberships_club ON club_memberships(club_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id, is_public);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON redemptions(user_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify policies are working:

-- 1. Check that RLS is enabled on critical tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN (
  'users', 'user_permissions', 'clubs', 'events', 
  'orders', 'point_transactions', 'cart_items'
)
ORDER BY tablename;

-- 2. Check helper function exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'current_user_id';

-- 3. List all policies created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN (
  'users', 'user_permissions', 'clubs', 'events', 
  'orders', 'point_transactions', 'cart_items'
)
ORDER BY tablename, policyname;

-- 4. Count policies per table
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN (
  'users', 'user_permissions', 'user_settings', 'clubs', 
  'club_officials', 'club_memberships', 'events', 'event_registrations',
  'orders', 'order_items', 'cart_items', 'point_transactions', 'redemptions'
)
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- If you see this message, all Phase 1 RLS policies were applied successfully.
-- 
-- Next steps:
-- 1. Run verification queries above
-- 2. Test with .\test-rls-policies.ps1
-- 3. Create test users to verify access controls
-- 4. Proceed with database seeding

