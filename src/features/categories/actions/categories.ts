'use server'

import { InitialFormState } from "@/types/action-type"
import {
  createCategory,
  removeCategory,
  restoreCategory,
  updateCategory,
} from "@/features/categories/db/categories";
import { revalidatePath } from 'next/cache'

export const categoryAction = async (_prevState: InitialFormState, formData: FormData) => {
    const rewData = {
        id: formData.get('category-id') as string,
        name: formData.get('category-name') as string
    }

    const result = rewData.id ? await updateCategory(rewData) : await createCategory(rewData)
    
    if (result && result.message && !result.success) {
        return {
            success: false,
            message: result.message,
            errors: result.error
        }
    }

    // Revalidate the categories page to show new data
    revalidatePath('/admin/categories')
    
    return {
        success: true,
        message: 'Category created successfully'
    }
}

export const deleteCategoryAction = async (_prevState: InitialFormState, formData: FormData) => {
    const id = formData.get('category-id') as string;

    const result = await removeCategory(id);

    return result && result.message && !result.success
    ? {
        success: false,
        message: result.message
    }
    : {
        success: true,
        message: 'Category removed successfully'
    }
}

export const restoreCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const id = formData.get("category-id") as string;

  const result = await restoreCategory(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Category restored successfully",
      };
};
