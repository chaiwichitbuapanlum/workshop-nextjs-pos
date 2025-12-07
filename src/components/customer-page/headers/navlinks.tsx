import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import Link from "next/link"

const NAV_LINKS = [
    { title: 'หน้าหลัก', href: '/'},
    { title: 'สินค้าทั้งหมด', href: '/products'},
    { title: 'เกี่ยวกับ', href: '/about'},
    { title: 'ติดต่อเรา', href: '/contact'}
]



export const MobileNavLinks = () => (
    <div className="flex flex-col gap-2 mt-3">
        {NAV_LINKS.map((link) => (
            <SheetClose key={link.href} className="px-4 py-2 hover:bg-accent rounded-md" asChild>
                <Button 
                    asChild  
                    size="lg" 
                    // className="bg-gray-300 text-black"
                    >
                <Link href={link.href} className="text-lg font-medium">
                    {link.title}
                </Link>
                </Button>
            </SheetClose>
        ))}
    </div>
)



export const DesktopNavLinks = () => (
    <div className="flex items-center gap-1 mr-4">
        {NAV_LINKS.map((link) => (
                <Button 
                    key={link.href}
                    asChild  
                    variant='ghost'
                    size="sm" 
                    className="hover:text-pink-600 transition-colors duration-200"
                    >
                <Link href={link.href} className="text-lg font-medium">
                    {link.title}
                </Link>
                </Button>

        ))}
    </div>
)