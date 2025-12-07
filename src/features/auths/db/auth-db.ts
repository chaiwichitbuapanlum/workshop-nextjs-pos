import { signupSchema, signinSchema } from '@/features/auths/schemas/auth-schema';
import { revalidateUserCache } from '@/features/users/db/cache';
import { getUserById } from '@/features/users/db/user-db';
import { db } from '@/lib/db';
import { hash, genSalt, compare } from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies, headers } from 'next/headers'

interface SignupInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SigninInput {
    email: string;
    password: string;
}

const generateJwtToken = async (userId: string) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    return await new SignJWT({ id: userId })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(secret)
}

// cookies
const setCookieToken = async (token: string) => {
    const cookie =  await cookies()
    cookie.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days   
    })

}

export const signup = async (input: SignupInput) => {
    try {
        const { success, data, error } = signupSchema.safeParse(input);

        if (!success) {

        return {
            success: false,
            errors: error.flatten().fieldErrors,
        }
        }

        const user = await db.user.findUnique({
            where: {
                email: data.email,
            }
        })

        if (user) {
            return {
                success: false,
                message: 'อีเมลนี้ถูกใช้งานแล้ว',
            }
        }

        const salt = await genSalt(10)
        const hashedPassword = await hash(data.password, salt)

        const newUser = await db.user.create({
            data: {
                name: data.name,    
                email: data.email,
                password: hashedPassword,
            }
        })

        const token = await generateJwtToken(newUser.id)
        await setCookieToken(token)

        revalidateUserCache(newUser.id) // ล้าง cache ของ user คนนี้ หลังจากสร้างใหม่

        return {
            success: true,
            message: 'สมัครสมาชิกสำเร็จ'
        }

    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
        }
    }
}

export const signin = async (input: SigninInput) => {
    try {
        const { success, data, error } = signinSchema.safeParse(input);

        if (!success) {
            return {
                success: false,
                message: 'ข้อมูลไม่ถูกต้อง',
                errors: error.flatten().fieldErrors,
            }
        }

        

        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        })  

        if (!user) {
            return {
                success: false,
                message: 'ไม่พบผู้ใช้งานนี้ในระบบ',
            }
        }

        if (user.status !== 'Active') {
            return {
                success: false,
                message: 'บัญชีผู้ใช้งานนี้ถูกระงับการใช้งาน',
            }
        }

        const isPasswordValid = await compare(data.password, user.password)
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'รหัสผ่านไม่ถูกต้อง',
            }
        }

        const token = await generateJwtToken(user.id)
        await setCookieToken(token)

        return {
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ'
        }

        
    } catch (error) {
        console.error('Signin error:', error);
        return {
            success: false,
            message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        }
    }
}

export const authCheck = async () => {
  const userId = (await headers()).get("x-user-id");
  return userId ? await getUserById(userId) : null;
};