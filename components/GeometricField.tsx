"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * GeometricField — bố cục thị giác chính của trang.
 *
 * Một trường dày đặc các hình khối cơ bản (tròn / vuông / tam giác), thuần
 * phẳng (2D), phủ kín màn hình. Độ sâu được dựng bằng 4 dải DOF (depth of
 * field): xa (rất mờ, rất to, gần như đứng yên) → xa-vừa → gần-vừa → gần
 * (mờ nhẹ, nhỏ nhất, di chuyển mạnh nhất theo con trỏ). Không có khối nào
 * hoàn toàn sắc nét 0 blur — mọi khối đều có một chút mờ để giữ chất liệu
 * đồng nhất, mềm mại.
 *
 * Một nhóm khối riêng "trôi dạt" tự do trên quỹ đạo lớn, độc lập với chuột,
 * như các mảnh vỡ thiên thể trôi chậm trong không gian.
 *
 * Bảng màu chủ đạo là đen/xám (graphite); xanh lá thương hiệu #A6CE39 chỉ
 * xuất hiện như điểm nhấn ở một số khối chọn lọc. Các khối dùng
 * mix-blend-mode "plus-lighter" trên nền đen — nơi hai khối giao nhau, ánh
 * sáng cộng dồn và bừng nhẹ.
 */

type ShapeKind = "circle" | "square" | "triangle" | "glyph" | "wave" | "ring";

type Shape = {
  kind: ShapeKind;
  size: string;
  style: React.CSSProperties;
  gradient: string; // với "glyph"/"wave"/"ring": dùng làm màu solid (stroke/text color)
  blur: number;
  opacity: number;
  rotate?: number;
  floatClass?: string;
  glyphChar?: "+" | "-" | "×" | "\\"; // chỉ dùng khi kind === "glyph"
  strokeWidth?: number; // dùng cho "wave" và "ring"
};

type DriftShape = {
  kind: "circle" | "square" | "triangle";
  size: string;
  style: React.CSSProperties;
  gradient: string;
  blur: number;
  opacity: number;
  rotate?: number;
  path: { x: number[]; y: number[]; rotate?: number[] };
  duration: number;
};

// Dải 1 — xa: rất mờ, rất to (x1.5), gần như đứng yên. Tông đen/xám thuần.
const farShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(690px, 87vw, 1200px)",
    style: { top: "-16%", left: "-14%" },
    gradient: "radial-gradient(circle at 35% 35%, #4A4A4A 0%, #1C1C1C 55%, transparent 78%)",
    blur: 140,
    opacity: 0.55,
  },
  {
    kind: "triangle",
    size: "clamp(570px, 69vw, 990px)",
    style: { bottom: "-18%", right: "-12%" },
    gradient: "linear-gradient(140deg, #4A4A4A 0%, #1C1C1C 45%, transparent 80%)",
    blur: 130,
    opacity: 0.3,
    rotate: -8,
  },
  {
    kind: "square",
    size: "clamp(390px, 48vw, 630px)",
    style: { bottom: "8%", left: "8%" },
    gradient: "linear-gradient(200deg, #4A4A4A 0%, transparent 75%)",
    blur: 120,
    opacity: 0.32,
    rotate: 12,
  },
  {
    kind: "circle",
    size: "clamp(450px, 51vw, 690px)",
    style: { top: "44%", right: "-10%" },
    gradient: "radial-gradient(circle at 40% 40%, #4A4A4A 0%, transparent 72%)",
    blur: 130,
    opacity: 0.24,
  },
  {
    kind: "square",
    size: "clamp(330px, 39vw, 510px)",
    style: { top: "-8%", right: "18%" },
    gradient: "linear-gradient(160deg, #1C1C1C 0%, #4A4A4A 60%, transparent 85%)",
    blur: 115,
    opacity: 0.36,
    rotate: -18,
  },
  {
    kind: "triangle",
    size: "clamp(390px, 45vw, 600px)",
    style: { bottom: "-14%", left: "34%" },
    gradient: "linear-gradient(80deg, #4A4A4A 0%, transparent 78%)",
    blur: 120,
    opacity: 0.26,
    rotate: 30,
  },
];

