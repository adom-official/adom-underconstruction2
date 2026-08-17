"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setStatus("error");
      setMessage("Vui lòng nhập một địa chỉ email hợp lệ.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("request_failed");

      setStatus("success");
      setMessage("Cảm ơn bạn! Chúng tôi sẽ báo ngay khi ADOM chính thức ra mắt.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Có lỗi xảy ra, vui lòng thử lại sau ít phút.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          Địa chỉ email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="email-cua-ban@congty.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full flex-1 rounded-full border border-stardust/15 bg-void-raised/60 px-5 py-3 text-sm text-stardust placeholder:text-stardust-faint focus:border-aurum/50 focus:outline-none focus:ring-1 focus:ring-aurum/40 disabled:opacity-60"
          aria-invalid={status === "error"}
          aria-describedby="waitlist-message"
        />
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="shrink-0 rounded-full bg-aurum px-6 py-3 text-sm font-medium tracking-wide text-void transition-colors hover:bg-aurum-bright disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading"
            ? "Đang gửi..."
            : status === "success"
              ? "Đã đăng ký"
              : "Nhận thông báo"}
        </motion.button>
      </form>

      <p
        id="waitlist-message"
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-[1.25rem] text-sm ${
          status === "error" ? "text-red-300" : "text-aurum-bright/90"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
