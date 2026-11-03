export type ScheduleClass = {
  id: string
  day: string
  time: string
  name: string
  trainer: string
  type: 'Group' | 'Small group' | '1:1'
  level: string
}

export const WEEKDAY_SCHEDULE: ScheduleClass[] = [
  { id: 'mon-1', day: 'Monday', time: '6:30am', name: 'Strength Training', trainer: 'Amara', type: 'Group', level: 'All levels' },
  { id: 'mon-2', day: 'Monday', time: '9:00am', name: 'Yoga & Mobility', trainer: 'Maya', type: 'Group', level: 'All levels' },
  { id: 'mon-3', day: 'Monday', time: '6:30pm', name: 'Zumba & Dance', trainer: 'Sofia', type: 'Group', level: 'Beginner friendly' },
  { id: 'tue-1', day: 'Tuesday', time: '7:00am', name: 'Functional Fitness', trainer: 'Leila', type: 'Small group', level: 'All levels' },
  { id: 'tue-2', day: 'Tuesday', time: '12:30pm', name: 'Express Strength', trainer: 'Amara', type: 'Group', level: 'All levels' },
  { id: 'wed-1', day: 'Wednesday', time: '6:30am', name: 'Weight Loss & Fitness', trainer: 'Sofia', type: 'Group', level: 'Beginner friendly' },
  { id: 'wed-2', day: 'Wednesday', time: '6:00pm', name: 'Yoga Flow', trainer: 'Maya', type: 'Group', level: 'All levels' },
  { id: 'thu-1', day: 'Thursday', time: '7:00am', name: 'Strength Training', trainer: 'Amara', type: 'Group', level: 'All levels' },
  { id: 'thu-2', day: 'Thursday', time: '5:30pm', name: 'Personal Training', trainer: 'Leila', type: '1:1', level: 'By appointment' },
  { id: 'fri-1', day: 'Friday', time: '9:00am', name: 'Zumba & Dance', trainer: 'Sofia', type: 'Group', level: 'High energy' },
  { id: 'fri-2', day: 'Friday', time: '6:00pm', name: 'Functional Fitness', trainer: 'Leila', type: 'Small group', level: 'All levels' },
]

export const WEEKEND_SCHEDULE: ScheduleClass[] = [
  { id: 'sat-1', day: 'Saturday', time: '8:00am', name: 'Strength Training', trainer: 'Amara', type: 'Group', level: 'All levels' },
  { id: 'sat-2', day: 'Saturday', time: '9:30am', name: 'Yoga & Mobility', trainer: 'Maya', type: 'Group', level: 'All levels' },
  { id: 'sat-3', day: 'Saturday', time: '11:00am', name: 'Dance Fitness', trainer: 'Sofia', type: 'Group', level: 'Beginner friendly' },
  { id: 'sun-1', day: 'Sunday', time: '9:00am', name: 'Functional Fitness', trainer: 'Leila', type: 'Small group', level: 'All levels' },
  { id: 'sun-2', day: 'Sunday', time: '10:30am', name: 'Personal Training', trainer: 'Amara', type: '1:1', level: 'By appointment' },
]
