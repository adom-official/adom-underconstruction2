# ADOM — Coming Soon

Landing page "sắp ra mắt" cho ADOM: Next.js 14 (App Router) + TypeScript +
Tailwind CSS + Framer Motion. Theme "Space / Universe" — nền tối huyền bí,
starfield + sao băng bằng canvas, tinh vân parallax theo chuột, form đăng ký
nhận thông báo, tối ưu SEO và Google Analytics tích hợp sẵn.

## Bắt đầu

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Trước khi triển khai (deploy)

1. **Thông tin liên hệ & thương hiệu** — mở `lib/constants.ts` và cập nhật:
   - `siteConfig.url` — domain thật (vd. `https://adom.vn`)
   - `siteConfig.ogImage` — thêm ảnh Open Graph 1200×630px vào `public/og-image.png`
   - `contactInfo.email`, `contactInfo.phone`, `contactInfo.address`, `contactInfo.socials`

2. **Favicon** — thêm file `favicon.ico` vào thư mục `public/`.

3. **Google Analytics** — tạo file `.env.local` (copy từ `.env.example`) và điền:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   Nếu để trống, phần Google Analytics sẽ tự động không được nhúng vào trang.

4. **Kết nối form đăng ký với dịch vụ thật** — hiện tại `app/api/subscribe/route.ts`
   chỉ log email ra console. Hãy nối với Mailchimp, Resend, Brevo, Google
   Sheets, hoặc một database (Supabase/Postgres...) trước khi dùng thật.

5. **Deploy lên Vercel**
   ```bash
   git init && git add . && git commit -m "init"
   git remote add origin <repo-url>
   git push -u origin main
   ```
   Sau đó import repo vào Vercel, thêm biến môi trường `NEXT_PUBLIC_GA_ID`
   trong phần Environment Variables, rồi deploy.

## Kiến trúc

- `app/layout.tsx` — font, metadata SEO đầy đủ (Open Graph, Twitter Card,
  JSON-LD Organization schema), tích hợp Google Analytics.
- `app/page.tsx` — nội dung trang, hiệu ứng entrance + tilt 3D nhẹ theo chuột.
- `app/api/subscribe/route.ts` — API nhận email đăng ký.
- `app/robots.ts`, `app/sitemap.ts` — sinh `robots.txt` và `sitemap.xml` tự động.
- `components/StarField.tsx` — nền sao + sao băng vẽ bằng Canvas 2D (nhẹ,
  tôn trọng `prefers-reduced-motion`, tự dừng khi tab ẩn để tiết kiệm CPU).
- `components/NebulaParallax.tsx` — các khối tinh vân mờ, di chuyển theo con trỏ.
- `components/ConstellationMark.tsx` — vòng quỹ đạo xoay chậm (signature visual).
- `components/WaitlistForm.tsx` — form đăng ký nhận thông báo.
- `components/GoogleAnalytics.tsx` — chèn gtag.js (chỉ khi có `NEXT_PUBLIC_GA_ID`).

## Hiệu năng

- Toàn bộ animation nền dùng Canvas 2D nhẹ, không dùng thư viện 3D nặng (giữ
  bundle nhỏ, tải nhanh).
- Font tải qua `next/font/google` (tự động subset + self-host, không có
  layout shift).
- Google Analytics tải với `strategy="afterInteractive"` để không chặn tốc
  độ hiển thị nội dung ban đầu.
- Ảnh (khi thêm vào) nên dùng `next/image` để tự động tối ưu định dạng
  AVIF/WebP (đã bật sẵn trong `next.config.mjs`).
