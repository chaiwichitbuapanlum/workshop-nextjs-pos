import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import NavbarCustomer from "./navbar"
import { UserType } from "@/types/user-type"

interface HeaderCustomerProps {
    user: UserType | null
}

const HeaderCustomer = ({ user }: HeaderCustomerProps) => {
    return (
        <header className="fixed top-0 inset-x-0 z-40 border-b border-b-border shadow-md">
            {/* icon */}
            <div className="max-w-7xl mx-auto px-4 xl:px-0 flex items-center justify-between h-16">

                <Link href="/" className="flex gap-1 items-center text-primary">
                    <ShoppingBag  size={28}/>
                    <h2 className="font-bold text-xl">SYSTEM POS</h2>
                </Link>
                    
                {/* Menu */}
                <NavbarCustomer user={user} />
            </div>
        </header>
    )
}

export default HeaderCustomer