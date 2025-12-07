import Link from "next/link"
import { ShoppingBag } from "lucide-react"

const CardIcon = () => {
    return (
        <Link 
            href="/cart" 
            className="flex gap-1 items-center text-primary md:hidden">
            <ShoppingBag size={28} />
        </Link>
    )
}

export default CardIcon