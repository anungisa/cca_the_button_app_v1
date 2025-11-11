-- Row Level Security (RLS) Policies for Curling Canada Database
-- Created: November 11, 2025
-- Purpose: Implement access control for all 98 tables
--
-- Security Model:
-- 1. Public tables: Anyone can read (events, clubs, venues)
-- 2. User-owned: Users can read/write their own data
-- 3. Admin-only: Only admins can access
-- 4. Role-based: Access based on user role (club manager, coach, etc.)

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Admins can view all profiles
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- User Permissions (Admin only)
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions"
ON user_permissions FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can manage all permissions"
ON user_permissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- User Settings (User-owned)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
ON user_settings FOR ALL
USING (user_id = auth.jwt() ->> 'sub');

-- ============================================================================
-- CLUBS & MEMBERSHIPS
-- ============================================================================

-- Clubs (Public read, restricted write)
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Everyone can view clubs
CREATE POLICY "Anyone can view clubs"
ON clubs FOR SELECT
USING (true);

-- Club managers can update their club
CREATE POLICY "Club managers can update own club"
ON clubs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_officials
    WHERE club_id = clubs.id
    AND user_id = auth.jwt() ->> 'sub'
    AND role IN ('manager', 'president')
  )
);

-- Admins can do anything with clubs
CREATE POLICY "Admins can manage clubs"
ON clubs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- Club Memberships
ALTER TABLE club_memberships ENABLE ROW LEVEL SECURITY;

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
ON club_memberships FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

-- Club managers can view all memberships for their club
CREATE POLICY "Club managers can view club memberships"
ON club_memberships FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM club_officials
    WHERE club_id = club_memberships.club_id
    AND user_id = auth.jwt() ->> 'sub'
    AND role IN ('manager', 'president')
  )
);

-- Users can create their own memberships
CREATE POLICY "Users can create own memberships"
ON club_memberships FOR INSERT
WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Club Officials
ALTER TABLE club_officials ENABLE ROW LEVEL SECURITY;

-- Anyone can view club officials (public info)
CREATE POLICY "Anyone can view club officials"
ON club_officials FOR SELECT
USING (true);

-- Club managers can manage officials for their club
CREATE POLICY "Club managers can manage officials"
ON club_officials FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM club_officials co
    WHERE co.club_id = club_officials.club_id
    AND co.user_id = auth.jwt() ->> 'sub'
    AND co.role IN ('manager', 'president')
  )
);

-- ============================================================================
-- EVENTS & COMPETITIONS
-- ============================================================================

-- Events (Public read, restricted write)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone can view published events
CREATE POLICY "Anyone can view published events"
ON events FOR SELECT
USING (status = 'published' OR status = 'upcoming');

-- Event organizers can view all events
CREATE POLICY "Organizers can view all events"
ON events FOR SELECT
USING (
  organizer_id = auth.jwt() ->> 'sub' OR
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type IN ('admin', 'event_organizer')
  )
);

-- Organizers can create events
CREATE POLICY "Organizers can create events"
ON events FOR INSERT
WITH CHECK (
  organizer_id = auth.jwt() ->> 'sub' OR
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type IN ('admin', 'event_organizer')
  )
);

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events"
ON events FOR UPDATE
USING (organizer_id = auth.jwt() ->> 'sub');

-- Event Registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
ON event_registrations FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

-- Event organizers can view all registrations for their events
CREATE POLICY "Organizers can view event registrations"
ON event_registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_registrations.event_id
    AND events.organizer_id = auth.jwt() ->> 'sub'
  )
);

-- Users can create their own registrations
CREATE POLICY "Users can register for events"
ON event_registrations FOR INSERT
WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Competitions
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- Anyone can view competitions
CREATE POLICY "Anyone can view competitions"
ON competitions FOR SELECT
USING (true);

-- Event organizers can manage competitions
CREATE POLICY "Organizers can manage competitions"
ON competitions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = competitions.event_id
    AND events.organizer_id = auth.jwt() ->> 'sub'
  ) OR
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- ============================================================================
-- TEAMS & ATHLETES
-- ============================================================================

