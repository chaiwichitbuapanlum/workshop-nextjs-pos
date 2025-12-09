"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SheetClose } from "@/components/ui/sheet"
import { useSignout } from '@/hooks/use-sign-out'
import { UserType } from "@/types/user-type"
import {
    Card,
    CardContent
} from '@/components/ui/card'
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

export const SignoutButton = ({ isMobile = false, isSheet = false }) => {
    const { isPending, handleSignout } = useSignout()

    // ใช้สำหรับ mobile menu ที่อยู่ใน Sheet
    if (isMobile && isSheet) {
        return (
            <SheetClose asChild>
                <Button
                    variant='destructive'
                    size='lg'
                    disabled={isPending}
                    onClick={handleSignout}
                >
                    ออกจากระบบ
                </Button>
            </SheetClose>
        )
    }

    // ใช้สำหรับ dropdown menu หรือ desktop
    if (isMobile) {
        return (
            <Button
                variant='destructive'
                size='lg'
                className="w-full"
                disabled={isPending}
                onClick={handleSignout}
            >
                ออกจากระบบ
            </Button>
        )
    }

    return (
        <Button
            variant='destructive'
            className='w-full mt-4'
            disabled={isPending}
            onClick={handleSignout}
        >
            ออกจากระบบ
        </Button>
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
                    className="rounded-full border-2 border-primary shadow-lg object-cover" />
                {/* Name || Email */}
                <h2 className="text-xl font-semibold">
                    {user.name || user.email}
                </h2>
            </CardContent>
        </Card>
    </div>
)

export const UserAvatarSmall = ({ user }: UserCompProps) => (
  <Avatar className='border-primary shadow-lg'>
    <AvatarImage
      src={user.picture || undefined}
      alt={user.name || 'User'}
    />
    <AvatarFallback className='bg-primary text-primary-foreground'>
      {user.name
        ? user.name.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
)

export const UserDropdownAvatar = ({ user }: UserCompProps) => (
  <Avatar className='size-16 border-2 border-primary'>
    <AvatarImage
      src={user.picture || undefined}
      alt={user.name || 'User'}
    />
    <AvatarFallback className='text-lg'>
      {user.name
        ? user.name.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
)
