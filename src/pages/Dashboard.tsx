import { useState, useEffect } from 'react'
import { CheckCircle, Circle, Award, RefreshCw, Loader2, Mic, BookOpen, HelpCircle, Video, Lock, ChevronRight, Trophy } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardTitle } from '../components/ui/card'
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

function CertificationPath({ completedIds, currentDay }: { completedIds: string[], currentDay: number }) {
  const days = [1, 2, 3, 4, 5]
  const dayLabels: Record<number, string> = {
    1: 'Foundations',
    2: 'Products',
    3: 'Client Skills',
    4: 'Objections',
    5: 'Certification',
  }

  return (
    <Card className="mb-8">
      <CardContent className="py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold" style={{ fontSize: 'var(--text-title-3)', color: 'var(--color-text)' }}>Certification Path</h2>
          <Trophy size={20} style={{ color: 'var(--color-accent)' }} />
        </div>
        <div className="flex items-center gap-0">
          {days.map((day, idx) => {
            const dayLessons = SEED_LESSONS.filter(l => l.day === day)
            const dayDone = dayLessons.every(l => completedIds.includes(l.id))
            const isActive = day === currentDay && !dayDone
            const locked = day > currentDay
            const isLast = idx === days.length - 1

            return (
              <div key={day} className="flex items-center" style={{ flex: isLast ? 'none' : 1 }}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: dayDone
                        ? 'var(--color-accent)'
                        : isActive
                        ? 'var(--color-primary)'
                        : locked
                        ? 'var(--color-border)'
                        : 'var(--color-border)',
                      border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                      boxShadow: isActive ? '0 0 0 3px rgba(30,64,175,0.15)' : 'none',
                    }}
                  >
                    {dayDone ? (
                      <CheckCircle size={18} color="white" />
                    ) : locked ? (
                      <Lock size={16} style={{ color: 'var(--color-text-muted)' }} />
                    ) : (
                      <span className="text-sm font-bold" style={{ color: isActive ? 'white' : 'var(--color-text-muted)' }}>{day}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium" style={{ color: dayDone ? 'var(--color-accent)' : isActive ? 'var(--color-primary)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      Day {day}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{dayLabels[day]}</p>
                    {dayDone && <p className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>Done</p>}
                    {isActive && <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Active</p>}
                    {locked && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Locked</p>}
                  </div>
                </div>
                {!isLast && (
                  <div
                    className="h-0.5 flex-1 mx-1 mb-7 transition-all duration-500"
                    style={{ backgroundColor: dayDone ? 'var(--color-accent)' : 'var(--color-border)' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Next Step guidance */}
        {(() => {
          const allDone = SEED_LESSONS.every(l => completedIds.includes(l.id))
          if (allDone) {
            return (
              <div className="mt-5 flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
                <Trophy size={18} style={{ color: 'var(--color-accent)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>All days complete — download your certificate below!</p>
              </div>
            )
          }
          const nextLesson = SEED_LESSONS.find(l => !completedIds.includes(l.id))
          return nextLesson ? (
            <div className="mt-5 flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(30,64,175,0.06)', border: '1px solid rgba(30,64,175,0.15)' }}>
              <ChevronRight size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Next Step</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{nextLesson.title}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Day {nextLesson.day} · {nextLesson.duration_minutes} min · {nextLesson.type}</p>
              </div>
            </div>
          ) : null
        })()}
      </CardContent>
    </Card>
  )
}

function ProgressSummaryCard({ completedIds, currentDay }: { completedIds: string[], currentDay: number }) {
  const totalLessons = SEED_LESSONS.length
  const completedCount = completedIds.length
  const progressPct = Math.round((completedCount / totalLessons) * 100)
  const nextLesson = SEED_LESSONS.find(l => !completedIds.includes(l.id))

  return (
    <Card className="mb-8">
      <CardContent className="py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold" style={{ fontSize: 'var(--text-title-3)', color: 'var(--color-text)' }}>Progress Summary</h2>
          <Badge
            className="text-xs font-semibold"
            style={{
              backgroundColor: progressPct === 100 ? 'rgba(5,150,105,0.1)' : 'rgba(30,64,175,0.08)',
              color: progressPct === 100 ? 'var(--color-accent)' : 'var(--color-primary)',
              border: 'none',
            }}
          >
            {progressPct}% Complete
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(30,64,175,0.06)' }}>
            <p className="font-display font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>{completedCount}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>of {totalLessons} lessons</p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(30,64,175,0.06)' }}>
            <p className="font-display font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>Day {currentDay}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>current day</p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: completedCount === totalLessons ? 'rgba(5,150,105,0.08)' : 'rgba(30,64,175,0.06)' }}>
            <p className="font-display font-bold text-2xl" style={{ color: completedCount === totalLessons ? 'var(--color-accent)' : 'var(--color-primary)' }}>
              {completedCount === totalLessons ? '🏆' : `${5 - currentDay + 1}d`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{completedCount === totalLessons ? 'certified' : 'days left'}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Overall progress</span>
            <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>{completedCount} of {totalLessons} lessons</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? 'var(--color-accent)' : 'var(--color-primary)' }}
            />
          </div>
        </div>
        {nextLesson && completedCount < totalLessons && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronRight size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>Up next: <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{nextLesson.title}</span></span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState<string | null>(null)

  useEffect(() => { loadProgress() }, [])

  // Recompute currentDay whenever completedIds changes
  function computeCurrentDay(ids: string[]): number {
    let day = 1
    for (let d = 1; d <= 5; d++) {
      const dayLessons = SEED_LESSONS.filter(l => l.day === d)
      if (dayLessons.every(l => ids.includes(l.id))) day = d + 1
    }
    return Math.min(day, 5)
  }

  async function loadProgress() {
    setLoading(true)
    setError('')

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        const ids = ['1']
        setCompletedIds(ids)
        setCurrentDay(computeCurrentDay(ids))
        setLoading(false)
      }, 600)
      return
    }

    try {
      let session = null
      try {
        const { data, error: authError } = await supabase.auth.getSession()
        if (authError) {
          console.error('[Dashboard] Auth error:', authError.message)
        } else {
          session = data.session
        }
      } catch (authEx) {
        console.error('[Dashboard] Auth exception:', authEx)
      }

      if (!session) {
        console.warn('[Dashboard] No active session — showing empty progress.')
        setCompletedIds([])
        setCurrentDay(1)
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await (supabase
        .from('sauti_progress')
        .select('lesson_id')
        .eq('user_id', session.user.id) as any)

      if (fetchError) {
        console.error('[Dashboard] Fetch error — code:', fetchError.code, '| message:', fetchError.message, '| details:', fetchError.details, '| hint:', fetchError.hint)
        const knownFallbackCodes = ['42P01', '42501', 'PGRST301', 'PGRST116']
        if (knownFallbackCodes.includes(fetchError.code) || fetchError.code?.startsWith('PGRST')) {
          console.warn('[Dashboard] Schema/permission issue — showing empty progress as fallback.')
          setCompletedIds([])
          setCurrentDay(1)
          setLoading(false)
          return
        }
        throw fetchError
      }

      const ids = (data || []).map((r: { lesson_id: string }) => r.lesson_id)
      setCompletedIds(ids)
      setCurrentDay(computeCurrentDay(ids))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[Dashboard] loadProgress failed:', message)
      setError('Failed to load progress. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function markComplete(lessonId: string) {
    if (completedIds.includes(lessonId)) return
    setMarking(lessonId)
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setCompletedIds(prev => {
          const updated = [...prev, lessonId]
          setCurrentDay(computeCurrentDay(updated))
          return updated
        })
        setMarking(null)
      }, 500)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setMarking(null); return }
    await (supabase.from('sauti_progress').insert({ user_id: session.user.id, lesson_id: lessonId, score: null } as any) as any)
    setCompletedIds(prev => {
      const updated = [...prev, lessonId]
      setCurrentDay(computeCurrentDay(updated))
      return updated
    })
    setMarking(null)
  }

  const totalLessons = SEED_LESSONS.length
  const completedCount = completedIds.length
  const progressPct = Math.round((completedCount / totalLessons) * 100)
  const days = [1, 2, 3, 4, 5]
  const allComplete = completedCount === totalLessons

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

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Lessons Done', value: `${completedCount}/${totalLessons}` },
            { label: 'Progress', value: `${progressPct}%` },
            { label: 'Current Day', value: `Day ${currentDay}` },
            { label: 'Certificate', value: allComplete ? 'Earned 🏆' : 'Pending' },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-5">
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-overline)' }}>{label}</p>
                <p className="font-display font-bold text-2xl" style={{ color: label === 'Certificate' && allComplete ? 'var(--color-accent)' : 'var(--color-primary)' }}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Summary Card */}
        <ProgressSummaryCard completedIds={completedIds} currentDay={currentDay} />

        {/* Certification Path */}
        <CertificationPath completedIds={completedIds} currentDay={currentDay} />

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
                {locked && <Badge variant="outline"><Lock size={11} className="mr-1" />Locked</Badge>}
                {!dayDone && !locked && (
                  <Badge style={{ backgroundColor: 'rgba(30,64,175,0.08)', color: 'var(--color-primary)', border: 'none' }}>In Progress</Badge>
                )}
              </div>
              <div className="space-y-3">
                {dayLessons.map(lesson => {
                  const done = completedIds.includes(lesson.id)
                  const Icon = TYPE_ICON[lesson.type] || BookOpen
                  return (
                    <Card
                      key={lesson.id}
                      className={locked ? 'opacity-40' : done ? '' : ''}
                      style={{
                        borderColor: done ? 'rgba(5,150,105,0.3)' : locked ? 'var(--color-border)' : 'var(--color-border)',
                        backgroundColor: done ? 'rgba(5,150,105,0.04)' : 'var(--color-bg-surface)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent className="py-4 flex items-center gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: done ? 'rgba(5,150,105,0.12)' : 'rgba(30,64,175,0.08)' }}
                        >
                          <Icon size={20} style={{ color: done ? 'var(--color-accent)' : 'var(--color-primary)', opacity: locked ? 0.5 : 1 }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium"
                            style={{
                              color: done ? 'var(--color-text-muted)' : 'var(--color-text)',
                              fontSize: 'var(--text-subhead)',
                              textDecoration: done ? 'line-through' : 'none',
                              opacity: done ? 0.7 : 1,
                            }}
                          >
                            {lesson.title}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{lesson.duration_minutes} min · {lesson.type}</p>
                        </div>
                        {done ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>Done</span>
                            <CheckCircle size={20} style={{ color: 'var(--color-accent)' }} aria-label="Completed" />
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            disabled={locked || marking === lesson.id}
                            onClick={() => markComplete(lesson.id)}
                          >
                            {marking === lesson.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <><Circle size={14} className="mr-1" />Start</>
                            }
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Certificate Card — only shown when all 9 lessons complete */}
        {allComplete && (
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
