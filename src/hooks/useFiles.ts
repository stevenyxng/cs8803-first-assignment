import { useCallback, useEffect, useState } from 'react'
import {
  ref,
  listAll,
  getMetadata,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage'
import type { User } from 'firebase/auth'
import { storage } from '../lib/firebase'
import type { StoredFile, UploadProgress } from '../types'

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

/**
 * Owns every Cloud Storage call in the app. Components render what it returns
 * and call back into it; they never touch the SDK directly. Keeping it in one
 * place means Uploader and FileList share a single source of truth without
 * prop-threading, and any rules denial surfaces from one file.
 */
export function useFiles(user: User | null) {
  const [files, setFiles] = useState<StoredFile[]>([])
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setFiles([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      // listAll on a prefix with no objects returns an empty list, not an error.
      const res = await listAll(ref(storage, `users/${user.uid}`))
      const items = await Promise.all(
        res.items.map(async (item): Promise<StoredFile> => {
          const [meta, url] = await Promise.all([getMetadata(item), getDownloadURL(item)])
          return {
            fullPath: item.fullPath,
            // Fall back to the path segment for anything uploaded without
            // our customMetadata (e.g. added by hand in the console).
            name: meta.customMetadata?.originalName ?? item.name,
            size: meta.size,
            contentType: meta.contentType ?? 'application/octet-stream',
            createdAt: meta.timeCreated,
            url,
          }
        }),
      )
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      setFiles(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your files.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const upload = useCallback(
    (file: File) => {
      if (!user) return

      const id = crypto.randomUUID()

      // Checked here for a fast, clear message; storage.rules enforces the
      // same limit server-side, which is what actually matters.
      if (file.size >= MAX_UPLOAD_BYTES) {
        setUploads((prev) => [
          ...prev,
          { id, name: file.name, percent: 0, error: 'File is larger than the 25 MB limit.' },
        ])
        return
      }

      // The uuid prefix keeps a re-upload of the same filename from silently
      // overwriting the earlier one; the real name rides along in metadata.
      const path = `users/${user.uid}/${id}-${file.name}`
      const task = uploadBytesResumable(ref(storage, path), file, {
        contentType: file.type || 'application/octet-stream',
        customMetadata: { originalName: file.name },
      })

      setUploads((prev) => [...prev, { id, name: file.name, percent: 0 }])

      task.on(
        'state_changed',
        (snap) => {
          const percent = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, percent } : u)))
        },
        (err) => {
          // Keep the row so the user can see which file failed and why.
          setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, error: err.message } : u)),
          )
        },
        () => {
          setUploads((prev) => prev.filter((u) => u.id !== id))
          void refresh()
        },
      )
    },
    [user, refresh],
  )

  const dismissUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const remove = useCallback(
    async (fullPath: string) => {
      setError(null)
      try {
        await deleteObject(ref(storage, fullPath))
        await refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete that file.')
      }
    },
    [refresh],
  )

  return { files, uploads, loading, error, upload, remove, refresh, dismissUpload }
}
