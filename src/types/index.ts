export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone: string
  institution: string
  current_day: number
  completed_days: number[]
  certification_earned: boolean
  created_at: string
  deleted_at: string | null
}

export interface Lesson {
  id: string
  day: number
  title: string
  duration_minutes: number
  type: 'video' | 'audio' | 'reading' | 'quiz'
  description: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed_at: string
  score: number | null
}

export interface SeedLesson {
  id: string
  day: number
  title: string
  duration_minutes: number
  type: 'video' | 'audio' | 'reading' | 'quiz'
  description: string
}
