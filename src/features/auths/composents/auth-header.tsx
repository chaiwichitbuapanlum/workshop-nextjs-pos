import { 
    Card,
    CardHeader,
    CardTitle,
    CardDescription
 } from '@/components/ui/card'


 interface AuthHeaderProps {
    type: 'signup' | 'signin'
    children?: React.ReactNode
 }


const AuthHeader = ({ type, children }: AuthHeaderProps) => {
    const title = type === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'
    const description = type === 'signup' ? 'สมัครสมาชิกเพื่อเข้าใช้งานระบบ' : 'เข้าสู่ระบบเพื่อใช้งานระบบ'


  return (
    <div className="px-4 md:px-0">
    <Card className='max-w-md mx-auto '>
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        { children }
    </Card>
    </div>
  )
}

export default AuthHeader