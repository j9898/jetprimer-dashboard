'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface Document {
  id: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  document_type: string
  status: 'pending' | 'verified' | 'rejected'
  admin_note: string | null
  uploaded_at: string
  reviewed_at: string | null
}

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const FileIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType === 'application/pdf') {
    return (
      <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/>
        <path d="M8 16h1.5v-1.5h1c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H8v4.5zm1.5-3h1v1h-1v-1zm4.5 3h1.5v-1.5h.5v-1h-.5v-1h.5v-1h-1.5v4.5zm-2.5 0c.55 0 1-.45 1-1v-2.5c0-.55-.45-1-1-1H10v4.5h1.5zm0-3.5v2.5H10v-2.5h1.5z"/>
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
  )
}

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const documentTypeOptions = ['passport', 'id_card', 'address_proof', 'business', 'other'] as const

export default function DocumentList() {
  const t = useTranslations('documents')
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedType, setSelectedType] = useState<string>('other')
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpload = async (file: File) => {
    setError(null)

    // Client-side validation
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError(t('fileTooLarge'))
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
    if (!allowedTypes.includes(file.type)) {
      setError(t('invalidFileType'))
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', selectedType)

      setUploadProgress(30)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      setUploadProgress(80)

      const data = await response.json()

      if (data.success) {
        setDocuments(prev => [data.document, ...prev])
        setUploadProgress(100)
        setTimeout(() => {
          setUploadProgress(0)
          setIsUploading(false)
        }, 500)
      } else {
        setError(data.error || t('uploadFailed'))
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (err) {
      console.error('Upload failed:', err)
      setError(t('uploadFailed'))
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id: string) => {
    const docToDelete = documents.find(d => d.id === id)
    setDocuments(prev => prev.filter(d => d.id !== id))

    try {
      const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!data.success && docToDelete) {
        setDocuments(prev => [...prev, docToDelete])
      }
    } catch (err) {
      console.error('Failed to delete document:', err)
      if (docToDelete) {
        setDocuments(prev => [...prev, docToDelete])
      }
    }
  }

  const handleDownload = async (id: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`)
      const data = await response.json()
      if (data.success && data.url) {
        const link = document.createElement('a')
        link.href = data.url
        link.download = fileName
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.click()
      }
    } catch (err) {
      console.error('Failed to download document:', err)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    pending: { label: t('statusPending'), bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
    verified: { label: t('statusVerified'), bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    rejected: { label: t('statusRejected'), bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' },
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="text-sky-500">📎</span>
            {t('title')}
          </h2>
          <span className="text-sm text-slate-400">
            {documents.length} {t('filesCount')}
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="px-4 py-4 border-b border-slate-100">
        {/* Document Type Selector */}
        <div className="mb-3">
          <label className="text-xs text-slate-500 mb-1.5 block">{t('documentType')}</label>
          <div className="flex flex-wrap gap-1.5">
            {documentTypeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                  selectedType === type
                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-medium'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {t(`types.${type}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-sky-400 bg-sky-50'
              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.heic"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-3">
              <div className="animate-spin mx-auto rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent" />
              <p className="text-sm text-sky-600 font-medium">{t('uploading')}</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-xs mx-auto">
                <div
                  className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-slate-400 mb-2 flex justify-center">
                <UploadIcon />
              </div>
              <p className="text-sm text-slate-600 font-medium">{t('dropOrClick')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('fileRequirements')}</p>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="divide-y divide-slate-100">
        {documents.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-slate-400 text-sm">{t('noDocuments')}</p>
          </div>
        ) : (
          documents.map((doc) => {
            const statusStyle = statusConfig[doc.status] || statusConfig.pending
            return (
              <div key={doc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 group transition-colors">
                {/* File Icon */}
                <div className="flex-shrink-0 w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                  <FileIcon mimeType={doc.mime_type} />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">{doc.file_name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-400">{formatFileSize(doc.file_size)}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">{t(`types.${doc.document_type}`)}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">
                      {new Date(doc.uploaded_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                  {doc.admin_note && doc.status === 'rejected' && (
                    <p className="text-xs text-rose-500 mt-1 bg-rose-50 px-2 py-0.5 rounded inline-block">
                      {doc.admin_note}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  <span className={`text-[10px] font-semibold ${statusStyle.text}`}>{statusStyle.label}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(doc.id, doc.file_name)}
                    className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                    title={t('download')}
                  >
                    <DownloadIcon />
                  </button>
                  {doc.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title={t('delete')}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
