import AuthForm from '@/features/auths/composents/auth-form'
import AuthHeader from '@/features/auths/composents/auth-header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'สมัครสมาชิก',
    description: 'สมัครสมาชิกเพื่อเข้าใช้งานระบบ',

}



const SignupPage = () => {
    const type = 'signup'
    return (

        <AuthHeader type={type}>
            <AuthForm type={type}/>
        </AuthHeader>

    )
}

export default SignupPage