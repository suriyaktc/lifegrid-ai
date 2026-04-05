import { motion } from 'framer-motion'

export default function Footer() {
  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'How It Works', href: '#how' },
        { label: 'Live Map', href: '#dashboard' },
        { label: 'Send SOS', href: '#sos' },
        { label: 'Features', href: '#volunteers' },
      ],
    },
    {
      title: 'Network',
      links: [
        { label: 'Volunteer Portal', href: '#' },
        { label: 'NGO Dashboard', href: '#' },
        { label: 'Government API', href: '#' },
        { label: 'Field Reports', href: '#' },
      ],
    },
    {
      title: 'Project',
      links: [
        { label: 'Hackathon Deck', href: '#' },
        { label: 'Tech Architecture', href: '#' },
        { label: 'Open Source', href: '#' },
        { label: 'Contact Team', href: '#' },
      ],
    },
  ]

  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 32px' }}>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--red)', animation: 'pulseDot 1.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
                Life<span style={{ color: 'var(--red)' }}>Grid</span> AI
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>
              Real-time survival intelligence network for India. AI-powered emergency coordination saving lives every second.
            </p>
            <div className="flex gap-2">
              {['𝕏', '⬛', '🐙'].map((icon, i) => (
                <div key={i} style={{
                  width: 32, height: 32, background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, cursor: 'none',
                }} />
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map(link => (
                  <li key={link.label} style={{ marginBottom: 12 }}>
                    <a
                      href={link.href}
                      style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--text)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text2)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Emergency banner */}
        <div
          className="flex items-center justify-between flex-wrap gap-4 p-6 mb-10"
          style={{ border: '1px solid rgba(255,45,45,0.3)', background: 'rgba(255,45,45,0.05)' }}
        >
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--red)', marginBottom: 4 }}>
              In an Emergency?
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              Don't hesitate. Send SOS now — AI + volunteers respond in under 60 seconds.
            </div>
          </div>
          <button
            onClick={() => document.getElementById('sos')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '12px 28px',
              background: 'var(--red)', color: 'white',
              fontFamily: 'Space Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '2px',
              border: 'none', cursor: 'none', textTransform: 'uppercase',
            }}
          >
            🆘 SEND SOS NOW
          </button>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.5px' }}>
            © 2025 LifeGrid AI · Hackathon Project · Built with ❤️ for humanity
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)', animation: 'blink 1s step-end infinite' }} />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: '1px' }}>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)' }}>
              🌍 India-First · Globally Scalable
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
