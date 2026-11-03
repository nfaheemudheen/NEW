import strengthImage from '@/assets/program-strength.jpg'
import weightLossImage from '@/assets/program-weight-loss.jpg'
import yogaImage from '@/assets/program-yoga.jpg'
import danceImage from '@/assets/program-dance.jpg'
import personalImage from '@/assets/program-personal.jpg'
import onlineImage from '@/assets/program-online.jpg'

export type ProgramIcon = 'strength' | 'weight' | 'yoga' | 'dance' | 'personal' | 'online'

export type Program = {
  id: string
  name: string
  description: string
  image: string
  icon: ProgramIcon
  meta: string
}

export const PROGRAMS: Program[] = [
  {
    id: 'strength',
    name: 'Strength Training',
    description:
      'Progressive dumbbell, band and bodyweight work to build lean muscle and everyday power.',
    image: strengthImage,
    icon: 'strength',
    meta: '45 min · All levels',
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss & Fitness',
    description:
      'Low-impact conditioning and sustainable habits that help you feel lighter, fitter and more energetic.',
    image: weightLossImage,
    icon: 'weight',
    meta: '50 min · Beginner friendly',
  },
  {
    id: 'yoga',
    name: 'Yoga & Flexibility',
    description:
      'Breath-led flow, mobility and deep stretching to release tension and help you move with ease.',
    image: yogaImage,
    icon: 'yoga',
    meta: '60 min · All levels',
  },
  {
    id: 'dance',
    name: 'Zumba & Dance Fitness',
    description:
      'Feel-good cardio with music and simple choreography — a workout that never feels like one.',
    image: danceImage,
    icon: 'dance',
    meta: '45 min · High energy',
  },
  {
    id: 'personal',
    name: 'Personal Training',
    description:
      'One-to-one coaching built around your body, goals and schedule, with weekly progress check-ins.',
    image: personalImage,
    icon: 'personal',
    meta: '60 min · By appointment',
  },
  {
    id: 'online',
    name: 'Online Fitness Classes',
    description:
      'Live and on-demand sessions you can join from home, wherever life takes you.',
    image: onlineImage,
    icon: 'online',
    meta: '30–45 min · On demand',
  },
]
