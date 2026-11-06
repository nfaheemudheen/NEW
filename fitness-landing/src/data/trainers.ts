export type ManagementMember = {
  id: string
  name: string
  role: string
  specialty: string
  experience: string
  bio: string
  image: string
}

export type Trainer = {
  id: string
  name: string
  role: string
  description: string
  image: string
}

export const MANAGEMENT_TEAM: ManagementMember[] = [
  {
    id: 'ranjitha',
    name: 'Ranjitha Arunkumar',
    role: 'Fitness Coach | Nutritionist',
    specialty: 'Yoga & Mobility',
    experience: '4 years',
    bio: 'Ranjitha brings fitness coaching and practical nutrition guidance together, with a thoughtful focus on mobility and steady strength.',
    image: '/image2.webp',
  },
  {
    id: 'shanthi',
    name: 'Shanthi Kasiraj',
    role: 'Fitness Coach | Nutritionist | Social Media Influencer',
    specialty: 'Strength & Conditioning',
    experience: '4 years',
    bio: 'Shanthi combines fitness coaching and nutrition guidance with an encouraging online presence that helps women feel supported in their wellness journey.',
    image: '/iamge1.webp',
  },
]

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
