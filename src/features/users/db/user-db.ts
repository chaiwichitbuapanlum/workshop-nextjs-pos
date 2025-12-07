import { db } from '@/lib/db'


export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id, status: 'Active' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                address: true,
                picture: true,
                tel: true
            }
            })
        return user
        
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}