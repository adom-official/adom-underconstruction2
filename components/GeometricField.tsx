"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * GeometricField — bố cục thị giác chính của trang.
 *
 * Một trường dày đặc các hình khối cơ bản (tròn / vuông / tam giác), thuần
 * phẳng (2D), phủ kín màn hình. Độ sâu được dựng bằng 4 dải DOF (depth of
 * field) thay vì phối cảnh 3D: xa (rất mờ, rất to, gần như đứng yên) → xa-vừa
 * → gần-vừa → gần (sắc nét tuyệt đối, nhỏ, di chuyển mạnh nhất theo con trỏ) —
 * mô phỏng độ sâu trường ảnh của một ống kính khẩu độ lớn.
 *
 * Ngoài parallax theo con trỏ, một nhóm khối riêng "trôi dạt" tự do trên
 * quỹ đạo lớn (khoảng 30–70% chiều rộng/cao màn hình), độc lập với chuột,
 * như các mảnh vỡ thiên thể trôi chậm trong không gian.
 *
 * Các khối dùng mix-blend-mode "plus-lighter" trên nền đen — nơi hai khối
 * giao nhau, ánh sáng cộng dồn và bừng nhẹ, như các tấm gel ánh sáng chồng
 * lên nhau. Bảng màu: xanh lá thương hiệu #A6CE39 phối cùng các sắc đen/xám.
 */

type Shape = {
  kind: "circle" | "square" | "triangle";
  size: string;
  style: React.CSSProperties;
  gradient: string;
  blur?: number;
  opacity: number;
  rotate?: number;
  floatClass?: string;
};

type DriftShape = {
  kind: "circle" | "square" | "triangle";
  size: string;
  style: React.CSSProperties;
  gradient: string;
  blur?: number;
  opacity: number;
  rotate?: number;
  path: { x: number[]; y: number[]; rotate?: number[] };
  duration: number;
};

// Dải 1 — xa: rất mờ, rất to, gần như đứng yên (DOF sâu nhất)
const farShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(460px, 58vw, 800px)",
    style: { top: "-16%", left: "-14%" },
    gradient: "radial-gradient(circle at 35% 35%, #6E8A26 0%, #1C1C1C 55%, transparent 78%)",
    blur: 110,
    opacity: 0.55,
  },
  {
    kind: "triangle",
    size: "clamp(380px, 46vw, 660px)",
    style: { bottom: "-18%", right: "-12%" },
    gradient: "linear-gradient(140deg, #A6CE39 0%, #465A18 40%, transparent 80%)",
    blur: 100,
    opacity: 0.28,
    rotate: -8,
  },
  {
    kind: "square",
    size: "clamp(260px, 32vw, 420px)",
    style: { bottom: "8%", left: "8%" },
    gradient: "linear-gradient(200deg, #4A4A4A 0%, transparent 75%)",
    blur: 95,
    opacity: 0.3,
    rotate: 12,
  },
  {
    kind: "circle",
    size: "clamp(300px, 34vw, 460px)",
    style: { top: "44%", right: "-10%" },
    gradient: "radial-gradient(circle at 40% 40%, #A6CE39 0%, transparent 70%)",
    blur: 100,
    opacity: 0.22,
  },
  {
    kind: "square",
    size: "clamp(220px, 26vw, 340px)",
    style: { top: "-8%", right: "18%" },
    gradient: "linear-gradient(160deg, #1C1C1C 0%, #4A4A4A 60%, transparent 85%)",
    blur: 90,
    opacity: 0.35,
    rotate: -18,
  },
  {
    kind: "triangle",
    size: "clamp(260px, 30vw, 400px)",
    style: { bottom: "-14%", left: "34%" },
    gradient: "linear-gradient(80deg, #6E8A26 0%, transparent 78%)",
    blur: 95,
    opacity: 0.24,
    rotate: 30,
  },
];

