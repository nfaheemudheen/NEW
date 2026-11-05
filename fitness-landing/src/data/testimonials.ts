export type Testimonial = {
  id: number
  name: string
  reviewCount: number
  quote: string
  rating: number
  timeAgo: string
  avatarColor: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    reviewCount: 14,
    quote:
      'I came for the workouts and stayed for the women. Twelve weeks in, I feel stronger than I have in years — and I actually look forward to class.',
    rating: 5,
    timeAgo: '2 weeks ago',
    avatarColor: 'bg-brand-700',
  },
  {
    id: 2,
    name: 'Hannah Miller',
    reviewCount: 27,
    quote:
      "It's the first studio where I haven't felt like I had to keep up. Every class meets you where you are, and the coaches notice everything.",
    rating: 5,
    timeAgo: '1 month ago',
    avatarColor: 'bg-aqua-700',
  },
  {
    id: 3,
    name: 'Nadia Kapoor',
    reviewCount: 9,
    quote:
      "The mix of strength, yoga and honest check-ins is exactly what my body needed. I'm lifting heavier, sleeping better, and standing taller.",
    rating: 5,
    timeAgo: '3 months ago',
    avatarColor: 'bg-brand-500',
  },
]
