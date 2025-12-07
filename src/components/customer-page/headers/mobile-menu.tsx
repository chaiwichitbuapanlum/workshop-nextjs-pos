import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { UserType } from "@/types/user-type"
import { AuthButtons, SignoutButton, UserAvatar } from "./user-comp"



interface MobileMenuProps {
    user: UserType | null
}

const MobileMenu = ({ user }: MobileMenuProps) => {
    return (
        <Sheet>
            <SheetTrigger 
                asChild
                className="md:hidden"
            >
                <Button variant="ghost" size='icon'>
                    <Menu size={20} />
                </Button>

            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-full md:max-sm">
                <SheetHeader>
                    <SheetTitle className="text-primary text-xl">
                        {user ? `โปรไฟล์ของคุณ` : 'ยินดีต้อนรับ'}
                    </SheetTitle>
                </SheetHeader>
                <div>

                    {/* User profile && Auth Buttons */}
                    {user
                    ? <UserAvatar user={user} />
                    : <AuthButtons />
                    }

                    {/* Nav Links */}

                    {/* Go to admin */}

                    {user && user.role === 'Admin' && (
                        <div>
                            ไปที่แผงควบคุมผู้ดูแลระบบ
                        </div>
                    )}

                    {user && (
                        <SheetFooter>
                            <SignoutButton />
                        </SheetFooter>
                    )}

                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu