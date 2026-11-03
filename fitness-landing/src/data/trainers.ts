import amaraImage from '@/assets/trainer-amara.jpg'
import mayaImage from '@/assets/trainer-maya.jpg'
import sofiaImage from '@/assets/trainer-sofia.jpg'
import leilaImage from '@/assets/trainer-leila.jpg'

export type Trainer = {
  id: string
  name: string
  role: string
  specialty: string
  experience: string
  bio: string
  image: string
  tags: string[]
}

export const TRAINERS: Trainer[] = [
  {
    id: 'amara',
    name: 'Amara Okafor',
    role: 'Founder & Head Coach',
    specialty: 'Strength & Conditioning',
    experience: '12+ years',
    bio: 'Amara built Bloom around one belief: every woman deserves a room where she can take up space. Her coaching is precise, patient and quietly powerful.',
    image: amaraImage,
    tags: ['Strength', 'Pre & postnatal'],
  },
  {
    id: 'maya',
    name: 'Maya Chen',
    role: 'Yoga & Mobility Coach',
    specialty: 'Yoga & Mobility',
    experience: '8 years',
    bio: 'Maya blends breathwork, mobility and slow strength. Her classes are an invitation to move gently, breathe deeper and come home to your body.',
    image: mayaImage,
    tags: ['Yoga', 'Mobility'],
  },
  {
    id: 'sofia',
    name: 'Sofia Reyes',
    role: 'Weight Management Coach',
    specialty: 'Weight Management',
    experience: '7 years',
    bio: 'Sofia helps members build habits that last. No crash diets, no guilt — just practical nutrition, steady progress and a lot of encouragement.',
    image: sofiaImage,
    tags: ['Nutrition', 'Habits'],
  },
  {
    id: 'leila',
    name: 'Leila Hassan',
    role: 'Functional Fitness Coach',
    specialty: 'Functional Fitness',
    experience: '6 years',
    bio: 'Leila trains movement that carries into real life: carrying, climbing, lifting and playing. Expect smart progressions and a very good playlist.',
    image: leilaImage,
    tags: ['Functional', 'Conditioning'],
  },
]
