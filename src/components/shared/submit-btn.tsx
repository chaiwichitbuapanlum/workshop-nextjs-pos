import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    name: string
    pending?: boolean

}

const SubmitBtn = ({ name, pending = false, ...props }: SubmitBtnProps) => {
  return (
    <Button 
        type="submit" 
        disabled={pending}
        {...props} 
        >
      {pending ? <Loader2 size={16} className="mr-2 h-4 w-4 animate-spin" /> : name}
    </Button>
  )
}

export default SubmitBtn