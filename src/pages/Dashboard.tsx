import { useState, useEffect } from 'react'
import { CheckCircle, Circle, Award, RefreshCw, Loader2, Mic, BookOpen, HelpCircle, Video } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Navbar from '../components/Navbar'
import type { SeedLesson } from '../types'

const SEED_LESSONS: SeedLesson[] = [
  { id: '1', day: 1, title: 'Introduction to Kenya Capital Markets', duration_minutes: 18, type: 'audio', description: 'Understand the CMA regulatory framework and your role as an agent.' },
  { id: '2', day: 1, title: 'Ethics and Compliance Basics', duration_minutes: 12, type: 'reading', description: 'Core compliance obligations every licensed agent must follow.' },
  { id: '3', day: 2, title: 'Product Knowledge: Unit Trusts & Bonds', duration_minutes: 22, type: 'video', description: 'Deep dive into Kenyan investment products you will sell.' },
  { id: '4', day: 2, title: 'Day 2 Knowledge Check', duration_minutes: 10, type: 'quiz', description: 'Test your understanding before moving to client interactions.' },
  { id: '5', day: 3, title: 'Client Onboarding Scripts (Swahili)', duration_minutes: 20, type: 'audio', description: 'Culturally-adapted scripts for opening client conversations.' },
  { id: '6', day: 3, title: 'KYC Documentation Process', duration_minutes: 15, type: 'reading', description: 'Step-by-step guide to compliant client identification.' },
  { id: '7', day: 4, title: 'Objection Handling Masterclass', duration_minutes: 25, type: 'audio', description: 'Proven responses to the top 10 client objections in Kenyan markets.' },
  { id: '8', day: 4, title: 'Role Play: Difficult Conversations', duration_minutes: 18, type: 'video', description: 'Watch and learn from real agent simulations.' },
  { id: '9', day: 5, title: 'Final Certification Exam', duration_minutes: 30, type: 'quiz', description: 'Complete the exam to earn your Sauti Voice certificate.' },
]

const TYPE_ICON: Record<string, typeof Mic> = { audio: Mic, reading: BookOpen, quiz: HelpCircle, video: Video }

export default function Dashboard() {
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState<string | null>(null)

  useEffect(() => { loadProgress() }, [])

  async function loadProgress() {
    setLoading(true)
    setError('')
    if (!isSupabaseConfigured) {
      setTimeout(() => { setCompletedIds(['1']); setCurrentDay(1); setLoading(false) }, 600)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      const { data, error: fetchError } = await (supabase.from('sauti_progress').select('*').eq('user_id', session.user.id) as any)
      if (fetchError) throw fetchError
      const ids = (data || []).map((r: { lesson_id: string }) => r.lesson_id)
      setCompletedIds(ids)
      const completedDays = new Set(SEED_LESSONS.filter(l => ids.includes(l.id)).map(l => l.day))
      let day = 1
      for (let d = 1; d <= 5; d++) {
        const dayLessons = SEED_LESSONS.filter(l => l.day === d)
        if (dayLessons.every(l => ids.includes(l.id))) day = d + 1
      }
      setCurrentDay(Math.min(day, 5))
      setCompletedIds(ids)
      completedDays.size
    } catch {
      setError('Failed to load progress. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function markComplete(lessonId: string) {
    if (completedIds.includes(lessonId)) return
    setMarking(lessonId)
    if (!isSupabaseConfigured) {
      setTimeout(() => { setCompletedIds(prev => [...prev, lessonId]); setMarking(null) }, 500)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setMarking(null); return }
    await (supabase.from('sauti_progress').insert({ user_id: session.user.id, lesson_id: lessonId, score: null } as any) as any)
    setCompletedIds(prev => [...prev, lessonId])
    setMarking(null)
  }

  const totalLessons = SEED_LESSONS.length
  const completedCount = completedIds.length
  const progressPct = Math.round((completedCount / totalLessons) * 100)
  const days = [1, 2, 3, 4, 5]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl text-sm border" style={{ backgroundColor: 'rgba(37,99,235,0.06)', borderColor: 'rgba(37,99,235,0.2)', color: 'var(--color-info)' }}>
            Viewing sample data — connect your database to go live.
          </div>
        )}

        <div className="mb-8">
          <h1 className="font-display font-bold mb-1" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Your Training Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Day {currentDay} of 5 — keep going, you are making progress.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ label: 'Lessons Done', value: `${completedCount}/${totalLessons}` }, { label: 'Progress', value: `${progressPct}%` }, { label: 'Current Day', value: `Day ${currentDay}` }, { label: 'Certificate', value: completedCount === totalLessons ? 'Earned' : 'Pending' }].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-5">
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-overline)' }}>{label}</p>
                <p className="font-display font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Overall progress</span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{progressPct}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: 'var(--color-primary)' }} />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" />
            <span>Loading your progress...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center py-16 gap-4">
            <p style={{ color: 'var(--color-error)' }}>{error}</p>
            <Button variant="outline" onClick={loadProgress}><RefreshCw size={16} className="mr-2" />Retry</Button>
          </div>
        )}

        {!loading && !error && days.map(day => {
          const dayLessons = SEED_LESSONS.filter(l => l.day === day)
          const dayDone = dayLessons.every(l => completedIds.includes(l.id))
          const locked = day > currentDay
          return (
            <div key={day} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-display font-semibold" style={{ fontSize: 'var(--text-title-3)', color: locked ? 'var(--color-text-muted)' : 'var(--color-text)' }}>Day {day}</h2>
                {dayDone && <Badge className="bg-green-100 text-green-800">Complete</Badge>}
                {locked && <Badge variant="outline">Locked</Badge>}
              </div>
              <div className="space-y-3">
                {dayLessons.map(lesson => {
                  const done = completedIds.includes(lesson.id)
                  const Icon = TYPE_ICON[lesson.type] || BookOpen
                  return (
                    <Card key={lesson.id} className={locked ? 'opacity-50' : ''}>
                      <CardContent className="py-4 flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: done ? 'rgba(5,150,105,0.1)' : 'rgba(30,64,175,0.08)' }}>
                          <Icon size={20} style={{ color: done ? 'var(--color-accent)' : 'var(--color-primary)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium" style={{ color: 'var(--color-text)', fontSize: 'var(--text-subhead)' }}>{lesson.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{lesson.duration_minutes} min · {lesson.type}</p>
                        </div>
                        {done
                          ? <CheckCircle size={20} style={{ color: 'var(--color-success)' }} aria-label="Completed" />
                          : <Button size="sm" disabled={locked || marking === lesson.id} onClick={() => markComplete(lesson.id)}>
                              {marking === lesson.id ? <Loader2 size={14} className="animate-spin" /> : <><Circle size={14} className="mr-1" />Start</>}
                            </Button>
                        }
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}

        {completedCount === totalLessons && (
          <Card className="mt-8 border-2" style={{ borderColor: 'var(--color-accent)' }}>
            <CardContent className="py-8 text-center">
              <Award size={48} className="mx-auto mb-4" style={{ color: 'var(--color-accent)' }} />
              <CardTitle className="mb-2 font-display">Certification Earned!</CardTitle>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Congratulations — you are now a Sauti Voice Certified Agent. Share your achievement on LinkedIn.</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Download Certificate</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}