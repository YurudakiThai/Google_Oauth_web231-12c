/*

Auth Route Handler จะทำการ:
1.	รับ authorization code
2.	ใช้ Client ID และ Client Secret แลก token กับ Google
3.	ตรวจสอบตัวตนของผู้ใช้
4.	อ่านข้อมูลพื้นฐาน เช่น ชื่อ อีเมล และรูป
5.	สร้าง session
6.	บันทึก session cookie ลงใน browser
7.	Redirect กลับไปยัง redirectTo
 * */
import { handlers } from "@/src/auth";
export const { GET, POST } = handlers;
