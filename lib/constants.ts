// Cập nhật các thông tin dưới đây cho đúng với ADOM trước khi triển khai.

export const siteConfig = {
  name: "ADOM",
  fullName: "ADOM Creative",
  legalName: "Một thương hiệu của Công ty TNHH Đầu tư Thương mại HML",
  url: "https://adom.vn", // TODO: thay bằng domain thật khi deploy
  description:
    "ADOM Creative là công ty tư vấn chiến lược thương hiệu và thiết kế cao cấp dành cho doanh nghiệp SME và khách hàng Enterprise. Website mới của chúng tôi sắp ra mắt.",
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
  email: "creative.adom@gmail.com", // TODO: thay email thật
  phone: "+84 (0) 985 048 267", // TODO: thay số điện thoại thật
  address: "Hà Nội, Việt Nam", // TODO: thay địa chỉ chi tiết nếu muốn hiển thị
  socials: [
    { label: "Facebook", href: "https://facebook.com/adom" }, // TODO
    { label: "Instagram", href: "https://instagram.com/adom" }, // TODO
    { label: "LinkedIn", href: "https://linkedin.com/company/adom" }, // TODO
  ],
};

// Đặt biến môi trường NEXT_PUBLIC_GA_ID trong .env.local để bật Google Analytics
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
