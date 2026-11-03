import { useState } from 'react'
import { ArrowRight, CalendarDays, Info, Sun } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE, type ScheduleClass } from '@/data/schedule'
import { cn } from '@/lib/utils'

type ScheduleTab = 'weekday' | 'weekend'

type ClassScheduleProps = {
  onEnquire: (interest: string) => void
}

const TABS: { id: ScheduleTab; label: string; hint: string; icon: typeof Sun }[] = [
  { id: 'weekday', label: 'Weekdays', hint: 'Mon – Fri', icon: Sun },
  { id: 'weekend', label: 'Weekends', hint: 'Sat – Sun', icon: CalendarDays },
]

export default function ClassSchedule({ onEnquire }: ClassScheduleProps) {
  const [tab, setTab] = useState<ScheduleTab>('weekday')
  const classes = tab === 'weekday' ? WEEKDAY_SCHEDULE : WEEKEND_SCHEDULE
  const days = Array.from(new Set(classes.map((item) => item.day)))

  return (
    <section id="schedule" className="section bg-soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Weekly schedule"
          title={
            <>
              Find your rhythm,
              <br />
              <span className="italic text-gradient">one class at a time.</span>
            </>
          }
          description="Morning, lunchtime and evening sessions designed to fit around real life. Pick a day, meet your coach and move with women who get it."
        />

        <div className="mx-auto max-w-4xl" data-reveal>
          <div
            className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row"
            role="group"
            aria-label="Filter the class schedule"
          >
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
              {TABS.map(({ id, label, hint, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 sm:px-5',
                    tab === id
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
                      : 'text-slate-500 hover:bg-brand-50 hover:text-brand-700',
                  )}
                >
                  <Icon size={15} />
                  {label}
                  <span
                    className={cn(
                      'hidden text-[10px] font-medium sm:inline',
                      tab === id ? 'text-brand-100/80' : 'text-slate-400',
                    )}
                  >
                    {hint}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              All times are studio local time · sample timetable
            </p>
          </div>

          <div
            className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm"
            aria-live="polite"
          >
            {days.map((day, dayIndex) => {
              const dayClasses = classes.filter((item) => item.day === day)
              return (
                <div
                  key={day}
                  className={cn(dayIndex > 0 && 'border-t border-slate-100')}
                >
                  <div className="flex items-center justify-between gap-3 bg-brand-50/70 px-5 py-3 sm:px-6">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-800">
                      <CalendarDays size={14} /> {day}
                    </h3>
                    <span className="text-[10px] font-semibold text-brand-600">
                      {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>

                  <ul>
                    {dayClasses.map((item: ScheduleClass) => (
                      <li
                        key={item.id}
                        className="grid gap-1.5 border-t border-slate-100 px-5 py-4 first:border-t-0 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:px-6"
                      >
                        <time className="text-sm font-bold text-brand-700">{item.time}</time>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            with {item.trainer} · {item.level}
                          </p>
                        </div>
                        <span className="w-fit rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-700">
                          {item.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-white/70 px-5 py-4 text-center sm:flex-row sm:text-left">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <Info size={15} className="mt-0.5 shrink-0 text-brand-600" />
              Sample timetable for development. Class times and availability can change — confirm
              with the studio before your first visit.
            </p>
            <button
              type="button"
              onClick={() => onEnquire('General enquiry')}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
            >
              Ask about a class <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
