import { useAuth, signOutUser } from './hooks/useAuth'
import { useFiles } from './hooks/useFiles'
import { SignIn } from './components/SignIn'
import { Uploader } from './components/Uploader'
import { FileList } from './components/FileList'

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const { files, uploads, loading, error, upload, remove, dismissUpload } = useFiles(user)

  if (authLoading) return <div className="center muted">Loading…</div>
  if (!user) return <SignIn />

  return (
    <div className="app">
      <header>
        <h1>File Storage</h1>
        <div className="who">
          <span className="muted">{user.email}</span>
          <button onClick={() => void signOutUser()}>Sign out</button>
        </div>
      </header>

      <Uploader uploads={uploads} onUpload={upload} onDismiss={dismissUpload} />

      {error && <p className="error">{error}</p>}

      <FileList files={files} loading={loading} onDelete={(p) => void remove(p)} />
    </div>
  )
}
