import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import LiveMap from './components/LiveMap'
import AlertFeed from './components/AlertFeed'
import SOSForm from './components/SOSForm'
import AIPriorityEngine from './components/AIPriorityEngine'
import VolunteerSection from './components/VolunteerSection'
import Footer from './components/Footer'
import { useFirestoreIncidents } from './hooks/useFirestore'
import { initAuth } from './lib/firebase'
import { useStore } from './store/store'

function HomePage() {
  useFirestoreIncidents()

  return (
    <main>
      <Hero />
      <section id="dashboard" className="py-16 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
          <div className="xl:col-span-2">
            <LiveMap />
          </div>
          <div>
            <AlertFeed />
          </div>
        </div>
      </section>
      <section id="sos" className="py-16 px-6 md:px-12 lg:px-20 bg-[var(--bg2)]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 max-w-[1400px] mx-auto">
          <SOSForm />
          <AIPriorityEngine />
        </div>
      </section>
      <VolunteerSection />
      <Footer />
    </main>
  )
}

export default function App() {
  const setNetworkStatus = useStore(s => s.setNetworkStatus)

  useEffect(() => {
    initAuth()
    const handleOffline = () => setNetworkStatus('offline')
    const handleOnline = () => setNetworkStatus('online')
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return (
    <BrowserRouter>
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: '"Space Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.5px',
          },
          duration: 4000,
        }}
      />
    </BrowserRouter>
  )
}
