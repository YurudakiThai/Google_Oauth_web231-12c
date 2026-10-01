import { auth } from "@/src/auth";
import ShopProductExplorer from "@/src/components/ShopProductExplorer";
import AdminProductExplorer from "@/src/components/AdminProductExplorer";
import { getProducts } from "@/src/lib/product-store";
import { AuthButtons } from "./auth-buttons";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <>
      <div className="auth-bar">
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </div>
      {isLoggedIn ? (
        <AdminProductExplorer products={getProducts()} />
      ) : (
        <ShopProductExplorer />
      )}
    </>
  );
}
