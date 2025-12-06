import AuthForm from '@/features/auths/composents/auth-form'
import AuthHeader from '@/features/auths/composents/auth-header'
import type { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'เข้าสู่ระบบ',
    description: 'เข้าสู่ระบบเพื่อเข้าใช้งานระบบ',

}

const SignInPage = () => {
  const type = 'signin'
    return (

        <AuthHeader type={type}>
            <AuthForm type={type}/>
        </AuthHeader>

    )
}

export default SignInPage