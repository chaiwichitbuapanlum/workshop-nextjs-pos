interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col justify-center min-h-svh">
        {children}
    </div>
  )
}

export default AuthLayout