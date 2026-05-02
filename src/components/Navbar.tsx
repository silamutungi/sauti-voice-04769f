import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, LayoutDashboard, BookOpen, Settings } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from './ui/button'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Training', href: '/dashboard', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-xl" style={{ color: 'var(--color-primary)' }}>Sauti Voice</Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: location.pathname === href ? 'var(--color-primary)' : 'var(--color-text-secondary)', backgroundColor: location.pathname === href ? 'rgba(30,64,175,0.08)' : 'transparent' }}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:inline-flex" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" aria-hidden="true" />Log out
          </Button>
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-4 space-y-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={label} to={href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium"
              style={{ color: location.pathname === href ? 'var(--color-primary)' : 'var(--color-text)' }}
            >
              <Icon size={16} />{label}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium w-full" style={{ color: 'var(--color-error)' }}>
            <LogOut size={16} />Log out
          </button>
        </div>
      )}
    </header>
  )
}