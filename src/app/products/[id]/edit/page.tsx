import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { getProduct } from "@/src/lib/product-store";
import { updateProductAction } from "@/src/app/actions";
import ProductEditorForm from "@/src/components/ProductEditorForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  // Next 16: params เป็น Promise จึงต้อง await
  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, String(product.id));

  return (
    <main className="editor-page">
      <Link className="back-link" href="/admin">
        ← กลับไปหน้าจัดการ
      </Link>
      <h1>แก้ไขสินค้า</h1>
      <p className="hint">
        ปรับรายละเอียดของ “{product.title}” แล้วกดบันทึก การเปลี่ยนแปลงจะแสดงในหน้าจัดการทันที
      </p>

      <ProductEditorForm
        action={updateAction}
        product={product}
        submitLabel="บันทึกการแก้ไข"
      />
    </main>
  );
}
