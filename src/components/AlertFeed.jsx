import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useStore } from '../store/store'

const SEVERITY_STYLE = {
  critical: { color: '#FF2D2D', bg: 'rgba(255,45,45,0.08)', bar: '#FF2D2D', emoji: '🔴' },
  high: { color: '#FF7A00', bg: 'rgba(255,122,0,0.08)', bar: '#FF7A00', emoji: '🟠' },
  medium: { color: '#FFD600', bg: 'rgba(255,214,0,0.08)', bar: '#FFD600', emoji: '🟡' },
  low: { color: '#00FF88', bg: 'rgba(0,255,136,0.08)', bar: '#00FF88', emoji: '🟢' },
}

const TYPE_ICON = { flood: '🌊', fire: '🔥', earthquake: '🌍', medical: '🚑', other: '⚠️' }

export default function AlertFeed() {
  const incidents = useStore(s => s.incidents)
  const [filter, setFilter] = useState('all')
  const listRef = useRef(null)
  const prevCount = useRef(incidents.length)

  const filtered = incidents.filter(i => filter === 'all' ? true : i.severity === filter)

  useEffect(() => {
    if (incidents.length > prevCount.current && listRef.current) {
      listRef.current.scrollTop = 0
    }
    prevCount.current = incidents.length
  }, [incidents.length])

  return (
    <div className="flex flex-col h-full" style={{ height: 480, border: '1px solid var(--border)', background: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)', animation: 'blink 1s step-end infinite' }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text)', letterSpacing: '1px' }}>LIVE FEED</span>
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)' }}>
          {filtered.length} EVENTS
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
        {['all', 'critical', 'high', 'medium'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '4px 10px',
              border: `1px solid ${filter === f ? (SEVERITY_STYLE[f]?.color || 'var(--cyan)') : 'var(--border)'}`,
              background: filter === f ? (SEVERITY_STYLE[f]?.bg || 'rgba(0,212,255,0.08)') : 'transparent',
              color: filter === f ? (SEVERITY_STYLE[f]?.color || 'var(--cyan)') : 'var(--text3)',
              cursor: 'none',
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed list */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full" style={{ color: 'var(--text3)', fontFamily: 'Space Mono, monospace', fontSize: 11 }}>
            NO INCIDENTS FOUND
          </div>
        ) : (
          filtered.map((incident, idx) => {
            const s = SEVERITY_STYLE[incident.severity] || SEVERITY_STYLE.medium
            const timeAgo = (() => {
              try { return formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true }) }
              catch { return 'just now' }
            })()

            return (
              <div
                key={incident.id}
                className="flex relative"
                style={{
                  borderBottom: '1px solid rgba(30,58,80,0.5)',
                  background: idx === 0 ? s.bg : 'transparent',
                  transition: 'background 0.3s',
                  cursor: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = s.bg}
                onMouseLeave={e => e.currentTarget.style.background = idx === 0 ? s.bg : 'transparent'}
              >
                {/* Severity bar */}
                <div style={{ width: 2, background: s.bar, flexShrink: 0 }} />
                <div className="px-3 py-3 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: s.color, letterSpacing: '0.5px' }}>
                      {s.emoji} {TYPE_ICON[incident.type] || '⚠️'} {incident.type?.toUpperCase()} · {incident.severity?.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)' }}>
                      {incident.status === 'resolved' ? '✅' : '🔴'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 2, fontWeight: 500 }}>
                    {incident.location}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, lineHeight: 1.4 }}>
                    {incident.description || 'Emergency reported'}
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)' }}>
                      {timeAgo}
                    </span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)' }}>
                      {incident.respondersAssigned || 0} responders
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
