import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// These values are compiled into the client bundle and are public by design.
// The Firebase web config identifies the project; it does not grant access.
// Authorization is enforced by storage.rules.
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

export const auth = getAuth(app)
export const storage = getStorage(app)

// In dev, talk to the local emulator suite so nothing touches the real
// bucket (and so no billing-enabled project is needed to work on the UI).
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}
