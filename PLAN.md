# ffSpace — Football News Website

## Tổng quan
Website tin tức bóng đá tên **ffSpace**. Hiển thị tin tức các giải đấu bóng đá, chuyển nhượng. Chỉ lưu tin trong **72 giờ gần nhất**. Public, ai cũng xem được.

## Tech stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Prisma
- **Database**: SQLite (dev) → PostgreSQL (production)
- **Deploy**: Vercel
- **RSS parser**: rss-parser
- **Auth admin**: HTTP Basic Auth (Next.js middleware)

## Màu sắc & thương hiệu
- **Màu chủ đạo**: `#1755C0` (xanh dương đậm)
- **Logo**: file `public/logo.png` (chữ ffS trắng trên nền xanh)
- **Tên hiển thị**: ffSpace

## Cấu trúc thư mục
```
ffspace/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← trang chủ duy nhất
│   │   ├── layout.tsx            ← layout chung + font
│   │   ├── globals.css
│   │   ├── admin/
│   │   │   └── page.tsx          ← admin panel
│   │   └── api/
│   │       ├── articles/
│   │       │   ├── route.ts      ← GET (list) + POST (tạo mới)
│   │       │   └── [id]/
│   │       │       └── route.ts  ← DELETE + PATCH (ẩn)
│   │       └── cron/
│   │           ├── fetch/
│   │           │   └── route.ts  ← fetch RSS feeds
│   │           └── cleanup/
│   │               └── route.ts  ← xoá tin > 72h
│   ├── components/
│   │   ├── Header.tsx            ← logo + nav + bộ lọc giải
│   │   ├── NewsCard.tsx          ← card tin tức
│   │   ├── ArticleModal.tsx      ← popup chi tiết
│   │   ├── LeagueFilter.tsx      ← filter theo giải đấu
│   │   └── Sidebar.tsx           ← chuyển nhượng nóng
│   └── lib/
│       ├── prisma.ts             ← Prisma client singleton
│       └── rss.ts                ← hàm fetch + parse RSS
├── prisma/
│   └── schema.prisma
├── public/
│   └── logo.png                  ← logo ffSpace
└── .env
```

## Database schema (Prisma)

```prisma
model Article {
  id          String   @id @default(cuid())
  title       String
  summary     String
  content     String
  imageUrl    String?
  source      String
  league      String
  publishedAt DateTime @default(now())
  sourceUrl   String?  @unique
  isManual    Boolean  @default(false)
  isHidden    Boolean  @default(false)

  @@index([publishedAt])
  @@index([league])
}

model RssFeed {
  id        String   @id @default(cuid())
  name      String
  url       String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

## Các giải đấu (league filter)
- `all` — Tất cả
- `premier-league` — Premier League
- `champions-league` — Champions League
- `la-liga` — La Liga
- `serie-a` — Serie A
- `bundesliga` — Bundesliga
- `v-league` — V.League
- `transfer` — Chuyển nhượng

## Trang chủ (page.tsx)
- Header: logo ffSpace + bộ lọc giải ngang
- Main: grid card tin tức (2–3 cột), fetch bài trong 72h, sort mới nhất trước
- Sidebar (desktop): danh sách tin chuyển nhượng nóng
- Click card → mở `ArticleModal` (không navigate sang page mới)
- Filter hoạt động phía client (không reload page)

## ArticleModal
- Overlay tối + modal giữa màn hình
- Nội dung: ảnh lớn, badge giải, tiêu đề, nguồn + thời gian, nội dung đầy đủ, link "Xem bài gốc"
- Đóng: click ngoài modal hoặc nút X
- Responsive trên mobile

## Admin panel (/admin)
- Bảo vệ bằng password (env: `ADMIN_PASSWORD`)
- **Tab 1 — Thêm tin**: form gồm tiêu đề, tóm tắt, nội dung, URL ảnh, chọn giải
- **Tab 2 — Quản lý RSS**: danh sách feeds, toggle bật/tắt, thêm feed mới
- **Tab 3 — Danh sách tin**: bảng bài đã đăng, nút ẩn/hiện, nút xoá

## API routes

| Method | Route | Mô tả |
|--------|-------|-------|
| GET | /api/articles | Lấy bài trong 72h, filter theo league |
| POST | /api/articles | Tạo bài thủ công (admin) |
| DELETE | /api/articles/[id] | Xoá bài |
| PATCH | /api/articles/[id] | Ẩn/hiện bài |
| POST | /api/cron/fetch | Fetch tất cả RSS feeds đang bật |
| POST | /api/cron/cleanup | Xoá bài cũ hơn 72h |

## Cron jobs (vercel.json)
```json
{
  "crons": [
    { "path": "/api/cron/fetch", "schedule": "*/15 * * * *" },
    { "path": "/api/cron/cleanup", "schedule": "0 3 * * *" }
  ]
}
```

## RSS feeds mặc định (seed vào DB khi init)
- BBC Sport Football: `https://feeds.bbci.co.uk/sport/football/rss.xml`
- Goal.com: `https://www.goal.com/feeds/en/news`
- ESPN FC: `https://www.espn.com/espn/rss/soccer/news`

