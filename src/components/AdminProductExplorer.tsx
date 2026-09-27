"use client";

import { useEffect, useState } from "react";
import {
  type Product,
  type ProductDraft,
  type ProductList,
  type SearchQuery,
  defaultQuery,
  fetchProducts,
} from "@/src/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import ProductThumbnail from "./ProductImages";

type LoadState = "loading" | "error" | "ready";

export default function AdminProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(err: unknown) {
    setErrorMessage(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      const list = await fetchProducts(query);
      showResult(list);
    } catch (err) {
      showError(err);
    }
  }

  // โหลดครั้งเดียวตอนเปิดหน้า
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  // เพิ่ม/แก้ไข อยู่ใน client state เท่านั้น ไม่มีการเรียก API เขียนจริง
  function saveProduct(draft: ProductDraft) {
    if (editing) {
      setProducts(
        products.map((p) => (p.id === editing.id ? { ...draft, id: p.id } : p))
      );
      setEditing(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  function deleteProduct(id: number) {
    setProducts(products.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null); // ลบตัวที่กำลังแก้ → กลับโหมดเพิ่ม
  }

  return (
    <div className="explorer">
      <h1>แผงควบคุมแอดมิน</h1>
      <p className="hint">
        ข้อมูลที่เพิ่ม/แก้/ลบ อยู่ใน memory ของแท็บนี้เท่านั้น รีเฟรชแล้วหาย
        (ดูหัวข้อ &quot;HTTP 200 ≠ บันทึกจริง&quot;)
      </p>

      <ProductSearchForm onSearch={loadProducts} />

      <ProductForm
        key={editing?.id ?? "new"}
        editing={editing}
        onSave={saveProduct}
        onCancel={() => setEditing(null)}
      />

      {status === "loading" && <p>กำลังโหลด...</p>}
      {status === "error" && <p className="error">{errorMessage}</p>}
      {status === "ready" && products.length === 0 && <p>ไม่พบสินค้า</p>}
      {status === "ready" && products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>รูป</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>คงเหลือ</th>
              <th>หมวดหมู่</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.thumbnail ? (
                    <ProductThumbnail src={item.thumbnail} alt={`${item.title}-${item.id}`} />
                  ) : (
                    <span>ไม่มีรูป</span>
                  )}
                </td>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>{item.category}</td>
                <td className="row-actions">
                  <button onClick={() => setEditing(item)}>แก้ไข</button>
                  <button onClick={() => deleteProduct(item.id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
