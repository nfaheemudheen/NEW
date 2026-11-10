import bellyFatImage from '@/assets/blog/belly-fat.jpg'
import fatLossPlanImage from '@/assets/blog/fat-loss-plan.jpg'
import highProteinImage from '@/assets/blog/high-protein.png'
import hiitAtHomeImage from '@/assets/blog/hiit-at-home.jpg'
import hiitTwentyMinuteImage from '@/assets/blog/hiit-20-minute.jpg'
import onlineClassesImage from '@/assets/blog/online-classes.jpg'
import strengthBeginnersImage from '@/assets/blog/strength-beginners.jpg'
import walkingVsRunningImage from '@/assets/blog/walking-vs-running.jpg'
import weightLossChennaiImage from '@/assets/blog/weight-loss-chennai.jpg'
import yogaDailyPlanImage from '@/assets/blog/yoga-daily-plan.jpg'

export const BLOG_HOME_URL = 'https://herspacefitness.com/blog/'
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@shanthikasiraj'

export const BLOG_CATEGORIES = [
  'All',
  'Cardio & HIIT',
  'Strength',
  'Yoga & mobility',
  'Nutrition',
  'Weight loss',
  'Everyday wellness',
] as const

export type BlogCategory = Exclude<(typeof BLOG_CATEGORIES)[number], 'All'>

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  date: string
  readTime: number
  image: string
  imageAlt: string
  href: string
}

const blogDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatBlogDate(value: string) {
  return blogDateFormatter.format(new Date(`${value}T12:00:00`))
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-is-belly-fat-difficult-to-lose',
    title: 'Why Is Belly Fat Difficult to Lose? 7 Common Mistakes Women Make',
    excerpt:
      'Stubborn belly fat is rarely about willpower. These seven everyday mistakes may be making your progress harder than it needs to be.',
    category: 'Weight loss',
    date: '2026-10-30',
    readTime: 6,
    image: bellyFatImage,
    imageAlt: 'Woman stretching in a studio beside the title Why Is Belly Fat Difficult to Lose',
    href: 'https://herspacefitness.com/blog/why-is-belly-fat-difficult-to-lose/',
  },
  {
    slug: '20-minute-hiit-workout-for-women',
    title: 'How to Build a 20-Minute HIIT Workout for Women',
    excerpt:
      'A busy schedule does not have to mean skipping movement. Learn how to build a short, effective HIIT session that fits real life.',
    category: 'Cardio & HIIT',
    date: '2026-10-23',
    readTime: 5,
    image: hiitTwentyMinuteImage,
    imageAlt: 'Woman training with a kettlebell in a bright studio',
    href: 'https://herspacefitness.com/blog/20-minute-hiit-workout-for-women/',
  },
  {
    slug: 'walking-vs-running-for-women',
    title: 'Walking vs Running: Which Cardio Works Best for Women?',
    excerpt:
      'Both get your heart going, but the right choice depends on your goals, your joints and the time you have. Here is how to decide.',
    category: 'Cardio & HIIT',
    date: '2026-10-13',
    readTime: 6,
    image: walkingVsRunningImage,
    imageAlt: 'Woman running outdoors in the morning light',
    href: 'https://herspacefitness.com/blog/walking-vs-running-for-women/',
  },
  {
    slug: 'online-fitness-classes-for-women',
    title: 'Online Fitness Classes for Women to Try at Home Today',
    excerpt:
      'From busy workdays to family routines, online classes can make showing up feel simpler. Here is how to choose the right one for you.',
    category: 'Everyday wellness',
    date: '2026-09-28',
    readTime: 5,
    image: onlineClassesImage,
    imageAlt: 'Woman following a workout at home in front of a laptop',
    href: 'https://herspacefitness.com/blog/online-fitness-classes-for-women/',
  },
  {
    slug: 'yoga-for-women-15-minute-daily-plan',
    title: 'How to Start Yoga for Women With a 15-Minute Daily Plan',
    excerpt:
      'A simple, realistic routine to help you build flexibility, balance and a calmer start to your day, one small practice at a time.',
    category: 'Yoga & mobility',
    date: '2026-09-23',
    readTime: 4,
    image: yogaDailyPlanImage,
    imageAlt: 'Women practising different yoga poses in a sunlit studio',
    href: 'https://herspacefitness.com/blog/yoga-for-women-15-minute-daily-plan/',
  },
  {
    slug: 'lose-weight-at-a-fitness-studio-in-chennai',
    title: 'How Women Can Lose Weight at a Fitness Studio in Chennai',
    excerpt:
      'Sustainable weight management is less about quick fixes and more about a plan you can live with. Here is where a supportive studio can help.',
    category: 'Weight loss',
    date: '2026-09-16',
    readTime: 6,
    image: weightLossChennaiImage,
    imageAlt: 'Woman working out with a trainer at a fitness studio',
    href: 'https://herspacefitness.com/blog/lose-weight-at-a-fitness-studio-in-chennai/',
  },
  {
    slug: 'strength-training-exercises-for-women-beginners',
    title: 'Best Strength Training Exercises for Women Beginners',
    excerpt:
      'New to the weights room? These beginner-friendly movements can help you build confidence, technique and full-body strength.',
    category: 'Strength',
    date: '2026-09-07',
    readTime: 7,
    image: strengthBeginnersImage,
    imageAlt: 'Woman lifting a dumbbell during a strength training session',
    href: 'https://herspacefitness.com/blog/strength-training-exercises-for-women-beginners/',
  },
  {
    slug: 'womens-hiit-workout-at-home',
    title: 'How to Start a Women’s HIIT Workout at Home',
    excerpt:
      'No equipment, no problem. Learn how to structure a safe and effective HIIT session in your own space, at your own pace.',
    category: 'Cardio & HIIT',
    date: '2026-09-03',
    readTime: 5,
    image: hiitAtHomeImage,
    imageAlt: 'Woman doing a high-intensity workout on a mat at home',
    href: 'https://herspacefitness.com/blog/womens-hiit-workout-at-home/',
  },
  {
    slug: 'high-protein-foods-for-women',
    title: '10 High-Protein Foods That Support Women’s Fitness Goals',
    excerpt:
      'Protein supports strength, recovery and everyday energy. These ten accessible foods make it easier to get enough on a busy day.',
    category: 'Nutrition',
    date: '2026-08-31',
    readTime: 5,
    image: highProteinImage,
    imageAlt: 'High-protein foods including eggs, fish, paneer, lentils and yoghurt',
    href: 'https://herspacefitness.com/blog/high-protein-foods-for-women/',
  },
  {
    slug: 'fat-loss-workout-plan-for-women',
    title: 'How to Build a Fat Loss Workout Plan for Women',
    excerpt:
      'A practical plan should work around your life, not the other way round. Start with these building blocks for steady, sustainable progress.',
    category: 'Weight loss',
    date: '2026-08-21',
    readTime: 7,
    image: fatLossPlanImage,
    imageAlt: 'Woman following a fat loss workout plan in a studio',
    href: 'https://herspacefitness.com/blog/fat-loss-workout-plan-for-women/',
  },
]

