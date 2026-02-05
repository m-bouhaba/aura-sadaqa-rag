'use client'

import * as React from "react"
import {
  SearchIcon,
  FileTextIcon,
  MoreVerticalIcon,
  LayoutGridIcon,
} from "lucide-react"

import { UploadButton } from '@/components/upload/upload-button'

interface ExplorerFile {
  id: string
  title: string
  date: string
  type: string
}

export function FileExplorer() {
  const [files, setFiles] = React.useState<ExplorerFile[]>([])
  const [search, setSearch] = React.useState("")

  const handleUploadComplete = (file: File) => {
    const newFile: ExplorerFile = {
      id: crypto.randomUUID(),
      title: file.name,
      date: "Just now",
      type: file.name.split('.').pop() || 'file',
    }

    setFiles((prev) => [newFile, ...prev])
  }

  const filteredFiles = files.filter((file) =>
    file.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGridIcon className="w-5 h-5 text-primary" />
          <h2 className="font-semibold tracking-tight">Documents</h2>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {files.length} {files.length === 1 ? "File" : "Files"}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-4">
        <UploadButton onUploadComplete={handleUploadComplete} />

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
              placeholder:text-muted-foreground/70"
            placeholder="Search documents..."
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground px-6">
            <FileTextIcon className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No documents yet</p>
            <p className="text-xs mt-1">
              Upload PDF or XLSX files to build your knowledge base
            </p>
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group flex items-center gap-3 p-3 rounded-lg
                  hover:bg-muted/60 transition-colors cursor-pointer
                  border border-transparent hover:border-border/50"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center
                  text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                  <FileTextIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <h3 className="text-sm font-medium truncate text-foreground/90">
                    {file.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{file.date}</p>
                </div>

                <button
                  className="text-muted-foreground hover:text-foreground
                    opacity-0 group-hover:opacity-100 transition-opacity p-2"
                >
                  <MoreVerticalIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
