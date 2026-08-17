"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Vài khối tinh vân mờ, trôi theo chuyển động chuột (desktop) tạo cảm giác
 * chiều sâu vũ trụ. Trên thiết bị cảm ứng, các khối chỉ trôi nhẹ (ambient drift)
 * qua CSS animation thay vì theo dõi con trỏ.
 */
export default function NebulaParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 40, damping: 20, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const layer1X = useTransform(smoothX, [-1, 1], [-30, 30]);
  const layer1Y = useTransform(smoothY, [-1, 1], [-20, 20]);
  const layer2X = useTransform(smoothX, [-1, 1], [24, -24]);
  const layer2Y = useTransform(smoothY, [-1, 1], [16, -16]);
  const layer3X = useTransform(smoothX, [-1, 1], [-14, 14]);
  const layer3Y = useTransform(smoothY, [-1, 1], [10, -10]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="absolute -left-32 -top-24 h-[32rem] w-[32rem] rounded-full bg-nebula-glow/20 blur-[120px]"
      />
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-aurum/10 blur-[130px]"
      />
      <motion.div
        style={{ x: layer3X, y: layer3Y }}
        className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-nebula/25 blur-[110px]"
      />
    </div>
  );
}
