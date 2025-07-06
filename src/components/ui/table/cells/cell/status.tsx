import { Badge } from '@/components/ui/badge/badge'

const Status = ({ value, text }: { value: string; text?: string }) => {
  return (
    <Badge status={value} className='capitalize'>
      {text || value}
    </Badge>
  )
}

export default Status
