import { useState } from 'react'
import type { StoredFile } from '../types'

interface Props {
  files: StoredFile[]
  loading: boolean
  onDelete: (fullPath: string) => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(1)} ${units[unit]}`
}

/** Compact by design — the full timestamp is too long for a narrow screen. */
function formatDate(iso: string): string {
  const d = new Date(iso)
  const sameYear = d.getFullYear() === new Date().getFullYear()
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

export function FileList({ files, loading, onDelete }: Props) {
  const [query, setQuery] = useState('')

  if (loading && files.length === 0) return <p className="empty">Loading…</p>
  if (files.length === 0) return <p className="empty">No files yet.</p>

  // Case-insensitive substring match on the name the user sees, not the path.
  const needle = query.trim().toLowerCase()
  const shown = needle ? files.filter((f) => f.name.toLowerCase().includes(needle)) : files

  return (
    <>
      <div className="file-search">
        <input
          type="search"
          placeholder="Search files"
          aria-label="Search files by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="file-count">
          {needle ? `${shown.length} of ${files.length}` : `${files.length}`}{' '}
          {files.length === 1 ? 'file' : 'files'}
        </span>
      </div>
      {shown.length === 0 ? (
        <p className="empty">No files match “{query.trim()}”.</p>
      ) : (
        <ul className="files">
          {shown.map((f) => (
            <li key={f.fullPath}>
              <div className="file-main">
                <span className="file-name">{f.name}</span>
                <span className="file-meta">
                  {formatSize(f.size)} · {formatDate(f.createdAt)}
                </span>
              </div>
              <div className="file-actions">
                <a className="linkbutton" href={f.url} download={f.name} target="_blank" rel="noreferrer">
                  Download
                </a>
                <button
                  className="danger"
                  onClick={() => {
                    if (confirm(`Delete "${f.name}"? This cannot be undone.`)) {
                      onDelete(f.fullPath)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
