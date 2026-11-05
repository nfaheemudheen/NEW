export type Membership = {
  id: string
  name: string
  price: number
  cadence: string
  duration: string
  description: string
  features: string[]
  interest: string
  popular: boolean
}

export const MEMBERSHIPS: Membership[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 7500,
    cadence: 'per month',
    duration: 'No lock-in',
    description: 'A gentle way to build your rhythm and meet the studio.',
    features: [
      '4 group classes each month',
      'Access to all studio programs',
      'Monthly progress check-in',
      'Member community events',
      'Pause anytime',
    ],
    interest: 'Starter membership',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 12200,
    cadence: 'per month',
    duration: '3-month minimum',
    description: 'Our most loved plan for women who want it all.',
    features: [
      'Unlimited group classes',
      'All six fitness programs',
      'Monthly 1:1 coaching session',
      'Nutrition and wellness workshops',
      'Priority class booking',
    ],
    interest: 'Premium membership',
    popular: true,
  },
  {
    id: 'personal',
    name: 'Personal Coaching',
    price: 23500,
    cadence: 'per month',
    duration: '3-month minimum',
    description: 'Private, focused coaching for a goal that matters to you.',
    features: [
      '4 private sessions each month',
      'Fully personalised training plan',
      'Weekly coach check-ins',
      'Nutrition guidance',
      'Private WhatsApp support',
    ],
    interest: 'Personal Coaching',
    popular: false,
  },
]