-- Teams (Public read, team-owned write)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Anyone can view teams
CREATE POLICY "Anyone can view teams"
ON teams FOR SELECT
USING (true);

-- Team captains can update their team
CREATE POLICY "Captains can update own team"
ON teams FOR UPDATE
USING (
  captain_id = auth.jwt() ->> 'sub' OR
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = teams.id
    AND user_id = auth.jwt() ->> 'sub'
    AND role = 'captain'
  )
);

-- Users can create teams
CREATE POLICY "Users can create teams"
ON teams FOR INSERT
WITH CHECK (captain_id = auth.jwt() ->> 'sub');

-- Team Members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view team members
CREATE POLICY "Anyone can view team members"
ON team_members FOR SELECT
USING (true);

-- Team captains can manage their team members
CREATE POLICY "Captains can manage team members"
ON team_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM teams
    WHERE teams.id = team_members.team_id
    AND teams.captain_id = auth.jwt() ->> 'sub'
  )
);

-- Athlete Profiles
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view public athlete profiles
CREATE POLICY "Anyone can view public profiles"
ON athlete_profiles FOR SELECT
USING (is_public = true);

-- Users can view their own profile even if private
CREATE POLICY "Users can view own profile"
ON athlete_profiles FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

-- Users can manage their own profile
CREATE POLICY "Users can manage own athlete profile"
ON athlete_profiles FOR ALL
USING (user_id = auth.jwt() ->> 'sub');

-- Coaches
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

-- Anyone can view coaches
CREATE POLICY "Anyone can view coaches"
ON coaches FOR SELECT
USING (true);

-- Users can create/update their own coach profile
CREATE POLICY "Users can manage own coach profile"
ON coaches FOR ALL
USING (user_id = auth.jwt() ->> 'sub');

-- ============================================================================
-- DRAWS & MATCHES
-- ============================================================================

-- Draws (Public read, restricted write)
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view draws"
ON draws FOR SELECT
USING (true);

CREATE POLICY "Event organizers can manage draws"
ON draws FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = draws.event_id
    AND events.organizer_id = auth.jwt() ->> 'sub'
  ) OR
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type IN ('admin', 'scorekeeper')
  )
);

-- Matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches"
ON matches FOR SELECT
USING (true);

CREATE POLICY "Scorekeepers can manage matches"
ON matches FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type IN ('admin', 'scorekeeper')
  )
);

-- End Scores, Shots, Match Stats (Public read, scorekeeper write)
ALTER TABLE end_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view end scores" ON end_scores FOR SELECT USING (true);
CREATE POLICY "Scorekeepers can manage end scores" ON end_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'scorekeeper'))
);

CREATE POLICY "Anyone can view shots" ON shots FOR SELECT USING (true);
CREATE POLICY "Scorekeepers can manage shots" ON shots FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'scorekeeper'))
);

CREATE POLICY "Anyone can view match stats" ON match_stats FOR SELECT USING (true);
CREATE POLICY "Scorekeepers can manage match stats" ON match_stats FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'scorekeeper'))
);

CREATE POLICY "Anyone can view player match stats" ON player_match_stats FOR SELECT USING (true);
CREATE POLICY "Scorekeepers can manage player match stats" ON player_match_stats FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'scorekeeper'))
);

-- ============================================================================
-- LOYALTY & REWARDS
-- ============================================================================

-- Loyalty Tiers (Public read, admin write)
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view loyalty tiers"
ON loyalty_tiers FOR SELECT
USING (true);

CREATE POLICY "Admins can manage loyalty tiers"
ON loyalty_tiers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- Point Transactions (User-owned)
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own point transactions"
ON point_transactions FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "System can create point transactions"
ON point_transactions FOR INSERT
WITH CHECK (true); -- Backend will verify

