'use server'

import { InitialFormState } from "@/types/action-type"
import { signup } from "@/features/auths/db/auth-db"
import { signupSchema, signinSchema } from "@/features/auths/schemas/auth-schema"

export const authAction = async (_prevState: InitialFormState, formData: FormData) => {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    }

    // ตรวจสอบว่าเป็น signup หรือ signin
    const isSignup = !!rawData.confirmPassword
    
    // เลือก schema ที่เหมาะสม
    const schema = isSignup ? signupSchema : signinSchema
    const dataToValidate = isSignup ? rawData : {
        email: rawData.email,
        password: rawData.password
    }

    // Validate ข้อมูล
    const validation = schema.safeParse(dataToValidate)
    
    if (!validation.success) {
        return {
            success: false,
            message: 'กรุณากรอกข้อมูลให้ถูกต้อง',
            errors: validation.error.flatten().fieldErrors
        }
    }

    // เรียก function signup (จะต้องเพิ่ม signin function ภายหลัง)
    const result = await signup(rawData)
    // const result: any = {
    //     success: true,
    //     message: 'ทดสอบสำเร็จ'
    // }

    // ตรวจสอบผลลัพธ์
    if (result && result.errors) {
        return { 
            success: false,
            message: result.message || 'เกิดข้อผิดพลาด',
            errors: result.errors
        }
    }
    
    // ถ้าไม่มี success: true แสดงว่าเกิด error
    if (result && !result.success) {
        return {
            success: false,
            message: result.message || 'เกิดข้อผิดพลาด'
        }
    }

    return {
        success: true,
        message: result.message || (isSignup ? 'สมัครสมาชิกสำเร็จ' : 'เข้าสู่ระบบสำเร็จ')
    }
}