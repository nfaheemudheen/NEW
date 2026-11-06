import { Link } from 'react-router-dom'
import { ArrowLeft, Flower2 } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-Her Space px-6 py-20">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-lg shadow-brand-500/20">
          <Flower2 size={26} strokeWidth={1.8} />
        </div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">
          404 · Page not found
        </p>
        <h1 className="font-display text-4xl text-slate-900 sm:text-5xl">
          This page has
          <br />
          <span className="italic text-gradient">wandered off.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
          The page you are looking for is not here. Let us take you back to the studio.
        </p>
        <Link to="/" className="btn-primary mt-7">
          <ArrowLeft size={17} /> Back to home
        </Link>
      </div>
    </main>
  )
}
