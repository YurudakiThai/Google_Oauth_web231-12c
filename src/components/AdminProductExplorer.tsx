"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StoreProduct } from "@/src/lib/product-store";
import ProductThumbnail from "./ProductImages";

export default function AdminProductExplorer({
  products,
}: {
  products: StoreProduct[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((item) =>
      [item.title, item.category, item.description].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    );
  }, [products, query]);

  return (
    <div className="explorer admin">
      <header className="admin-head">
        <div>
          <h1>แผงควบคุมแอดมิน</h1>
          <p>แก้ไข ลบ และเพิ่มสินค้าได้จริง</p>
        </div>
        <Link className="button" href="/products/new">
          + เพิ่มสินค้าใหม่
        </Link>
      </header>

      <div className="admin-stats">
        <span className="stat-chip">สินค้าทั้งหมด {products.length} รายการ</span>
        {query.trim() && (
          <span className="stat-chip">ตรงกับคำค้น {filtered.length} รายการ</span>
        )}
      </div>

      <div className="admin-toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาชื่อ / หมวดหมู่ / รายละเอียด..."
          aria-label="ค้นหาสินค้า"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty">
          {products.length === 0
            ? "ยังไม่มีสินค้า เริ่มต้นด้วยการเพิ่มสินค้าใหม่"
            : "ไม่พบสินค้าที่ตรงกับคำค้น"}
        </p>
      ) : (
        <div className="tableWrap">
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
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.thumbnail ? (
                      <ProductThumbnail
                        src={item.thumbnail}
                        alt={`${item.title}-${item.id}`}
                      />
                    ) : (
                      <span>ไม่มีรูป</span>
                    )}
                  </td>
                  <td>
                    <span className="cell-title">{item.title}</span>
                    <span className="cell-sub">{item.description}</span>
                  </td>
                  <td>฿{item.price.toLocaleString("th-TH")}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  <td className="row-actions">
                    <Link
                      className="button small"
                      href={`/products/${item.id}/edit`}
                    >
                      แก้ไข
                    </Link>
                    <Link
                      className="button small danger"
                      href={`/products/${item.id}/delete`}
                    >
                      ลบ
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
