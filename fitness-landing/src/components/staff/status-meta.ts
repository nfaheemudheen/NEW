import { STATUS_LABELS, type SubmissionStatus } from '@/lib/submissions'

export const STATUS_META: Record<
  SubmissionStatus,
  { label: string; badge: string; dot: string; solid: string }
> = {
  new: {
    label: STATUS_LABELS.new,
    badge: 'border-brand-200 bg-brand-50 text-brand-700',
    dot: 'bg-brand-500',
    solid: 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/25',
  },
  contacted: {
    label: STATUS_LABELS.contacted,
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
    solid: 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/25',
  },
  booked: {
    label: STATUS_LABELS.booked,
    badge: 'border-aqua-200 bg-aqua-50 text-aqua-800',
    dot: 'bg-aqua-500',
    solid: 'border-aqua-600 bg-aqua-600 text-white shadow-sm shadow-aqua-600/25',
  },
  archived: {
    label: STATUS_LABELS.archived,
    badge: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
    solid: 'border-slate-700 bg-slate-700 text-white shadow-sm shadow-slate-700/20',
  },
}
