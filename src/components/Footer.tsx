import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t py-12" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display font-bold" style={{ color: 'var(--color-primary)' }}>Sauti Voice</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Agent Readiness Platform — Nairobi, Kenya</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <Link to="/pricing" className="hover:underline">Pricing</Link>
          <Link to="/login" className="hover:underline">Log in</Link>
          <Link to="/signup" className="hover:underline">Sign up</Link>
          <a href="mailto:hello@sautivoice.co.ke" className="hover:underline">Contact</a>
        </nav>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          &copy; {new Date().getFullYear()} Sauti Voice. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
