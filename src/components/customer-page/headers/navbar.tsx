import { UserType } from '@/types/user-type'
import MobileMenu from './mobile-menu'
import CardIcon from './card-icon'
import { DesktopNavLinks } from './navlinks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DesktopUserMenu from './desktop-user-menu'


interface NavbarProps {
    user: UserType | null
}

const NavbarCustomer = ({ user }: NavbarProps) => {
  return (
    <nav
        className="flex items-center gap-3"
    >
        {/* Mobile Navigation */}
        {user && <CardIcon />}
        <MobileMenu user={user} />

        {/* Desktop Navigation */}
        <div className='hidden md:flex md:items-center'>
            <DesktopNavLinks />
            {user 
            ? <DesktopUserMenu user={user} />
            : (
              <Button
                asChild  
                size="sm" 
                className=""
                
              >
                <Link href="/auth/signin" className="text-lg font-medium">
                    เข้าสู่ระบบ
                </Link>
              </Button>
            )
            }
        </div>
    </nav>
  )
}

export default NavbarCustomer