import { User } from "@prisma/client";

//Omit  ตัดฟิลด์ที่ไม่ต้องการออกจาก User type
export interface UserType extends Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'pictureId'> {}