import ProductList from "@/features/products/components/product-list";
import { getProducts } from "@/features/products/db/products";


interface ProductAdminPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ProductAdminPage = async ({ searchParams }: ProductAdminPageProps) => {
  const page = parseInt((await searchParams).page || "1");

  const limit = 2;

  const { products, totalCount } = await getProducts(page, limit);

  return (
    <div className="p-4 sm:p-6">
      {/* Product Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage your product inventory and details
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Product List */}
        <div className="lg:col-span-3">
          <ProductList
            products={products}
            totalCount={totalCount}
            page={page}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductAdminPage;
