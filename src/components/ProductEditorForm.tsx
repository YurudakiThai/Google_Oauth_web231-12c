"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CATEGORIES } from "@/src/lib/categories";
import { initialFormState, type FormState } from "@/src/lib/form-state";
import type { StoreProduct } from "@/src/lib/product-store";
import ProductThumbnail from "./ProductImages";

type ProductEditorFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  product?: StoreProduct;
  submitLabel: string;
  cancelHref?: string;
};

export default function ProductEditorForm({
  action,
  product,
  submitLabel,
  cancelHref = "/admin",
}: ProductEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const [title, setTitle] = useState(product?.title ?? "");
  const [thumbnail, setThumbnail] = useState(product?.thumbnail ?? "");
  const [category, setCategory] = useState(product?.category ?? "");

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form className="editor-form" action={formAction} noValidate>
      <div className="editor-grid">
        <aside className="editor-preview">
          <div className="editor-preview-img">
            {thumbnail ? (
              <ProductThumbnail src={thumbnail} alt={title || "ตัวอย่างสินค้า"} size={200} />
            ) : (
              <span className="editor-preview-empty">ตัวอย่างรูปสินค้า</span>
            )}
          </div>
          <p className="editor-preview-title">{title || "ชื่อสินค้า"}</p>
          <span className="editor-preview-tag">{category || "หมวดหมู่"}</span>
        </aside>

        <div className="editor-fields">
          {state.message && (
            <p className="form-alert" role="alert">
              {state.message}
            </p>
          )}

          <label>
            ชื่อสินค้า
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="เช่น Wireless Mouse"
              required
              aria-invalid={!!fieldError("title")}
            />
            <span className="field-error" role="alert">
              {fieldError("title")}
            </span>
          </label>

          <div className="editor-row">
            <label>
              ราคา (บาท)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price}
                placeholder="0.00"
                required
                aria-invalid={!!fieldError("price")}
              />
              <span className="field-error" role="alert">
                {fieldError("price")}
              </span>
            </label>

            <label>
              จำนวนคงเหลือ
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.stock}
                placeholder="0"
                required
                aria-invalid={!!fieldError("stock")}
              />
              <span className="field-error" role="alert">
                {fieldError("stock")}
              </span>
            </label>
          </div>

          <label>
            หมวดหมู่
            <select
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              aria-invalid={!!fieldError("category")}
            >
              <option value="">กรุณาเลือกหมวดหมู่</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <span className="field-error" role="alert">
              {fieldError("category")}
            </span>
          </label>

          <label>
            URL รูปภาพ
            <input
              name="thumbnail"
              type="url"
              value={thumbnail}
              onChange={(event) => setThumbnail(event.target.value)}
              placeholder="https://example.com/product.png"
              required
              aria-invalid={!!fieldError("thumbnail")}
            />
            <span className="field-error" role="alert">
              {fieldError("thumbnail")}
            </span>
          </label>

          <label>
            รายละเอียด
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={4}
              placeholder="อธิบายจุดเด่นของสินค้า..."
              required
              aria-invalid={!!fieldError("description")}
            />
            <span className="field-error" role="alert">
              {fieldError("description")}
            </span>
          </label>
        </div>
      </div>

      <div className="editor-actions">
        <button type="submit" disabled={pending}>
          {pending ? "กำลังบันทึก..." : submitLabel}
        </button>
        <Link className="button secondary" href={cancelHref}>
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
