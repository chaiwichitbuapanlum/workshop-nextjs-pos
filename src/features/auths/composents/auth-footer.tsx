import Link from 'next/link'

interface AuthFooterProps {
    type?: 'signup' | 'signin'
}

const authTextMap = {
    signup: {
        footerText: 'มีบัญชีอยู่แล้ว? ',
        linkText: 'เข้าสู่ระบบ',
        linkHref: '/auth/signin'
    },
    signin: {
        footerText: 'ยังไม่มีบัญชี? ',
        linkText: 'สมัครสมาชิก',
        linkHref: '/auth/signup'
    },
}

const AuthFooter = ({ type }: AuthFooterProps) => {
    const { footerText, linkText, linkHref } = authTextMap[type || 'signin']
    return (
        <>
           <p className='text-accent-foreground'>
            {footerText} 
            <Link 
                className='text-primary hover:underline ml-1'
                href={linkHref}
                >
                { linkText }
            </Link>
            </p>
        </>
    )
}

export default AuthFooter