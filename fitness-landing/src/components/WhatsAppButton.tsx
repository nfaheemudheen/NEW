import { MessageCircle } from 'lucide-react'
import { STUDIO } from '@/data/site'

export default function WhatsAppButton() {
  return (
    <a
      href={STUDIO.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Her Space Studio on WhatsApp"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_14px_30px_-10px_rgba(57,118,83,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 sm:right-6"
    >
      <MessageCircle size={24} />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Chat with us
      </span>
    </a>
  )
}
