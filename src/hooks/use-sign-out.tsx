import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signoutAction } from '@/features/auths/actions/auths'

export const useSignout = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSignout = () => {
    startTransition(async () => {
      const result = await signoutAction()
      if (result.success) {
        toast.success(result.message)
        router.push('/auth/signin')
      } else {
        toast.error(result.message)
      }
    })
  }

  return { isPending, handleSignout }
}