import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    const onMove = (e) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      dot.style.left = (e.clientX - 6) + 'px'
      dot.style.top = (e.clientY - 6) + 'px'
    }

    const animate = () => {
      const { mx, my, rx, ry } = pos.current
      pos.current.rx = rx + (mx - rx - 18) * 0.12
      pos.current.ry = ry + (my - ry - 18) * 0.12
      ring.style.left = pos.current.rx + 'px'
      ring.style.top = pos.current.ry + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const grow = () => {
      dot.style.transform = 'scale(2.5)'
      ring.style.transform = 'scale(1.5)'
      ring.style.opacity = '1'
      ring.style.borderColor = 'var(--red)'
    }
    const shrink = () => {
      dot.style.transform = 'scale(1)'
      ring.style.transform = 'scale(1)'
      ring.style.opacity = '0.6'
      ring.style.borderColor = 'var(--cyan)'
    }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[role="button"]').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full mix-blend-screen"
        style={{ background: 'var(--red)', transition: 'transform 0.1s' }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] w-9 h-9 rounded-full"
        style={{
          border: '1px solid var(--cyan)',
          opacity: 0.6,
          transition: 'transform 0.15s, opacity 0.15s, border-color 0.2s',
        }}
      />
    </>
  )
}