## .env cần có
```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="password_của_bạn"
CRON_SECRET="random_secret_string"
```

---

## Các Phase cần làm theo thứ tự

### Phase 1 — Khởi tạo project
1. Tạo Next.js 14 app với TypeScript + Tailwind + App Router + src dir
2. Cài: `prisma @prisma/client rss-parser`
3. Tạo `prisma/schema.prisma` với 2 model: Article + RssFeed (xem schema ở trên)
4. Tạo file `.env` với DATABASE_URL, ADMIN_PASSWORD, CRON_SECRET
5. Chạy `npx prisma migrate dev --name init`
6. Tạo `src/lib/prisma.ts` (singleton Prisma client)
7. Tạo cấu trúc thư mục đầy đủ như trên (file rỗng cũng được)

### Phase 2 — Layout + trang chủ
1. Viết `layout.tsx`: font Inter, màu chủ đạo #1755C0, meta tags
2. Viết `globals.css`: CSS variables cho màu ffSpace
3. Viết `Header.tsx`: logo (public/logo.png) + tên ffSpace + LeagueFilter
4. Viết `LeagueFilter.tsx`: các tab giải đấu, active state màu #1755C0
5. Viết `NewsCard.tsx`: ảnh, badge giải (màu theo giải), tiêu đề, tóm tắt, nguồn + thời gian
6. Viết `Sidebar.tsx`: danh sách tin chuyển nhượng dạng list nhỏ
7. Viết `page.tsx`: fetch từ /api/articles, render grid + sidebar, state filter

### Phase 3 — API articles
1. `GET /api/articles`: query bài trong 72h, filter league, sort publishedAt desc
2. `POST /api/articles`: nhận body JSON, lưu bài mới (isManual: true)
3. `DELETE /api/articles/[id]`: xoá bài theo id
4. `PATCH /api/articles/[id]`: toggle isHidden

### Phase 4 — ArticleModal
1. Viết `ArticleModal.tsx`: overlay + modal
2. Tích hợp vào `page.tsx`: click card → set selectedArticle → mở modal
3. Đóng khi click overlay hoặc nút X
4. Animation mở/đóng mượt
5. Responsive mobile

### Phase 5 — Admin panel
1. Viết middleware bảo vệ `/admin` bằng ADMIN_PASSWORD
2. Viết `admin/page.tsx` với 3 tab: Thêm tin / Quản lý RSS / Danh sách tin
3. Form thêm tin thủ công
4. Danh sách tin với nút ẩn/xoá

### Phase 6 — RSS fetcher
1. Viết `src/lib/rss.ts`: hàm fetchAndParseRSS dùng rss-parser
2. Lọc bài trùng bằng sourceUrl trước khi insert
3. `POST /api/cron/fetch`: fetch tất cả feeds đang isActive: true
4. Trong admin: UI thêm/bật/tắt RSS feed

### Phase 7 — Auto-cleanup
1. `POST /api/cron/cleanup`: xoá Article có publishedAt < now - 72h
2. Tạo `vercel.json` với 2 cron jobs

### Phase 8 — Hoàn thiện & deploy
1. Loading skeleton cho card
2. Error handling khi RSS fail
3. Responsive kiểm tra toàn bộ
4. Deploy Vercel + kết nối PostgreSQL (Supabase hoặc Vercel Postgres)
5. Test cron job production
6. Thêm RSS feeds thật
