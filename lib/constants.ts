// Cập nhật các thông tin dưới đây cho đúng với ADOM trước khi triển khai.

export const siteConfig = {
  name: "ADOM",
  fullName: "ADOM Brand Studio",
  legalName: "Công ty TNHH Đầu tư Thương mại HML",
  url: "https://adom.vn", // TODO: thay bằng domain thật khi deploy
  description:
    "ADOM là studio tư vấn chiến lược thương hiệu và thiết kế cao cấp dành cho doanh nghiệp SME và khách hàng enterprise. Website mới của chúng tôi sắp ra mắt.",
  ogImage: "/og-image.png", // TODO: thêm ảnh OG 1200x630 vào /public
  locale: "vi_VN",
  keywords: [
    "ADOM",
    "brand strategy",
    "thiết kế thương hiệu",
    "tư vấn thương hiệu",
    "brand design Hà Nội",
    "chiến lược thương hiệu",
    "branding agency Vietnam",
  ],
};

export const contactInfo = {
  email: "hello@adom.vn", // TODO: thay email thật
  phone: "+84 (0) 24 0000 0000", // TODO: thay số điện thoại thật
  address: "Hà Nội, Việt Nam", // TODO: thay địa chỉ chi tiết nếu muốn hiển thị
  socials: [
    { label: "Facebook", href: "https://facebook.com/adom" }, // TODO
    { label: "Instagram", href: "https://instagram.com/adom" }, // TODO
    { label: "LinkedIn", href: "https://linkedin.com/company/adom" }, // TODO
  ],
};

// Đặt biến môi trường NEXT_PUBLIC_GA_ID trong .env.local để bật Google Analytics
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
