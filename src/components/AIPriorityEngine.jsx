import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/store'

const PRIORITY_COLOR = (score) => {
  if (score >= 85) return '#FF2D2D'
  if (score >= 65) return '#FF7A00'
  if (score >= 40) return '#FFD600'
  return '#00FF88'
}

const PRIORITY_LABEL = (score) => {
  if (score >= 85) return 'CRITICAL'
  if (score >= 65) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

export default function AIPriorityEngine() {
  const incidents = useStore(s => s.incidents)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (!input.trim()) return
    setAnalyzing(true)
    setResult(null)
    setError(null)

    const apiKey = import.meta.env.VITE_ANTHROPIC_KEY

    if (!apiKey) {
      // Demo mode — simulate AI response
      await new Promise(r => setTimeout(r, 1800))
      const mockScore = 55 + Math.floor(Math.random() * 40)
      setResult({
        score: mockScore,
        type: 'flood',
        severity: PRIORITY_LABEL(mockScore).toLowerCase(),
        resources: ['Medical Team', 'Water Rescue Unit', 'NDRF'],
        eta: Math.floor(Math.random() * 30) + 10,
        summary: `AI analysis complete (demo mode). Based on the description, this appears to be a ${PRIORITY_LABEL(mockScore).toLowerCase()} priority emergency requiring immediate coordination. Recommend deploying nearest available volunteer units.`,
        actions: ['Notify nearest 3 volunteers', 'Alert district NDRF unit', 'Coordinate with local police', 'Set up relief camp'],
      })
      setAnalyzing(false)
      return
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are LifeGrid AI's emergency triage engine for India. Analyze emergency SOS reports and return ONLY a valid JSON object (no markdown, no preamble) with this exact structure:
{
  "score": <0-100 priority score>,
  "type": "<flood|fire|earthquake|medical|cyclone|other>",
  "severity": "<critical|high|medium|low>",
  "resources": ["<resource1>", "<resource2>", "<resource3>"],
  "eta": <estimated response time in minutes>,
  "summary": "<2-sentence AI assessment>",
  "actions": ["<action1>", "<action2>", "<action3>", "<action4>"]
}`,
          messages: [{ role: 'user', content: `Analyze this emergency: ${input}` }],
        }),
      })

      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
    } catch (err) {
      setError('AI engine unavailable — check VITE_ANTHROPIC_KEY in .env.local')
    }
    setAnalyzing(false)
  }

  const topIncidents = incidents
    .filter(i => i.status === 'active')
    .sort((a, b) => (b.aiPriority || 0) - (a.aiPriority || 0))
    .slice(0, 4)

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>AI PRIORITY ENGINE</span>
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--green)', border: '1px solid rgba(0,255,136,0.3)', padding: '3px 10px', letterSpacing: '1px' }}>
          CLAUDE SONNET
        </div>
      </div>

      {/* Input */}
      <div>
        <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
          Describe Emergency for AI Triage
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
          placeholder="e.g. Flash flood in Wayanad district, 200 families trapped, water rising 2ft per hour, no road access..."
          style={{
            width: '100%', padding: '12px 14px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'DM Sans, sans-serif',
            fontSize: 14, resize: 'vertical', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          onClick={analyze}
          disabled={analyzing || !input.trim()}
          style={{
            marginTop: 10, width: '100%', padding: '13px',
            background: analyzing ? 'var(--surface2)' : 'rgba(0,212,255,0.1)',
            color: analyzing ? 'var(--text3)' : 'var(--cyan)',
            fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: '2px', border: `1px solid ${analyzing ? 'var(--border)' : 'var(--cyan)'}`,
            cursor: analyzing ? 'wait' : 'none', textTransform: 'uppercase', transition: 'all 0.2s',
          }}
        >
          {analyzing ? '⚡ ANALYZING...' : '⚡ ANALYZE WITH AI'}
        </button>
        {!import.meta.env.VITE_ANTHROPIC_KEY && (
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', marginTop: 6, letterSpacing: '0.5px' }}>
            Demo mode — add VITE_ANTHROPIC_KEY for real AI analysis
          </div>
        )}
      </div>

      {/* AI Result */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: 12, background: 'rgba(255,45,45,0.08)', border: '1px solid rgba(255,45,45,0.3)', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--red)', letterSpacing: '0.5px' }}>
            ⚠ {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ border: `1px solid ${PRIORITY_COLOR(result.score)}44`, background: `${PRIORITY_COLOR(result.score)}08`, padding: 20 }}
          >
            {/* Score */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px', marginBottom: 4 }}>AI PRIORITY SCORE</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 800, color: PRIORITY_COLOR(result.score), lineHeight: 1 }}>
                  {result.score}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 18, fontWeight: 700, color: PRIORITY_COLOR(result.score), letterSpacing: '2px' }}>
                  {PRIORITY_LABEL(result.score)}
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text2)', marginTop: 4 }}>
                  ETA: ~{result.eta} min
                </div>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ height: 3, background: 'var(--border)', marginBottom: 16 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: PRIORITY_COLOR(result.score) }}
              />
            </div>

            {/* Summary */}
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>{result.summary}</p>

            {/* Resources */}
            <div className="mb-4">
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px', marginBottom: 8 }}>RECOMMENDED RESOURCES</div>
              <div className="flex flex-wrap gap-2">
                {result.resources?.map((r, i) => (
                  <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.3)', padding: '3px 10px', letterSpacing: '0.5px' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px', marginBottom: 8 }}>RECOMMENDED ACTIONS</div>
              {result.actions?.map((a, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div style={{ width: 4, height: 4, background: PRIORITY_COLOR(result.score), borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{a}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Priority Queue */}
      <div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
          LIVE PRIORITY QUEUE
        </div>
        {topIncidents.map((inc, idx) => {
          const color = PRIORITY_COLOR(inc.aiPriority || 50)
          return (
            <div key={inc.id} className="flex items-center gap-3 mb-3">
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', width: 16 }}>#{idx + 1}</div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{inc.location}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: color, fontWeight: 700 }}>{inc.aiPriority || 50}</span>
                </div>
                <div style={{ height: 2, background: 'var(--border)', borderRadius: 1 }}>
                  <div style={{ width: `${inc.aiPriority || 50}%`, height: '100%', background: color, borderRadius: 1, transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
