'use client'

import { useRef, useTransition } from 'react'
import { Loader2Icon, UploadIcon } from 'lucide-react'
import { uploadFile } from '@/actions/upload-action'

interface UploadButtonProps {
    onUploadComplete?: (file: File) => void
    onUploadStart?: () => void
    onUploadEnd?: () => void
    className?: string
}

export function UploadButton({ onUploadComplete, onUploadStart, onUploadEnd, className }: UploadButtonProps) {
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        onUploadStart?.()

        startTransition(async () => {
            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadFile(formData)

            if (result.success) {
                onUploadComplete?.(file)
            } else {
                console.error('Upload failed:', result.message)
                alert(result.message || 'Upload failed')
            }

            onUploadEnd?.()

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        })
    }

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.xlsx"
            />
            <button
                onClick={handleUploadClick}
                disabled={isPending}
                className={`group relative overflow-hidden rounded-xl border border-dashed border-white/[0.10] hover:border-primary/30 bg-white/[0.02] hover:bg-primary/[0.04] px-4 py-3 text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-40 cursor-pointer ${className || ''}`}
            >
                {isPending ? (
                    <>
                        <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-primary/80">Processing…</span>
                    </>
                ) : (
                    <>
                        <UploadIcon className="h-4 w-4 group-hover:text-primary transition-colors" />
                        <span>Upload PDF or XLSX</span>
                    </>
                )}
            </button>
        </>
    )
}
