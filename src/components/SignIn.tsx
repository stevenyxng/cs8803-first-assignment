import { useState } from 'react'
import { signIn } from '../hooks/useAuth'

export function SignIn() {
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    try {
      await signIn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    }
  }

  return (
    <div className="signin">
      <h1>File Storage</h1>
      <p>Sign in to upload and manage your files.</p>
      <button className="primary" onClick={handleClick}>
        Sign in with Google
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
