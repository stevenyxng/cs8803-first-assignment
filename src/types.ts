/** A file already stored in Cloud Storage, flattened for display. */
export interface StoredFile {
  /** Full Storage path, e.g. users/abc123/uuid-report.pdf — used to delete. */
  fullPath: string
  /** Original filename as the user chose it. */
  name: string
  size: number
  contentType: string
  createdAt: string
  url: string
}

/** An upload currently in flight, keyed by a client-generated id. */
export interface UploadProgress {
  id: string
  name: string
  /** 0–100. */
  percent: number
  error?: string
}
