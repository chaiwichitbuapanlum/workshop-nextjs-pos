import { db } from '../../../lib/db';
import {
    unstable_cacheLife as cacheLife,
    unstable_cacheTag as cacheTag
} from 'next/cache'
import { getCategoryGlobalTag } from './cache';

export const getCategories = async () => {
    'use cache';

    cacheLife('days')
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