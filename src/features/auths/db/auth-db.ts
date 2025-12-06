import { signupSchema } from '@/features/auths/schemas/auth-schema';
import { db } from '@/lib/db';
import { hash, genSalt } from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers'

interface SignupInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
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
                message: 'กรุณากรอกข้อมูลให้ถูกต้อง',
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

        return {
            message: 'สมัครสมาชิกสำเร็จ'
        }

    } catch (error) {
        console.error('Signup error:', error);
        return {
            message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
        }
    }
}