import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { getProduct } from "@/src/lib/product-store";
import { deleteProductAction } from "@/src/app/actions";
import ProductThumbnail from "@/src/components/ProductImages";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, String(product.id));

  return (
    <main className="editor-page">
      <Link className="back-link" href="/admin">
        ← กลับไปหน้าจัดการ
      </Link>

      <div className="danger-card">
        <span className="danger-icon" aria-hidden>
          🗑️
        </span>
        <h1>ยืนยันการลบสินค้า</h1>
        <p className="danger-note">
          การลบไม่สามารถย้อนกลับได้ โปรดตรวจสอบให้แน่ใจก่อนดำเนินการ
        </p>

        <div className="danger-product">
          {product.thumbnail ? (
            <ProductThumbnail
              src={product.thumbnail}
              alt={product.title}
              size={72}
            />
          ) : (
            <span className="danger-noimg">ไม่มีรูป</span>
          )}
          <div>
            <p className="danger-name">{product.title}</p>
            <p className="danger-meta">
              ฿{product.price.toLocaleString("th-TH")} · เหลือ {product.stock} ชิ้น ·{" "}
              {product.category}
            </p>
          </div>
        </div>

        <div className="editor-actions">
          <form action={deleteAction}>
            <button className="danger" type="submit">
              ยืนยันการลบ
            </button>
          </form>
          <Link className="button secondary" href="/admin">
            ยกเลิก
          </Link>
        </div>
      </div>
    </main>
  );
}
