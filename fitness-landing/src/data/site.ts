export const STUDIO = {
  name: 'Her Space Studio',
  tagline: "A women-only fitness studio for strength, wellness and everything in between.",
  phone: '+91 72008 17377',
  phoneHref: 'tel:+917200817377',
  email: 'info@herspacefitness.com',
  whatsapp:
    'https://wa.me/917200817377?text=' +
    encodeURIComponent("Hi, I'd love to know more about the memberships."),
  address:
    'No. 3/72, 2nd Floor, TVM Towers, Old Mahabalipuram Road (OMR), Kelambakkam, Thiruporur Taluk, Tamil Nadu 603103.',
  hours: [{ days: 'Monday - Saturday', time: '6:00am - 7:30pm' }],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'YouTube', href: 'https://www.youtube.com/@shanthikasiraj' },
  ],
}

type Branch = {
  name: string
  location: string
  address: string
}

export const BRANCHES: Branch[] = [
  {
    name: 'Branch One',
    location: 'Thiruporur',
    address: '2/252, Ayesha Complex, near Mohan Hospital, Thiruporur area.',
  },
  {
    name: 'Branch Two',
    location: 'OMR, Kelambakkam',
    address:
      'No. 3/72, 2nd Floor, TVM Towers, Old Mahabalipuram Road (OMR), Kelambakkam, Thiruporur Taluk, Tamil Nadu 603103.',
  },
]

export const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Programs', id: 'programs' },
  { label: 'Services', id: 'services' },
  { label: 'Membership', id: 'membership' },
  { label: 'FAQs', id: 'faqs' },
  { label: 'Contact', id: 'contact' },
]

export const STATS = [
  { value: '500+', label: 'Members supported', detail: 'since our first class' },
  { value: '6', label: 'Fitness programs', detail: 'for every season of life' },
  { value: '8', label: 'Expert trainers', detail: 'women-first coaching' },
  { value: '6', label: 'Years of experience', detail: 'growing together' },
]

export const ENQUIRY_INTERESTS = [
  'General enquiry',
  'Membership enquiry',
  'Strength Training',
  'Weight Loss & Fitness',
  'Yoga & Flexibility',
  'Zumba & Dance Fitness',
  'Personal Training',
  'Online Fitness Classes',
  'Nutrition & wellness',
  'Starter membership',
  'Premium membership',
  'Personal Coaching',
  'Franchise enquiry',
]

export const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp']
