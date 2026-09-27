"use client";

import { useEffect, useState } from "react";
import {
  type Product,
  type ProductList,
  type SearchQuery,
  defaultQuery,
  fetchProducts,
} from "@/src/lib/products";
import ProductSearchForm from "./ProductSearchForm";

type LoadState = "loading" | "error" | "ready";

// หมายเหตุ: component นี้ไม่มี setProducts จากที่อื่นเลยนอกจาก loadProducts
// จึงไม่มีทางแก้/ลบสินค้าได้จากหน้านี้ (ไม่ใช่ auth จริง แค่ไม่มีโค้ดให้ทำ)
export default function ShopProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  return (
    <div className="explorer">
      <h1>สินค้าทั้งหมด</h1>

      <ProductSearchForm onSearch={loadProducts} />

      {status === "loading" && <p>กำลังโหลด...</p>}
      {status === "error" && <p className="error">{errorMessage}</p>}
      {status === "ready" && products.length === 0 && <p>ไม่พบสินค้า</p>}
      {status === "ready" && products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>คงเหลือ</th>
              <th>หมวดหมู่</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
