import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/store'

function Counter({ target, suffix = '', duration = 2000 }) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    const step = () => {
      if (!startRef.current) startRef.current = performance.now()
      const elapsed = performance.now() - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const timer = setTimeout(() => requestAnimationFrame(step), 800)
    return () => clearTimeout(timer)
  }, [target])

  const display = value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value

  return <>{display}{suffix}</>
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden" style={{ paddingTop: 100, paddingBottom: 80, paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: 'clamp(24px, 5vw, 80px)' }}>
      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
      }} />

      {/* Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'rgba(255,45,45,0.07)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-50px] left-[-50px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'rgba(0,212,255,0.05)', filter: 'blur(80px)' }} />

      {/* Scanning line */}
      <div className="absolute left-0 right-0 h-px pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
        opacity: 0.3,
        animation: 'scan 6s linear infinite',
      }} />

      <div className="relative z-10 max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5"
          style={{ border: '1px solid var(--border)', background: 'rgba(0,212,255,0.05)', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--cyan)', letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)', animation: 'blink 1s step-end infinite' }} />
          INDIA · REAL-TIME EMERGENCY AI · OPERATIONAL
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(52px, 8vw, 100px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-3px', marginBottom: 32 }}
        >
          WHEN
          <br />
          <span style={{ color: 'var(--red)' }}>SECONDS</span>
          <br />
          <span style={{ WebkitTextStroke: '1px var(--text3)', color: 'transparent' }}>MATTER MOST</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: 48, fontWeight: 300 }}
        >
          AI-powered emergency response network connecting citizens, volunteers, and responders in real-time. Send SOS, track incidents, coordinate relief — even offline.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 items-center mb-20"
        >
          <button
            onClick={() => document.getElementById('sos')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative overflow-hidden flex items-center gap-3"
            style={{ background: 'var(--red)', color: 'white', fontFamily: 'Space Mono, monospace', fontSize: 12, fontWeight: 700, letterSpacing: '2px', padding: '16px 32px', border: 'none', cursor: 'none', textTransform: 'uppercase' }}
          >
            🆘 SEND SOS NOW
          </button>
          <button
            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'transparent', color: 'var(--cyan)', fontFamily: 'Space Mono, monospace', fontSize: 12, letterSpacing: '2px', padding: '16px 32px', border: '1px solid var(--border)', cursor: 'none', textTransform: 'uppercase' }}
          >
            LIVE MAP →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { id: 'incidents', label: 'Active Incidents', target: 47, suffix: '+', color: 'var(--red)' },
            { id: 'volunteers', label: 'Volunteers Online', target: 312, suffix: '+', color: 'var(--cyan)' },
            { id: 'lives', label: 'Lives Helped', target: 14200, suffix: '', color: 'var(--green)' },
            { id: 'response', label: 'Avg Response (s)', target: 47, suffix: 's', color: 'var(--orange)' },
          ].map(stat => (
            <div key={stat.id} className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1px', marginTop: 8, textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '2px' }}>SCROLL</div>
        <div className="w-px h-12" style={{ background: 'linear-gradient(var(--cyan), transparent)' }} />
      </div>
    </section>
  )
}
