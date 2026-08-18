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

type Shape = {
  kind: "circle" | "square" | "triangle";
  size: string;
  style: React.CSSProperties;
  gradient: string;
  blur: number;
  opacity: number;
  rotate?: number;
  floatClass?: string;
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

// Tiền cảnh — 1-2 khối siêu to đặt ở góc màn hình, blur rất đậm để không che
// nội dung, tương tác mạnh nhất với con trỏ (gần nhất, nên di chuyển nhiều nhất).
const foregroundShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(900px, 92vw, 1500px)",
    style: { top: "-42%", left: "-34%" },
    gradient: "radial-gradient(circle at 38% 38%, #4A4A4A 0%, #1C1C1C 50%, transparent 76%)",
    blur: 190,
    opacity: 0.42,
  },
  {
    kind: "circle",
    size: "clamp(820px, 84vw, 1360px)",
    style: { bottom: "-40%", right: "-32%" },
    gradient:
      "radial-gradient(circle at 35% 35%, #A6CE39 0%, #3A3A3A 26%, #1C1C1C 55%, transparent 78%)",
    blur: 180,
    opacity: 0.36,
  },
];

function ShapeEl({ shape }: { shape: Shape }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: shape.size,
    height: shape.size,
    background: shape.gradient,
    opacity: shape.opacity,
    filter: `blur(${shape.blur}px)`,
    transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
    mixBlendMode: "plus-lighter",
    ...shape.style,
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
  // Tiền cảnh: gần nhất, tương tác mạnh nhất với con trỏ
  const fgX = useTransform(smoothX, [-1, 1], [-150, 150]);
  const fgY = useTransform(smoothY, [-1, 1], [-110, 110]);

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
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <motion.div style={{ x: farX, y: farY }} className="absolute inset-0">
        {farShapes.map((s, i) => (
          <ShapeEl key={`far-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: midFarX, y: midFarY }} className="absolute inset-0">
        {midFarShapes.map((s, i) => (
          <ShapeEl key={`midfar-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: midNearX, y: midNearY }} className="absolute inset-0">
        {midNearShapes.map((s, i) => (
          <ShapeEl key={`midnear-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: nearX, y: nearY }} className="absolute inset-0">
        {nearShapes.map((s, i) => (
          <ShapeEl key={`near-${i}`} shape={s} />
        ))}
      </motion.div>

      {/* Object trôi dạt tự do, độc lập với parallax con trỏ */}
      <div className="absolute inset-0">
        {driftShapes.map((s, i) => (
          <DriftEl key={`drift-${i}`} shape={s} reduced={!!prefersReducedMotion} />
        ))}
      </div>

      {/* Tiền cảnh — khối siêu to ở góc màn hình, blur đậm, tương tác mạnh nhất */}
      <motion.div style={{ x: fgX, y: fgY }} className="absolute inset-0">
        {foregroundShapes.map((s, i) => (
          <ShapeEl key={`fg-${i}`} shape={s} />
        ))}
      </motion.div>

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
