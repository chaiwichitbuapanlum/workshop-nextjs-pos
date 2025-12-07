import { getGlobalTag, getIdTag } from '@/lib/dataCache'
import { revalidateTag } from 'next/cache'

/**
 * สร้าง Cache Tag สำหรับข้อมูล Users ทั้งหมด
 * 
 * @description ใช้สำหรับการ cache ข้อมูล users แบบ global (ทั้งหมด)
 * เมื่อต้องการ invalidate cache ของ users ทุกคนพร้อมกัน
 * 
 * @returns {string} Cache tag ในรูปแบบ "global:users"
 * 
 * @example
 * // ใช้กับ Next.js cache
 * const users = await unstable_cache(
 *   async () => await db.user.findMany(),
 *   [getUserGlobalTag()],
 *   { tags: [getUserGlobalTag()] }
 * )()
 */
export const getUserGlobalTag = () => {
  return getGlobalTag('users')
}

/**
 * สร้าง Cache Tag สำหรับข้อมูล User รายบุคคลตาม ID
 * 
 * @description ใช้สำหรับการ cache ข้อมูล user แต่ละคนแยกกัน
 * ทำให้สามารถ invalidate cache เฉพาะ user ที่ต้องการได้
 * โดยไม่กระทบกับ cache ของ user คนอื่น
 * 
 * @param {string} id - รหัสประจำตัวของ User (UUID หรือ ID อื่นๆ)
 * @returns {string} Cache tag ในรูปแบบ "id:{id}-users"
 * 
 * @example
 * // ใช้กับ Next.js cache สำหรับดึงข้อมูล user คนเดียว
 * const user = await unstable_cache(
 *   async () => await db.user.findUnique({ where: { id } }),
 *   [getUserIdTag(id)],
 *   { tags: [getUserIdTag(id), getUserGlobalTag()] }
 * )()
 */
export const getUserIdTag = (id: string) => {
  return getIdTag('users', id)
}

/**
 * ล้าง Cache ของ User ทั้งแบบ Global และแบบรายบุคคล
 * 
 * @description ฟังก์ชันนี้ใช้สำหรับ invalidate (ล้าง) cache ของ user
 * เมื่อมีการเปลี่ยนแปลงข้อมูล เช่น สร้าง, แก้ไข, หรือลบ user
 * 
 * การทำงาน:
 * 1. revalidateTag(getUserGlobalTag()) - ล้าง cache ของ users ทั้งหมด
 *    เพื่อให้ข้อมูลรายการ users ถูกดึงใหม่
 * 2. revalidateTag(getUserIdTag(id)) - ล้าง cache เฉพาะ user คนนั้น
 *    เพื่อให้ข้อมูลรายละเอียดของ user ถูกดึงใหม่
 * 
 * @param {string} id - รหัสประจำตัวของ User ที่ต้องการล้าง cache
 * @returns {void}
 * 
 * @example
 * // เรียกใช้หลังจากอัพเดทข้อมูล user
 * await db.user.update({ where: { id }, data: { name: 'New Name' } })
 * revalidateUserCache(id) // ล้าง cache เพื่อให้ข้อมูลใหม่แสดงผล
 * 
 * @example
 * // เรียกใช้หลังจากลบ user
 * await db.user.delete({ where: { id } })
 * revalidateUserCache(id) // ล้าง cache ของ user ที่ถูกลบ
 */
export const revalidateUserCache = (id: string) => {
  revalidateTag(getUserGlobalTag(), {})
  revalidateTag(getUserIdTag(id), {})
}