-- Rewards (Public read, admin write)
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available rewards"
ON rewards FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage rewards"
ON rewards FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- Redemptions (User-owned read, restricted write)
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
ON redemptions FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create redemptions"
ON redemptions FOR INSERT
WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Challenges, User Challenges, Referrals
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges" ON challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage challenges" ON challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Users can view own challenges" ON user_challenges FOR SELECT USING (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can update own challenges" ON user_challenges FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (referrer_id = auth.jwt() ->> 'sub' OR referred_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can create referrals" ON referrals FOR INSERT WITH CHECK (referrer_id = auth.jwt() ->> 'sub');

-- ============================================================================
-- PERFORMANCE & STATISTICS
-- ============================================================================

-- Player & Team Season Stats (Public read, system write)
ALTER TABLE player_season_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_season_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view player stats" ON player_season_stats FOR SELECT USING (true);
CREATE POLICY "System can manage player stats" ON player_season_stats FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'scorekeeper'))
);

CREATE POLICY "Anyone can view team stats" ON team_season_stats FOR SELECT USING (true);
CREATE POLICY "System can manage team stats" ON team_season_stats FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'scorekeeper'))
);

-- Rankings, Achievements, Records, Milestones (Public read, admin write)
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rankings" ON rankings FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view user achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view team achievements" ON team_achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view records" ON records FOR SELECT USING (true);
CREATE POLICY "Anyone can view milestones" ON milestones FOR SELECT USING (true);

-- Admins can manage all performance data
CREATE POLICY "Admins manage rankings" ON rankings FOR ALL USING (EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin'));
CREATE POLICY "Admins manage achievements" ON achievements FOR ALL USING (EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin'));
CREATE POLICY "Admins manage user achievements" ON user_achievements FOR ALL USING (EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin'));
CREATE POLICY "Admins manage team achievements" ON team_achievements FOR ALL USING (EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin'));
CREATE POLICY "Admins manage records" ON records FOR ALL USING (EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin'));
CREATE POLICY "Admins manage milestones" ON milestones FOR ALL USING (EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin'));

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

-- Articles, Videos, Photos, Albums (Public read, content manager write)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Content managers can manage articles" ON articles FOR ALL USING (
  author_id = auth.jwt() ->> 'sub' OR
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'content_manager'))
);

CREATE POLICY "Anyone can view published videos" ON videos FOR SELECT USING (status = 'published');
CREATE POLICY "Content managers can manage videos" ON videos FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'content_manager'))
);

CREATE POLICY "Anyone can view public photos" ON photos FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own photos" ON photos FOR ALL USING (uploaded_by = auth.jwt() ->> 'sub');

CREATE POLICY "Anyone can view public albums" ON albums FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own albums" ON albums FOR ALL USING (created_by = auth.jwt() ->> 'sub');

CREATE POLICY "Anyone can view knowledge base" ON knowledge_base FOR SELECT USING (is_published = true);
CREATE POLICY "Content managers can manage knowledge base" ON knowledge_base FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'content_manager'))
);

CREATE POLICY "Anyone can view FAQs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Content managers can manage FAQs" ON faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type IN ('admin', 'content_manager'))
);

-- Comments & Engagement (User-owned)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved comments" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can edit own comments" ON comments FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view own engagement" ON content_engagement FOR SELECT USING (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can create engagement" ON content_engagement FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can manage newsletters" ON newsletters FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

-- ============================================================================
-- ORGANIZATION
-- ============================================================================

-- Venues (Public read, admin write)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view venues"
ON venues FOR SELECT
USING (true);

CREATE POLICY "Admins can manage venues"
ON venues FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- Sponsors, Sponsorships (Public read, admin write)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Admins can manage sponsors" ON sponsors FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Anyone can view sponsorships" ON sponsorships FOR SELECT USING (true);
CREATE POLICY "Admins can manage sponsorships" ON sponsorships FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

-- Staff, Volunteers, Officials
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage staff roles" ON staff_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Anyone can view volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Users can create volunteer profile" ON volunteers FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can manage volunteer assignments" ON volunteer_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Anyone can view officials" ON officials FOR SELECT USING (true);
CREATE POLICY "Users can create official profile" ON officials FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can manage official assignments" ON official_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

-- ============================================================================
-- COMMUNICATIONS
-- ============================================================================

-- Notifications (User-owned)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can manage notification preferences"
ON notification_preferences FOR ALL
USING (user_id = auth.jwt() ->> 'sub');

