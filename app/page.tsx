"use client";

import Image from "next/image";
import StarField from "@/components/StarField";
import GeometricField from "@/components/GeometricField";
import WaitlistForm from "@/components/WaitlistForm";
import { motion } from "framer-motion";
import { contactInfo, siteConfig } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void">
      <StarField />
      <GeometricField />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 46%, rgba(5,4,8,0.7) 0%, rgba(5,4,8,0.35) 45%, transparent 72%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-10 sm:py-10">
        {/* Header — logo căn giữa trang */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={367}
            height={121}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </motion.header>

        {/* Hero */}
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.span
              variants={itemVariants}
              className="font-mono text-xs uppercase tracking-widest2 text-brand"
            >
              Cảm ơn bạn đã ghé thăm
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="mt-6 max-w-3xl font-display text-4xl italic leading-[1.15] text-stardust sm:text-5xl md:text-6xl"
            >
              ADOM CREATIVE đang thực hiện nâng cấp website
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-balance font-body text-base leading-relaxed text-stardust-dim sm:text-lg"
            >
              Chúng tôi đang dành trọn thời gian này để chuẩn bị cho một website mới —
              <br />
              nơi câu chuyện thương hiệu được kể bằng chiến lược và hình ảnh
              <br />
              một cách chỉn chu nhất. Hẹn gặp lại các bạn!
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 w-full max-w-md">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-stardust-faint">
                Nhận thông báo ngay khi ra mắt
              </p>
              <WaitlistForm />
            </motion.div>
          </motion.div>
        </div>

        {/* Footer / Liên hệ */}
        <motion.footer
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 border-t border-stardust/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-body text-sm text-stardust-dim transition-colors hover:text-brand-bright"
            >
              {contactInfo.email}
            </a>
            <a
              href={`tel:${contactInfo.phone.replace(/\s|\(|\)/g, "")}`}
              className="font-body text-sm text-stardust-dim transition-colors hover:text-brand-bright"
            >
              {contactInfo.phone}
            </a>
            <span className="font-body text-sm text-stardust-faint">
              {contactInfo.address}
            </span>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-widest2 text-stardust-faint">
            Brand Strategy &amp; Design
          </span>
        </motion.footer>

        <p className="mt-4 text-center font-mono text-[10px] tracking-wide text-stardust-faint/70 sm:text-left">
          © {new Date().getFullYear()} {siteConfig.name} — {siteConfig.legalName}. All rights reserved.
        </p>
      </div>
    </main>
  );
}
