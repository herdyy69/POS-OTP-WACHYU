import { cn } from '@/lib/utils'

const Text = ({ className = '', type, value, ...rest }: { className?: string; type?: any; value?: any }) => {
  return (
    <div className={cn('flex items-center gap-1 w-full text-sm', className)} {...rest}>
      {value}
    </div>
  )
}

export default Text
