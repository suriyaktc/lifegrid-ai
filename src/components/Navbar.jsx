import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/store'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const networkStatus = useStore(s => s.networkStatus)
  const stats = useStore(s => s.stats)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Send SOS', href: '#sos' },
    { label: 'Volunteers', href: '#volunteers' },
    { label: 'How It Works', href: '#how' },
  ]

  return (
    <>
      {networkStatus === 'offline' && (
        <div className="fixed top-0 left-0 right-0 z-[1100] bg-[var(--orange)] text-black font-mono text-xs text-center py-1 tracking-widest">
          ⚠ OFFLINE — SMS FALLBACK ACTIVE — SOS STILL WORKS
        </div>
      )}
      <nav
        className={`fixed left-0 right-0 z-[1000] flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${networkStatus === 'offline' ? 'top-6' : 'top-0'}`}
        style={{
          background: scrolled ? 'rgba(5,10,14,0.95)' : 'rgba(5,10,14,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: 'var(--red)',
                boxShadow: '0 0 0 0 var(--red-glow)',
                animation: 'pulseDot 1.5s ease-in-out infinite',
              }}
            />
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>
              Life<span style={{ color: 'var(--red)' }}>Grid</span> AI
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {links.map(l => (
            <li key={l.label}>
              <a
                href={l.href}
                style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text2)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1.5px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--text2)'}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5" style={{ border: '1px solid var(--border)', background: 'rgba(0,255,136,0.05)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)', animation: 'blink 1s step-end infinite' }} />
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: '1px' }}>
              {stats.activeIncidents} ACTIVE
            </span>
          </div>

          <button
            onClick={() => document.getElementById('sos')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative overflow-hidden group"
            style={{
              background: 'var(--red)',
              color: 'white',
              fontFamily: 'Space Mono, monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '2px',
              padding: '10px 20px',
              border: 'none',
              textTransform: 'uppercase',
              cursor: 'none',
            }}
          >
            <span className="relative z-10">SOS ▲</span>
            <span
              className="absolute inset-0 bg-white"
              style={{ transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scaleX(1)'}
            />
          </button>
        </div>
      </nav>
    </>
  )
}
