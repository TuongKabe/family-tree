-- ═══════════════════════════════════════════════════════════════════════════
-- Sprint 7: Lịch Cầu đương (Ceremony Rotation Schedule)
-- Phân công xoay vòng người chủ lễ Cầu đương theo thứ tự cây gia phả
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Nhóm cầu đương (rotation pool config)
--    Mỗi nhóm được định nghĩa bởi một tổ tông và tiêu chí đủ điều kiện
CREATE TABLE IF NOT EXISTS cau_duong_pools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,       -- VD: "Nhánh ông Đặng Đình Nhân"
    ancestor_id     UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
    min_generation  INTEGER NOT NULL DEFAULT 1,  -- Đời tối thiểu (VD: 12)
    max_age_lunar   INTEGER NOT NULL DEFAULT 70, -- Tuổi âm tối đa (dưới 70)
    description     TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Phân công cầu đương (assignments)
--    Mỗi lễ trong năm được phân cho một người, xoay vòng theo thứ tự DFS
CREATE TABLE IF NOT EXISTS cau_duong_assignments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pool_id                 UUID NOT NULL REFERENCES cau_duong_pools(id) ON DELETE CASCADE,
    year                    INTEGER NOT NULL,          -- Năm dương lịch
    ceremony_type           VARCHAR(30) NOT NULL CHECK (
                                ceremony_type IN ('tet', 'ram_thang_gieng', 'gio_to', 'ram_thang_bay')
                            ),
    -- Người được phân công (theo thứ tự xoay vòng)
    host_person_id          UUID REFERENCES people(id) ON DELETE SET NULL,
    -- Người thực sự thực hiện (nếu được ủy quyền)
    actual_host_person_id   UUID REFERENCES people(id) ON DELETE SET NULL,
    -- Trạng thái
    status                  VARCHAR(20) DEFAULT 'scheduled' CHECK (
                                status IN ('scheduled', 'completed', 'delegated', 'rescheduled', 'cancelled')
                            ),
    -- Ngày dự kiến (dương lịch, tính từ lịch âm)
    scheduled_date          DATE,
    -- Ngày thực hiện (nếu sớm/muộn hơn)
    actual_date             DATE,
    -- Lý do ủy quyền hoặc đổi ngày
    reason                  TEXT,
    notes                   TEXT,
    -- Thứ tự trong vòng xoay (để theo dõi tiến trình)
    rotation_index          INTEGER, -- Vị trí trong danh sách DFS khi phân công
    created_by              UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(pool_id, year, ceremony_type)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_cau_duong_pools_ancestor ON cau_duong_pools(ancestor_id);
CREATE INDEX IF NOT EXISTS idx_cau_duong_assignments_pool ON cau_duong_assignments(pool_id);
CREATE INDEX IF NOT EXISTS idx_cau_duong_assignments_year ON cau_duong_assignments(year);
CREATE INDEX IF NOT EXISTS idx_cau_duong_assignments_host ON cau_duong_assignments(host_person_id);
CREATE INDEX IF NOT EXISTS idx_cau_duong_assignments_status ON cau_duong_assignments(status);

-- 4. RLS
ALTER TABLE cau_duong_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE cau_duong_assignments ENABLE ROW LEVEL SECURITY;

-- Pools: tất cả đọc được, admin/editor mới sửa được
CREATE POLICY "Anyone can view cau duong pools"
    ON cau_duong_pools FOR SELECT USING (true);

CREATE POLICY "Admins and editors can manage cau duong pools"
    ON cau_duong_pools FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

-- Assignments: tất cả đọc được, admin/editor mới sửa được
CREATE POLICY "Anyone can view cau duong assignments"
    ON cau_duong_assignments FOR SELECT USING (true);

CREATE POLICY "Admins and editors can manage cau duong assignments"
    ON cau_duong_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

-- ═══════════════════════════════════════════════════════════════════════════
-- Seed: Tạo nhóm cầu đương mặc định
-- Cập nhật ancestor_id sau khi đã chạy seed-dang-dinh.sql
-- ═══════════════════════════════════════════════════════════════════════════
-- INSERT INTO cau_duong_pools (name, ancestor_id, min_generation, max_age_lunar, description)
-- SELECT
--   'Nhóm Cầu đương Chi tộc Đặng Đình',
--   id,
--   12,   -- Đời 12 trở xuống
--   70,   -- Dưới 70 tuổi âm
--   'Xoay vòng các nam giới đã lập gia đình, dưới 70 tuổi âm, đời 12 trở xuống'
-- FROM people WHERE handle = 'P001'; -- Thay handle của tổ tông

