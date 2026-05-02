import { useState, useEffect, useRef } from 'react'
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
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

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
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col transform transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: open ? '-4px 0 24px rgba(0,0,0,0.12)' : 'none',
        }}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--color-primary)' }}>Sauti Voice</span>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = location.pathname === href
            return (
              <Link
                key={label}
                to={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  backgroundColor: isActive ? 'rgba(30,64,175,0.08)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Drawer footer with logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => { setOpen(false); handleLogout() }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium w-full transition-colors"
            style={{ color: 'var(--color-error)' }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
