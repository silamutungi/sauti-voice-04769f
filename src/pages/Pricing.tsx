import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const plans = [
  {
    name: 'Free Trial',
    price: 'KES 0',
    period: '3 days',
    description: 'Explore Days 1–3 at zero cost. No card needed.',
    cta: 'Start free',
    href: '/signup',
    highlight: false,
    features: ['Days 1–3 unlocked', 'Audio-first lessons', 'Progress tracking', 'Community forum access'],
  },
  {
    name: 'Certification',
    price: 'KES 799',
    period: 'per month',
    description: 'Complete the full 5-day path and earn your certificate.',
    cta: 'Get certified',
    href: '/signup',
    highlight: true,
    features: ['All 5 days unlocked', 'Audio + video lessons', 'CMA-aligned quizzes', 'Shareable certificate', 'LinkedIn badge', 'Offline access', 'Priority support'],
  },
  {
    name: 'Team',
    price: 'KES 2,499',
    period: 'per month',
    description: 'For institutions onboarding cohorts of agents.',
    cta: 'Contact us',
    href: 'mailto:hello@sautivoice.co.ke',
    highlight: false,
    features: ['Up to 10 agents', 'Admin dashboard', 'Progress reports', 'Bulk certificates', 'Dedicated support', 'Custom branding'],
  },
]

const faqs = [
  { q: 'Is the certificate recognised by CMA Kenya?', a: 'Sauti Voice certificates demonstrate completion of a CMA-aligned training pathway. They complement — not replace — the official CMA licensing exam.' },
  { q: 'Can I access lessons offline?', a: 'Yes. Audio lessons can be downloaded on mobile for low-bandwidth environments. Progress syncs when you reconnect.' },
  { q: 'What happens after my free trial?', a: 'You keep access to Days 1–3 forever. To unlock Days 4–5 and your certificate, upgrade to the Certification plan.' },
  { q: 'Is content available in Swahili?', a: 'Key client-facing scripts and Day 3 audio lessons are fully in Swahili. More Swahili content ships monthly.' },
]

export default function Pricing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="font-display font-bold mb-4" style={{ fontSize: 'var(--text-large-title)', color: 'var(--color-text)' }}>Simple, honest pricing</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)', maxWidth: '480px', margin: '0 auto' }}>Sub-KES 1,000 for world-class agent training. No hidden fees, no long-term contracts.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.highlight ? 'ring-2 ring-[color:var(--color-primary)]' : ''} style={plan.highlight ? { borderColor: 'var(--color-primary)' } : {}}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlight && <Badge>Most popular</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-3xl" style={{ color: 'var(--color-primary)' }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.href}>
                  <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'}>{plan.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-center mb-8" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{q}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)', lineHeight: 'var(--leading-relaxed)' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
