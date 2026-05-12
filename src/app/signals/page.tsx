import { Sparkles } from 'lucide-react'
import { getRecentSignals } from '@/lib/azure-db'
import { DataPageHeader } from '@/components/DataPageHeader'
import { ScrollReveal } from '@/components/ScrollReveal'
import { auth } from '@/lib/auth'
import { SignalsClient } from './SignalsClient'
import { tierAtLeast } from '@/lib/tier'

export const revalidate = 30

export default async function SignalsPage() {
  const [session, signals] = await Promise.all([
    auth(),
    getRecentSignals({ limit: 50 }).catch(() => []),
  ])

  const isAlphaOrHigher = tierAtLeast(session, 'alpha')

  const upCount = signals.filter((s) => s.direction === 'UP').length
  const downCount = signals.filter((s) => s.direction === 'DOWN').length
  const highConf = signals.filter((s) => s.confidence >= 70).length

  const visibleSignals = isAlphaOrHigher ? signals : signals.slice(0, 8)

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <ScrollReveal>
        <DataPageHeader
          label="AI Signal Feed · Live"
          labelColor="#a78bfa"
          icon={Sparkles}
          iconColor="#a78bfa"
          iconGlow="rgba(167,139,250,0.35)"
          title="AI Momentum Signals"
          description="Live momentum signals from the Catalyst Harvester engine. Every minute, the forecasting model analyzes the next 5 minutes of price action."
          stats={[
            { label: 'Total Signals', value: signals.length, color: '#a78bfa' },
            { label: 'Bullish (UP)', value: upCount, color: '#00e676' },
            { label: 'Bearish (DOWN)', value: downCount, color: '#ff4d4d' },
            { label: 'High Confidence', value: highConf, color: '#f59e0b' },
          ]}
          isPremium={isAlphaOrHigher}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Alpha for Live Stream + Full History"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <SignalsClient
          initialSignals={visibleSignals}
          isPremium={isAlphaOrHigher}
          totalCount={signals.length}
        />
      </ScrollReveal>
    </div>
  )
}
