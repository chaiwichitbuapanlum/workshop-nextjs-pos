'use client'

import InputForm from '@/components/shared/input-form'
import SubmitBtn from '@/components/shared/submit-btn'
import { CardContent, CardFooter } from '@/components/ui/card'
import Form from 'next/form'
import AuthFooter from './auth-footer'

interface AuthFormProps {
    type: 'signup' | 'signin'
}
const AuthForm = ({ type }: AuthFormProps) => {

    const rederInput = (label: string, id: string, type = 'text', required = false) => (
        <div>
            <InputForm label={label} id={id} type={type} required={required} />
        </div>
    )

    return (
        <Form action=''>
            <CardContent className='grid gap-3'>
                { type === 'signup' && rederInput('ชื่อผู้ใช้', 'name', 'text', true) }
                { rederInput('อีเมล', 'email', 'email', true) }
                { rederInput('รหัสผ่าน', 'password', 'password', true) }
                { type === 'signup' && rederInput('ยืนยันรหัสผ่าน', 'confirmPassword', 'password', true) }
            </CardContent>
            <CardFooter className='pt-4 flex flex-col gap-2'>
                <AuthFooter type={type} />
               <SubmitBtn 
                name={type === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'} 
                pending={false}
                className='w-full' 
                />
            </CardFooter>
        </Form>
    )
}

export default AuthForm