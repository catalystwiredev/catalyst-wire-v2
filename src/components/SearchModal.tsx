'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search,
  X,
  ArrowRight,
  TrendingUp,
  FileText,
  Newspaper,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

interface Hit {
  id: string
  title?: string
  ticker?: string
  description?: string
  url?: string
  type?: string
}

const QUICK_LINKS = [
  { href: '/live-catalysts', label: 'Live Catalysts', icon: TrendingUp },
  { href: '/news', label: 'News Feed', icon: Newspaper },
  { href: '/sec-filings', label: 'SEC Filings', icon: FileText },
  { href: '/glossary', label: 'Glossary', icon: BookOpen },
]

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setHits([])
    }
  }, [open])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setHits([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setHits(data.hits ?? [])
    } catch {
      setHits([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => doSearch(v), 280)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          margin: '0 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Search
            size={16}
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search tickers, filings, news, terms…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: 'var(--text-primary)',
              caretColor: 'var(--accent)',
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setHits([])
                inputRef.current?.focus()
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
              }}
            >
              <X size={15} />
            </button>
          )}
          <kbd
            onClick={onClose}
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 5,
              padding: '2px 7px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            ESC
          </kbd>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading && (
            <div
              style={{
                padding: '20px 18px',
                color: 'var(--text-muted)',
                fontSize: 13,
              }}
            >
              Searching…
            </div>
          )}

          {!loading && query && hits.length === 0 && (
            <div
              style={{
                padding: '20px 18px',
                color: 'var(--text-muted)',
                fontSize: 13,
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && hits.length > 0 && (
            <div style={{ padding: '8px 0' }}>
              <div
                style={{
                  padding: '6px 18px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Results
              </div>
              {hits.slice(0, 8).map((hit) => (
                <Link
                  key={hit.id}
                  href={hit.url ?? `/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 18px',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--bg-elevated)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Search size={13} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hit.title ?? hit.ticker ?? 'Untitled'}
                    </div>
                    {hit.description && (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 2,
                        }}
                      >
                        {hit.description}
                      </div>
                    )}
                  </div>
                  <ArrowRight
                    size={13}
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                  />
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div style={{ padding: '8px 0' }}>
              <div
                style={{
                  padding: '6px 18px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Quick Links
              </div>
              {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 18px',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--bg-elevated)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'var(--accent)18',
                      border: '1px solid var(--accent)30',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {label}
                  </span>
                  <ArrowRight
                    size={13}
                    style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 16,
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <span>
            <kbd
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '1px 6px',
                fontFamily: 'monospace',
                fontSize: 10,
              }}
            >
              ↑↓
            </kbd>{' '}
            navigate
          </span>
          <span>
            <kbd
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '1px 6px',
                fontFamily: 'monospace',
                fontSize: 10,
              }}
            >
              ↵
            </kbd>{' '}
            select
          </span>
          <span>
            <kbd
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '1px 6px',
                fontFamily: 'monospace',
                fontSize: 10,
              }}
            >
              ESC
            </kbd>{' '}
            close
          </span>
        </div>
      </div>
    </div>
  )
}
