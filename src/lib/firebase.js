import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

export let db = null
export let auth = null
let app = null

if (apiKey && apiKey !== '' && !apiKey.includes('your_')) {
  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
}

export const initAuth = async () => {
  if (!auth) {
    console.log('Firebase not configured — running in demo mode')
    return
  }
  try {
    await signInAnonymously(auth)
  } catch (err) {
    console.warn('Auth failed:', err.message)
  }
}
