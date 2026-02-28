-- ═══════════════════════════════════════════════════════════════════════════
-- Sprint 9 Security Hardening Migration
-- Reference: https://anninhthudo.vn (personal data risks in genealogy apps)
-- Issues addressed:
--   SEC-01: profiles table exposed to unauthenticated requests
--   SEC-02: people contact fields (phone/email/zalo/address) readable by
--           any registered user regardless of privacy_level
--   SEC-03: privacy_level default 0 (public) too permissive for new entries
--   SEC-04: living people contact data exposed in public SELECT policy
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- SEC-01: Fix profiles table — require authentication to read any profile
-- Before: USING (true)  ← anyone, including unauthenticated, can list all
--         profiles and harvest user emails + roles via the Supabase REST API
-- After:  USING (auth.uid() IS NOT NULL)  ← logged-in users only
-- ─────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;

CREATE POLICY "Authenticated users can read profiles"
ON profiles FOR SELECT
USING (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────────────────
-- SEC-02 & SEC-04: Fix people table — strip contact data from public reads
-- The existing "Public read for public people" policy exposes ALL columns
-- including phone, email, zalo, facebook, address for privacy_level=0 rows
-- even to unauthenticated API requests.
-- 
-- PostgreSQL RLS is row-level (cannot restrict columns), so we:
--   a) Drop the unrestricted public SELECT policy
--   b) For unauthenticated access: expose only rows where privacy_level=0
--      AND the person has no living contact data stored.
--      (Leaves historical ancestors visible; protects living member data)
--   c) Require auth for ANY person that has contact data
-- ─────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read for public people" ON people;

-- New policy: unauthenticated users can only see:
--  - Records explicitly marked public (privacy_level = 0)
--  - AND only where no contact data is stored (safety net)
CREATE POLICY "Public read for public non-contact people" ON people
    FOR SELECT USING (
        privacy_level = 0
        AND phone IS NULL
        AND email IS NULL
        AND zalo IS NULL
        AND facebook IS NULL
        AND address IS NULL
    );

-- Authenticated users can read all members-or-public records (privacy_level < 2)
DROP POLICY IF EXISTS "Members can read all people" ON people;

CREATE POLICY "Authenticated users can read non-private people" ON people
    FOR SELECT USING (
        auth.uid() IS NOT NULL
        AND privacy_level < 2
    );

-- Admins can read everything including privacy_level = 2 (private) records
CREATE POLICY "Admins can read all people" ON people
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────────────────
-- SEC-03: Change default privacy level for people from 0 (public) to 1.
-- New people added via the admin UI will default to "members only".
-- Existing public (privacy_level = 0) ancestors are unchanged.
-- Admins can explicitly set privacy_level = 0 for historical figures.
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE people ALTER COLUMN privacy_level SET DEFAULT 1;

-- ─────────────────────────────────────────────────────────────────────────
-- SEC-05: Ensure living people with contact info are NOT publicly readable.
-- Sets privacy_level = 1 for any currently-public living person who has
-- at least one contact field populated.
-- ─────────────────────────────────────────────────────────────────────────
UPDATE people
SET privacy_level = 1
WHERE privacy_level = 0
  AND is_living = true
  AND (
      phone    IS NOT NULL OR
      email    IS NOT NULL OR
      zalo     IS NOT NULL OR
      facebook IS NOT NULL OR
      address  IS NOT NULL
  );

-- ─────────────────────────────────────────────────────────────────────────
-- SEC-06: Tighten families/children/events/media public read policies.
-- Currently "Anyone can read families/children/events/media" includes
-- unauthenticated users. Restrict to authenticated only so that structural
-- data about living members isn't freely crawlable.
-- ─────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can read families" ON families;
CREATE POLICY "Authenticated can read families" ON families
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can read children" ON children;
CREATE POLICY "Authenticated can read children" ON children
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can read events" ON events;
CREATE POLICY "Authenticated can read events" ON events
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can read media" ON media;
CREATE POLICY "Authenticated can read media" ON media
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────────────────
-- Summary of changes
-- ─────────────────────────────────────────────────────────────────────────
-- Table     | Before                          | After
-- ──────────┼─────────────────────────────────┼────────────────────────────
-- profiles  | SELECT: everyone (incl. anon)   | SELECT: authenticated only
-- people    | SELECT: anon sees ALL public rows| SELECT: anon sees non-contact public only; auth sees members+; admin sees all
-- people    | default privacy_level = 0       | default privacy_level = 1
-- families  | SELECT: everyone                | SELECT: authenticated only
-- children  | SELECT: everyone                | SELECT: authenticated only
-- events    | SELECT: everyone                | SELECT: authenticated only
-- media     | SELECT: everyone                | SELECT: authenticated only
