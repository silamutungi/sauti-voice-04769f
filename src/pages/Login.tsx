import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!isSupabaseConfigured) {
      setTimeout(() => { setLoading(false); navigate('/dashboard') }, 800)
      return
    }
    const { error: authError } = await (supabase.auth.signInWithPassword({ email, password }) as any)
    setLoading(false)
    if (authError) { setError(authError.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display font-bold text-2xl mb-8" style={{ color: 'var(--color-primary)' }}>Sauti Voice</Link>
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Log in to continue your training journey</CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupabaseConfigured && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(37,99,235,0.08)', color: 'var(--color-info)' }}>
                Demo mode — connect Supabase to enable real auth.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 size={16} className="animate-spin mr-2" />Logging in...</> : 'Log in'}
              </Button>
            </form>
            <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
              No account? <Link to="/signup" className="font-medium" style={{ color: 'var(--color-primary)' }}>Sign up free</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}