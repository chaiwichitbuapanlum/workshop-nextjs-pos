import { db } from '@/lib/db'
import { cacheLife, cacheTag } from 'next/cache'
import { getUserIdTag } from './cache'
import { UserType } from '@/types/user-type'

/**
 * ดึงข้อมูลผู้ใช้จากฐานข้อมูลตาม ID ที่ระบุ
 * 
 * ฟังก์ชันนี้ใช้ Next.js caching เพื่อเพิ่มประสิทธิภาพในการเรียกข้อมูล
 * และมีการจัดการข้อผิดพลาดที่อาจเกิดขึ้นในระหว่างการเรียกข้อมูล
 * 
 * @param {string} id - รหัสผู้ใช้ (User ID) ที่ต้องการค้นหา
 * @returns {Promise<Object|null>} คืนค่าข้อมูลผู้ใช้ถ้าพบ หรือ null ถ้าไม่พบหรือเกิดข้อผิดพลาด
 * 
 * @example
 * ```typescript
 * const user = await getUserById('user-123');
 * if (user) {
 *   console.log(user.name); // ชื่อผู้ใช้
 *   console.log(user.email); // อีเมลผู้ใช้
 * }
 * ```
 */
export const getUserById = async (id: string): Promise<object | null> => {
    'use cache' // เปิดใช้งาน Next.js caching สำหรับฟังก์ชันนี้
    
    // กำหนดอายุของ cache เป็น 1 ชั่วโมง เพื่อลดการเรียก database ซ้ำๆ
    cacheLife('hours')
    
    // สร้าง cache tag เฉพาะสำหรับ user ID นี้ เพื่อให้สามารถล้าง cache ได้เมื่อข้อมูลเปลี่ยน
    cacheTag(getUserIdTag(id))
    
    try {
        // เรียกข้อมูลผู้ใช้จากฐานข้อมูลด้วย Prisma ORM
        const user = await db.user.findUnique({
            where: { 
                id,               // ค้นหาด้วย user ID
                status: 'Active'  // เฉพาะผู้ใช้ที่มีสถานะ Active เท่านั้น
            },
            select: {
                id: true,       // รหัสผู้ใช้
                name: true,     // ชื่อผู้ใช้
                email: true,    // อีเมลผู้ใช้
                role: true,     // บทบาทของผู้ใช้ (admin, user, etc.)
                status: true,   // สถานะของผู้ใช้
                address: true,  // ที่อยู่ผู้ใช้
                picture: true,  // รูปภาพโปรไฟล์
                tel: true       // เบอร์โทรศัพท์
            }
        })

        return user as UserType
        
    } catch (error) {
        // บันทึก error ลงใน console เพื่อการ debug
        console.error("Error fetching user by ID:", error);
        // คืนค่า null เมื่อเกิดข้อผิดพลาด
        return null;
    }
}