// Dải 2 — xa-vừa (x1.5). Chủ yếu xám, 2 khối có ánh xanh làm điểm nhấn.
const midFarShapes: Shape[] = [
  {
    kind: "square",
    size: "clamp(225px, 28.5vw, 390px)",
    style: { top: "10%", right: "8%" },
    gradient: "linear-gradient(135deg, #8C8C8C 0%, #4A4A4A 100%)",
    blur: 44,
    opacity: 0.4,
    rotate: -12,
    floatClass: "animate-float-slow",
  },
  {
    kind: "circle",
    size: "clamp(225px, 27vw, 375px)",
    style: { bottom: "16%", left: "5%" },
    gradient: "radial-gradient(circle at 40% 35%, #8C8C8C 0%, transparent 72%)",
    blur: 39,
    opacity: 0.42,
    floatClass: "animate-float-slow",
  },
  {
    kind: "triangle",
    size: "clamp(195px, 24vw, 315px)",
    style: { top: "32%", left: "-4%" },
    gradient: "linear-gradient(60deg, #8C8C8C 0%, transparent 78%)",
    blur: 36,
    opacity: 0.32,
    rotate: 24,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(285px, 33vw, 480px)",
    style: { top: "60%", right: "-6%" },
    gradient: "radial-gradient(circle at 40% 40%, #4A4A4A 0%, transparent 70%)",
    blur: 49,
    opacity: 0.3,
    floatClass: "animate-float-slow",
  },
  {
    kind: "square",
    size: "clamp(180px, 21vw, 285px)",
    style: { top: "6%", left: "26%" },
    gradient: "linear-gradient(120deg, #1C1C1C 0%, #A6CE39 130%)",
    blur: 34,
    opacity: 0.24,
    rotate: 20,
    floatClass: "animate-float-med",
  },
  {
    kind: "triangle",
    size: "clamp(210px, 25.5vw, 345px)",
    style: { bottom: "6%", right: "30%" },
    gradient: "linear-gradient(200deg, #A6CE39 0%, transparent 76%)",
    blur: 39,
    opacity: 0.22,
    rotate: -30,
    floatClass: "animate-float-slow",
  },
  {
    kind: "circle",
    size: "clamp(150px, 18vw, 240px)",
    style: { top: "78%", left: "24%" },
    gradient: "radial-gradient(circle at 40% 40%, #8C8C8C 0%, transparent 70%)",
    blur: 29,
    opacity: 0.34,
    floatClass: "animate-float-med",
  },
  {
    kind: "square",
    size: "clamp(135px, 16.5vw, 225px)",
    style: { bottom: "40%", left: "48%" },
    gradient: "linear-gradient(150deg, #4A4A4A 0%, transparent 80%)",
    blur: 26,
    opacity: 0.26,
    rotate: 8,
    floatClass: "animate-float-slow",
  },
];

// Dải 3 — gần-vừa (x2, "object nhỏ"). Chủ yếu xám, 2 khối điểm nhấn xanh.
const midNearShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(96px, 11vw, 168px)",
    style: { top: "22%", left: "18%" },
    gradient: "radial-gradient(circle at 40% 35%, #A6CE39 0%, transparent 74%)",
    blur: 10,
    opacity: 0.4,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(80px, 9.2vw, 140px)",
    style: { bottom: "26%", right: "16%" },
    gradient: "linear-gradient(135deg, #8C8C8C 0%, #4A4A4A 100%)",
    blur: 7,
    opacity: 0.5,
    rotate: 32,
    floatClass: "animate-float-med",
  },
  {
    kind: "triangle",
    size: "clamp(88px, 10vw, 152px)",
    style: { top: "48%", left: "12%" },
    gradient: "linear-gradient(70deg, #8C8C8C 0%, transparent 82%)",
    blur: 8,
    opacity: 0.46,
    rotate: -14,
    floatClass: "animate-float-fast",
  },
  {
    kind: "circle",
    size: "clamp(72px, 8vw, 120px)",
    style: { top: "68%", right: "26%" },
    gradient: "radial-gradient(circle at 40% 40%, #4A4A4A 0%, transparent 72%)",
    blur: 5,
    opacity: 0.48,
    floatClass: "animate-float-med",
  },
  {
    kind: "square",
    size: "clamp(60px, 6.8vw, 104px)",
    style: { top: "8%", right: "34%" },
    gradient: "linear-gradient(160deg, #8C8C8C 0%, transparent 78%)",
    blur: 4,
    opacity: 0.46,
    rotate: -20,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(68px, 7.6vw, 116px)",
    style: { bottom: "10%", left: "38%" },
    gradient: "linear-gradient(200deg, #8C8C8C 0%, transparent 80%)",
    blur: 5,
    opacity: 0.42,
    rotate: 44,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(52px, 6vw, 88px)",
    style: { top: "38%", right: "8%" },
    gradient: "radial-gradient(circle at 40% 40%, #A6CE39 0%, transparent 72%)",
    blur: 4,
    opacity: 0.4,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(48px, 5.6vw, 80px)",
    style: { bottom: "48%", left: "62%" },
    gradient: "linear-gradient(130deg, #4A4A4A 0%, transparent 82%)",
    blur: 4,
    opacity: 0.36,
    rotate: 15,
    floatClass: "animate-float-slow",
  },
];

