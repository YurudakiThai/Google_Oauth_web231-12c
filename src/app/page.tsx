import { auth } from "@/src/auth";
import ShopProductExplorer from "@/src/components/ShopProductExplorer";
import AdminProductExplorer from "@/src/components/AdminProductExplorer";
import { AuthButtons } from "./auth-buttons";

export default async function HomePage() {
  const session = await auth();
  // เติม: ฟังก์ชันที่แปลงค่าเป็น true หรือ false
  const isLoggedIn = Boolean(session?.user);

  return (
    <>
      <div className="auth-bar">
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </div>
      {isLoggedIn ? <AdminProductExplorer /> : <ShopProductExplorer />}
    </>
  );
}
