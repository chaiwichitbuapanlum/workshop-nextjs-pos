import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

/**
 * ขยาย interface JWTPayload เพื่อเพิ่มฟิลด์ id ที่เก็บ user id
 * @interface Payload
 * @extends JWTPayload
 */
interface Payload extends JWTPayload {
  /** รหัสผู้ใช้งานที่เก็บใน JWT token */
  id: string;
}

/**
 * ฟังก์ชันสำหรับถอดรหัส JWT token และตรวจสอบความถูกต้อง
 * @param {string} token - JWT token ที่ต้องการถอดรหัส
 * @returns {Promise<Payload | null>} ข้อมูล payload หากถอดรหัสสำเร็จ หรือ null หากล้มเหลว
 * @description
 * 1. สร้าง secret key จาก environment variable
 * 2. ใช้ jose library ในการ verify และ decode JWT token
 * 3. คืนค่า payload หากสำเร็จ หรือ null หากเกิดข้อผิดพลาด
 */
const decryptJwtToken = async (token: string): Promise<Payload | null> => {
  // แปลง JWT secret key จาก string เป็น Uint8Array สำหรับใช้งานกับ jose
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  try {
    // ตรวจสอบและถอดรหัส JWT token
    const { payload } = await jwtVerify(token, secret);
    return payload as Payload;
  } catch (error) {
    // บันทึกข้อผิดพลาดและคืนค่า null
    console.error("Error decripting jwt token:", error);
    return null;
  }
};

/**
 * Proxy (เดิมคือ middleware) สำหรับการจัดการ authentication และ authorization
 * @param {NextRequest} req - Request object จาก Next.js
 * @returns {Promise<NextResponse>} Response object ที่ผ่านการประมวลผลแล้ว
 * @description
 * กระบวนการทำงานของ proxy:
 * 1. สร้าง response object พื้นฐาน
 * 2. ดึง JWT token จาก cookies
 * 3. หาก token ไม่มี ให้ผ่าน request ต่อไปได้
 * 4. ถอดรหัส JWT token และตรวจสอบความถูกต้อง
 * 5. ตรวจสอบว่า token หมดอายุหรือไม่
 * 6. หาก token ไม่ถูกต้องหรือหมดอายุ ให้ลบ token ออกจาก cookies
 * 7. หาก token ถูกต้อง ให้เพิ่ม user id ลงใน response headers
 */
export const proxy = async (req: NextRequest) => {
  // สร้าง response object พื้นฐานที่จะส่งต่อไปยัง route handler
  const response = NextResponse.next();

  // ดึง JWT token จาก cookies (ชื่อ cookie คือ "token")
  const token = req.cookies.get("token")?.value;

  // หาก token ไม่มี ให้ส่ง response กลับไปโดยไม่มีการประมวลผลเพิ่มเติม
  if (!token) return response;

  // ถอดรหัส JWT token และดึงข้อมูล payload
  const payload = await decryptJwtToken(token);

  // ตรวจสอบว่า token หมดอายุหรือไม่ (เปรียบเทียบกับเวลาปัจจุบัน)
  const isTokenExpired = payload?.exp && payload.exp < Date.now() / 1000;

  // หาก payload เป็น null หรือ token หมดอายุ
  if (!payload || isTokenExpired) {
    // ลบ token ออกจาก cookies เพื่อบังคับให้ user login ใหม่
    response.cookies.delete("token");
    return response;
  }

  // หาก token ถูกต้องและยังไม่หมดอายุ ให้เพิ่ม user id ลงใน response headers
  // เพื่อให้ route handlers สามารถเข้าถึงข้อมูล user ได้
  response.headers.set("x-user-id", payload.id);
  return response;
};

/**
 * การกำหนดค่า config สำหรับ proxy
 * @description
 * กำหนด URL patterns ที่ proxy จะทำงาน:
 * - "/" : หน้าแรก
 * - "/auth/:path*" : เส้นทางเกี่ยวกับการ authentication (เช่น /auth, /auth/signup, /auth/signin)
 * - "/admin/:path*" : เส้นทางสำหรับการจัดการระบบ (admin panel)
 * - "/cart/:path*" : เส้นทางเกี่ยวกับตะกร้าสินค้า
 * - "/checkout/:path*" : เส้นทางสำหรับการชำระเงิน
 * - "/my-orders/:path*" : เส้นทางสำหรับดูประวัติการสั่งซื้อ
 *
 * หมายเหตุ: :path* หมายถึงจับคู่กับ path ย่อยทั้งหมดภายใต้ path หลัก
 */
export const config = {
  matcher: [
    "/",
    "/auth/:path*", // /auth, /auth/signup, /auth/signin
    "/admin/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/my-orders/:path*",
  ],
};
