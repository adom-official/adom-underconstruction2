"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  parallax: number;
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  life: number;
  maxLife: number;
};

/**
 * StarField vẽ một nền sao tĩnh (lấp lánh nhẹ) trên canvas 2D, cực nhẹ cho hiệu năng,
 * cùng các vệt sao băng xuất hiện ngẫu nhiên. Toàn bộ animation dừng lại nếu người dùng
 * bật "prefers-reduced-motion" hoặc khi tab không hiển thị (tiết kiệm pin/CPU).
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let animationId = 0;
    let lastShootingStarSpawn = 0;
    let visible = true;

    function resize() {
      const canvasEl = canvasRef.current;
      if (!canvasEl || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = width < 640 ? 0.00065 : 0.00011;
      const count = Math.floor(width * height * density) + 60;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + 0.25,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.0015 + 0.0004,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: Math.random() * 0.6 + 0.2,
      }));
    }

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * width * 0.7 + width * 0.15,
        y: Math.random() * height * 0.25,
        length: Math.random() * 140 + 90,
        speed: Math.random() * 9 + 7,
        angle: (Math.PI / 180) * (135 + Math.random() * 15),
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Sao nền, lấp lánh nhẹ
      for (const star of stars) {
        const twinkle = prefersReducedMotion
          ? star.baseAlpha
          : star.baseAlpha *
            (0.65 + 0.35 * Math.sin(time * star.twinkleSpeed + star.twinklePhase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 241, 234, ${twinkle.toFixed(3)})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        // Sao băng
        if (time - lastShootingStarSpawn > 3200 + Math.random() * 2600) {
          if (shootingStars.length < 2) spawnShootingStar();
          lastShootingStarSpawn = time;
        }

        shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
        for (const s of shootingStars) {
          s.life += 1;
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          const fade = 1 - s.life / s.maxLife;
          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          gradient.addColorStop(0, `rgba(199, 229, 111, ${fade})`);
          gradient.addColorStop(1, "rgba(199, 229, 111, 0)");

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }

      if (visible) {
        animationId = requestAnimationFrame(draw);
      }
    }

    function handleVisibility() {
      visible = document.visibilityState === "visible";
      if (visible) {
        animationId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animationId);
      }
    }

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