// Dải 4 — gần (x2, "object nhỏ"). Mờ nhẹ (không còn 0 blur), điểm nhấn xanh duy nhất.
const nearShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(32px, 3.8vw, 56px)",
    style: { top: "20%", left: "30%" },
    gradient: "#8C8C8C",
    blur: 3,
    opacity: 0.7,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(28px, 3.4vw, 48px)",
    style: { bottom: "30%", right: "22%" },
    gradient: "#4A4A4A",
    blur: 2.5,
    opacity: 0.65,
    rotate: 45,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(28px, 3.2vw, 44px)",
    style: { top: "66%", right: "32%" },
    gradient: "#F2F2EF",
    blur: 3,
    opacity: 0.55,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(18px, 2.2vw, 30px)",
    style: { top: "50%", left: "44%" },
    gradient: "#8C8C8C",
    blur: 2,
    opacity: 0.6,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(20px, 2.4vw, 34px)",
    style: { top: "14%", right: "44%" },
    gradient: "#A6CE39",
    blur: 2,
    opacity: 0.75,
    rotate: 20,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(24px, 2.8vw, 38px)",
    style: { bottom: "14%", left: "22%" },
    gradient: "#F2F2EF",
    blur: 3,
    opacity: 0.6,
    rotate: -30,
    floatClass: "animate-float-med",
  },
];

// Object trôi dạt tự do — độc lập với con trỏ, chủ yếu xám, 2 điểm nhấn xanh.
const driftShapes: DriftShape[] = [
  {
    kind: "circle",
    size: "clamp(120px, 13vw, 192px)",
    style: { top: "16%", left: "10%" },
    gradient: "radial-gradient(circle at 40% 35%, #A6CE39 0%, transparent 74%)",
    blur: 8,
    opacity: 0.32,
    path: { x: [0, 220, 60, 0], y: [0, 90, 200, 0] },
    duration: 42,
  },
  {
    kind: "square",
    size: "clamp(40px, 4.8vw, 68px)",
    style: { top: "62%", left: "16%" },
    gradient: "#8C8C8C",
    blur: 3,
    opacity: 0.6,
    rotate: 20,
    path: { x: [0, -140, 120, 0], y: [0, -160, -60, 0], rotate: [20, 110, 200, 380] },
    duration: 34,
  },
  {
    kind: "triangle",
    size: "clamp(105px, 12vw, 180px)",
    style: { top: "30%", right: "12%" },
    gradient: "linear-gradient(100deg, #8C8C8C 0%, transparent 78%)",
    blur: 9,
    opacity: 0.36,
    path: { x: [0, -180, -40, 0], y: [0, 140, 260, 0] },
    duration: 48,
  },
  {
    kind: "circle",
    size: "clamp(28px, 3.2vw, 44px)",
    style: { bottom: "18%", right: "20%" },
    gradient: "#A6CE39",
    blur: 2,
    opacity: 0.7,
    path: { x: [0, 160, -80, 0], y: [0, -110, -30, 0] },
    duration: 27,
  },
  {
    kind: "square",
    size: "clamp(135px, 15vw, 225px)",
    style: { bottom: "-6%", left: "44%" },
    gradient: "linear-gradient(150deg, #1C1C1C 0%, #4A4A4A 60%, transparent 85%)",
    blur: 46,
    opacity: 0.28,
    rotate: 10,
    path: { x: [0, 120, -60, 0], y: [0, -80, -180, 0], rotate: [10, 60, -20, 10] },
    duration: 55,
  },
  {
    kind: "circle",
    size: "clamp(16px, 2vw, 26px)",
    style: { top: "44%", left: "70%" },
    gradient: "#F2F2EF",
    blur: 2,
    opacity: 0.55,
    path: { x: [0, -90, 40, 0], y: [0, 70, 150, 0] },
    duration: 23,
  },
];

// --- Bộ sinh số ngẫu nhiên có seed cố định --------------------------------
// Dùng seed cố định để kết quả giống hệt nhau giữa server và client (tránh
// lỗi hydration mismatch của Next.js nếu dùng Math.random() trực tiếp).
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1337);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function between(min: number, max: number) {
  return min + rand() * (max - min);
}

const grayGreenPalette = [
  "#8C8C8C",
  "#4A4A4A",
  "#6C6C69",
  "#F2F2EF",
  "#8C8C8C",
  "#4A4A4A",
  "#A6CE39", // ~1/6 xác suất rơi vào xanh — giữ đúng vai trò "điểm nhấn"
];