// Dải 2 — xa-vừa: mờ vừa, kích thước trung-lớn
const midFarShapes: Shape[] = [
  {
    kind: "square",
    size: "clamp(150px, 19vw, 260px)",
    style: { top: "10%", right: "8%" },
    gradient: "linear-gradient(135deg, #C7E56F 0%, #4A4A4A 100%)",
    blur: 34,
    opacity: 0.42,
    rotate: -12,
    floatClass: "animate-float-slow",
  },
  {
    kind: "circle",
    size: "clamp(150px, 18vw, 250px)",
    style: { bottom: "16%", left: "5%" },
    gradient: "radial-gradient(circle at 40% 35%, #A6CE39 0%, transparent 72%)",
    blur: 30,
    opacity: 0.46,
    floatClass: "animate-float-slow",
  },
  {
    kind: "triangle",
    size: "clamp(130px, 16vw, 210px)",
    style: { top: "32%", left: "-4%" },
    gradient: "linear-gradient(60deg, #8C8C8C 0%, transparent 78%)",
    blur: 28,
    opacity: 0.34,
    rotate: 24,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(190px, 22vw, 320px)",
    style: { top: "60%", right: "-6%" },
    gradient: "radial-gradient(circle at 40% 40%, #6E8A26 0%, transparent 70%)",
    blur: 38,
    opacity: 0.32,
    floatClass: "animate-float-slow",
  },
  {
    kind: "square",
    size: "clamp(120px, 14vw, 190px)",
    style: { top: "6%", left: "26%" },
    gradient: "linear-gradient(120deg, #1C1C1C 0%, #A6CE39 130%)",
    blur: 26,
    opacity: 0.3,
    rotate: 20,
    floatClass: "animate-float-med",
  },
  {
    kind: "triangle",
    size: "clamp(140px, 17vw, 230px)",
    style: { bottom: "6%", right: "30%" },
    gradient: "linear-gradient(200deg, #C7E56F 0%, transparent 76%)",
    blur: 30,
    opacity: 0.3,
    rotate: -30,
    floatClass: "animate-float-slow",
  },
  {
    kind: "circle",
    size: "clamp(100px, 12vw, 160px)",
    style: { top: "78%", left: "24%" },
    gradient: "radial-gradient(circle at 40% 40%, #8C8C8C 0%, transparent 70%)",
    blur: 22,
    opacity: 0.36,
    floatClass: "animate-float-med",
  },
  {
    kind: "square",
    size: "clamp(90px, 11vw, 150px)",
    style: { bottom: "40%", left: "48%" },
    gradient: "linear-gradient(150deg, #A6CE39 0%, transparent 80%)",
    blur: 20,
    opacity: 0.28,
    rotate: 8,
    floatClass: "animate-float-slow",
  },
];

// Dải 3 — gần-vừa: nét hơn, kích thước nhỏ-vừa
const midNearShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(48px, 5.5vw, 84px)",
    style: { top: "22%", left: "18%" },
    gradient: "radial-gradient(circle at 40% 35%, #C7E56F 0%, transparent 74%)",
    blur: 6,
    opacity: 0.65,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(40px, 4.6vw, 70px)",
    style: { bottom: "26%", right: "16%" },
    gradient: "linear-gradient(135deg, #8C8C8C 0%, #A6CE39 100%)",
    blur: 4,
    opacity: 0.55,
    rotate: 32,
    floatClass: "animate-float-med",
  },
  {
    kind: "triangle",
    size: "clamp(44px, 5vw, 76px)",
    style: { top: "48%", left: "12%" },
    gradient: "linear-gradient(70deg, #A6CE39 0%, transparent 82%)",
    blur: 5,
    opacity: 0.6,
    rotate: -14,
    floatClass: "animate-float-fast",
  },
  {
    kind: "circle",
    size: "clamp(36px, 4vw, 60px)",
    style: { top: "68%", right: "26%" },
    gradient: "radial-gradient(circle at 40% 40%, #4A4A4A 0%, transparent 72%)",
    blur: 3,
    opacity: 0.5,
    floatClass: "animate-float-med",
  },
  {
    kind: "square",
    size: "clamp(30px, 3.4vw, 52px)",
    style: { top: "8%", right: "34%" },
    gradient: "linear-gradient(160deg, #C7E56F 0%, transparent 78%)",
    blur: 2,
    opacity: 0.55,
    rotate: -20,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(34px, 3.8vw, 58px)",
    style: { bottom: "10%", left: "38%" },
    gradient: "linear-gradient(200deg, #8C8C8C 0%, transparent 80%)",
    blur: 3,
    opacity: 0.5,
    rotate: 44,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(26px, 3vw, 44px)",
    style: { top: "38%", right: "8%" },
    gradient: "radial-gradient(circle at 40% 40%, #A6CE39 0%, transparent 72%)",
    blur: 2,
    opacity: 0.6,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(24px, 2.8vw, 40px)",
    style: { bottom: "48%", left: "62%" },
    gradient: "linear-gradient(130deg, #6E8A26 0%, transparent 82%)",
    blur: 2,
    opacity: 0.45,
    rotate: 15,
    floatClass: "animate-float-slow",
  },
];

