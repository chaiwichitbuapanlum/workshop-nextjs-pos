import { db } from '../../../lib/db';


export const getCategories = async () => {
    try {

        return await db.category.findMany({
            select : {
                id: true,
                name: true,
                status: true
            }
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}