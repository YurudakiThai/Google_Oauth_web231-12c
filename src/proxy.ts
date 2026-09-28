//ใช้ป้องกันแทน middelware.ts
export { auth as proxy } from "@/src/auth";

export const config = {
  matcher: ["/products/:id/edit", "/products/:id/delete"],
};