// Dải DOF theo từng tầng (size / blur / floatClass tương ứng độ sâu)
const dofTiers = [
  { size: [46, 90], blur: [45, 85], floatClass: "animate-float-slow" }, // xa
  { size: [30, 54], blur: [16, 34], floatClass: "animate-float-slow" }, // xa-vừa
  { size: [18, 32], blur: [3, 9], floatClass: "animate-float-med" }, // gần-vừa
  { size: [10, 20], blur: [1, 4], floatClass: "animate-float-fast" }, // gần
];

function randomPositionStyle(): React.CSSProperties {
  const useTop = rand() > 0.5;
  const useLeft = rand() > 0.5;
  const vertical = between(4, 90);
  const horizontal = between(2, 92);
  return {
    [useTop ? "top" : "bottom"]: `${vertical.toFixed(1)}%`,
    [useLeft ? "left" : "right"]: `${horizontal.toFixed(1)}%`,
  } as React.CSSProperties;
}

// 20 object dấu +, -, ×, \ — kích thước/độ mờ/tầng DOF ngẫu nhiên (seed cố định)
const glyphChars: Array<"+" | "-" | "×" | "\\"> = ["+", "-", "×", "\\"];
const glyphShapes: Shape[] = Array.from({ length: 20 }, () => {
  const tier = pick(dofTiers);
  return {
    kind: "glyph",
    size: `${between(tier.size[0], tier.size[1]).toFixed(0)}px`,
    style: randomPositionStyle(),
    gradient: pick(grayGreenPalette),
    blur: Number(between(tier.blur[0], tier.blur[1]).toFixed(1)),
    opacity: Number(between(0.35, 0.8).toFixed(2)),
    rotate: Number(between(-30, 30).toFixed(0)),
    floatClass: tier.floatClass,
    glyphChar: pick(glyphChars),
  };
});

// 6 object hình lượn sóng ngắn — tầng DOF ngẫu nhiên
const waveShapes: Shape[] = Array.from({ length: 6 }, () => {
  const tier = pick(dofTiers);
  const size = between(tier.size[0] * 1.6, tier.size[1] * 1.6);
  return {
    kind: "wave",
    size: `${size.toFixed(0)}px`,
    style: randomPositionStyle(),
    gradient: pick(grayGreenPalette),
    blur: Number(between(tier.blur[0] * 0.5, tier.blur[1] * 0.5).toFixed(1)),
    opacity: Number(between(0.4, 0.75).toFixed(2)),
    rotate: Number(between(-20, 20).toFixed(0)),
    floatClass: tier.floatClass,
    strokeWidth: Number(between(1.5, 3).toFixed(1)),
  };
});

// 6 object hình tròn rỗng, chỉ có viền (stroke) — tầng DOF ngẫu nhiên
const ringShapes: Shape[] = Array.from({ length: 6 }, () => {
  const tier = pick(dofTiers);
  return {
    kind: "ring",
    size: `${between(tier.size[0] * 1.3, tier.size[1] * 1.3).toFixed(0)}px`,
    style: randomPositionStyle(),
    gradient: pick(grayGreenPalette),
    blur: Number(between(tier.blur[0] * 0.4, tier.blur[1] * 0.4).toFixed(1)),
    opacity: Number(between(0.35, 0.7).toFixed(2)),
    floatClass: tier.floatClass,
    strokeWidth: Number(between(1.5, 2.5).toFixed(1)),
  };
});

// Gộp toàn bộ object mới, chia đều ngẫu nhiên vào 4 layer DOF hiện có
const extraShapes = [...glyphShapes, ...waveShapes, ...ringShapes];
const extraFar: Shape[] = [];
const extraMidFar: Shape[] = [];
const extraMidNear: Shape[] = [];
const extraNear: Shape[] = [];
extraShapes.forEach((s, i) => {
  const bucket = i % 4;
  if (bucket === 0) extraFar.push(s);
  else if (bucket === 1) extraMidFar.push(s);
  else if (bucket === 2) extraMidNear.push(s);
  else extraNear.push(s);
});

