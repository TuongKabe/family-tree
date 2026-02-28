-- ═══════════════════════════════════════════════════════════════════════════
-- Sprint 7.5 Migration: Tree-Scoped Editor
-- FR-507: Link user account to person in the family tree
-- FR-508: Scoped edit permissions (subtree boundary)
-- FR-510: Server-side enforcement via RLS + PostgreSQL function
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add edit_root_person_id column to profiles
--    This stores the root of the subtree that this user can edit.
--    NULL = no restriction (global editor / not an editor at all).
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS edit_root_person_id UUID REFERENCES people(id) ON DELETE SET NULL;

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_linked_person     ON profiles(linked_person);
CREATE INDEX IF NOT EXISTS idx_profiles_edit_root_person  ON profiles(edit_root_person_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. PostgreSQL recursive function: is_person_in_subtree
--    Returns TRUE if target_id is the root or a descendant of root_id.
--    Uses recursive CTE through families + children tables.
--    SECURITY DEFINER: runs as owner, bypasses RLS on the read path.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION is_person_in_subtree(root_id UUID, target_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE subtree(id) AS (
    -- Base case: the root itself
    SELECT root_id
    UNION
    -- Recursive case: children via families + children junction
    SELECT ch.person_id
    FROM   subtree s
    JOIN   families f  ON (f.father_id = s.id OR f.mother_id = s.id)
    JOIN   children ch ON ch.family_id = f.id
  )
  SELECT EXISTS (SELECT 1 FROM subtree WHERE id = target_id);
$$;

-- Grant execute to authenticated users (needed for RLS policy evaluation)
GRANT EXECUTE ON FUNCTION is_person_in_subtree(UUID, UUID) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. RLS: Linked person can update their own record (FR-507)
--    A user whose profile.linked_person = people.id can update their own info,
--    even if they have viewer role. This enables self-service profile updates.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE POLICY "Linked person can update own info" ON people
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE  p.user_id = auth.uid()
      AND    p.linked_person = people.id
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. RLS: Branch editors can update people within their assigned subtree (FR-508)
--    Supplements (OR) the existing global editor policy.
--    Only activates when edit_root_person_id IS NOT NULL.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE POLICY "Branch editors can update their subtree" ON people
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE  p.user_id = auth.uid()
      AND    p.role = 'editor'
      AND    p.edit_root_person_id IS NOT NULL
      AND    is_person_in_subtree(p.edit_root_person_id, people.id)
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. RLS: Branch editors can insert people (children in their subtree)
--    INSERT doesn't have the new person's ID yet, so we allow all editors
--    to insert — consistent with current behaviour.
--    Subtree enforcement for INSERT is handled at application level.
-- ═══════════════════════════════════════════════════════════════════════════
-- (No change: existing "Admins and editors can insert people" policy covers this)
