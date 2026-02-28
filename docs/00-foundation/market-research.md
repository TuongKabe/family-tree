---
project: AncestorTree
path: docs/00-foundation/market-research.md
type: foundation
version: 1.0.0
updated: 2026-02-24
owner: "@researcher"
status: approved
---

# Market Research: Genealogy Software

## 1. Executive Summary

Nghiên cứu các giải pháp gia phả quốc tế và OSS để xác định:
- Core features phổ biến nhất
- Best practices về UX/UI
- Technical standards (GEDCOM)
- Gaps có thể fill cho thị trường Việt Nam

---

## 2. Commercial Platforms

### 2.1 Ancestry.com (Market Leader)

| Aspect | Details |
|--------|---------|
| **Users** | 3+ million paying subscribers |
| **Pricing** | $24.99 - $49.99/month |
| **Strengths** | Massive database, DNA integration, historical records |
| **Weaknesses** | Expensive, US-centric, no Vietnamese support |

**Key Features:**
- Family tree builder
- DNA testing integration
- Historical record search
- Hints & suggestions
- Mobile apps (iOS, Android)
- Collaboration tools

### 2.2 MyHeritage

| Aspect | Details |
|--------|---------|
| **Users** | 60+ million users |
| **Pricing** | Free tier + Premium ($12.49/month) |
| **Strengths** | Good international support, photo enhancement |
| **Weaknesses** | Limited free tier, no Vietnamese UI |

**Key Features:**
- Smart Matches™
- Photo colorization & animation
- DNA testing
- Family tree builder
- Mobile apps

### 2.3 FamilySearch (Free)

| Aspect | Details |
|--------|---------|
| **Users** | 15+ million registered |
| **Pricing** | 100% Free (LDS Church) |
| **Strengths** | Free, massive records, collaborative |
| **Weaknesses** | Complex UI, limited Vietnamese records |

**Key Features:**
- Collaborative family tree
- Record search
- Memories (photos, stories)
- Temple work (LDS-specific)
- GEDCOM import/export

### 2.4 Findmypast

| Aspect | Details |
|--------|---------|
| **Pricing** | £12.95/month |
| **Focus** | UK & Ireland records |

### 2.5 Geni.com

| Aspect | Details |
|--------|---------|
| **Model** | Freemium |
| **Unique** | Single world family tree concept |

---

## 3. Open Source Solutions (OSS)

### 3.1 Gramps (⭐ 2.5K GitHub)

| Aspect | Details |
|--------|---------|
| **URL** | https://gramps-project.org |
| **Tech** | Python, GTK |
| **Platform** | Desktop (Windows, macOS, Linux) |
| **License** | GPL v2 |

**Features:**
- Full genealogy database
- Reports & charts
- GEDCOM compliant
- Plugin system
- Privacy controls
- Extensive documentation

**Gramps Web** - Web interface cho Gramps:
- JavaScript frontend
- REST API backend
- Collaborative editing

### 3.2 Webtrees (⭐ 2.1K GitHub)

| Aspect | Details |
|--------|---------|
| **URL** | https://webtrees.net |
| **Tech** | PHP, MySQL |
| **Platform** | Web (self-hosted) |
| **License** | GPL v3 |

**Key Features:**
- 60+ languages supported
- GEDCOM compliant
- Collaborative editing
- Multiple surname conventions
- Privacy controls (flexible)
- Theme customization
- Report generation

### 3.3 Topola Viewer (⭐ 300+ GitHub)

| Aspect | Details |
|--------|---------|
| **URL** | https://github.com/PeWu/topola-viewer |
| **Tech** | TypeScript, React |
| **Platform** | Web (client-side) |
| **License** | MIT |

**Key Features:**
- Hourglass chart
- All relatives chart
- GEDCOM file support
- Export: PDF, PNG, SVG
- Privacy - files stay local
- Print entire tree
- Interactive animations

**Best for:** Pure visualization, no backend needed

### 3.4 Genealogy Laravel (Active Development)

| Aspect | Details |
|--------|---------|
| **URL** | https://github.com/MGeurts/genealogy |
| **Tech** | Laravel 12, PHP 8.4, Filament, Livewire |
| **License** | MIT |

**Modern stack, actively maintained (Feb 2026)**

### 3.5 dTree (Visualization Library)

| Aspect | Details |
|--------|---------|
| **URL** | https://github.com/ErikGartner/dTree |
| **Tech** | JavaScript, D3.js |
| **Use case** | Tree visualization with multiple parents |

### 3.6 FamilyGem (Mobile)

