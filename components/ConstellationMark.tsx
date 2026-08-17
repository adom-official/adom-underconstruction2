"use client";

import { motion } from "framer-motion";

/**
 * Signature visual của trang: các vòng quỹ đạo (armillary rings) lồng nhau,
 * xoay chậm quanh một điểm sáng trung tâm — ẩn dụ cho vai trò của ADOM:
 * định hướng và dẫn lối cho thương hiệu, giống một ngôi sao dẫn đường.
 * Thuần line-art, tối giản, không cạnh tranh với typography.
 */
export default function ConstellationMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto h-[280px] w-[280px] sm:h-[380px] sm:w-[380px]"
    >
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full animate-spin-slow"
        style={{ animationDirection: "reverse" }}
      >
        <ellipse
          cx="200"
          cy="200"
          rx="170"
          ry="60"
          fill="none"
          stroke="rgba(201,164,103,0.28)"
          strokeWidth="0.75"
          transform="rotate(15 200 200)"
        />
      </motion.svg>

      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow">
        <ellipse
          cx="200"
          cy="200"
          rx="150"
          ry="90"
          fill="none"
          stroke="rgba(138,111,214,0.3)"
          strokeWidth="0.75"
          transform="rotate(-25 200 200)"
        />
      </svg>

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        style={{ animation: "spin-slow 130s linear infinite" }}
      >
        <ellipse
          cx="200"
          cy="200"
          rx="120"
          ry="120"
          fill="none"
          stroke="rgba(244,241,234,0.14)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Điểm sáng trung tâm - ngôi sao dẫn đường */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurum-bright shadow-[0_0_18px_6px_rgba(228,197,139,0.55)]"
      />
    </div>
  );
}
