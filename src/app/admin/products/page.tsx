import ProductList from '@/features/products/components/product-list'
import { getProducts } from '@/features/products/db/products'
import { ProductType } from '@/types/product'

const ProductAdminPage = async () => {

    const products = await getProducts() as ProductType[]

    return (
        <div className='p-4 sm:p-6'>
            {/* product header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-2xl sm:text-3xl font-bold'>Product Management</h1>
                    <p className='text-muted-foreground text-sm'>Manage your product listings and details here.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                {/* Product list */}
                <div className='lg:col-span-3'>
                    <ProductList products={products} />
                </div>
            </div>
        </div>
    )
}

export default ProductAdminPage