function ShapeEl({ shape }: { shape: Shape }) {
  const commonPosition: React.CSSProperties = { position: "absolute", ...shape.style };

  if (shape.kind === "glyph") {
    return (
      <div
        className={shape.floatClass}
        style={{
          ...commonPosition,
          fontSize: shape.size,
          lineHeight: 1,
          fontWeight: 600,
          color: shape.gradient,
          opacity: shape.opacity,
          filter: `blur(${shape.blur}px)`,
          transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
          mixBlendMode: "plus-lighter",
          fontFamily: "var(--font-mono)",
          userSelect: "none",
        }}
      >
        {shape.glyphChar}
      </div>
    );
  }

  if (shape.kind === "wave") {
    return (
      <svg
        className={shape.floatClass}
        style={{
          ...commonPosition,
          width: shape.size,
          height: shape.size,
          opacity: shape.opacity,
          filter: `blur(${shape.blur}px)`,
          transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
          mixBlendMode: "plus-lighter",
          overflow: "visible",
        }}
        viewBox="0 0 60 20"
      >
        <path
          d="M0,10 C6,0 14,0 20,10 C26,20 34,20 40,10 C46,0 54,0 60,10"
          fill="none"
          stroke={shape.gradient}
          strokeWidth={shape.strokeWidth ?? 2.5}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (shape.kind === "ring") {
    return (
      <div
        className={shape.floatClass}
        style={{
          ...commonPosition,
          width: shape.size,
          height: shape.size,
          borderRadius: "9999px",
          border: `${shape.strokeWidth ?? 2}px solid ${shape.gradient}`,
          opacity: shape.opacity,
          filter: `blur(${shape.blur}px)`,
          mixBlendMode: "plus-lighter",
        }}
      />
    );
  }

  const base: React.CSSProperties = {
    ...commonPosition,
    width: shape.size,
    height: shape.size,
    background: shape.gradient,
    opacity: shape.opacity,
    filter: `blur(${shape.blur}px)`,
    transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
    mixBlendMode: "plus-lighter",
  };

  if (shape.kind === "circle") base.borderRadius = "9999px";
  if (shape.kind === "triangle") base.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";

  return <div className={shape.floatClass} style={base} />;
}

function DriftEl({ shape, reduced }: { shape: DriftShape; reduced: boolean }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: shape.size,
    height: shape.size,
    background: shape.gradient,
    opacity: shape.opacity,
    filter: `blur(${shape.blur}px)`,
    mixBlendMode: "plus-lighter",
    ...shape.style,
  };
  if (shape.kind === "circle") base.borderRadius = "9999px";
  if (shape.kind === "triangle") base.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";

  if (reduced) {
    return <div style={{ ...base, transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined }} />;
  }

  return (
    <motion.div
      style={base}
      animate={{ x: shape.path.x, y: shape.path.y, rotate: shape.path.rotate ?? shape.rotate }}
      transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function GeometricField() {
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 32, damping: 20, mass: 0.7 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 4 dải DOF: biên độ parallax tăng dần từ xa -> gần, khớp với độ mờ giảm dần
  const farX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const farY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const midFarX = useTransform(smoothX, [-1, 1], [-26, 26]);
  const midFarY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const midNearX = useTransform(smoothX, [-1, 1], [-50, 50]);
  const midNearY = useTransform(smoothY, [-1, 1], [-36, 36]);
  const nearX = useTransform(smoothX, [-1, 1], [-84, 84]);
  const nearY = useTransform(smoothY, [-1, 1], [-60, 60]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    function handlePointerMove(e: PointerEvent) {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const grainUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <motion.div style={{ x: farX, y: farY }} className="absolute inset-0">
        {farShapes.map((s, i) => (
          <ShapeEl key={`far-${i}`} shape={s} />
        ))}
        {extraFar.map((s, i) => (
          <ShapeEl key={`extra-far-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: midFarX, y: midFarY }} className="absolute inset-0">
        {midFarShapes.map((s, i) => (
          <ShapeEl key={`midfar-${i}`} shape={s} />
        ))}
        {extraMidFar.map((s, i) => (
          <ShapeEl key={`extra-midfar-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: midNearX, y: midNearY }} className="absolute inset-0">
        {midNearShapes.map((s, i) => (
          <ShapeEl key={`midnear-${i}`} shape={s} />
        ))}
        {extraMidNear.map((s, i) => (
          <ShapeEl key={`extra-midnear-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: nearX, y: nearY }} className="absolute inset-0">
        {nearShapes.map((s, i) => (
          <ShapeEl key={`near-${i}`} shape={s} />
        ))}
        {extraNear.map((s, i) => (
          <ShapeEl key={`extra-near-${i}`} shape={s} />
        ))}
      </motion.div>

      {/* Object trôi dạt tự do, độc lập với parallax con trỏ */}
      <div className="absolute inset-0">
        {driftShapes.map((s, i) => (
          <DriftEl key={`drift-${i}`} shape={s} reduced={!!prefersReducedMotion} />
        ))}
      </div>

      {/* Grain — chất liệu poster in, phủ rất nhẹ */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("${grainUrl}")`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
