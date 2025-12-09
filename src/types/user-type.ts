import { User } from "@prisma/client";

//Omit password และ field วันที่ที่ไม่ต้องการส่งต่อไปที่ client
export type UserType = Omit<
  User,
  "password" | "createdAt" | "updatedAt" | "pictureId"
>;

