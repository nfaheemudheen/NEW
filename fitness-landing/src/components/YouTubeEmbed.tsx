import { useState } from 'react'
import { Play } from 'lucide-react'

type YouTubeEmbedProps = {
  videoId: string
  title: string
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const [thumbnail, setThumbnail] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  )

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-brand-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-aqua-400"
    >
      <img
        src={thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => {
          if (thumbnail.endsWith('/maxresdefault.jpg')) {
            setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
          }
        }}
      />
      <span className="absolute inset-0 bg-brand-950/15 transition-colors group-hover:bg-brand-950/30" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-transform group-hover:scale-110 sm:h-[4.5rem] sm:w-[4.5rem]">
        <Play size={27} fill="currentColor" className="ml-1" />
      </span>
    </button>
  )
}
