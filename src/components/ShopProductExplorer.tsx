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
import ProductThumbnail from "./ProductImages";

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
    <div className="explorer shop">
      <h1>สินค้าทั้งหมด</h1>

      <ProductSearchForm onSearch={loadProducts} />

      {status === "loading" && <p>กำลังโหลด...</p>}
      {status === "error" && <p className="error">{errorMessage}</p>}
      {status === "ready" && products.length === 0 && <p>ไม่พบสินค้า</p>}
      {status === "ready" && products.length > 0 && (
        <div className="shop-grid">
          {products.map((item) => (
            <article className="shop-card" key={item.id}>
              <div className="shop-card-img">
                {item.thumbnail ? (
                  <ProductThumbnail src={item.thumbnail} alt={`${item.title}-${item.id}`} size={220} />
                ) : (
                  <span>ไม่มีรูป</span>
                )}
                {item.stock <= 0 && <span className="shop-badge shop-badge--out">สินค้าหมด</span>}
              </div>
              <div className="shop-card-body">
                <p className="shop-title" title={item.title}>{item.title}</p>
                <p className="shop-price">฿{item.price.toLocaleString("th-TH")}</p>
                <div className="shop-meta">
                  <span className="shop-tag">{item.category}</span>
                  <span className="shop-stock">เหลือ {item.stock} ชิ้น</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
