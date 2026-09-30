import type { Metadata } from "next";
import Link from "next/link";
import "@/src/app/globals.css";
export const metadata: Metadata = { title: "รายการสินค้า" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <nav className="site-nav" aria-label="เมนูหลัก">
          <Link href="/">หน้าแรก</Link>
          <Link href="/shop">ร้านค้า</Link>
          <Link href="/admin">แอดมิน</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
