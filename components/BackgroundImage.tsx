import Image from "next/image";

/**
 * BackgroundImage — ảnh nền chủ đề (hố đen) đặt ở lớp thấp nhất của trang,
 * bên dưới starfield và trường hình khối. Độ mờ được hạ xuống 20% để không
 * cạnh tranh với nội dung và các lớp hiệu ứng phía trên.
 */
export default function BackgroundImage() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-20"
    >
      <Image
        src="/bg-blackhole.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
