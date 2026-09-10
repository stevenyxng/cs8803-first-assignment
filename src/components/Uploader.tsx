import { useRef, useState } from 'react'
import type { UploadProgress } from '../types'

interface Props {
  uploads: UploadProgress[]
  onUpload: (file: File) => void
  onDismiss: (id: string) => void
}

export function Uploader({ uploads, onUpload, onDismiss }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(list: FileList | null) {
    if (!list) return
    Array.from(list).forEach(onUpload)
  }

  return (
    <section>
      {/* A real <button> so it is keyboard-reachable and announced correctly;
          the drag handlers are additive for pointer devices. */}
      <button
        type="button"
        className={dragging ? 'dropzone dragging' : 'dropzone'}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        <strong>Add files</strong>
        <span>25 MB max per file</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files)
          // Reset so picking the same file twice in a row still fires onChange.
          e.target.value = ''
        }}
      />

      {uploads.length > 0 && (
        <ul className="uploads">
          {uploads.map((u) => (
            <li key={u.id}>
              <div className="uploads-row">
                <span className="uploads-name">{u.name}</span>
                {u.error ? (
                  <button onClick={() => onDismiss(u.id)}>Dismiss</button>
                ) : (
                  <span className="uploads-pct">{u.percent}%</span>
                )}
              </div>
              {u.error ? (
                <span className="error">{u.error}</span>
              ) : (
                <progress value={u.percent} max={100} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
