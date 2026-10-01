import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { getProducts } from "@/src/lib/product-store";
import AdminProductExplorer from "@/src/components/AdminProductExplorer";

export default async function AdminPage() {
  const session = await auth();
  // ผู้ที่ยังไม่ล็อกอินให้กลับหน้าแรก
  if (!session?.user) {
    redirect("/");
  }

  return <AdminProductExplorer products={getProducts()} />;
}
