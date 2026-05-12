'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Lock,
  Wifi,
  WifiOff,
  AlertTriangle,
} from 'lucide-react'
import type { Signal } from '@/lib/azure-db'
import {
  useSignalStream,
  type SignalEvent,
  type PubSubStatus,
} from '@/lib/pubsub-client'

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 0) return 'just now'
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function StatusPill({ status }: { status: PubSubStatus }) {
  const map = {
    idle: { Icon: WifiOff, color: '#6a84a0', text: 'Offline' },
    connecting: { Icon: Wifi, color: '#f59e0b', text: 'Connecting…' },
    connected: { Icon: Wifi, color: '#00e676', text: 'Live' },
    error: { Icon: AlertTriangle, color: '#ff4d4d', text: 'Error' },
  } as const

  const { Icon, color, text } = map[status]
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        background: `${color}10`,
        border: `1px solid ${color}25`,
        borderRadius: 6,
        padding: '4px 9px',
      }}
    >
      <Icon size={11} /> {text}
    </div>
  )
}

interface RowSignal {
  id: string
  symbol: string
  ts: string
  direction: 'UP' | 'DOWN'
  confidence: number
  last_price: number
  mean_target: number
  pct_change: number
  bull_range: number
  bear_range: number
}

function toRow(s: Signal | SignalEvent): RowSignal {
  return {
    id: s.id,
    symbol: s.symbol,
    ts: s.ts,
    direction: s.direction,
    confidence: s.confidence,
    last_price: s.last_price,
    mean_target: s.mean_target,
    pct_change: s.pct_change,
    bull_range: s.bull_range,
    bear_range: s.bear_range,
  }
}

interface SignalsClientProps {
  initialSignals: Signal[]
  isPremium: boolean
  totalCount: number
}

export function SignalsClient({
  initialSignals,
  isPremium,
  totalCount,
}: SignalsClientProps) {
  const { status, signals: liveSignals } = useSignalStream(50)

  const rows: RowSignal[] = useMemo(() => {
    const seen = new Set<string>()
    const out: RowSignal[] = []

    for (const s of liveSignals) {
      if (!seen.has(s.id)) {
        seen.add(s.id)
        out.push(toRow(s))
      }
    }

    for (const s of initialSignals) {
      if (!seen.has(s.id)) {
        seen.add(s.id)
        out.push(toRow(s))
      }
    }

    return out
  }, [liveSignals, initialSignals])

  const lockedCount = isPremium ? 0 : Math.max(0, totalCount - rows.length)

  return (
    <div
      style={{
        background: 'rgba(8,14,26,0.70)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          padding: '14px 20px',
          background: 'rgba(4,8,18,0.60)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.10em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            Live Signals · {rows.length}
          </span>
        </div>

        {isPremium ? (
          <StatusPill status={status} />
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: '#6a84a0',
              fontWeight: 600,
            }}
          >
            <Lock size={11} /> Live stream — Alpha tier
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontSize: 14, marginBottom: 6 }}>No signals yet</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            The harvester runs every minute. New signals will appear
            automatically.
          </div>
        </div>
      ) : (
        <table
          className="data-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Symbol
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Direction
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Confidence
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Last
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Target
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Δ%
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Range
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                When
              </th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const dirColor = s.direction === 'UP' ? '#00e676' : '#ff4d4d'
              const DirIcon = s.direction === 'UP' ? TrendingUp : TrendingDown
              return (
                <tr
                  key={s.id}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {s.symbol}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 12,
                        fontWeight: 700,
                        color: dirColor,
                        background: `${dirColor}12`,
                        border: `1px solid ${dirColor}28`,
                        borderRadius: 6,
                        padding: '3px 9px',
                      }}
                    >
                      <DirIcon size={11} /> {s.direction}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color:
                        s.confidence >= 70
                          ? '#f59e0b'
                          : 'var(--text-secondary)',
                      textShadow:
                        s.confidence >= 70
                          ? '0 0 10px rgba(245,158,11,0.4)'
                          : 'none',
                    }}
                  >
                    {s.confidence}%
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                    }}
                  >
                    ${s.last_price.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      color: dirColor,
                    }}
                  >
                    ${s.mean_target.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      color: dirColor,
                      fontWeight: 600,
                    }}
                  >
                    {s.pct_change >= 0 ? '+' : ''}
                    {s.pct_change.toFixed(3)}%
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}
                  >
                    ${s.bear_range.toFixed(2)}–${s.bull_range.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {relTime(s.ts)}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <Link
                      href={`/charts/${s.symbol}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: 'rgba(167,139,250,0.10)',
                        border: '1px solid rgba(167,139,250,0.25)',
                        color: '#a78bfa',
                        textDecoration: 'none',
                      }}
                    >
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {lockedCount > 0 && (
        <div
          style={{
            padding: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background:
              'linear-gradient(180deg, rgba(8,14,26,0.4) 0%, rgba(8,14,26,0.85) 100%)',
            textAlign: 'center',
          }}
        >
          <Lock
            size={20}
            style={{ color: '#a78bfa', marginBottom: 10, opacity: 0.7 }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            {lockedCount} more signals + live stream
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              marginBottom: 14,
            }}
          >
            Upgrade to Alpha for full feed access and real-time WebSocket
            updates.
          </div>
          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              color: '#fff',
              padding: '9px 18px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(167,139,250,0.30)',
            }}
          >
            Unlock Alpha <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  )
}
