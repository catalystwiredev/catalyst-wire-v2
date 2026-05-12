'use client'
import { FlaskConical, BarChart2, Rocket } from 'lucide-react'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import { LiveBadge } from '@/components/LiveBadge'
import { EarningsTable } from '@/components/tables/EarningsTable'
import { FDAApplicationsTable } from '@/components/tables/FDATable'
import { SecFilingsTable } from '@/components/tables/SecFilingsTable'

interface CalendarData {
  earnings: unknown[]
  fdaApps: unknown[]
  ipoFilings: unknown[]
}

export function CalendarsLive({ initial }: { initial: CalendarData }) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<CalendarData>(
    initial,
    '/api/calendars',
    { intervalMs: 30_000 },
  )

  const earnings = data.earnings ?? []
  const fdaApps = data.fdaApps ?? []
  const ipoFilings = data.ipoFilings ?? []

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 14,
        }}
      >
        <LiveBadge
          isFetching={isFetching}
          lastUpdated={lastUpdated}
          label="Live · 30s"
          color="#0090f0"
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <SectionHeader
          icon={BarChart2}
          title="Upcoming Earnings"
          count={earnings.length}
          color="#f59e0b"
        />
        {earnings.length === 0 ? (
          <EmptyState
            label="No upcoming earnings on the calendar."
            icon={BarChart2}
            color="#f59e0b"
          />
        ) : (
          <EarningsTable earnings={earnings as any} />
        )}
      </div>

      <div style={{ marginBottom: 32 }}>
        <SectionHeader
          icon={FlaskConical}
          title="FDA Applications"
          count={fdaApps.length}
          color="#f472b6"
        />
        {fdaApps.length === 0 ? (
          <EmptyState
            label="No active FDA applications."
            icon={FlaskConical}
            color="#f472b6"
          />
        ) : (
          <FDAApplicationsTable applications={fdaApps as any} />
        )}
      </div>

      <div>
        <SectionHeader
          icon={Rocket}
          title="IPO & S-1 Filings"
          count={ipoFilings.length}
          color="#a78bfa"
        />
        {ipoFilings.length === 0 ? (
          <EmptyState
            label="No recent IPO filings."
            icon={Rocket}
            color="#a78bfa"
          />
        ) : (
          <SecFilingsTable filings={ipoFilings as any} />
        )}
      </div>
    </>
  )
}

// Helper Components
function SectionHeader({
  icon: Icon,
  title,
  count,
  color = 'var(--accent)',
}: {
  icon: React.ElementType
  title: string
  count?: number
  color?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          background: `${color}12`,
          border: `1px solid ${color}28`,
          borderRadius: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 16px ${color}25`,
        }}
      >
        <Icon
          size={18}
          style={{ color, filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: '-0.015em',
          margin: 0,
        }}
      >
        {title}
      </h2>
      {count != null && (
        <span
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 6,
            padding: '2px 9px',
            fontWeight: 600,
          }}
        >
          {count} items
        </span>
      )}
    </div>
  )
}

function EmptyState({
  label,
  icon: Icon,
  color,
}: {
  label: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div
      style={{
        padding: '40px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        background: 'rgba(8,14,26,0.65)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${color}12`,
        borderRadius: 16,
        fontSize: 13,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: `${color}08`,
          border: `1px solid ${color}18`,
          borderRadius: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
        }}
      >
        <Icon size={22} style={{ color, opacity: 0.6 }} />
      </div>
      {label}
    </div>
  )
}