// Dải 4 — gần: sắc nét tuyệt đối, nhỏ, di chuyển mạnh nhất
const nearShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(16px, 1.9vw, 28px)",
    style: { top: "20%", left: "30%" },
    gradient: "#C7E56F",
    opacity: 0.92,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(14px, 1.7vw, 24px)",
    style: { bottom: "30%", right: "22%" },
    gradient: "#A6CE39",
    opacity: 0.85,
    rotate: 45,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(14px, 1.6vw, 22px)",
    style: { top: "66%", right: "32%" },
    gradient: "#F2F2EF",
    opacity: 0.7,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(9px, 1.1vw, 15px)",
    style: { top: "50%", left: "44%" },
    gradient: "#8C8C8C",
    opacity: 0.75,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(10px, 1.2vw, 17px)",
    style: { top: "14%", right: "44%" },
    gradient: "#A6CE39",
    opacity: 0.8,
    rotate: 20,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(12px, 1.4vw, 19px)",
    style: { bottom: "14%", left: "22%" },
    gradient: "#C7E56F",
    opacity: 0.78,
    rotate: -30,
    floatClass: "animate-float-med",
  },
];

// Object trôi dạt tự do — di chuyển độc lập với con trỏ trên quỹ đạo lớn
const driftShapes: DriftShape[] = [
  {
    kind: "circle",
    size: "clamp(60px, 6.5vw, 96px)",
    style: { top: "16%", left: "10%" },
    gradient: "radial-gradient(circle at 40% 35%, #A6CE39 0%, transparent 74%)",
    blur: 5,
    opacity: 0.5,
    path: { x: [0, 220, 60, 0], y: [0, 90, 200, 0] },
    duration: 42,
  },
  {
    kind: "square",
    size: "clamp(20px, 2.4vw, 34px)",
    style: { top: "62%", left: "16%" },
    gradient: "#C7E56F",
    opacity: 0.75,
    rotate: 20,
    path: { x: [0, -140, 120, 0], y: [0, -160, -60, 0], rotate: [20, 110, 200, 380] },
    duration: 34,
  },
  {
    kind: "triangle",
    size: "clamp(70px, 8vw, 120px)",
    style: { top: "30%", right: "12%" },
    gradient: "linear-gradient(100deg, #8C8C8C 0%, transparent 78%)",
    blur: 6,
    opacity: 0.4,
    path: { x: [0, -180, -40, 0], y: [0, 140, 260, 0] },
    duration: 48,
  },
  {
    kind: "circle",
    size: "clamp(14px, 1.6vw, 22px)",
    style: { bottom: "18%", right: "20%" },
    gradient: "#A6CE39",
    opacity: 0.85,
    path: { x: [0, 160, -80, 0], y: [0, -110, -30, 0] },
    duration: 27,
  },
  {
    kind: "square",
    size: "clamp(90px, 10vw, 150px)",
    style: { bottom: "-6%", left: "44%" },
    gradient: "linear-gradient(150deg, #1C1C1C 0%, #4A4A4A 60%, transparent 85%)",
    blur: 40,
    opacity: 0.3,
    rotate: 10,
    path: { x: [0, 120, -60, 0], y: [0, -80, -180, 0], rotate: [10, 60, -20, 10] },
    duration: 55,
  },
  {
    kind: "circle",
    size: "clamp(8px, 1vw, 13px)",
    style: { top: "44%", left: "70%" },
    gradient: "#F2F2EF",
    opacity: 0.6,
    path: { x: [0, -90, 40, 0], y: [0, 70, 150, 0] },
    duration: 23,
  },
];

function ShapeEl({ shape }: { shape: Shape }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: shape.size,
    height: shape.size,
    background: shape.gradient,
    opacity: shape.opacity,
    filter: shape.blur ? `blur(${shape.blur}px)` : undefined,
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
    filter: shape.blur ? `blur(${shape.blur}px)` : undefined,
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

      {/* Dải sáng quét chéo */}
      {!prefersReducedMotion && (
        <div
          className="animate-sweep absolute left-1/2 top-1/2 h-[140vh] w-[10vw] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(199,229,111,0.18) 45%, rgba(242,242,239,0.22) 50%, rgba(166,206,57,0.18) 55%, transparent 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(6px)",
          }}
        />
      )}

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
