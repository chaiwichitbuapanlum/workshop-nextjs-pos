import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"


interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    id: string
    required?: boolean
}

const InputForm = ({ label, id, required = false, ...props }: InputFormProps) => {
  return (
    <div className="flex flex-col gap-2">
        <Label htmlFor={id} className="font-bold">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input 
            id={id} 
            name={id}
            required={required} 
            {...props}
            className="mt-1 w-full" 
        />
    </div>
  )
}

export default InputForm