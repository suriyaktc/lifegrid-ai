import { useEffect, useRef } from 'react'
import { collection, onSnapshot, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useStore } from '../store/store'

export const useFirestoreIncidents = () => {
  const addIncident = useStore(s => s.addIncident)
  const unsubRef = useRef(null)

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'incidents'),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
      unsubRef.current = onSnapshot(q, (snap) => {
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data()
            addIncident({
              id: change.doc.id,
              ...data,
              timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
            })
          }
        })
      }, (err) => {
        console.warn('Firestore unavailable, running in demo mode:', err.message)
      })
    } catch (err) {
      console.warn('Firebase not configured, running in demo mode')
    }

    return () => unsubRef.current?.()
  }, [])
}

export const submitSOSToFirestore = async (sosData) => {
  try {
    const docRef = await addDoc(collection(db, 'incidents'), {
      ...sosData,
      timestamp: serverTimestamp(),
      status: 'active',
    })
    return docRef.id
  } catch (err) {
    console.warn('Firestore write failed, using local state:', err.message)
    return `LOCAL-${Math.random().toString(36).toUpperCase().slice(2, 8)}`
  }
}
