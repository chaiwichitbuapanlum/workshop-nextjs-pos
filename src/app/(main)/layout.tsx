import HeaderCustomer from "@/components/customer-page/headers/header"
import { authCheck } from "@/features/auths/db/auth-db"
import { UserType } from "@/types/user-type"

interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout = async ({ children }: MainLayoutProps) => {
    const user = await authCheck() as UserType | null
    // console.log(user)


    return (
        <div className="min-h-svh flex flex-col">
            <HeaderCustomer user={user} />
            <main className="pt-16 max-w-7xl mx-auto px-4 xl:px-0">{children}</main>

        </div>
    )
}

export default MainLayout