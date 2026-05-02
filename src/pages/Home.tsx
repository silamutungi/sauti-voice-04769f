import { Link } from 'react-router-dom'
import { CheckCircle, Mic, Award, TrendingUp, Users, Shield } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import Footer from '../components/Footer'

const features = [
  { icon: '🗓️', title: '5-Day Structured Path', desc: 'Clear daily milestones from orientation to certification — no guessing what to do next.' },
  { icon: '🎙️', title: 'Audio-First Lessons', desc: 'Voice-led training reduces reading fatigue and matches how Kenyan professionals learn best.' },
  { icon: '📋', title: 'Kenya-Specific Content', desc: 'Regulatory frameworks, CMA guidelines, and cultural context built into every lesson.' },
  { icon: '🏆', title: 'Recognized Certification', desc: 'Share your certificate on LinkedIn. Prove readiness to employers and clients instantly.' },
  { icon: '📱', title: 'Works Offline', desc: 'Download lessons and complete training even with intermittent connectivity.' },
  { icon: '💰', title: 'Sub-KES 1,000/month', desc: 'World-class training at emerging-market pricing — accessible to every graduate.' },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl" style={{ color: 'var(--color-primary)' }}>Sauti Voice</Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="hidden md:block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Pricing</Link>
            <Link to="/login"><Button variant="outline" className="hidden md:inline-flex">Log in</Button></Link>
            <Link to="/signup"><Button>Start free</Button></Link>
          </div>
        </div>
      </nav>

      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1729465906595-e69ef2700ad6?ixid=M3w5MTM0MDN8MHwxfHNlYXJjaHwxfHxBJTIwcHJvZmVzc2lvbmFsJTIwS2VueWFuJTIwZmVtYWxlJTIwYWdlbnQlMjBpbiUyMG1vZGVybiUyMGJ1c2luZXNzJTIwYXR0aXJlfGVufDB8MHx8fDE3Nzc2ODE1OTB8MA&ixlib=rb-4.1.0&w=1920&h=1080&fit=crop&crop=center&q=80&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
          <Badge className="mb-6 bg-gray-900/20 text-white border-white/30">Kenya-Built. CMA-Aligned.</Badge>
          <h1 className="font-display font-bold text-white mb-6 leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', maxWidth: '640px' }}>
            Certified agent-ready in 5 days. No classroom required.
          </h1>
          <p className="text-white/85 mb-10 leading-relaxed" style={{ fontSize: '1.125rem', maxWidth: '500px' }}>
            Sauti Voice trains Kenyan graduates with audio-first lessons, regulatory context, and a recognised certificate — for less than the cost of a textbook.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup"><Button className="text-base px-8 py-3 h-auto bg-white text-blue-900 hover:bg-blue-50">Start free today</Button></Link>
            <Link to="/pricing"><Button variant="outline" className="text-base px-8 py-3 h-auto border-white/50 text-white hover:bg-gray-900/10">See pricing</Button></Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-6">
            {[{ icon: CheckCircle, text: '5-day path' }, { icon: Mic, text: 'Audio-first' }, { icon: Award, text: 'Sharable cert' }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/80">
                <Icon size={16} strokeWidth={2} />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display font-bold text-center mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Everything you need to pass certification</h2>
          <p className="text-center mb-16" style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 4rem' }}>Built for the Kenyan market. Designed for the agent who cannot afford to waste time or money.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)', fontSize: 'var(--text-headline)' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)', lineHeight: 'var(--leading-relaxed)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display font-bold text-center mb-16" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Why Sauti beats the alternatives</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[{ icon: TrendingUp, stat: '87%', label: 'Pass rate in first attempt' }, { icon: Users, stat: '2,400+', label: 'Agents certified to date' }, { icon: Shield, stat: 'CMA', label: 'Kenya regulatory aligned' }].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="p-8 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
                <Icon size={32} className="mx-auto mb-4" style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
                <div className="font-display font-bold text-4xl mb-2" style={{ color: 'var(--color-primary)' }}>{stat}</div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 'var(--text-title-1)' }}>Start your 5-day journey today</h2>
          <p className="text-white/80 mb-8" style={{ fontSize: 'var(--text-body)' }}>Free for the first 3 days. No credit card required.</p>
          <Link to="/signup"><Button className="text-base px-10 py-3 h-auto bg-white text-blue-900 hover:bg-blue-50">Get started free</Button></Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}