export type StudioVideo = {
  id: string
  title: string
  cardTitle: string
  tag: string
  channel: string
  image: string
}

export const STUDIO_VIDEOS: StudioVideo[] = [
  {
    id: 'h77h9m7-rLk',
    title: 'Pelvic Floor Tightness? Try These 2 Gentle Relaxation Exercises!',
    cardTitle: 'Gentle pelvic floor relaxation',
    tag: 'Pelvic floor',
    channel: 'Shanthi Kasiraj',
    image: 'https://i.ytimg.com/vi/h77h9m7-rLk/maxresdefault.jpg',
  },
  {
    id: 'qlHHDOWR0XU',
    title: '3 Core Exercises for a Stronger Belly! | Home Workout for Women',
    cardTitle: '3 core exercises for a stronger belly',
    tag: 'Core workout',
    channel: 'Shanthi Kasiraj',
    image: 'https://i.ytimg.com/vi/qlHHDOWR0XU/maxresdefault.jpg',
  },
  {
    id: 'LwlPFp0CGfU',
    title: 'Women Over 40 & 50: Why You Need Strength Training!',
    cardTitle: 'Strength training after 40',
    tag: 'Strength training',
    channel: 'Shanthi Kasiraj',
    image: 'https://i.ytimg.com/vi/LwlPFp0CGfU/maxresdefault.jpg',
  },
  {
    id: 'lIbiP8wcaHU',
    title: '3 Floor Exercises with Weights | Build Strength & Tone Your Body',
    cardTitle: '3 floor exercises with weights',
    tag: 'Weighted workout',
    channel: 'Shanthi Kasiraj',
    image: 'https://i.ytimg.com/vi/lIbiP8wcaHU/maxresdefault.jpg',
  },
]
