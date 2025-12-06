'use server'

import { InitialFormState } from "@/types/action-type"
import { signup } from "@/features/auths/db/auth-db"

export const authAction = async (_prevState: InitialFormState, formData: FormData) => {
    const reaData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    }

    // mock result
    const result = await signup(reaData)

    return result && result.message ? { 
        success: false,
        message: result.message,
        error: result.errors
    } : {
        success: true,
        message: reaData.confirmPassword ? 'สมัครสมาชิกสำเร็จ' : 'เข้าสู่ระบบสำเร็จ'

     }

}