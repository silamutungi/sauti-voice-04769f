import { useState, useEffect, type FormEvent } from 'react'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import Navbar from '../components/Navbar'

export default function Settings() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [institution, setInstitution] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setFullName('Jane Mwangi')
        setPhone('+254 712 345678')
        setInstitution('University of Nairobi')
        setLoading(false)
      }, 600)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setLoading(false); return }
    const { data } = await (supabase.from('sauti_profiles').select('*').eq('user_id', session.user.id).single() as any)
    if (data) {
      setProfileId(data.id)
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
      setInstitution(data.institution || '')
    }
    setLoading(false)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    if (!isSupabaseConfigured) {
      setTimeout(() => { setSaving(false); setSuccess(true) }, 700)
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setSaving(false); setError('Not authenticated.'); return }
    const payload = { full_name: fullName, phone, institution }
    let err
    if (profileId) {
      const { error: updateError } = await (supabase.from('sauti_profiles').update(payload as any).eq('id', profileId) as any)
      err = updateError
    } else {
      const { error: insertError } = await (supabase.from('sauti_profiles').insert({ ...payload, user_id: session.user.id, current_day: 1, completed_days: [], certification_earned: false } as any) as any)
      err = insertError
    }
    setSaving(false)
    if (err) { setError(err.message) } else { setSuccess(true) }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-10">
        <h1 className="font-display font-bold mb-6" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Account Settings</h1>
        {loading ? (
          <div className="flex items-center gap-3 py-16 justify-center" style={{ color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" />
            <span>Loading your profile...</span>
          </div>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="s-fullName">Full name</Label>
                    <Input id="s-fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Mwangi" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="s-phone">Phone number</Label>
                    <Input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="s-institution">Institution</Label>
                    <Input id="s-institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="University of Nairobi" />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                      <AlertCircle size={16} aria-hidden="true" />
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(22,163,74,0.08)', color: 'var(--color-success)' }}>
                      <CheckCircle size={16} aria-hidden="true" />
                      Profile updated successfully.
                    </div>
                  )}
                  <Button type="submit" disabled={saving}>
                    {saving ? <><Loader2 size={16} className="animate-spin mr-2" />Saving...</> : 'Save changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => window.confirm('Are you sure? This will delete your account.') && undefined}>Delete Account</Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}