| Aspect | Details |
|--------|---------|
| **URL** | https://github.com/michelesalvador/FamilyGem |
| **Tech** | Kotlin |
| **Platform** | Android |
| **License** | GPL v3 |

---

## 4. Industry Standard: GEDCOM

### 4.1 What is GEDCOM?

**GEDCOM** (Genealogical Data Communication) là tiêu chuẩn ngành để trao đổi dữ liệu gia phả.

| Version | Status |
|---------|--------|
| GEDCOM 5.5.1 | Current standard (1999) |
| GEDCOM 7.0 | Released 2021, adoption growing |
| GEDCOM-X | JSON-based alternative |

### 4.2 GEDCOM Structure

```gedcom
0 HEAD
1 SOUR MyGenealogy
1 GEDC
2 VERS 5.5.1
0 @I1@ INDI
1 NAME John /Doe/
1 SEX M
1 BIRT
2 DATE 1 JAN 1900
2 PLAC New York, USA
1 FAMC @F1@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
0 TRLR
```

### 4.3 GEDCOM Recommendation

| Priority | Recommendation |
|----------|----------------|
| **v1.0** | Basic import/export (GEDCOM 5.5.1) |
| **v2.0** | Full GEDCOM 7.0 support |

---

## 5. Core Features Analysis

### 5.1 Must-Have Features (All Platforms)

| Feature | Ancestry | MyHeritage | FamilySearch | Gramps | Webtrees |
|---------|:--------:|:----------:|:------------:|:------:|:--------:|
| Person CRUD | ✅ | ✅ | ✅ | ✅ | ✅ |
| Family relationships | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tree visualization | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| GEDCOM | ✅ | ✅ | ✅ | ✅ | ✅ |
| Photos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Privacy controls | ✅ | ✅ | ✅ | ✅ | ✅ |

### 5.2 Common Features

| Feature | % Platforms | Priority for Us |
|---------|-------------|-----------------|
| Pedigree chart (ancestors) | 100% | P0 |
| Descendant chart | 100% | P0 |
| Person profile | 100% | P0 |
| Date handling | 100% | P0 |
| Place handling | 100% | P1 |
| Source citations | 80% | P2 |
| Reports/exports | 80% | P1 |
| Collaboration | 70% | P1 |
| Mobile responsive | 60% | P0 |
| DNA integration | 40% | ❌ Out of scope |

### 5.3 Differentiating Features

| Feature | Unique to | Consider? |
|---------|-----------|-----------|
| Smart Matches | MyHeritage | ❌ |
| DNA testing | Ancestry | ❌ |
| Historical records | Ancestry, FamilySearch | ❌ |
| Photo colorization | MyHeritage | ❌ |
| Hourglass chart | Topola | ✅ Nice to have |
| Multiple parents | dTree | ✅ Important |

---

## 6. Vietnamese-Specific Requirements

### 6.1 Features Missing from International Solutions

| Feature | Description | Priority |
|---------|-------------|----------|
| **Âm lịch** | Lunar calendar for death anniversaries | P1 |
| **Ngày giỗ** | Memorial day tracking | P1 |
| **Chi/Nhánh** | Lineage branches | P0 |
| **Đời (Generation)** | Generation numbering | P0 |
| **Tên húy/Tên tự** | Traditional names | P2 |
| **Chính tộc** | Patrilineal markers | P0 |
| **Nhà thờ họ** | Ancestral hall info | P2 |
| **Quỹ họ** | Family fund management | P2 |
| **Can Chi** | Zodiac year | P2 |

### 6.2 Vietnamese Name Conventions

```
Full name: Đặng Đình Tài
├── Họ (Surname): Đặng
├── Tên đệm (Middle): Đình
└── Tên (Given): Tài

Traditional:
├── Tên húy (Taboo name): Tên chính thức, tránh gọi
├── Tên tự (Courtesy name): Tên xưng hô
└── Hiệu (Pen name): Tên tự đặt
```

---

## 7. Technical Standards

### 7.1 Data Model Comparison

| Platform | Storage | Relationships |
|----------|---------|---------------|
| GEDCOM | File-based | Links by ID |
| Gramps | SQLite | Normalized tables |
| Webtrees | MySQL | Normalized + GEDCOM cache |
| Our choice | **PostgreSQL** | Normalized, Supabase |

### 7.2 Tree Visualization Libraries

| Library | Tech | Pros | Cons |
|---------|------|------|------|
| **D3.js** | JS | Powerful, flexible | Learning curve |
| **GoJS** | JS | Feature-rich | Commercial |
| **Cytoscape** | JS | Graph-focused | Overkill |
| **Custom SVG** | - | Full control | More work |
| **React Flow** | React | Modern, easy | May not fit |

