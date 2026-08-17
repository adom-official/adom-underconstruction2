"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Signature visual của trang: một cụm hình khối cầu (basic geometric orbs)
 * với kích thước, độ mờ đục và gradient ánh sáng khác nhau — mô phỏng một
 * cụm thiên thể / nguồn sáng vũ trụ tỏa ra từ một lõi sáng trung tâm.
 * Được bao quanh bởi 2 vòng quỹ đạo mảnh, xoay chậm, giữ cảm giác kỷ luật,
 * tối giản nhưng vẫn tạo điểm nhấn thị giác mạnh — ẩn dụ ADOM là điểm tựa
 * ánh sáng dẫn lối cho thương hiệu.
 */
export default function ConstellationMark() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto h-[300px] w-[300px] sm:h-[420px] sm:w-[420px]"
    >
      {/* Vòng quỹ đạo ngoài */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full animate-spin-slow"
        style={{ animationDirection: "reverse" }}
      >
        <ellipse
          cx="200"
          cy="200"
          rx="178"
          ry="66"
          fill="none"
          stroke="rgba(201,164,103,0.22)"
          strokeWidth="0.75"
          transform="rotate(15 200 200)"
        />
      </svg>

      {/* Vòng quỹ đạo trong */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow">
        <ellipse
          cx="200"
          cy="200"
          rx="140"
          ry="96"
          fill="none"
          stroke="rgba(138,111,214,0.26)"
          strokeWidth="0.75"
          transform="rotate(-20 200 200)"
        />
      </svg>

      {/* Cụm hình khối phát sáng - phần tử tín hiệu của trang */}
      <motion.div
        className="absolute inset-0"
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, -12, 0] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="orbAurum" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#F6E4C1" stopOpacity="1" />
              <stop offset="45%" stopColor="#E4C58B" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C9A467" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orbNebula" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#B7A2E8" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#8A6FD6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4B3A86" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orbGhost" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#F4F1EA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F4F1EA" stopOpacity="0" />
            </radialGradient>
            <filter id="softBlurLg" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <filter id="softBlurMd" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Quầng sáng lớn phía sau - tạo chiều sâu volumetric */}
          <circle cx="195" cy="205" r="150" fill="url(#orbNebula)" opacity="0.35" filter="url(#softBlurLg)" />

          {/* Khối phụ - kích thước và độ mờ khác nhau */}
          <circle cx="296" cy="146" r="30" fill="url(#orbNebula)" opacity="0.55" filter="url(#softBlurMd)" />
          <circle cx="108" cy="268" r="17" fill="url(#orbGhost)" opacity="0.3" />
          <circle cx="252" cy="288" r="9" fill="#E4C58B" opacity="0.55" />
          <circle cx="86" cy="150" r="5" fill="#F4F1EA" opacity="0.65" />
          <circle cx="318" cy="238" r="4" fill="#F4F1EA" opacity="0.5" />
          <circle cx="150" cy="96" r="3.5" fill="#E4C58B" opacity="0.7" />

          {/* Khối lõi trung tâm - tiêu điểm chính */}
          <circle cx="196" cy="200" r="64" fill="url(#orbAurum)" />
          <circle cx="196" cy="200" r="64" fill="none" stroke="rgba(244,241,234,0.12)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Điểm sáng nhấp nháy - điểm nhìn trung tâm */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { opacity: 0.9 }
            : { opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }
        }
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[41%] top-[36%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_28px_10px_rgba(244,228,193,0.6)]"
      />
    </div>
  );
}
