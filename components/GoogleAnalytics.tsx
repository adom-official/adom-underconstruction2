import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/constants";

/**
 * Chèn Google Analytics (gtag.js) theo chuẩn Next.js.
 * Dùng strategy "afterInteractive" để không chặn tốc độ tải trang ban đầu.
 * Nếu chưa cấu hình NEXT_PUBLIC_GA_ID thì component sẽ không render gì cả.
 */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