**Recommendation:** Custom implementation hoặc dTree/Topola patterns

### 7.3 Chart Types

| Chart | Description | Priority |
|-------|-------------|----------|
| **Pedigree** | Ancestors only (2, 4, 8...) | P0 |
| **Descendant** | All descendants from person | P0 |
| **Hourglass** | Ancestors + Descendants | P1 |
| **Fan chart** | Circular ancestors | P2 |
| **All relatives** | Complete network | P2 |

---

## 8. Recommendations for BRD

### 8.1 Core Features (MVP - v1.0)

| ID | Feature | Source |
|----|---------|--------|
| F-01 | Person CRUD | All platforms |
| F-02 | Family relationships | All platforms |
| F-03 | Pedigree tree view | All platforms |
| F-04 | Descendant tree view | All platforms |
| F-05 | Search by name | All platforms |
| F-06 | Generation tracking | Vietnamese need |
| F-07 | Chi/Branch tracking | Vietnamese need |
| F-08 | Patrilineal marking | Vietnamese need |
| F-09 | Basic auth (Admin/Viewer) | Webtrees |
| F-10 | Mobile responsive | Industry standard |
| F-11 | GEDCOM export (basic) | Industry standard |

### 8.2 Enhanced Features (v1.1)

| ID | Feature | Source |
|----|---------|--------|
| F-12 | Photo gallery | All platforms |
| F-13 | Contribution workflow | Webtrees |
| F-14 | Member directory | FamilySearch |
| F-15 | Hourglass chart | Topola |
| F-16 | Print/Export PDF | Topola |

### 8.3 Vietnamese Features (v1.2+)

| ID | Feature | Source |
|----|---------|--------|
| F-17 | Âm lịch support | Gen3.vn |
| F-18 | Ngày giỗ calendar | Gen3.vn |
| F-19 | Memorial reminders | Gen3.vn |
| F-20 | Can Chi (Zodiac) | Existing repo |

### 8.4 Future Scope (v2.0+)

| ID | Feature | Notes |
|----|---------|-------|
| F-21 | Multi-tenant | Like Gen3 |
| F-22 | Quỹ họ (Fund) | Vietnamese need |
| F-23 | Nhà thờ họ | Vietnamese need |
| F-24 | Full GEDCOM 7.0 | Industry standard |

---

## 9. Competitive Positioning

### 9.1 Our Unique Value

| Differentiator | vs Commercial | vs OSS |
|----------------|---------------|--------|
| **100% Free** | ✅ Win | = Equal |
| **Vietnamese UI** | ✅ Win | ✅ Win |
| **Vietnamese culture** | ✅ Win | ✅ Win |
| **Modern stack** | ✅ Win | ✅ Win (vs Gramps/Webtrees) |
| **Easy deploy** | ✅ Win | ✅ Win |
| **Open source** | ✅ Win | = Equal |

### 9.2 Gap Analysis

| Gap | Commercial | OSS | Our Solution |
|-----|------------|-----|--------------|
| Vietnamese language | ❌ | ⚠️ Limited | ✅ Native |
| Âm lịch | ❌ | ❌ | ✅ Built-in |
| Ngày giỗ | ❌ | ❌ | ✅ Built-in |
| Chi/Nhánh | ❌ | ❌ | ✅ Built-in |
| Modern web stack | ✅ | ⚠️ Varies | ✅ Next.js |
| Free hosting | ❌ | ⚠️ Self-host | ✅ Vercel free |

---

## 10. References

### 10.1 GitHub Repositories (423 genealogy projects)

| Project | Stars | Tech | Active |
|---------|-------|------|--------|
| gramps/gramps | 2.5K | Python | ✅ Feb 2026 |
| fisharebest/webtrees | 2.1K | PHP | ✅ Feb 2026 |
| PeWu/topola-viewer | 300+ | TypeScript | ✅ Feb 2026 |
| MGeurts/genealogy | 200+ | Laravel | ✅ Feb 2026 |
| ErikGartner/dTree | 500+ | JavaScript | ⚠️ 2024 |

### 10.2 Standards

- GEDCOM 5.5.1: https://gedcom.io/specs/
- GEDCOM 7.0: https://gedcom.io/
- GEDCOM-X: https://github.com/FamilySearch/gedcomx

### 10.3 Articles

- "State of Genealogy Software 2025"
- "GEDCOM 7.0 Adoption Guide"
- "Building Family Tree Visualizations with D3"

---

**Previous:** [problem-statement.md](./problem-statement.md)
**Next:** [business-case.md](./business-case.md)

*SDLC Framework 6.1.1 - Stage 00 Foundation*
