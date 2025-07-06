import { cn } from '@/lib/utils'

const DownloadLink = ({ href, name, className }: { href: string; name: string; className?: string }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className={cn('plabs-caption-medium-14 text-greyscale-10 break-all hover:underline', className)}
  >
    {name}
  </a>
)

export default DownloadLink
