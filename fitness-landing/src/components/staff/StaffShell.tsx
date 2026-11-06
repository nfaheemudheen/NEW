import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, LogOut, ShieldCheck } from 'lucide-react'
import type { StaffSession } from '@/lib/auth'

type StaffShellProps = {
  session: StaffSession
  onLogout: () => void
  children: ReactNode
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function StaffShell({ session, onLogout, children }: StaffShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_8px_30px_-28px_rgba(9,39,71,0.4)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/staff"
              className="flex shrink-0 items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
              aria-label="Her Space staff portal home"
            >
              <img src="/logo2.png" alt="" className="h-12 w-12 object-contain" />
              <span className="hidden sm:block">
                <span className="block font-display text-base leading-tight text-slate-900">
                  Her Space
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-brand-700">
                  Staff portal
                </span>
              </span>
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full border border-aqua-200 bg-aqua-50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-aqua-800 md:inline-flex">
              <ShieldCheck size={12} /> Workspace
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 sm:px-4"
            >
              <span className="hidden sm:inline">View website</span>
              <span className="sm:hidden">Site</span>
              <ArrowUpRight size={14} />
            </Link>

            <span aria-hidden="true" className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="hidden min-w-0 text-right md:block">
              <p className="truncate text-xs font-semibold text-slate-800">{session.name}</p>
              <p className="text-[10px] text-slate-400">{session.role}</p>
            </div>

            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-aqua-700 text-xs font-bold text-white shadow-sm"
              aria-hidden="true"
            >
              {initials(session.name) || 'HS'}
            </span>

            <button
              type="button"
              onClick={onLogout}
              className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/15"
              aria-label="Log out of the staff portal"
            >
              <LogOut size={14} />
              <span className="hidden lg:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-[10px] text-slate-400 sm:flex-row sm:text-left">
          <p>© 2026 Her Space Studio · Staff workspace</p>
          <p>Submissions are stored in this browser and can be synced to Google Sheets.</p>
        </div>
      </footer>
    </div>
  )
}
