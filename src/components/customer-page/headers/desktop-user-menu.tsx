import { UserType } from "@/types/user-type"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SignoutButton, UserAvatarSmall, UserDropdownAvatar } from "./user-comp"

interface DesktopUserMenuProps {
    user: UserType
}

const DesktopUserMenu = ({ user }: DesktopUserMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full cursor-pointer">
                    <UserAvatarSmall user={user} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4}
                className="w-56"
            >
                <DropdownMenuLabel
                    className="flex flex-col items-center gap-2"
                >
                    <UserDropdownAvatar user={user} />
                    <span>สวัสดี, {user.name || user.email}</span>
                </DropdownMenuLabel>

                <DropdownMenuItem
                    asChild
                    className="cursor-pointer "
                >
                    <Link href="/profile" className="w-full">โปรไฟล์ของฉัน</Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="mt-2 cursor-pointer "
                >
                    <Link href="/cart" className="w-full">
                        ตระกร้าของฉัน <Badge className="ml-auto">20</Badge>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="mt-2 cursor-pointer hover:bg-gray-400"
                >
                    <Link href="/my-orders" className="w-full  hover:bg-gray-400">
                        ประวัติการสั่งซื้อ
                    </Link>
                </DropdownMenuItem>

                {user.role === 'Admin' && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-center font-semibold">
                            สำหรับผู้ดูแลระบบ
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                            asChild
                            className="mt-2 cursor-pointer hover:bg-gray-400"
                        >
                            <Link href="/admin" className="w-full  hover:bg-gray-400">
                                แดชบอร์ดผู้ดูแลระบบ
                            </Link>
                        </DropdownMenuItem>

                    </>
                )}

                <DropdownMenuSeparator />
                <div>
                    <SignoutButton isMobile />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DesktopUserMenu