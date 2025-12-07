import { UserType } from '@/types/user-type'
import MobileMenu from './mobile-menu'
import CardIcon from './card-icon'


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
        <div className='hidden'>
            <div>Desktop Links</div>
            {user 
            ? <div>Profile</div>
            : <div>เข้าสู่ระบบ</div>}
        </div>
    </nav>
  )
}

export default NavbarCustomer