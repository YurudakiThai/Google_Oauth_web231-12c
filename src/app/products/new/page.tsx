import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { createProductAction } from "@/src/app/actions";
import ProductEditorForm from "@/src/components/ProductEditorForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="editor-page">
      <Link className="back-link" href="/admin">
        ← กลับไปหน้าจัดการ
      </Link>
      <h1>เพิ่มสินค้าใหม่</h1>
      <p className="hint">
        กรอกรายละเอียดสินค้าให้ครบถ้วน เมื่อบันทึกแล้วสินค้าจะปรากฏในหน้าจัดการทันที
      </p>

      <ProductEditorForm action={createProductAction} submitLabel="เพิ่มสินค้า" />
    </main>
  );
}
