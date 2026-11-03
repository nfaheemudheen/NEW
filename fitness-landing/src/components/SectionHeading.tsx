import type { ReactNode } from 'react'
import { Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'center' | 'left'
  as?: 'h1' | 'h2'
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn('mb-12 sm:mb-14', align === 'center' ? 'text-center' : 'text-left', className)}
      data-reveal
    >
      <div className={cn('section-badge', align === 'center' && 'mx-auto')}>
        <Flower2 size={14} /> {eyebrow}
      </div>
      <Heading className={cn('section-title', align === 'center' && 'mx-auto')}>{title}</Heading>
      {description && (
        <p className={cn('section-subtitle', align === 'left' && '!mx-0')}>{description}</p>
      )}
    </div>
  )
}
