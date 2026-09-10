import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  // Starts true so the app shows a spinner instead of flashing the sign-in
  // screen on every reload while Firebase restores the persisted session.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  return { user, loading }
}

export async function signIn() {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider())
  } catch (err) {
    // The user closing the popup is a normal outcome, not an error worth
    // surfacing. Anything else is.
    const code = (err as { code?: string }).code
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
    throw err
  }
}

export function signOutUser() {
  return signOut(auth)
}
