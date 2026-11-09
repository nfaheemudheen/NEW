export type Trainer = {
  id: string
  name: string
  role: string
  description: string
  image: string
}

export const FOUNDER = {
  name: 'Shanthi Kasiraj',
  role: 'Founder, Her Space',
  bio: 'Shanthi built Her Space around one belief: every woman deserves a room where she can take up space. She leads with patient coaching and a commitment to making fitness feel welcoming and empowering.',
  image: '/iamge1.webp',
}

export const TRAINERS: Trainer[] = [
  {
    id: 'vilva',
    name: 'Vilva',
    role: 'International Yoga Champion & Fitness Trainer',
    description: 'Brings champion-level yoga experience to sessions that build balance, flexibility and confidence.',
    image: '/iamge3.webp',
  },
  {
    id: 'monisha',
    name: 'Monisha',
    role: 'Fitness Trainer',
    description: 'Helps members build strength and consistency with supportive, approachable coaching.',
    image: '/image4.webp',
  },
  {
    id: 'joshlin',
    name: 'Joshlin',
    role: 'Fitness Trainer',
    description: 'Creates an encouraging space to move, learn and grow stronger at your own pace.',
    image: '/image5.webp',
  },
  {
    id: 'shobana',
    name: 'Shobana',
    role: 'Fitness Trainer',
    description: 'Supports members as they make movement a positive and steady part of everyday life.',
    image: '/image6.webp',
  },
]
