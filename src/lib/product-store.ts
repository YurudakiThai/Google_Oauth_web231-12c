// คลังสินค้าที่แก้ไขได้ (mutable store)
// ใช้ "ข้อมูล" ชุดเดียวกับ dummyjson (snapshot ในเครื่อง) แต่ใช้ "รูปแบบโค้ด"
// แบบ products_2: เก็บในหน่วยความจำของเซิร์ฟเวอร์ + globalThis กัน HMR รีเซ็ต
import { z } from "zod";
import fallbackData from "@/src/data/products-fallback.json";

// 1 สินค้าในคลัง — เก็บทั้งข้อมูลที่ dummyjson มี และฟิลด์ที่หน้าแก้ไขต้องใช้
export const StoreProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().default(""),
  price: z.number(),
  stock: z.number(),
  category: z.string(),
  thumbnail: z.string(),
});

export type StoreProduct = z.infer<typeof StoreProductSchema>;

const SeedSchema = z.object({ products: z.array(StoreProductSchema) });

// seed ครั้งแรกจากข้อมูล dummyjson ที่บันทึกไว้ในเครื่อง
const seed: StoreProduct[] = SeedSchema.parse(fallbackData).products;

declare global {
  var demoProductStore: StoreProduct[] | undefined;
}

const products: StoreProduct[] =
  globalThis.demoProductStore ?? structuredClone(seed);

// ให้ค่าคงอยู่แม้ dev HMR โหลดโมดูลใหม่
globalThis.demoProductStore = products;

export function getProducts(): StoreProduct[] {
  return products;
}

export function getProduct(id: string | number): StoreProduct | undefined {
  const numericId = typeof id === "number" ? id : Number(id);
  if (!Number.isFinite(numericId)) return undefined;
  return products.find((product) => product.id === numericId);
}

export function updateProduct(
  id: string | number,
  values: ProductInput,
): StoreProduct | undefined {
  const product = getProduct(id);
  if (!product) return undefined;
  Object.assign(product, values);
  return product;
}

export function deleteProduct(id: string | number): boolean {
  const numericId = typeof id === "number" ? id : Number(id);
  const index = products.findIndex((product) => product.id === numericId);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

export function createProduct(values: ProductInput): StoreProduct {
  const nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
  const product: StoreProduct = { id: nextId, ...values };
  products.unshift(product);
  return product;
}

// ---- ตรวจสอบข้อมูลจากฟอร์ม ----

function toNumber(value: unknown) {
  if (value === "" || value === null || value === undefined) return undefined;
  return Number(value);
}

export const ProductInputSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  description: z.string().trim().min(1, "กรุณากรอกรายละเอียดสินค้า"),
  price: z.preprocess(
    toNumber,
    z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  ),
  stock: z.preprocess(
    toNumber,
    z
      .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
      .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
      .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  ),
  category: z.string().trim().min(1, "กรุณาเลือกหมวดหมู่"),
  thumbnail: z
    .string()
    .trim()
    .min(1, "กรุณากรอก URL รูปภาพ")
    .url("URL รูปภาพไม่ถูกต้อง"),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;
