import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('')
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
    const { data, error: signUpError } = await (supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } }) as any)
    if (signUpError) { setLoading(false); setError(signUpError.message); return }
    if (data.user) {
      await (supabase.from('sauti_profiles').insert({ user_id: data.user.id, full_name: fullName, phone: '', institution, current_day: 1, completed_days: [], certification_earned: false } as any) as any)
    }
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display font-bold text-2xl mb-8" style={{ color: 'var(--color-primary)' }}>Sauti Voice</Link>
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Start your 5-day certification journey. Free for 3 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Mwangi" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="institution">Institution / University</Label>
                <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="University of Nairobi" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} autoComplete="new-password" />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 size={16} className="animate-spin mr-2" />Creating account...</> : 'Start free'}
              </Button>
              <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>By signing up you agree to our Terms of Service and Privacy Policy.</p>
            </form>
            <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account? <Link to="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}