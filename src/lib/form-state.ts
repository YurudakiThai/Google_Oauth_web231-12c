// สถานะผลลัพธ์ของ server action ที่ฟอร์มใช้ร่วมกับ useActionState
export type FormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };
