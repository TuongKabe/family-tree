---
project: AncestorTree
path: docs/00-foundation/problem-statement.md
type: foundation
version: 1.0.0
updated: 2026-02-24
owner: "@pm, @researcher"
status: approved
---

# Problem Statement

## 1. Problem Overview

### 1.1 Current Situation

Chi tộc Đặng Đình tại Hà Tĩnh hiện đang quản lý gia phả theo phương pháp truyền thống:

| Phương pháp | Vấn đề |
|-------------|--------|
| **Sách gia phả giấy** | Dễ hư hỏng, thất lạc, khó cập nhật |
| **Excel/Word** | Không trực quan, khó chia sẻ, thiếu bảo mật |
| **Truyền miệng** | Thông tin sai lệch, mất mát qua thế hệ |
| **Ảnh chụp** | Phân tán, không có cấu trúc, khó tìm kiếm |

### 1.2 Pain Points

#### Đối với Hội đồng Gia tộc (HĐGT)
- Khó tổng hợp thông tin từ các chi nhánh
- Không có công cụ quản lý tập trung
- Khó thống kê số lượng thành viên theo đời, chi
- Không có hệ thống lưu trữ backup

#### Đối với Thành viên trong tộc
- Không biết mình thuộc đời thứ mấy, chi nào
- Khó tìm hiểu thông tin về tổ tiên
- Không có kênh đóng góp, cập nhật thông tin
- Thiếu công cụ tra cứu khi cần (giỗ, cúng, liên lạc)

#### Đối với Thế hệ trẻ
- Không quan tâm vì thiếu công cụ hiện đại
- Không có ứng dụng mobile để tra cứu
- Thiếu sự kết nối với nguồn cội

### 1.3 Impact

| Metric | Current State | Impact |
|--------|---------------|--------|
| **Thông tin chính xác** | ~60-70% | Sai lệch dẫn đến tranh cãi |
| **Khả năng truy cập** | Chỉ HĐGT | Thành viên không thể tra cứu |
| **Tốc độ cập nhật** | 1-2 năm/lần | Thông tin lỗi thời |
| **Backup & Recovery** | Không có | Nguy cơ mất mát vĩnh viễn |

---

## 2. Problem Statement

> **"Chi tộc Đặng Đình cần một giải pháp số hóa gia phả để bảo tồn, quản lý và chia sẻ thông tin dòng họ một cách chính xác, dễ truy cập và bền vững qua nhiều thế hệ."**

### 2.1 Root Causes (5 Whys Analysis)

```
Tại sao thông tin gia phả bị sai lệch?
└── Vì không có nguồn dữ liệu tập trung (SSOT)
    └── Vì không có công cụ quản lý số hóa
        └── Vì các giải pháp hiện có không phù hợp văn hóa Việt Nam
            └── Vì thiếu giải pháp open-source cho cộng đồng
                └── VÌ CHƯA AI LÀM ĐÚNG VÀ ĐẦY ĐỦ
```

### 2.2 Constraints

| Constraint | Description |
|------------|-------------|
| **Budget** | $0/month (sử dụng free tier) |
| **Tech Stack** | Web-based, mobile responsive |
| **Users** | Đa dạng (từ cao tuổi đến trẻ) |
| **Data Privacy** | Thông tin nhạy cảm (liên lạc, địa chỉ) |
| **Scalability** | Có thể reuse cho dòng họ khác |

---

## 3. Success Criteria

### 3.1 Business Success

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Adoption Rate** | >50% thành viên trong 1 năm | Số tài khoản đăng ký |
| **Data Accuracy** | >95% | Review bởi HĐGT |
| **Community Reuse** | >5 dòng họ sử dụng | Fork/Deploy count |

### 3.2 Technical Success

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Uptime** | >99% | Vercel analytics |
| **Page Load** | <3s | Lighthouse |
| **Mobile Score** | >90 | Lighthouse |
| **Zero Cost** | $0/month | Billing |

---

## 4. Scope Boundaries

### 4.1 In Scope

- ✅ Quản lý thông tin thành viên (CRUD)
- ✅ Hiển thị cây gia phả (interactive tree)
- ✅ Tìm kiếm, lọc theo đời/chi/tên
- ✅ Hệ thống auth (Admin/Viewer)
- ✅ Mobile responsive
- ✅ Open source (MIT license)

### 4.2 Out of Scope (v1.0)

- ❌ Native mobile app (iOS/Android)
- ❌ Quản lý tài chính/quỹ họ
- ❌ Tích hợp DNA/genetic testing
- ❌ Multi-language (chỉ tiếng Việt)
- ❌ Offline-first capability

### 4.3 Future Considerations (v2.0+)

- 📌 Âm lịch cho ngày giỗ
- 📌 Quản lý quỹ họ
- 📌 Export PDF sách gia phả
- 📌 Nhà thờ họ (map, ảnh)
- 📌 Thông báo ngày giỗ

---

## 5. Stakeholder Analysis

| Stakeholder | Role | Interest | Influence |
|-------------|------|----------|-----------|
| **Chủ tịch HĐGT** | Sponsor | Cao | Cao |
| **Ban Chấp hành** | Admin Users | Cao | Trung bình |
| **Thành viên** | End Users | Trung bình | Thấp |
| **Cộng đồng OSS** | Contributors | Thấp | Thấp |

---

## 6. Assumptions & Risks

### 6.1 Assumptions

1. Thành viên có smartphone và internet cơ bản
2. HĐGT sẵn sàng cung cấp dữ liệu gia phả
3. Có người phụ trách nhập liệu ban đầu
4. Supabase và Vercel free tier đủ cho scale hiện tại

### 6.2 Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Dữ liệu nhập sai** | Cao | Cao | Review workflow, contribution system |
| **Low adoption** | Trung bình | Cao | UI đơn giản, training HĐGT |
| **Free tier limits** | Thấp | Trung bình | Monitor usage, upgrade plan |
| **Bảo mật thông tin** | Thấp | Cao | Role-based access, data encryption |

---

## 7. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Sponsor | Chủ tịch HĐGT | | ⏳ Pending |
| PM | @pm | 2026-02-24 | ✅ Approved |
| Researcher | @researcher | 2026-02-24 | ✅ Approved |

---

**Next:** [Business Case](./business-case.md)

*SDLC Framework 6.1.1 - Stage 00 Foundation*
