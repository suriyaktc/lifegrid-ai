import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useStore } from '../store/store'

const SKILL_COLOR = {
  'Medical': 'var(--red)',
  'Search & Rescue': 'var(--orange)',
  'Flood Relief': 'var(--cyan)',
  'First Aid': 'var(--green)',
  'Logistics': 'var(--yellow)',
  'Communication': 'var(--cyan)',
  'Counseling': 'var(--green)',
  'default': 'var(--text3)',
}

function VolunteerCard({ vol, index }) {
  const [deploying, setDeploying] = useState(false)
  const isAvailable = vol.status === 'available'

  const handleDeploy = async () => {
    setDeploying(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(`🚀 ${vol.name} dispatched to nearest incident`)
    setDeploying(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        border: `1px solid ${isAvailable ? 'var(--border)' : 'rgba(30,58,80,0.4)'}`,
        background: 'var(--surface)',
        padding: 24,
        position: 'relative',
        opacity: isAvailable ? 1 : 0.6,
      }}
    >
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: isAvailable ? 'var(--green)' : 'var(--orange)',
              animation: isAvailable ? 'blink 1s step-end infinite' : 'none',
            }}
          />
          <span style={{
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            color: isAvailable ? 'var(--green)' : 'var(--orange)',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {vol.status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--yellow)', fontSize: 12 }}>★</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text2)' }}>{vol.rating}</span>
        </div>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div style={{
          width: 44, height: 44,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          {['👨‍⚕️', '👩‍🚒', '👨‍💼', '👩‍⚕️'][parseInt(vol.id.replace('vol', '')) - 1] || '🧑'}
        </div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            {vol.name}
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            📍 {vol.location}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {vol.skills.map(skill => (
          <span key={skill} style={{
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            color: SKILL_COLOR[skill] || SKILL_COLOR.default,
            border: `1px solid ${SKILL_COLOR[skill] || SKILL_COLOR.default}44`,
            padding: '3px 8px', letterSpacing: '0.5px',
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Response time */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px' }}>RESPONSE TIME</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--cyan)', marginTop: 2 }}>
            {vol.responseTime}
          </div>
        </div>
      </div>

      {/* Deploy button */}
      <button
        onClick={handleDeploy}
        disabled={!isAvailable || deploying}
        style={{
          width: '100%', padding: '10px',
          background: isAvailable ? 'rgba(0,212,255,0.08)' : 'transparent',
          color: isAvailable ? 'var(--cyan)' : 'var(--text3)',
          fontFamily: 'Space Mono, monospace', fontSize: 10,
          letterSpacing: '1px', textTransform: 'uppercase',
          border: `1px solid ${isAvailable ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
          cursor: isAvailable ? 'none' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        {deploying ? '⏳ DISPATCHING...' : isAvailable ? '⚡ DEPLOY NOW' : '✈ ON MISSION'}
      </button>
    </motion.div>
  )
}

export default function VolunteerSection() {
  const volunteers = useStore(s => s.volunteers)
  const [showRegister, setShowRegister] = useState(false)

  const handleRegister = () => {
    toast('👥 Volunteer portal coming soon!', { icon: '🔜' })
    setTimeout(() => toast.success('✅ Added to early access waitlist'), 1000)
  }

  return (
    <section id="volunteers" style={{ padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 80px)', background: 'var(--bg3)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'Space Mono, monospace', fontSize: 10,
                color: 'var(--cyan)', letterSpacing: '2px', textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--cyan)' }} />
              VOLUNTEER NETWORK
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, lineHeight: 1, letterSpacing: -1.5, color: 'var(--text)' }}
            >
              512+ ACTIVE<br />
              <span style={{ color: 'var(--cyan)' }}>RESPONDERS</span>
            </motion.h2>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={handleRegister}
            style={{
              padding: '14px 32px',
              background: 'rgba(0,212,255,0.08)',
              color: 'var(--cyan)',
              fontFamily: 'Space Mono, monospace', fontSize: 11,
              letterSpacing: '2px', textTransform: 'uppercase',
              border: '1px solid rgba(0,212,255,0.4)',
              cursor: 'none', whiteSpace: 'nowrap',
            }}
          >
            + JOIN AS VOLUNTEER
          </motion.button>
        </div>

        {/* Volunteer cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {volunteers.map((vol, i) => (
            <VolunteerCard key={vol.id} vol={vol} index={i} />
          ))}
        </div>

        {/* How It Works */}
        <div id="how" style={{ borderTop: '1px solid var(--border)', paddingTop: 48 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '2px', marginBottom: 32, textTransform: 'uppercase' }}>
            HOW IT WORKS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Citizen Sends SOS', desc: 'One tap to dispatch. Works online, offline via SMS, and on any device.', icon: '📱', color: 'var(--red)' },
              { step: '02', title: 'AI Classifies', desc: 'Claude AI instantly analyzes severity, type, and resources needed.', icon: '🤖', color: 'var(--cyan)' },
              { step: '03', title: 'Volunteers Notified', desc: 'Nearest trained volunteers get real-time alerts with location data.', icon: '🚀', color: 'var(--orange)' },
              { step: '04', title: 'Relief Coordinated', desc: 'NGOs, NDRF, and agencies get unified dashboard view of all incidents.', icon: '🤝', color: 'var(--green)' },
            ].map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ padding: 24, border: '1px solid var(--border)', background: 'var(--surface)', position: 'relative' }}
              >
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 800, color: 'var(--border)', position: 'absolute', top: 12, right: 16, lineHeight: 1 }}>
                  {step.step}
                </div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: step.color, marginBottom: 8 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}
        >
          {[
            { label: 'SOS Dispatched', value: '7,240', color: 'var(--red)' },
            { label: 'Volunteers Deployed', value: '2,300', color: 'var(--cyan)' },
            { label: 'Districts Covered', value: '512', color: 'var(--green)' },
            { label: 'Avg Response', value: '47s', color: 'var(--orange)' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px', marginTop: 4, textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
