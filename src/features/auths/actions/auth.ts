'use server'
import { InitialFormState } from "@/types/action-type";
import { signin, signup } from "../db/auth-db";


export const authAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = rawData.confirmPassword
    ? await signup(rawData)
    : await signin(rawData);

  // ถ้ามี errors หรือ success: false ให้ return error
  if (result && (result.errors || result.success === false)) {
    return {
      success: false,
      message: result.message || 'เกิดข้อผิดพลาด',
      errors: result.errors,
    };
  }

  // ถ้าสำเร็จ
  return {
    success: true,
    message: result?.message || (rawData.confirmPassword
      ? "สมัครสมาชิกสำเร็จ"
      : "เข้าสู่ระบบสำเร็จ"),
  };
};
