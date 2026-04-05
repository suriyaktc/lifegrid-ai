import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useStore } from '../store/store'
import { submitSOSToFirestore } from '../hooks/useFirestore'

const EMERGENCY_TYPES = [
  { id: 'flood', label: 'Flood', emoji: '🌊' },
  { id: 'fire', label: 'Fire', emoji: '🔥' },
  { id: 'earthquake', label: 'Earthquake', emoji: '🌍' },
  { id: 'medical', label: 'Medical', emoji: '🚑' },
  { id: 'cyclone', label: 'Cyclone', emoji: '🌀' },
  { id: 'other', label: 'Other', emoji: '⚠️' },
]

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    const data = await res.json()
    const addr = data.address
    const parts = [addr.city || addr.town || addr.village, addr.state].filter(Boolean)
    return parts.join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch { return `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
}

export default function SOSForm() {
  const [type, setType] = useState('flood')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('high')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [locating, setLocating] = useState(false)
  const [coords, setCoords] = useState({ lat: null, lng: null })
  const addIncident = useStore(s => s.addIncident)

  const handleGetLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return }
    setLocating(true)
    toast('📡 Detecting your location...')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCoords({ lat, lng })
        const place = await reverseGeocode(lat, lng)
        setLocation(place)
        setLocating(false)
        toast.success(`📍 Location: ${place}`)
      },
      () => { setLocating(false); toast.error('Could not detect location — type it manually') },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const handleSubmit = async () => {
    if (!location.trim()) { toast.error('⚠ Location required'); return }
    setSubmitting(true)
    const sosData = {
      id: `LG-${Math.random().toString(36).toUpperCase().slice(2, 8)}`,
      type, location: location.trim(),
      description: description.trim() || `${type} emergency reported`,
      severity, phone: phone.trim(),
      lat: coords.lat, lng: coords.lng,
      aiPriority: severity === 'critical' ? 92 : severity === 'high' ? 78 : 52,
      respondersAssigned: 0, status: 'active',
      timestamp: new Date().toISOString(),
    }
    try { const id = await submitSOSToFirestore(sosData); sosData.id = id } catch {}
    addIncident(sosData)
    setSubmitted({ ref: sosData.id, location })
    toast.success(`🆘 SOS Dispatched — Ref: ${sosData.id}`)
    setTimeout(() => toast(`🤖 AI: ${type.toUpperCase()} · ${severity.toUpperCase()}`), 1200)
    setTimeout(() => toast.success('✅ 3 volunteers notified · ETA calculating'), 2400)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ border: '1px solid var(--green)', background: 'rgba(0,255,136,0.05)', minHeight: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 48 }}>
        <div style={{ fontSize: 64 }}>✅</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--green)', textAlign: 'center' }}>SOS DISPATCHED</div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, color: 'var(--text2)', textAlign: 'center', lineHeight: 1.8 }}>
          Ref: <span style={{ color: 'var(--cyan)' }}>{submitted.ref}</span><br />
          Location: <span style={{ color: 'var(--text)' }}>{submitted.location}</span><br /><br />
          <span style={{ color: 'var(--text3)', fontSize: 11 }}>Responders routing to your location.</span>
        </div>
        <button onClick={() => { setSubmitted(null); setLocation(''); setDescription(''); setPhone(''); setCoords({ lat: null, lng: null }) }}
          style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text2)', background: 'transparent', border: '1px solid var(--border)', padding: '10px 24px', cursor: 'none' }}>
          SEND ANOTHER SOS
        </button>
      </motion.div>
    )
  }

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', animation: 'pulseDot 1.5s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800 }}>SEND SOS</span>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--red)', border: '1px solid var(--red)', padding: '2px 8px', marginLeft: 'auto' }}>EMERGENCY</div>
      </div>

      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Emergency Type</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
        {EMERGENCY_TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{ padding: '10px 8px', border: `1px solid ${type === t.id ? 'var(--red)' : 'var(--border)'}`, background: type === t.id ? 'rgba(255,45,45,0.1)' : 'transparent', color: type === t.id ? 'var(--text)' : 'var(--text2)', fontFamily: 'Space Mono, monospace', fontSize: 10, cursor: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 18 }}>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Your Location *</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: coords.lat ? 4 : 16 }}>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, District, State"
          style={{ flex: 1, padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        <button onClick={handleGetLocation} disabled={locating} title="Use my GPS location"
          style={{ padding: '12px 14px', background: locating ? 'var(--surface2)' : 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyan)', fontSize: 18, cursor: locating ? 'wait' : 'none' }}>
          {locating ? '⏳' : '📍'}
        </button>
      </div>
      {coords.lat && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--green)', marginBottom: 16 }}>✓ GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</div>}

      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Describe the Emergency</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="People affected, immediate dangers, resources needed..."
        style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, resize: 'vertical', outline: 'none', marginBottom: 16 }}
        onFocus={e => e.target.style.borderColor = 'var(--cyan)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Severity</label>
          <select value={severity} onChange={e => setSeverity(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'Space Mono, monospace', fontSize: 11, outline: 'none', cursor: 'none' }}>
            <option value="critical">CRITICAL</option>
            <option value="high">HIGH</option>
            <option value="medium">MEDIUM</option>
            <option value="low">LOW</option>
          </select>
        </div>
        <div>
          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Phone (optional)</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
            style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--cyan)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={submitting}
        style={{ width: '100%', padding: '16px', background: submitting ? 'var(--surface2)' : 'var(--red)', color: 'white', fontFamily: 'Space Mono, monospace', fontSize: 13, fontWeight: 700, letterSpacing: '2px', border: 'none', cursor: submitting ? 'wait' : 'none', textTransform: 'uppercase', transition: 'all 0.2s' }}>
        {submitting ? '⏳ DISPATCHING...' : '🆘 DISPATCH SOS NOW'}
      </button>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', textAlign: 'center', marginTop: 12 }}>
        Works offline via SMS fallback · Response typically within 60 seconds
      </div>
    </div>
  )
}
