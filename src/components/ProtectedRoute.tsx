import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) { setAuthed(true); setChecking(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(Boolean(data.session))
      setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }
  if (!authed) return <Navigate to="/login" replace />
  return <>{children}</>
}
