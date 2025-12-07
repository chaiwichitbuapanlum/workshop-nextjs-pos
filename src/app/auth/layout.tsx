import { authCheck } from "@/features/auths/db/auth-db"
import { redirect } from "next/navigation"
import HeaderCustomer from '@/components/customer-page/headers/header'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {

  const user = await authCheck()

  //ถ้ามี user ให้ไปหน้าแรก ป้องกันไม่ให้เข้าหน้า auth ซ้ำ
  if (user) {
    redirect('/')
  }
  return (
    <div className="flex flex-col justify-center min-h-svh">
      <HeaderCustomer user={null}/>
      <div>
        {children}
      </div>
    </div >
  )
}

export default AuthLayout