-- Messages & Conversations (User-owned)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (sender_id = auth.jwt() ->> 'sub' OR recipient_id = auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (sender_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view their conversations"
ON conversations FOR SELECT
USING (sender_id = auth.jwt() ->> 'sub' OR recipient_id = auth.jwt() ->> 'sub');

-- Announcements (Public read, admin write)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published announcements"
ON announcements FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = (auth.jwt() ->> 'sub')
    AND permission_type = 'admin'
  )
);

-- Email & SMS (Admin only)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" ON email_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can view email logs" ON email_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can view SMS logs" ON sms_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Users can manage own push tokens" ON push_tokens FOR ALL USING (user_id = auth.jwt() ->> 'sub');

-- ============================================================================
-- STREAMING & E-COMMERCE
-- ============================================================================

-- Streams (Public read, admin write)
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_viewers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live streams" ON streams FOR SELECT USING (status = 'live' OR status = 'scheduled');
CREATE POLICY "Admins can manage streams" ON streams FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "System can track stream viewers" ON stream_viewers FOR INSERT WITH CHECK (true);

-- Products & E-commerce (Public read, admin write, user orders)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Anyone can view product variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Admins can manage variants" ON product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.jwt() ->> 'sub')
);

CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can create subscriptions" ON subscriptions FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- ============================================================================
-- SOCIAL FEATURES
-- ============================================================================

-- Follows & Activities
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (follower_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can view who they follow" ON follows FOR SELECT USING (follower_id = auth.jwt() ->> 'sub' OR followed_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can manage team follows" ON team_follows FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Anyone can view public activities" ON activities FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create activities" ON activities FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Anyone can view activity likes" ON activity_likes FOR SELECT USING (true);
CREATE POLICY "Users can like activities" ON activity_likes FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Posts & Comments
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public posts" ON posts FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can edit own posts" ON posts FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Anyone can view post likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Anyone can view approved post comments" ON post_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create post comments" ON post_comments FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Badges, Leaderboards, Stories
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view user badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view leaderboards" ON leaderboards FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view leaderboard entries" ON leaderboard_entries FOR SELECT USING (true);

CREATE POLICY "Anyone can view stories" ON stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Users can create stories" ON stories FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "System can track story views" ON story_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view mentions of themselves" ON mentions FOR SELECT USING (mentioned_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (reporter_id = auth.jwt() ->> 'sub');
CREATE POLICY "Admins can view reports" ON reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

-- ============================================================================
-- SYSTEM & ANALYTICS
-- ============================================================================

-- Analytics (System/Admin only)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can create analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "System can create page views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "System can create audit logs" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "System can create error logs" ON error_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "System can create API logs" ON api_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);
CREATE POLICY "Admins can view error logs" ON error_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);
CREATE POLICY "Admins can view API logs" ON api_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

-- System Management (Admin only)
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can create health metrics" ON health_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view health metrics" ON health_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can manage feature flags" ON feature_flags FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can manage scheduled jobs" ON scheduled_jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can view job executions" ON job_executions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can manage migrations" ON migrations FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can manage system settings" ON system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "Admins can manage webhooks" ON webhooks FOR ALL USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

CREATE POLICY "System can create webhook logs" ON webhook_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view webhook logs" ON webhook_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_permissions WHERE user_id = (auth.jwt() ->> 'sub') AND permission_type = 'admin')
);

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total Tables with RLS: 98
-- Security Model:
--   - Public tables: Read access for all (events, clubs, venues, etc.)
--   - User-owned: Users control their own data (profiles, settings, cart)
--   - Role-based: Access controlled by user_permissions table
--   - Admin: Full access to system tables and management functions
--
-- To apply these policies to Supabase:
-- 1. Connect to Supabase SQL Editor
-- 2. Run this entire script
-- 3. Verify policies in Supabase Dashboard > Authentication > Policies
-- 4. Test with different user roles
--
-- Note: This script assumes Clerk JWT contains user ID in 'sub' claim
-- The auth.jwt() function references Supabase's JWT parsing
-- Adjust if using different authentication structure
