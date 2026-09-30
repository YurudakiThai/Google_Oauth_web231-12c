//เก็บ Zod Schema ทุกตัว Type ที่สร้างจาก Schema และฟังก์ชันเรียก API ไว้ที่เดียว ทั้งฟอร์มและการรับข้อมูลจาก API อ้างถึงไฟล์นี้
import { z } from "zod";
import fallbackData from "@/src/data/products-fallback.json";
export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
  thumbnail: z.string().url(),
});
export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

//เติม: Method ของ zod ที่สร้าง Schema ใหม่โดยนํา field ที่ระบุออก
export const ProductDraftSchema = ProductSchema.omit({ id: true });
export type ProductDraft = z.infer<typeof ProductDraftSchema>;

const API_BASE = "https://dummyjson.com";
export const SORT_FIELDS = ["title", "price", "stock"] as const;
export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),
  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = { q: "", limit: 10, sortBy: "title" };

export function buildProductUrl(q: SearchQuery) {
  const p = new URLSearchParams();
  p.set("q", q.q);
  p.set("limit", String(q.limit));
  p.set("sortBy", q.sortBy);
  p.set("order", "asc");
  p.set("select", "title,price,stock,category,thumbnail");
  return `${API_BASE}/products/search?${p.toString()}`;
}

// ข้อมูลสำรองไว้ใช้เมื่อเรียก API ไม่สำเร็จ (เช่น ออฟไลน์)
const fallbackResult = ProductListSchema.safeParse(fallbackData);
const fallbackProducts: Product[] = fallbackResult.success
  ? fallbackResult.data.products
  : [];

function queryFallback(q: SearchQuery): ProductList {
  const needle = q.q.trim().toLowerCase();
  const filtered = needle
    ? fallbackProducts.filter((p) => p.title.toLowerCase().includes(needle))
    : fallbackProducts;

  const sorted = [...filtered].sort((a, b) => {
    const av = a[q.sortBy];
    const bv = b[q.sortBy];
    if (typeof av === "string" && typeof bv === "string") {
      return av.localeCompare(bv);
    }
    return Number(av) - Number(bv);
  });

  return {
    products: sorted.slice(0, q.limit),
    total: filtered.length,
    skip: 0,
    limit: q.limit,
  };
}

export async function fetchProducts(q: SearchQuery): Promise<ProductList> {
  try {
    const r = await fetch(buildProductUrl(q));
    if (!r.ok) throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${r.status}`);
    const data: unknown = await r.json();
    const result = ProductListSchema.safeParse(data);
    if (!result.success) throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
    return result.data;
  } catch {
    // API ใช้ไม่ได้ → ใช้ข้อมูลสำรองในเครื่องแทน
    return queryFallback(q);
  }
}
