---
project: AncestorTree
path: docs/04-build/LOCAL-DEVELOPMENT.md
type: build
version: 1.6.0
updated: 2026-02-26
owner: "@fullstack"
status: approved
---

# Local Development Guide

Chạy **toàn bộ AncestorTree stack** offline — không cần tài khoản Supabase hay Vercel.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |
| Node.js | 18+ | https://nodejs.org |
| pnpm | 8+ | `npm install -g pnpm` |
| Supabase CLI | Latest | `brew install supabase/tap/supabase` |

> **Memory:** Docker Desktop cần ít nhất **2GB RAM**. Mặc định thường đủ.

---

## Quick Start (3 bước)

```bash
# 1. Clone repo
git clone https://github.com/Minh-Tam-Solution/AncestorTree.git
cd AncestorTree/frontend

# 2. Cài dependencies + khởi động local stack
pnpm install
pnpm local:setup

# 3. Chạy app
pnpm dev
```

Truy cập:
- **App:** http://localhost:4000
- **Supabase Studio:** http://localhost:54323

**Demo accounts:**

| Email | Password | Role |
|-------|----------|------|
| `admin@giapha.local` | `admin123` | Admin |
| `viewer@giapha.local` | `viewer123` | Viewer |

---

## Cách hoạt động

```
pnpm local:setup
       │
       ├─ Kiểm tra Docker Desktop đang chạy
       ├─ Kiểm tra Supabase CLI installed
       ├─ supabase start  (Docker pull images lần đầu ~2-3 phút)
       │     │
       │     ├─ Chạy migrations/ (5 files, theo thứ tự timestamp)
       │     └─ Chạy seed.sql (2 auth users + 18 members + families)
       │
       └─ Tự động ghi .env.local với local credentials
```

**Zero code change:** Cùng data layer, hooks, components — chỉ khác env vars.

---

## Commands

| Command | Tác dụng |
|---------|---------|
| `pnpm local:setup` | Full setup: start Docker + write .env.local |
| `pnpm local:start` | Start containers (sau khi đã setup) |
| `pnpm local:stop` | Dừng containers, giữ nguyên data |
| `pnpm local:reset` | Reset DB + chạy lại migrations + seed |
| `pnpm dev` | Start Next.js dev server (port 4000) |
| `pnpm build` | Production build (cloud mode không ảnh hưởng) |

---

## Ports

| Service | Port | URL |
|---------|------|-----|
| Next.js app | 4000 | http://localhost:4000 |
| Supabase API | 54321 | http://localhost:54321 |
| PostgreSQL | 54322 | `postgresql://postgres:postgres@localhost:54322/postgres` |
| Supabase Studio | 54323 | http://localhost:54323 |

---

## Demo Data

`supabase/seed.sql` tạo sẵn:

**Auth users:**
- `admin@giapha.local` / `admin123` — role: admin
- `viewer@giapha.local` / `viewer123` — role: viewer

**Gia phả demo (18 thành viên, 5 đời):**

```
Đặng Văn Thủy Tổ (Đời 1)
├── Đặng Văn Nhất (Đời 2)  ×  Trần Thị Lan
│   ├── Đặng Văn Tài (Đời 3)  ×  Phạm Thị Hoa
│   │   ├── Đặng Văn Minh (Đời 4)  ×  Nguyễn Thị Hằng
│   │   │   ├── Đặng Văn An (Đời 5)
│   │   │   └── Đặng Thị Bình (Đời 5)
│   │   └── Đặng Văn Hùng (Đời 4)
│   │       └── Đặng Văn Cường (Đời 5)
│   └── Đặng Thị Liên (Đời 3)
├── Đặng Văn Nhị (Đời 2)  ×  Lê Thị Mai
│   └── Đặng Văn Đức (Đời 3)
│       └── Đặng Thị Phượng (Đời 4)
└── Đặng Thị Ba (Đời 2)
```

**Dữ liệu mẫu thêm:**
- 5 sự kiện (giỗ, lễ, tết)
- 2 thành tích (học tập, sự nghiệp)
- 2 bài hương ước (gia huấn, quy ước)

---

## Troubleshooting

### Docker không chạy

```
❌ Docker Desktop is not running.
```

→ Mở Docker Desktop, chờ "Docker Desktop is running" rồi chạy lại.

---

### Supabase CLI không tìm thấy

```
❌ Supabase CLI not found.
```

macOS/Linux:
```bash
brew install supabase/tap/supabase
```

Windows (PowerShell):
```powershell
scoop install supabase
# hoặc
winget install Supabase.CLI
```

---

### Port đã bị sử dụng

```
Error: listen tcp 0.0.0.0:54321: bind: address already in use
```

→ Kiểm tra `supabase status`. Nếu đã chạy, dùng `pnpm local:start` thay vì `local:setup`.

---

### Login thất bại với demo account

Trigger `handle_new_user()` tự tạo profile sau khi seed auth users. Nếu profile chưa có:

```sql
-- Chạy trong Supabase Studio → SQL Editor
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@giapha.local';
```

---

### Reset về trạng thái ban đầu

```bash
pnpm local:reset
```

Lệnh này chạy lại toàn bộ migrations + seed.sql. Mọi data tự tạo sẽ bị xoá.

---

### Chuyển về Supabase Cloud

```bash
# Backup .env.local hiện tại (nếu cần)
cp .env.local .env.local.local.bak

# Khôi phục cloud config
cp .env.local.cloud.bak .env.local   # nếu có từ pnpm local:setup
# hoặc
cp .env.local.example .env.local     # điền lại cloud credentials
```

---

## File Structure

```
frontend/
├── supabase/
│   ├── config.toml           # Supabase CLI config (ports, auth, storage)
│   ├── seed.sql              # Demo data (auth users + family tree)
│   └── migrations/           # Timestamped SQL — single source of truth
│       ├── 20260224000000_database_setup.sql
│       ├── 20260224000001_sprint6_migration.sql
│       ├── 20260224000002_cau_duong_migration.sql
│       ├── 20260224000003_sprint75_migration.sql
│       └── 20260224000004_storage_setup.sql
├── scripts/
│   └── local-setup.mjs       # Cross-platform Node.js setup script
├── .env.local.example         # Template (both cloud + local options)
└── .env.local                 # ⚠️ NOT committed (auto-generated)
```

---

## For Contributors

Khi thêm migration mới:
1. Tạo file `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Test locally: `pnpm local:reset`
3. Cập nhật `supabase/seed.sql` nếu cần seed data mới
4. Cập nhật `docs/02-design/technical-design.md`

---

**See also:**
- [SPRINT-PLAN.md](./SPRINT-PLAN.md) — Sprint 8 implementation details
- [technical-design.md](../02-design/technical-design.md) — Architecture + DB schema

*SDLC Framework 6.1.1 - Stage 04 Build*
