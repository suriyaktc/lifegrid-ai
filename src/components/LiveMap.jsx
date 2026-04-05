import { useEffect, useRef } from 'react'
import { useStore } from '../store/store'

const SEVERITY_COLOR = { critical: '#FF2D2D', high: '#FF7A00', medium: '#FFD600', low: '#00FF88' }
const TYPE_EMOJI = { flood: '🌊', fire: '🔥', earthquake: '🌍', medical: '🚑', other: '⚠️' }

export default function LiveMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef({})
  const incidents = useStore(s => s.incidents)
  const setSelected = useStore(s => s.setSelectedIncident)

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return
    import('leaflet').then(({ default: L }) => {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current, { center: [20.5937, 78.9629], zoom: 5, zoomControl: false, attributionControl: false })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      incidents.forEach(inc => { if (inc.lat && inc.lng) addMarker(L, map, inc) })
      mapInstance.current = map
      mapInstance.current._L = L
    })
    return () => { mapInstance.current?.remove(); mapInstance.current = null }
  }, [])

  useEffect(() => {
    if (!mapInstance.current?._L) return
    const L = mapInstance.current._L
    incidents.forEach(inc => {
      if (!inc.lat || !inc.lng || markersRef.current[inc.id]) return
      addMarker(L, mapInstance.current, inc)
    })
  }, [incidents])

  function addMarker(L, map, incident) {
    const color = SEVERITY_COLOR[incident.severity] || '#00D4FF'
    const emoji = TYPE_EMOJI[incident.type] || '⚠️'
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;box-shadow:0 0 0 4px ${color}33,0 0 16px ${color}88;animation:pulseDot 1.5s ease-in-out infinite;cursor:pointer;"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    })
    const marker = L.marker([incident.lat, incident.lng], { icon }).addTo(map)
      .bindPopup(`<div style="font-family:Space Mono,monospace;padding:10px;background:#112233;border:1px solid #1E3A50;min-width:200px;color:#E8F4FF;"><div style="color:${color};font-size:10px;letter-spacing:1px;margin-bottom:6px;">${emoji} ${(incident.type||'').toUpperCase()} · ${(incident.severity||'').toUpperCase()}</div><div style="font-size:13px;margin-bottom:4px;">${incident.location}</div><div style="color:#7AABC5;font-size:11px;">${incident.description||'Emergency reported'}</div><div style="color:#3D6A8A;font-size:9px;margin-top:8px;">${incident.respondersAssigned||0} responders</div></div>`, { className: 'lifegrid-popup' })
    marker.on('click', () => setSelected(incident))
    markersRef.current[incident.id] = marker
  }

  return (
    <div style={{ position: 'relative', height: 480, border: '1px solid var(--border)' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(5,10,14,0.9)', border: '1px solid var(--border)', padding: '4px 10px', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--green)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'blink 1s step-end infinite' }} />
        LIVE — {incidents.filter(i => i.status === 'active').length} ACTIVE
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000, background: 'rgba(5,10,14,0.9)', border: '1px solid var(--border)', padding: 12 }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text3)', letterSpacing: '1px', marginBottom: 8 }}>SEVERITY</div>
        {Object.entries(SEVERITY_COLOR).map(([level, color]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text2)', textTransform: 'uppercase' }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
