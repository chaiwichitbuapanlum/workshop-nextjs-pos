import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache'

export const getCategoryGlobalTag =() => {
    return getGlobalTag("categories");
}

export const getCategoryIdTag = (id: string) => {
    return getIdTag("categories", id);

}

export const revalidateCategoryCache = async (id?: string) => {
    revalidateTag(getCategoryGlobalTag());
    if (id) {
        revalidateTag(getCategoryIdTag(id));
    }
}