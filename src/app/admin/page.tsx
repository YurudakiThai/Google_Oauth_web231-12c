import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import AdminProductExplorer from "@/src/components/AdminProductExplorer";

export default async function AdminPage() {
  const session = await auth();
  // เติม: ฟังก์ชันที่พาผู้ที่ยังไม่ล็อกอินกลับหน้าแรก
  if (!session?.user) {
    redirect("/");
  }

  return <AdminProductExplorer />;
}
