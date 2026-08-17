"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * GeometricField — bố cục thị giác chính của trang.
 *
 * Ý tưởng: một trường các hình khối cơ bản (tròn / vuông / tam giác) thuần
 * phẳng (2D), phủ kín màn hình, được chia làm 3 lớp độ sâu (xa - giữa - gần).
 * Độ sâu KHÔNG dùng phối cảnh 3D mà dùng 3 tín hiệu thị giác cổ điển của
 * tranh khắc gỗ / thiết kế Bauhaus: kích thước, độ mờ nét (blur), và tốc độ
 * di chuyển khác nhau khi thị sai (parallax) theo con trỏ.
 *
 * Điểm khác lạ: các khối dùng mix-blend-mode "plus-lighter" trên nền tối,
 * nên tại các vùng khối chồng lên nhau, ánh sáng CỘNG DỒN và bừng sáng hơn —
 * như các tấm kính màu hoặc gel ánh sáng sân khấu xếp chồng lên nhau. Một
 * dải sáng chéo quét chậm qua toàn cảnh (giống ánh sáng máy quét) và một lớp
 * hạt nhiễu (grain) mỏng phủ lên trên tạo chất liệu như một tấm poster in.
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

const backShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(420px, 55vw, 760px)",
    style: { top: "-14%", left: "-12%" },
    gradient:
      "radial-gradient(circle at 35% 35%, #8A6FD6 0%, #4B3A86 45%, transparent 75%)",
    blur: 70,
    opacity: 0.55,
  },
  {
    kind: "triangle",
    size: "clamp(360px, 44vw, 620px)",
    style: { bottom: "-16%", right: "-10%" },
    gradient: "linear-gradient(140deg, #C9A467 0%, #8A703F 40%, transparent 80%)",
    blur: 60,
    opacity: 0.32,
    rotate: -8,
  },
  {
    kind: "square",
    size: "clamp(240px, 30vw, 400px)",
    style: { bottom: "6%", left: "10%" },
    gradient: "linear-gradient(200deg, #6B4FA0 0%, transparent 75%)",
    blur: 55,
    opacity: 0.3,
    rotate: 12,
  },
];

const midShapes: Shape[] = [
  {
    kind: "square",
    size: "clamp(150px, 19vw, 260px)",
    style: { top: "14%", right: "10%" },
    gradient: "linear-gradient(135deg, #E4C58B 0%, #6B4FA0 100%)",
    blur: 2,
    opacity: 0.5,
    rotate: -12,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(150px, 18vw, 250px)",
    style: { bottom: "20%", left: "7%" },
    gradient: "radial-gradient(circle at 40% 35%, #E4C58B 0%, transparent 72%)",
    blur: 4,
    opacity: 0.55,
    floatClass: "animate-float-slow",
  },
  {
    kind: "triangle",
    size: "clamp(120px, 15vw, 200px)",
    style: { top: "36%", left: "-3%" },
    gradient: "linear-gradient(60deg, #8A6FD6 0%, transparent 78%)",
    blur: 3,
    opacity: 0.4,
    rotate: 24,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(190px, 22vw, 320px)",
    style: { top: "56%", right: "-6%" },
    gradient: "radial-gradient(circle at 40% 40%, #6B4FA0 0%, transparent 70%)",
    blur: 20,
    opacity: 0.38,
    floatClass: "animate-float-slow",
  },
];

const frontShapes: Shape[] = [
  {
    kind: "circle",
    size: "clamp(22px, 2.6vw, 40px)",
    style: { top: "20%", left: "24%" },
    gradient: "#E4C58B",
    opacity: 0.9,
    floatClass: "animate-float-fast",
  },
  {
    kind: "square",
    size: "clamp(16px, 2vw, 28px)",
    style: { bottom: "28%", right: "22%" },
    gradient: "#8A6FD6",
    opacity: 0.8,
    rotate: 45,
    floatClass: "animate-float-fast",
  },
  {
    kind: "triangle",
    size: "clamp(16px, 1.8vw, 26px)",
    style: { top: "66%", right: "32%" },
    gradient: "#F4F1EA",
    opacity: 0.65,
    floatClass: "animate-float-med",
  },
  {
    kind: "circle",
    size: "clamp(10px, 1.2vw, 16px)",
    style: { top: "48%", left: "42%" },
    gradient: "#C9A467",
    opacity: 0.7,
    floatClass: "animate-float-fast",
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

  if (shape.kind === "circle") {
    base.borderRadius = "9999px";
  }
  if (shape.kind === "triangle") {
    base.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
  }

  return <div className={shape.floatClass} style={base} />;
}

export default function GeometricField() {
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 35, damping: 20, mass: 0.7 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const backX = useTransform(smoothX, [-1, 1], [-16, 16]);
  const backY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const midX = useTransform(smoothX, [-1, 1], [-42, 42]);
  const midY = useTransform(smoothY, [-1, 1], [-30, 30]);
  const frontX = useTransform(smoothX, [-1, 1], [-72, 72]);
  const frontY = useTransform(smoothY, [-1, 1], [-52, 52]);

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
      <motion.div style={{ x: backX, y: backY }} className="absolute inset-0">
        {backShapes.map((s, i) => (
          <ShapeEl key={`back-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: midX, y: midY }} className="absolute inset-0">
        {midShapes.map((s, i) => (
          <ShapeEl key={`mid-${i}`} shape={s} />
        ))}
      </motion.div>

      <motion.div style={{ x: frontX, y: frontY }} className="absolute inset-0">
        {frontShapes.map((s, i) => (
          <ShapeEl key={`front-${i}`} shape={s} />
        ))}
      </motion.div>

      {/* Dải sáng quét chéo — hiệu ứng chuyển động độc đáo, chậm và bất ngờ */}
      {!prefersReducedMotion && (
        <div
          className="animate-sweep absolute left-1/2 top-1/2 h-[140vh] w-[10vw] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(228,197,139,0.16) 45%, rgba(244,241,234,0.22) 50%, rgba(138,111,214,0.16) 55%, transparent 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(6px)",
          }}
        />
      )}

      {/* Grain — tạo chất liệu poster in, phủ rất nhẹ */}
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
