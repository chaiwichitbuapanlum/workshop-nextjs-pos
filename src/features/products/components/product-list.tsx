import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsList } from '@radix-ui/react-tabs'
import { Eye, MoreVertical, Pencil, Plus, RefreshCcw, Search, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductType } from '@/types/product'


interface ProductListProps {
    products: ProductType[]
}


const ProductList = ({ products }: ProductListProps) => {
    return (
        <Card>
            <CardHeader className='pb-4'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <CardTitle className='text-lg sm:text-xl'>Products</CardTitle>
                    <Button asChild className='mb-4'>
                        <Link href='/admin/products/new'>
                            <Plus size={16} />
                            <span>Add New Product</span>
                        </Link>
                    </Button>

                </div>

                <Tabs>
                    <TabsList className='grid-cols-4 mb-4'>
                        <TabsTrigger value='all'>All</TabsTrigger>
                        <TabsTrigger value='active'>Active</TabsTrigger>
                        <TabsTrigger value='inactive'>Inactive</TabsTrigger>
                        <TabsTrigger value='low-stock'>Low Stock</TabsTrigger>
                    </TabsList>

                    <div className='flex flex-col sm:flex-row gap-4 justify-between items-center mb-4'>
                        <div className='flex gap-2'>
                            <Badge variant='outline' className='sm:px-3 py-1' >
                                <span className='font-semibold text-blue-600'>
                                    {products.length}
                                </span>
                                Total
                            </Badge>
                            <Badge variant='outline' className='sm:px-3 py-1' >
                                <span className='font-semibold text-green-600'>
                                    {products.filter((p) => p.status === 'active').length}
                                </span>Active
                            </Badge>
                            <Badge variant='outline' className='sm:px-3 py-1' >
                                <span className='font-semibold text-gray-500'>
                                    {products.filter((p) => p.status === 'inactive').length}
                                </span>Inactive
                            </Badge>
                            <Badge variant='outline' className='sm:px-3 py-1' >
                                <span className='font-semibold text-yellow-500'>
                                    {products.filter((p) => p.stock <= p.lowStock && p.status === 'active').length}
                                </span>Low Stock
                            </Badge>
                        </div>

                        <div className='relative w-full sm:w-64' >
                            <Search size={16} className='absolute left-2 top-2.5 text-muted-foreground' />
                            <Input
                                className='pl-8'
                                placeholder="Search products" />

                        </div>
                    </div>
                </Tabs>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.length > 0 ? products.map((product, index) =>
                            <>
                                <TableRow key={index}>
                                    <TableCell>
                                        <Image
                                            alt='main produt image'
                                            src='/images/no-product-image.webp'
                                            width={70}
                                            height={70}
                                            className='object-cover rounded-md'
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className='font-medium'>{product.title}</div>
                                        <div className='text-xs text-muted-foreground'>{product.sku}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='text-sm'>{product.category.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='text-sm font-medium'>{product.price.toLocaleString()}</div>
                                        {product.basePrice !== product.price && (
                                            <div className='text-xs line-through text-muted-foreground'>{product.basePrice.toLocaleString()}</div>
                                        )}

                                    </TableCell>
                                    <TableCell>
                                        <div className={cn("text-sm", {
                                            "text-amber-500 font-medium": true
                                        })}>{product.stock.toLocaleString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{product.status}</Badge>
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    className='size-8'
                                                >
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem >
                                                    <Eye size={15} />
                                                    <span>View Details</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Pencil size={15} />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                {false ? (
                                                    <DropdownMenuItem>
                                                        <Trash2 size={15} className='text-destructive' />
                                                        <span className='text-destructive'>Delete</span>
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem>
                                                        <RefreshCcw size={15} className='text-green-500' />
                                                        <span className='text-green-500'>Restore</span>
                                                    </DropdownMenuItem>
                                                )}

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                </TableRow>
                            </>)
                            : <>
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center py-10'>
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            </>}

                    </TableBody>
                </Table>

            </CardContent>
        </Card>
    )
}

export default ProductList