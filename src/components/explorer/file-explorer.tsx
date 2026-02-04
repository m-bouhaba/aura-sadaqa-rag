'use client'

import { useState } from 'react'
import { FileIcon, FileTextIcon, FileSpreadsheetIcon, DownloadIcon, TrashIcon } from 'lucide-react'
import { UploadButton } from '@/components/upload/upload-button'

interface DocumentFile {
  id: string
  name: string
  type: 'pdf' | 'excel' | 'txt' | 'csv' // Kept others for backward compatibility
  size: string
  uploadDate: string
}

export function FileExplorer() {
  const [files, setFiles] = useState<DocumentFile[]>([
    {
      id: '1',
      name: 'Families_Database.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-02-28',
    },
    {
      id: '3',
      name: 'Volunteers_Schedule.xlsx',
      type: 'excel',
      size: '1.2 MB',
      uploadDate: '2024-02-26',
    },
    {
      id: '4',
      name: 'Distribution_Report.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadDate: '2024-02-25',
    }
  ])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileTextIcon className="h-5 w-5 text-red-500" />
      case 'csv':
        return <FileSpreadsheetIcon className="h-5 w-5 text-green-600" />
      case 'excel':
        return <FileSpreadsheetIcon className="h-5 w-5 text-green-700" />
      case 'txt':
        return <FileTextIcon className="h-5 w-5 text-gray-500" />
      default:
        return <FileIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleUploadComplete = (file: File) => {
    const newFile: DocumentFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' :
        file.name.endsWith('.xlsx') ? 'excel' : 'txt',
      size: (file.size / 1024 < 1000) ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString()
    }
    setFiles(prev => [newFile, ...prev])
  }

  return (
    <div className="flex w-[100%] h-[100vh] flex-col bg-background">
      {/* Explorer Header */}
      <div className="border-b border-border bg-card px-8 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Documents</h2>
            <p className="text-sm text-muted-foreground">Uploaded files and resources</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>

            {/* New Upload Button Component */}
            <UploadButton onUploadComplete={handleUploadComplete} />

          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-6">
        {files.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileIcon className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No files uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload a PDF or XLSX file to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="rounded-lg bg-muted p-2 flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm">{file.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Download">
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
