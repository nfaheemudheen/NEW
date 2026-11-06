import { cn } from '@/lib/utils'
import type { SubmissionStatus } from '@/lib/submissions'
import { STATUS_META } from '@/components/staff/status-meta'

export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]',
        meta.badge,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}
