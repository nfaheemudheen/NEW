import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Flower2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons'
import { BRANCHES, STUDIO } from '@/data/site'

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
} as const

export default function HomeContact() {
  return (
    <section
      aria-labelledby="home-contact-title"
      className="relative overflow-hidden bg-Her Space px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-brand-200/40 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-aqua-200/40 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/90 bg-white/45 p-4 shadow-[0_28px_80px_-48px_rgba(9,39,71,0.3)] backdrop-blur-sm sm:p-6 lg:rounded-[3rem] lg:p-8">
        <div className="mb-6 rounded-[1.8rem] border border-brand-100/80 bg-gradient-to-br from-white/90 via-brand-50/70 to-aqua-50/80 px-5 py-6 text-center sm:mb-8 sm:px-8 sm:py-8">
          <div data-reveal>
            <div className="section-badge mx-auto w-fit">
              <Flower2 size={14} /> Come say hello
            </div>
            <h2 id="home-contact-title" className="section-title !mb-0 mt-1">
              Two studios.
              <br />
              <span className="italic text-gradient">One warm welcome.</span>
            </h2>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center" data-reveal data-reveal-delay="100">
            
            <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-brand-400 opacity-60 blur-[2px]" />
                <span className="relative h-2 w-2 rounded-full bg-brand-500" />
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {STUDIO.hours[0].days} · {STUDIO.hours[0].time}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-5">
            {BRANCHES.map((branch, index) => {
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`

              return (
                <article
                  key={branch.name}
                  className="group grid overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-premium transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow sm:grid-cols-[0.85fr_1.15fr]"
                  data-reveal
                  data-reveal-delay={index ? '120' : undefined}
                >
                  <div className="relative h-52 overflow-hidden bg-brand-100 sm:h-full sm:min-h-[210px]">
                    <iframe
                      title={`${branch.location} location map`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.address)}&output=embed`}
                      className="absolute inset-0 h-full w-full border-0 saturate-[0.85] transition duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/10 to-brand-950/5"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-800 shadow-sm backdrop-blur">
                      {branch.name}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-2xl text-slate-900">
                            {branch.location}
                          </h3>
                        </div>
                      </div>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${branch.location} in Google Maps`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-700 transition-colors hover:bg-brand-700 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                      >
                        <ArrowUpRight size={17} />
                      </a>
                    </div>

                    <p className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                      <MapPin size={16} className="mt-1 shrink-0 text-brand-600" />
                      {branch.address}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                        <Clock3 size={13} className="text-brand-500" />
                        {STUDIO.hours[0].days}
                      </span>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                      >
                        Get directions <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <aside
            className="relative flex flex-col overflow-hidden rounded-[2rem] bg-brand-950 p-6 text-white shadow-premium sm:p-7"
            data-reveal
            data-reveal-delay="240"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-aqua-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-brand-500/25 blur-3xl"
            />

            <div className="relative flex flex-1 flex-col">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">
                <Flower2 size={13} /> Talk to a human
              </p>
              <h3 className="mt-3 font-display text-2xl leading-tight sm:text-[1.7rem]">
                A friendly voice,
                <br />
                <span className="text-brand-300">whenever you need one.</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Questions about classes, timings or memberships? We are happy to help you find your
                fit.
              </p>

              <div className="mt-6 space-y-2.5">
                <a
                  href={STUDIO.phoneHref}
                  className="group/contact flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200">
                    <Phone size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                      Call the studio
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold">{STUDIO.phone}</span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-white/30 transition group-hover/contact:text-brand-200"
                  />
                </a>

                <a
                  href={`mailto:${STUDIO.email}`}
                  className="group/contact flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200">
                    <Mail size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                      Email us
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold">{STUDIO.email}</span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-white/30 transition group-hover/contact:text-brand-200"
                  />
                </a>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2.5 pt-6">
                <a
                  href={STUDIO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-brand-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  WhatsApp <MessageCircle size={16} />
                </a>
                <a
                  href="/contact"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                >
                  Enquire <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                Follow along
              </span>
              <div className="flex gap-2">
                {STUDIO.socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${STUDIO.name} on ${social.label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-100 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                    >
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
