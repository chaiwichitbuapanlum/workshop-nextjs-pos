import { db } from '../../../lib/db';
import {
    cacheLife,
    cacheTag
} from 'next/cache'
import { getCategoryGlobalTag, revalidateCategoryCache } from './cache';
import { categorySchema } from '../schemas/categories';
import { authCheck } from '@/features/auths/db/auth-db'
import { canCreateCategory, canUpdateCategory } from '../permissions/categories';

import { redirect } from 'next/navigation';
import { UserType } from '@/types/user-type';



interface CreateCategoryInput {
    name: string;
}

interface UpdateCategoryInput {
  id: string;
  name: string;
}


export const getCategories = async () => {
    'use cache';

    cacheLife('hours');
    cacheTag(getCategoryGlobalTag());
    try {

        return await db.category.findMany({
            select : {
                id: true,
                name: true,
                status: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}


export const createCategory = async (input: CreateCategoryInput) => {
    try {
        const user = await authCheck() as UserType;


        if (!user || !canCreateCategory(user)) {
            redirect("/");
        }


        const { success, data, error } = categorySchema.safeParse(input);

        if (!success) {
            return {
                message: error.message,
                error: error.flatten().fieldErrors
            }
        }

        // Check for existing category
        const existingCategory = await db.category.findFirst({
            where: {
                name: data.name
            }
        });

        if (existingCategory) {
            return {
                message: 'Category already exists'
            }
        }

        // Create Category
       const newCategory = await db.category.create({
            data: {
                name: data.name
            }
        });

        // recahe the categories
        revalidateCategoryCache(newCategory.id)

        return {
            success: true,
            message: 'Category created successfully',
            data: newCategory
        }

    } catch (error) {
        console.error('Error creating category:', error);
        return {
            message: 'Error creating category'
        }
    }
}

export const updateCategory = async (input: UpdateCategoryInput) => {
  const user = await authCheck() as UserType;

  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = categorySchema.safeParse(input);
    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    // Check if category exists
    const existsingCategory = await db.category.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existsingCategory) {
      return {
        message: "Category not found",
      };
    }

    // Check if another category with the same name exists
    const duplicateCategory = await db.category.findFirst({
      where: {
        name: data.name,
        id: {
          not: input.id,
        },
      },
    });

    if (duplicateCategory) {
      return {
        message: "A category with this name already exists",
      };
    }

    // Update category
    const updatedCategory = await db.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: data.name,
      },
    });

    revalidateCategoryCache(updatedCategory.id);
    
    return {
      success: true,
      message: "Category updated successfully",
      data: updatedCategory
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};


export const changeCategoryStatus = async (id: string, status: string) => {

  const user = await authCheck() as UserType;

  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }

  try {
    // Your logic to change category status goes here
    const existsCategory = await db.category.findUnique({
      where: { id }
    })

    if (!existsCategory) {
      return {
        message: 'Category not found'
      }
    }


    if (existsCategory.status === status) {
      return {
        message: `Category is already ${status}`
      }
    }

    const updatedCategory =  await db.category.update({
      where: { id },
      data: { status }
    })

    revalidateCategoryCache(updatedCategory.id);

    return {
      success: true,
      message: `Category status changed to ${status} successfully`,
      data: updatedCategory
    }

  } catch (error) {
      console.error('Error changing category status:', error);
      return {
          message: 'Error changing category status'
      }
  }
}


export const removeCategory = async (id: string) => {
  return await changeCategoryStatus(id, "Inactive");
};

export const restoreCategory = async (id: string) => {
  return await changeCategoryStatus(id, "Active");
};