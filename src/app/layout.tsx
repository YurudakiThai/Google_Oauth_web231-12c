import type { Metadata } from "next";
import "@/src/app/globals.css";
export const metadata: Metadata = { title: "รายการสินค้า" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
