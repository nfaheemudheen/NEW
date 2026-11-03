import studioImage from '@/assets/studio.jpg'
import groupImage from '@/assets/gallery-group.jpg'
import strengthImage from '@/assets/gallery-strength.jpg'
import yogaImage from '@/assets/gallery-yoga.jpg'
import equipmentImage from '@/assets/gallery-equipment.jpg'
import functionalImage from '@/assets/gallery-functional.jpg'
import communityImage from '@/assets/gallery-community.jpg'
import yogaDuoImage from '@/assets/gallery-yoga-duo.jpg'

export type GalleryItem = {
  id: string
  src: string
  alt: string
  caption: string
  className: string
}

export const GALLERY: GalleryItem[] = [
  {
    id: 'studio',
    src: studioImage,
    alt: 'Sunlit studio with women warming up on yoga mats',
    caption: 'Our light-filled studio',
    className: 'col-span-2 row-span-2',
  },
  {
    id: 'group',
    src: groupImage,
    alt: 'Women moving together in a group fitness class',
    caption: 'Group classes, good energy',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 'strength',
    src: strengthImage,
    alt: 'Member training with a barbell in the studio',
    caption: 'Building strength',
    className: 'col-span-1 row-span-2',
  },
  {
    id: 'yoga',
    src: yogaImage,
    alt: 'Woman flowing through a yoga sequence',
    caption: 'Slow down, breathe',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 'equipment',
    src: equipmentImage,
    alt: 'Strength and conditioning equipment in the studio',
    caption: 'Everything you need',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 'functional',
    src: functionalImage,
    alt: 'Member working through a core exercise on a mat',
    caption: 'Train together',
    className: 'col-span-2 row-span-1',
  },
  {
    id: 'community',
    src: communityImage,
    alt: 'Member smiling after a class',
    caption: 'That post-class feeling',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 'yoga-duo',
    src: yogaDuoImage,
    alt: 'Two women practising yoga side by side',
    caption: 'A room that has your back',
    className: 'col-span-1 row-span-1',
  },
]
