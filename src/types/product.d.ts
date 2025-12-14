import { Category, Product } from "@prisma/client";

export interface ProductType extends Product {
    category: Category;
    lowStock: number;
    sku: string;
}