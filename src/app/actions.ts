"use server";

import { auth } from "@/src/auth";
import {
  ProductInputSchema,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/src/lib/product-store";
import type { FormState } from "@/src/lib/form-state";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

function readInput(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    thumbnail: formData.get("thumbnail"),
  };
}

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function refreshProductPages() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function updateProductAction(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();

  const parsed = ProductInputSchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  const updated = updateProduct(id, parsed.data);
  if (!updated) {
    return { status: "error", message: "ไม่พบสินค้าที่ต้องการแก้ไข" };
  }

  refreshProductPages();
  redirect("/admin");
}

export async function createProductAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();

  const parsed = ProductInputSchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  createProduct(parsed.data);
  refreshProductPages();
  redirect("/admin");
}

export async function deleteProductAction(id: string) {
  await requireUser();
  deleteProduct(id);
  refreshProductPages();
  redirect("/admin");
}
