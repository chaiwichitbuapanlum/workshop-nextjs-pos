"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SheetClose } from "@/components/ui/sheet"
import { useSignout } from '@/hooks/use-sign-out'
import { Loader2 } from "lucide-react"
import { UserType } from "@/types/user-type"
import {
    Card,
    CardContent
} from '@/components/ui/card'
import Image from "next/image"

interface UserCompProps {
    user: UserType
}


export const AuthButtons = () => (
    <div className="flex justify-center gap-3" >
        <Button size='lg' asChild>
            <SheetClose asChild>
                <Link href="/auth/signup">ลงทะเบียน</Link>
            </SheetClose>
        </Button>
        <Button size='lg' variant='outline' asChild>
            <SheetClose asChild>
                <Link href="/auth/signin">เข้าสู่ระบบ</Link>
            </SheetClose>
        </Button>
    </div>
)

export const SignoutButton = () => {
    const { handleSignout, isPending } = useSignout()
    return (
        <SheetClose asChild>
            <Button 
                variant='destructive'
                size='lg'
                onClick={handleSignout}
                disabled={isPending}
            >
                {isPending ? <Loader2 size='20' className="animate-spin" /> : 'ออกจากระบบ'}
            </Button>
        </SheetClose>
    )
}


export const UserAvatar = ({ user }: UserCompProps) => (
    <div className="px-4">
        <Card className="border-primary/50">
            <CardContent className="flex flex-col items-center gap-4">
                {/* Picture */}
                <Image 
                    src={user.picture || '/images/no-user-image.webp'} 
                    alt={`${user.name}'s avatar` || 'Profile'} 
                    width={120}
                    height={120} 
                    priority
                    className="rounded-full border-2 border-primary shadow-lg object-cover"/>
                {/* Name || Email */}
                <h2 className="text-xl font-semibold">
                    {user.name || user.email}
                </h2>
            </CardContent>
        </Card>
    </div>
)