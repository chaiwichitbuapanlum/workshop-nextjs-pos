
//server component
import HerderAdmin from '@/components/admin-page/herder/herder'
import SidebarAdmin from '@/components/admin-page/sidebar/sidebar'
import { authCheck } from '@/features/auths/db/auth-db'
import { SidebarProvider } from '@/providers/SidebarProvider'
import { UserType } from '@/types/user-type'
import { redirect } from 'next/navigation'

interface LayoutProps {
    children: React.ReactNode
}


const AdminLayout = async ({ children }: LayoutProps) => {

    const user = await authCheck() as UserType
    if (!user || user.role !== 'Admin') {
        redirect('/')
    }

    return (
        <SidebarProvider>
            <div className="bg-background flex min-h-svh">
                <SidebarAdmin user={user} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <HerderAdmin user={user} />
                    <main className="flex-1 overflow-y-auto md:ml-64 pt-16 p-4 md:px-6 transition-all duration-200">{children}</main>
                </div>

            </div>
        </SidebarProvider>
    )
}

export default AdminLayout